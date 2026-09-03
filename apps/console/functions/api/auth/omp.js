// 钉钉管理后台免登（OMP SSO）。
//
// 链路：管理员在 oa.dingtalk.com 打开应用 → 钉钉把 code 拼到「管理后台地址」上
//      → 服务端用 CorpId + SSOSecret 调 /sso/gettoken 拿 access_token
//      → 再用 access_token + code 调 /sso/getuserinfo 拿管理员身份。
//
// SSOSecret 的敏感级别等同于 AppSecret：泄漏即可伪造管理员身份，必须走 Secret。
// code 是一次性的，这里显式记录已使用的 code 摘要来防重放。
import { hmacBase64Url, randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { encryptText } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, handleError, newId, readJson } from '../_lib/staff.js';

const TIMEOUT_MS = 8000;
const CODE_MAX = 1024;

function requiredSecret(env, name, minLength = 32) {
  const value = env[name];
  if (typeof value !== 'string' || value.length < minLength) {
    throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整，请联系管理员');
  }
  return value;
}

async function dingTalkGet(url, reasonCode) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    throw new ApiError(`${reasonCode}_NETWORK`, 502, '钉钉服务暂时不可用，请重试');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errcode !== 0) {
    throw new ApiError(reasonCode, 401, '钉钉管理后台身份校验未通过');
  }
  return payload;
}

export async function exchangeOmpCode(code, env) {
  const corpId = env.DINGTALK_CORP_ID;
  const ssoSecret = requiredSecret(env, 'DINGTALK_SSO_SECRET');
  const token = await dingTalkGet(
    `https://oapi.dingtalk.com/sso/gettoken?corpid=${encodeURIComponent(corpId)}&corpsecret=${encodeURIComponent(ssoSecret)}`,
    'DINGTALK_SSO_TOKEN_FAILED'
  );
  if (typeof token.access_token !== 'string' || !token.access_token) {
    throw new ApiError('DINGTALK_SSO_TOKEN_INVALID', 502, '钉钉管理后台身份校验未通过');
  }
  const info = await dingTalkGet(
    `https://oapi.dingtalk.com/sso/getuserinfo?access_token=${encodeURIComponent(token.access_token)}&code=${encodeURIComponent(code)}`,
    'DINGTALK_SSO_USERINFO_FAILED'
  );
  const user = info.user_info || {};
  if (typeof user.userid !== 'string' || !user.userid) {
    throw new ApiError('DINGTALK_SSO_USERINFO_INVALID', 401, '钉钉管理后台身份校验未通过');
  }
  // 只有企业管理员（主管理员或子管理员）才允许进入管理端。
  const isAdmin = info.is_sys === true || user.is_admin === true || Number(info.sys_level) >= 1;
  return { userId: user.userid, displayName: user.name || '管理员', isAdmin };
}

async function resolveStaff(env, identity) {
  const corpId = env.DINGTALK_CORP_ID;
  const lookup = await hmacBase64Url(
    requiredSecret(env, 'STAFF_LOOKUP_KEY_V1'),
    `${corpId}:${identity.userId}`
  );
  const now = Date.now();
  const existing = await env.STAFF_DB
    .prepare('SELECT staff_id FROM staff WHERE subject_lookup = ?').bind(lookup).first();
  if (existing?.staff_id) {
    await env.STAFF_DB.prepare('UPDATE staff SET display_name = ?, updated_at = ?, last_seen_at = ? WHERE staff_id = ?')
      .bind(identity.displayName, now, now, existing.staff_id).run();
    return existing.staff_id;
  }
  const staffId = newId('stf');
  const keyVersion = env.STAFF_SUBJECT_KEY_VERSION || 'v1';
  const cipher = await encryptText(
    JSON.stringify({ corpId, userId: identity.userId }),
    requiredSecret(env, `STAFF_SUBJECT_KEY_${keyVersion.toUpperCase()}`, 43),
    staffId
  );
  // 路演阶段：企业管理员同时具备 hr_viewer，权限点本身是分开的，
  // 产品化时把授予 hr_viewer 的动作交给管理员在授权页面完成。
  await env.STAFF_DB.prepare(
    'INSERT INTO staff (staff_id, tenant_id, subject_lookup, subject_cipher, subject_key_version, display_name, roles, auth_method, status, created_at, updated_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    staffId, corpId, lookup, cipher, keyVersion, identity.displayName,
    'admin,hr_viewer', 'dingtalk_omp', 'active', now, now, now
  ).run();
  return staffId;
}

export async function onRequestPost({ request, env }) {
  try {
    const code = (await readJson(request))?.code;
    if (typeof code !== 'string' || !code || code.length > CODE_MAX) {
      throw new ApiError('SSO_CODE_INVALID', 400, '缺少有效的钉钉免登码');
    }
    if (!env.DINGTALK_CORP_ID) throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');

    // 防重放：同一个 code 只允许换取一次会话。
    const codeDigest = await sha256Base64Url(code);
    const replay = await env.STAFF_DB
      .prepare('SELECT code_digest FROM sso_code_uses WHERE code_digest = ?').bind(codeDigest).first();
    if (replay) throw new ApiError('SSO_CODE_REPLAYED', 401, '这个免登链接已经使用过，请从钉钉管理后台重新进入');
    await env.STAFF_DB.prepare('INSERT OR IGNORE INTO sso_code_uses (code_digest, used_at) VALUES (?, ?)')
      .bind(codeDigest, Date.now()).run();

    const identity = await exchangeOmpCode(code, env);
    if (!identity.isAdmin) throw new ApiError('NOT_ADMIN', 403, '只有企业管理员可以进入 MindBridge 管理后台');

    const staffId = await resolveStaff(env, identity);
    const raw = randomToken();
    const digest = await sha256Base64Url(raw);
    const ttl = Math.max(600, Math.min(Number.parseInt(env.STAFF_SESSION_TTL_SECONDS || '3600', 10) || 3600, 43200));
    const now = Date.now();
    await env.STAFF_DB.prepare(
      'INSERT INTO staff_sessions (session_digest, staff_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(digest, staffId, now + ttl * 1000, now, now).run();
    await audit(env, staffId, 'sign_in', 'console', 'dingtalk_omp', 'ok');

    return json(
      { ok: true, displayName: identity.displayName },
      200,
      { 'set-cookie': staffCookie(raw, ttl) }
    );
  } catch (error) {
    // 不记录 code、SSOSecret、access_token 或 userid。
    return handleError(error, 'omp_sign_in_failed');
  }
}
