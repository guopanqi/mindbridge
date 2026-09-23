// 内测疗愈师使用系统侧预置的唯一登录名进入全局个案台。
import { randomToken } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, createStaffSession, handleError, parseRoles, readJson } from '../_lib/staff.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await readJson(request, 512);
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    if (username.length < 2 || username.length > 40) {
      throw new ApiError('HEALER_NAME_REQUIRED', 400, '请输入疗愈师登录名');
    }
    const row = await env.STAFF_DB.prepare(
      "SELECT staff_id, display_name, credential, roles FROM staff WHERE login_name = ? AND status = 'active'"
    ).bind(username).first();
    if (!row || !parseRoles(row.roles).includes('healer')) {
      throw new ApiError('HEALER_UNKNOWN', 401, '没有这个疗愈师账号，请联系系统管理员');
    }
    const raw = randomToken();
    const ttl = Math.max(600, Math.min(
      Number.parseInt(env.STAFF_SESSION_TTL_SECONDS || '3600', 10) || 3600,
      43200,
    ));
    await createStaffSession(env, { staffId: row.staff_id, rawToken: raw, ttlSeconds: ttl });
    await audit(env, row.staff_id, 'sign_in', 'console', 'name_login', 'ok');
    return json(
      { ok: true, displayName: row.display_name, credential: row.credential },
      200,
      { 'set-cookie': staffCookie(raw, ttl) },
    );
  } catch (error) {
    return handleError(error, 'healer_sign_in_failed');
  }
}
