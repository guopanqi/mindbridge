import { encryptSubject, hmacBase64Url, randomToken, sha256Base64Url } from './_lib/crypto.js';
import { json, sessionCookie } from './_lib/http.js';

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

function versionedSecretName(prefix, version) {
  if (!/^v[1-9]\d*$/.test(version)) throw new Error(`invalid ${prefix} key version`);
  return `${prefix}_${version.toUpperCase()}`;
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

async function resolveAnonymousIdentity(env, corpId, userId) {
  const keyVersion = env.ANON_KEY_VERSION || 'v1';
  const encryptionKeyVersion = env.IDENTITY_ENCRYPTION_KEY_VERSION || 'v1';
  const subject = `${corpId}:${userId}`;
  const subjectLookup = await hmacBase64Url(requiredSecret(env, 'SUBJECT_LOOKUP_KEY_V1'), subject);
  const anonKey = requiredSecret(env, versionedSecretName('ANON_HMAC_KEY', keyVersion));
  const derivedAnonId = `mb_${keyVersion}_${await hmacBase64Url(anonKey, subject)}`;
  const now = Date.now();
  let existing = await env.IDENTITY_DB
    .prepare('SELECT canonical_anon_id FROM identity_mappings WHERE subject_lookup = ?')
    .bind(subjectLookup)
    .first();

  if (!existing?.canonical_anon_id) {
    const encryptedSubject = await encryptSubject(
      JSON.stringify({ corpId, userId }),
      requiredSecret(env, versionedSecretName('IDENTITY_ENCRYPTION_KEY', encryptionKeyVersion), 43),
      derivedAnonId
    );
    await env.IDENTITY_DB.prepare(
      'INSERT INTO identity_mappings (canonical_anon_id, subject_lookup, encrypted_subject, encryption_key_version, created_at, updated_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(subject_lookup) DO NOTHING'
    ).bind(derivedAnonId, subjectLookup, encryptedSubject, encryptionKeyVersion, now, now, now).run();
    existing = await env.IDENTITY_DB
      .prepare('SELECT canonical_anon_id FROM identity_mappings WHERE subject_lookup = ?')
      .bind(subjectLookup)
      .first();
  }
  const canonicalAnonId = existing?.canonical_anon_id;
  if (!canonicalAnonId) throw new Error('identity mapping unavailable');
  await env.IDENTITY_DB.batch([
    env.IDENTITY_DB.prepare('UPDATE identity_mappings SET updated_at = ?, last_seen_at = ? WHERE canonical_anon_id = ?')
      .bind(now, now, canonicalAnonId),
    env.IDENTITY_DB.prepare(
      'INSERT INTO identity_aliases (derived_anon_id, canonical_anon_id, anon_key_version, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(derived_anon_id) DO NOTHING'
    ).bind(derivedAnonId, canonicalAnonId, keyVersion, now),
  ]);
  return canonicalAnonId;
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
    return json({ message: '缺少有效的钉钉授权码', reasonCode: 'AUTH_CODE_INVALID' }, 400);
  }
  if (!isSafeText(env.DINGTALK_CLIENT_ID, 2, 256) || !isSafeText(env.DINGTALK_CORP_ID, 2, 256)) {
    return json({ message: '应用部署配置不完整', reasonCode: 'APP_CONFIGURATION_MISSING' }, 503);
  }

  try {
    requiredSecret(env, 'DINGTALK_APP_SECRET');
    const userId = await exchangeDingTalkCode(code, env);
    const anonId = await resolveAnonymousIdentity(env, env.DINGTALK_CORP_ID, userId);
    const rawSession = randomToken();
    const sessionDigest = await sha256Base64Url(rawSession);
    const now = Date.now();
    const configuredTtl = Number.parseInt(env.SESSION_TTL_SECONDS || '', 10);
    const ttl = Number.isFinite(configuredTtl) ? configuredTtl : 1800;
    const expiresAt = now + Math.max(300, Math.min(ttl, 86400)) * 1000;
    await env.CARE_DB.prepare(
      'INSERT INTO sessions (session_digest, anon_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(sessionDigest, anonId, expiresAt, now, now).run();
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
    return json({ message: '钉钉身份验证未完成，请稍后重试', reasonCode }, status);
  }
}

export function onRequestGet() {
  return json({ message: '仅支持 POST' }, 405);
}
