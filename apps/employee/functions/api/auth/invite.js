// 公开组织入口：持有邀请链接可加入，但不证明真实雇佣关系。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { DEVICE_SECONDS, issueBetaSession } from '../_lib/beta-session.js';
import { ApiError, handleError, newId, readJson } from '../_lib/care.js';
import { deviceCookie, json, readCookie } from '../_lib/http.js';
import { writeProductEvent } from '../_lib/product-events.js';

export async function onRequestPost({ request, env }) {
  try {
    const { token } = await readJson(request, 512);
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) {
      throw new ApiError('INVITE_INVALID', 400, '邀请链接无效');
    }
    const digest = await sha256Base64Url(token);
    const now = Date.now();
    const invite = await env.CARE_DB.prepare(
      `SELECT i.id, i.organization_id, i.expires_at, i.max_joins, i.join_count, i.disabled_at
       FROM beta_invites i JOIN organizations o ON o.id = i.organization_id
       WHERE i.token_digest = ? AND o.kind = 'beta' AND o.status = 'active'`
    ).bind(digest).first();
    if (!invite || invite.disabled_at || (invite.expires_at && invite.expires_at <= now)) {
      throw new ApiError('INVITE_INVALID', 403, '邀请链接已失效');
    }

    const previous = readCookie(request, '__Host-mb_device');
    let membership = null;
    if (previous && /^[A-Za-z0-9_-]{40,100}$/.test(previous)) {
      membership = await env.CARE_DB.prepare(
        'SELECT anon_id FROM beta_memberships WHERE browser_credential_digest = ? AND organization_id = ? AND revoked_at IS NULL'
      ).bind(await sha256Base64Url(previous), invite.organization_id).first();
    }

    let browserCredential = previous;
    let anonId = membership?.anon_id;
    const isNewMember = !anonId;
    if (isNewMember) {
      browserCredential = randomToken();
      anonId = newId('mbbeta');
      const result = await env.CARE_DB.prepare(
        `UPDATE beta_invites SET join_count = join_count + 1
         WHERE id = ? AND disabled_at IS NULL AND (expires_at IS NULL OR expires_at > ?)
           AND (max_joins IS NULL OR join_count < max_joins)`
      ).bind(invite.id, now).run();
      if (!result.meta?.changes) throw new ApiError('INVITE_FULL', 403, '邀请名额已满或链接已失效');
      await env.CARE_DB.prepare(
        `INSERT INTO beta_memberships
         (anon_id, organization_id, invite_id, browser_credential_digest, created_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(anonId, invite.organization_id, invite.id, await sha256Base64Url(browserCredential), now, now).run();
    } else {
      await env.CARE_DB.prepare('UPDATE beta_memberships SET last_seen_at = ? WHERE anon_id = ?')
        .bind(now, anonId).run();
    }
    await env.CARE_DB.prepare(
      `INSERT INTO subject_organizations (anon_id, organization_id, entry_channel, created_at, last_seen_at)
       VALUES (?, ?, 'beta_web', ?, ?) ON CONFLICT(anon_id) DO UPDATE SET last_seen_at = excluded.last_seen_at`
    ).bind(anonId, invite.organization_id, now, now).run();
    const response = json({ authenticated: true, entryChannel: 'beta_web' });
    response.headers.append('set-cookie', await issueBetaSession(env, anonId, invite.organization_id));
    response.headers.append('set-cookie', deviceCookie(browserCredential, DEVICE_SECONDS));
    const researchSession = { anonId, organizationId: invite.organization_id, entryChannel: 'beta_web' };
    if (isNewMember) await writeProductEvent(env, researchSession, 'beta_joined', { objectType: 'invite', objectId: invite.id });
    await writeProductEvent(env, researchSession, 'session_started');
    return response;
  } catch (error) {
    return handleError(error, 'beta_invite_auth_failed');
  }
}
