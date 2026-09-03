// 预设疗愈师门户登录：用长期门户密钥换取实名会话。
//
// 为什么不是演示当天现场兑换邀请码：疗愈师是外部持证人员，
// 演示动线上多一次"生成码 → 复制 → 粘贴"只增加出错概率，没有叙事价值。
// 密钥一次性配置、可随时吊销，进来后立刻换成 HttpOnly 会话，URL 里的密钥随即被清掉。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, handleError } from '../_lib/staff.js';

const PORTAL_TTL_SECONDS = 30 * 86400;

export async function onRequestPost({ request, env }) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      throw new ApiError('INVALID_JSON', 400, '请求格式错误');
    }
    const key = String(body?.key || '').trim();
    if (!key || key.length > 128) throw new ApiError('PORTAL_KEY_INVALID', 400, '门户链接无效');
    const now = Date.now();
    const row = await env.STAFF_DB.prepare(
      `SELECT k.id, k.staff_id, k.revoked_at, s.display_name, s.roles, s.status
       FROM healer_portal_keys k JOIN staff s ON s.staff_id = k.staff_id
       WHERE k.key_digest = ?`
    ).bind(await sha256Base64Url(key)).first();

    if (!row || row.revoked_at || row.status !== 'active') {
      throw new ApiError('PORTAL_KEY_INVALID', 401, '门户链接已失效，请联系企业管理员');
    }
    if (!String(row.roles || '').split(',').includes('healer')) {
      throw new ApiError('PORTAL_KEY_INVALID', 403, '该链接没有疗愈师权限');
    }

    const raw = randomToken();
    await env.STAFF_DB.batch([
      env.STAFF_DB.prepare(
        'INSERT INTO staff_sessions (session_digest, staff_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(await sha256Base64Url(raw), row.staff_id, now + PORTAL_TTL_SECONDS * 1000, now, now),
      env.STAFF_DB.prepare('UPDATE healer_portal_keys SET last_used_at = ? WHERE id = ?').bind(now, row.id),
      env.STAFF_DB.prepare('UPDATE staff SET last_seen_at = ? WHERE staff_id = ?').bind(now, row.staff_id),
    ]);
    await audit(env, row.staff_id, 'sign_in', 'console', 'portal_key', 'ok');
    return json(
      { ok: true, displayName: row.display_name, roles: ['healer'] },
      200,
      { 'set-cookie': staffCookie(raw, PORTAL_TTL_SECONDS) }
    );
  } catch (error) {
    return handleError(error, 'portal_sign_in_failed');
  }
}
