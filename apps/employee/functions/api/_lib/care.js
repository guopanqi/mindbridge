// Care Domain 通用服务层：会话校验、展示名派生、内容加解密、聚合埋点。
// 硬性约束：这一层只接受 canonical anonymous id，永远不接触钉钉 userid。
import { decryptText, encryptText, sha256Base64Url } from './crypto.js';
import { clearSessionCookie, json, readCookie } from './http.js';

export const SESSION_COOKIE = '__Host-mb_session';

export class ApiError extends Error {
  constructor(code, status = 400, message = '请求无法完成') {
    super(code);
    this.code = code;
    this.status = status;
    this.userMessage = message;
  }
}

export function newId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export function dayBucket(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

// 展示名只用于员工自己看见的界面；它由 anon_id 派生，不可反查到组织身份。
const ALIAS_POOL = ['小舟', '小林', '小河', '晚风', '青柠', '南山', '木棉', '小满', '拾光', '云间', '海盐', '知了'];

export async function deriveDisplayName(anonId) {
  const digest = await sha256Base64Url(`display:${anonId}`);
  let h = 0;
  for (let i = 0; i < digest.length; i++) h = (h * 31 + digest.charCodeAt(i)) >>> 0;
  const suffix = digest.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
  return `${ALIAS_POOL[h % ALIAS_POOL.length]}-${suffix}`;
}

export function contentKey(env) {
  const version = env.CARE_CONTENT_KEY_VERSION || 'v1';
  if (!/^v[1-9]\d*$/.test(version)) throw new ApiError('APP_CONFIGURATION_MISSING', 503, '应用部署配置不完整');
  const key = env[`CARE_CONTENT_KEY_${version.toUpperCase()}`];
  if (typeof key !== 'string' || key.length < 43) {
    throw new ApiError('APP_CONFIGURATION_MISSING', 503, '应用部署配置不完整');
  }
  return { version, key };
}

export function sealBody(env, plaintext, aad) {
  const { version, key } = contentKey(env);
  return encryptText(plaintext, key, aad).then((cipher) => ({ cipher, version }));
}

// content_key_version === 'plain' 只用于演示 seed 数据，调用方必须自己确认
// 该行的 data_origin === 'demo_seed'，否则不得传入 'plain'。
export const PLAIN_VERSION = 'plain';

export async function openBody(env, cipher, version, aad) {
  if (version === PLAIN_VERSION) return cipher;
  const key = env[`CARE_CONTENT_KEY_${String(version || 'v1').toUpperCase()}`];
  if (!key) return null;
  try {
    return await decryptText(cipher, key, aad);
  } catch {
    return null;
  }
}

// 一次 HTTP 请求内可能有多个处理器都要校验会话（/api/bootstrap 聚合了 5 个），
// 每次校验都是一读一写 D1。按 request 对象缓存，同一请求只做一遍。
const sessionCache = new WeakMap();

export function requireSession(request, env) {
  let pending = sessionCache.get(request);
  if (!pending) {
    pending = resolveSession(request, env);
    sessionCache.set(request, pending);
  }
  return pending;
}

async function resolveSession(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) throw new ApiError('SESSION_REQUIRED', 401, '匿名会话已失效，请从钉钉工作台重新进入');
  const digest = await sha256Base64Url(token);
  const now = Date.now();
  const row = await env.CARE_DB
    .prepare('SELECT anon_id FROM sessions WHERE session_digest = ? AND expires_at > ?')
    .bind(digest, now)
    .first();
  if (!row?.anon_id) throw new ApiError('SESSION_REQUIRED', 401, '匿名会话已失效，请从钉钉工作台重新进入');
  await env.CARE_DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE session_digest = ?')
    .bind(now, digest).run();
  return { anonId: row.anon_id, sessionDigest: digest };
}

export async function readJson(request, maxBytes = 8192) {
  const raw = await request.text();
  if (raw.length > maxBytes) throw new ApiError('PAYLOAD_TOO_LARGE', 413, '内容过长');
  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw new ApiError('INVALID_JSON', 400, '请求格式错误');
  }
}

export function requireText(value, { min = 1, max = 1000, field = 'text' } = {}) {
  if (typeof value !== 'string') throw new ApiError(`${field.toUpperCase()}_INVALID`, 400, '内容格式不正确');
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new ApiError(`${field.toUpperCase()}_INVALID`, 400, `内容长度需在 ${min}-${max} 字之间`);
  }
  return trimmed;
}

export function handleError(error, event) {
  if (error instanceof ApiError) {
    if (error.status >= 500) console.error(JSON.stringify({ event, reasonCode: error.code }));
    const headers = error.code === 'SESSION_REQUIRED' ? { 'set-cookie': clearSessionCookie() } : {};
    return json({ ok: false, reasonCode: error.code, message: error.userMessage }, error.status, headers);
  }
  // 不打印错误原文：可能包含员工输入或身份关联信息。
  console.error(JSON.stringify({ event, reasonCode: 'INTERNAL_ERROR' }));
  return json({ ok: false, reasonCode: 'INTERNAL_ERROR', message: '服务暂时不可用，请稍后重试' }, 500);
}

// 聚合埋点：只写事件类型、情绪、级别与日期分桶，供 HR 看板使用。
export function aggregateStatement(env, { eventType, emotion = null, level = null, at, ifChanged = false }) {
  return env.CARE_DB.prepare(
    `INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) SELECT ?, ?, ?, ?, ?, ?, ?${ifChanged ? ' WHERE changes()=1' : ''}`
  ).bind(newId('agg'), eventType, emotion, level, dayBucket(at), at, 'live');
}

export async function ensureProfile(env, anonId) {
  const existing = await env.CARE_DB
    .prepare('SELECT anon_id, display_name, context_tag, context_decided_at, onboarded_at FROM profiles WHERE anon_id = ?')
    .bind(anonId)
    .first();
  if (existing) return { profile: existing, created: false };
  const now = Date.now();
  const displayName = await deriveDisplayName(anonId);
  await env.CARE_DB.prepare(
    'INSERT INTO profiles (anon_id, display_name, context_tag, created_at, updated_at, data_origin) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(anon_id) DO NOTHING'
  ).bind(anonId, displayName, 'none', now, now, 'live').run();
  const profile = await env.CARE_DB
    .prepare('SELECT anon_id, display_name, context_tag, context_decided_at, onboarded_at FROM profiles WHERE anon_id = ?')
    .bind(anonId)
    .first();
  return { profile, created: true };
}
