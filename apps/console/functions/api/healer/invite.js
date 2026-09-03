// 管理员为疗愈师生成一次性邀请码。这是疗愈师唯一的入口。
// 邀请码只在响应里出现一次，服务端只保存摘要。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { json } from '../_lib/http.js';
import { ApiError, audit, handleError, newId, readJson, requireStaff } from '../_lib/staff.js';

const TTL_MS = 24 * 3600 * 1000;

export async function onRequestPost({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'admin');
    const name = String((await readJson(request))?.displayName || '').trim();
    if (name.length < 2 || name.length > 40) {
      throw new ApiError('NAME_INVALID', 400, '请填写疗愈师姓名（2-40 字）');
    }
    const code = randomToken(12);
    const now = Date.now();
    await env.STAFF_DB.prepare(
      'INSERT INTO healer_invites (id, code_digest, display_name, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(newId('inv'), await sha256Base64Url(code), name, staff.staffId, now, now + TTL_MS).run();
    await audit(env, staff.staffId, 'create_healer_invite', 'healer', name, 'ok');
    return json({ ok: true, code, displayName: name, expiresInHours: 24 });
  } catch (error) {
    return handleError(error, 'healer_invite_failed');
  }
}
