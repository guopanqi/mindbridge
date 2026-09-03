// 疗愈师用一次性邀请码登录，换取实名工作人员会话。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, handleError, newId, readJson } from '../_lib/staff.js';

export async function onRequestPost({ request, env }) {
  try {
    const code = String((await readJson(request))?.accessCode || '').trim();
    if (!code || code.length > 128) throw new ApiError('CODE_INVALID', 400, '请填写邀请码');
    const now = Date.now();
    const digest = await sha256Base64Url(code);
    const invite = await env.STAFF_DB
      .prepare('SELECT id, display_name, used_at, expires_at, staff_id FROM healer_invites WHERE code_digest = ?')
      .bind(digest).first();
    if (!invite || invite.expires_at < now) {
      throw new ApiError('CODE_INVALID', 401, '邀请码无效或已过期，请联系企业管理员重新生成');
    }

    let staffId = invite.staff_id;
    if (!staffId) {
      staffId = newId('stf');
      await env.STAFF_DB.batch([
        env.STAFF_DB.prepare(
          'INSERT INTO staff (staff_id, tenant_id, display_name, roles, auth_method, status, created_at, updated_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(staffId, env.DINGTALK_CORP_ID || 'external', invite.display_name, 'healer', 'invite_code', 'active', now, now, now),
        env.STAFF_DB.prepare('UPDATE healer_invites SET used_at = ?, staff_id = ? WHERE id = ?')
          .bind(now, staffId, invite.id),
      ]);
    }

    const raw = randomToken();
    const ttl = Math.max(600, Math.min(Number.parseInt(env.STAFF_SESSION_TTL_SECONDS || '3600', 10) || 3600, 43200));
    await env.STAFF_DB.prepare(
      'INSERT INTO staff_sessions (session_digest, staff_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(await sha256Base64Url(raw), staffId, now + ttl * 1000, now, now).run();
    await audit(env, staffId, 'sign_in', 'console', 'invite_code', 'ok');
    return json({ ok: true, displayName: invite.display_name }, 200, { 'set-cookie': staffCookie(raw, ttl) });
  } catch (error) {
    return handleError(error, 'healer_sign_in_failed');
  }
}
