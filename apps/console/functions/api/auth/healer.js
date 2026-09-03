// 疗愈师登录，换取实名工作人员会话。
//
// 两条路径：
// - accessKey：预设的长期入口密钥，可重复使用，用于日常与演示（打开链接即登录）；
// - accessCode：一次性邀请码，用于新疗愈师入职。
// 两者都只存摘要，都能被单独吊销。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, handleError, newId, readJson } from '../_lib/staff.js';

async function issueSession(env, staffId, method) {
  const raw = randomToken();
  // 疗愈师会话给足时长：演示或值班期间不应该被迫中途重新登录。
  const fallback = method === 'access_key' ? '43200' : '3600';
  const ttl = Math.max(600, Math.min(
    Number.parseInt(env.STAFF_SESSION_TTL_SECONDS || fallback, 10) || Number.parseInt(fallback, 10),
    43200
  ));
  const now = Date.now();
  await env.STAFF_DB.prepare(
    'INSERT INTO staff_sessions (session_digest, staff_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(await sha256Base64Url(raw), staffId, now + ttl * 1000, now, now).run();
  await audit(env, staffId, 'sign_in', 'console', method, 'ok');
  return { raw, ttl };
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readJson(request);
    const accessKey = String(body?.accessKey || '').trim();

    // 预设入口密钥：可重复使用，吊销后立即失效。
    if (accessKey) {
      if (accessKey.length > 256) throw new ApiError('KEY_INVALID', 400, '入口链接无效');
      const now = Date.now();
      const keyDigest = await sha256Base64Url(accessKey);
      const row = await env.STAFF_DB.prepare(
        `SELECT k.id, k.staff_id, k.revoked_at, s.display_name, s.credential, s.status
         FROM staff_access_keys k JOIN staff s ON s.staff_id = k.staff_id
         WHERE k.key_digest = ?`
      ).bind(keyDigest).first();
      if (!row || row.revoked_at || row.status !== 'active') {
        throw new ApiError('KEY_INVALID', 401, '入口链接无效或已被吊销，请联系企业管理员');
      }
      await env.STAFF_DB.prepare('UPDATE staff_access_keys SET last_used_at = ? WHERE id = ?')
        .bind(now, row.id).run();
      const { raw, ttl } = await issueSession(env, row.staff_id, 'access_key');
      return json(
        { ok: true, displayName: row.display_name, credential: row.credential },
        200,
        { 'set-cookie': staffCookie(raw, ttl) }
      );
    }

    const code = String(body?.accessCode || '').trim();
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

    const { raw, ttl } = await issueSession(env, staffId, 'invite_code');
    return json({ ok: true, displayName: invite.display_name }, 200, { 'set-cookie': staffCookie(raw, ttl) });
  } catch (error) {
    return handleError(error, 'healer_sign_in_failed');
  }
}
