import { anonIdFromStaffId } from './_lib/identity.js';
import { randomToken, sha256Base64Url } from './_lib/crypto.js';
import { json, sessionCookie } from './_lib/http.js';
import { ensureEnterpriseSubject } from './_lib/organizations.js';
import { writeProductEvent } from './_lib/product-events.js';

const MAX_CODE_LENGTH = 2048;
const DINGTALK_TIMEOUT_MS = 8_000;

class AuthError extends Error {
  constructor(reasonCode) {
    super(reasonCode);
    this.reasonCode = reasonCode;
  }
}

class ConfigError extends Error {
  constructor() {
    super('APP_CONFIGURATION_MISSING');
    this.reasonCode = 'APP_CONFIGURATION_MISSING';
  }
}

function isSafeText(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

function requiredSecret(env, name, minLength = 32) {
  const value = env[name];
  if (!isSafeText(value, minLength, 4096)) throw new ConfigError();
  return value;
}


async function dingTalkFetch(url, init, reasonCode) {
  let response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(DINGTALK_TIMEOUT_MS) });
  } catch {
    throw new AuthError(`${reasonCode}_NETWORK`);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthError(reasonCode);
  return payload;
}

export async function exchangeDingTalkCode(code, env) {
  const token = await dingTalkFetch('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      appKey: env.DINGTALK_CLIENT_ID,
      appSecret: env.DINGTALK_APP_SECRET,
    }),
  }, 'DINGTALK_APP_TOKEN_FAILED');
  if (!isSafeText(token.accessToken, 1, 8192)) throw new AuthError('DINGTALK_APP_TOKEN_INVALID');

  const identity = await dingTalkFetch(
    `https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=${encodeURIComponent(token.accessToken)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    },
    'DINGTALK_IDENTITY_FAILED'
  );
  if (identity.errcode !== 0 || !isSafeText(identity.result?.userid, 1, 512)) {
    throw new AuthError('DINGTALK_IDENTITY_INVALID');
  }
  return identity.result.userid;
}


export async function onRequestPost({ request, env }) {
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ message: '请求格式错误' }, 400);
  }
  const code = input?.code;
  if (!isSafeText(code, 1, MAX_CODE_LENGTH)) {
    return json({ message: '缺少有效的钉钉授权，请重试', reasonCode: 'AUTH_CODE_INVALID' }, 400);
  }
  if (!isSafeText(env.DINGTALK_CLIENT_ID, 2, 256) || !isSafeText(env.DINGTALK_CORP_ID, 2, 256)) {
    return json({ message: '应用配置不完整，请联系管理员', reasonCode: 'APP_CONFIGURATION_MISSING' }, 503);
  }

  try {
    requiredSecret(env, 'DINGTALK_APP_SECRET');
    const userId = await exchangeDingTalkCode(code, env);
    const anonId = await anonIdFromStaffId(env, userId);
    const rawSession = randomToken();
    const sessionDigest = await sha256Base64Url(rawSession);
    const now = Date.now();
    const configuredTtl = Number.parseInt(env.SESSION_TTL_SECONDS || '', 10);
    const ttl = Number.isFinite(configuredTtl) ? configuredTtl : 1800;
    const expiresAt = now + Math.max(300, Math.min(ttl, 86400)) * 1000;
    const organizationId = await ensureEnterpriseSubject(env, anonId);
    await env.CARE_DB.prepare(
      "INSERT INTO sessions (session_digest, anon_id, organization_id, entry_channel, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, 'dingtalk', ?, ?, ?)"
    ).bind(sessionDigest, anonId, organizationId, expiresAt, now, now).run();
    await writeProductEvent(env, { anonId, organizationId, entryChannel: 'dingtalk' }, 'session_started', { at: now });
    return json(
      { authenticated: true, message: '匿名会话已建立' },
      200,
      { 'set-cookie': sessionCookie(rawSession, Math.floor((expiresAt - now) / 1000)) }
    );
  } catch (error) {
    // 不记录 code、userId、token 或匿名身份；这些都是敏感关联信息。
    const reasonCode = error instanceof AuthError || error instanceof ConfigError
      ? error.reasonCode
      : 'IDENTITY_RELAY_FAILED';
    console.error(JSON.stringify({ event: 'dingtalk_auth_failed', reasonCode }));
    const status = error instanceof ConfigError || reasonCode === 'IDENTITY_RELAY_FAILED' ? 503 : 401;
    return json({ message: '钉钉身份验证未完成，请稍后再试', reasonCode }, status);
  }
}

export function onRequestGet() {
  return json({ message: '仅支持 POST' }, 405);
}
