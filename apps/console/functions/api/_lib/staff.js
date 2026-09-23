// 管理端服务层：实名会话、角色校验、审计。
import { sha256Base64Url } from './crypto.js';
import { clearStaffCookie, json, readCookie, STAFF_COOKIE } from './http.js';

export const ROLES = ['admin', 'hr_viewer', 'healer'];

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

export function parseRoles(value) {
  return String(value || '').split(',').map((r) => r.trim()).filter((r) => ROLES.includes(r));
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

export async function requireStaff(request, env, requiredRole) {
  const token = readCookie(request, STAFF_COOKIE);
  if (!token) throw new ApiError('STAFF_SESSION_REQUIRED', 401, '请重新登录');
  const digest = await sha256Base64Url(token);
  const now = Date.now();
  const row = await env.STAFF_DB.prepare(
    `SELECT s.staff_id, s.display_name, s.credential, s.roles, s.status,
            ss.organization_id, ss.organization_kind, ss.organization_name
     FROM staff_sessions ss JOIN staff s ON s.staff_id = ss.staff_id
     WHERE ss.session_digest = ? AND ss.expires_at > ?`
  ).bind(digest, now).first();
  if (!row || row.status !== 'active') throw new ApiError('STAFF_SESSION_REQUIRED', 401, '请重新登录');
  const roles = parseRoles(row.roles);
  if (requiredRole && !roles.includes(requiredRole)) {
    await audit(env, row.staff_id, 'access_denied', 'role', requiredRole, 'denied');
    throw new ApiError('FORBIDDEN', 403, '当前账号没有这个权限');
  }
  await env.STAFF_DB.prepare('UPDATE staff_sessions SET last_seen_at = ? WHERE session_digest = ?')
    .bind(now, digest).run();
  return {
    staffId: row.staff_id,
    displayName: row.display_name,
    credential: row.credential,
    roles,
    organizationId: row.organization_id || null,
    organizationKind: row.organization_kind || null,
    organizationName: row.organization_name || null,
  };
}

export async function createStaffSession(env, {
  staffId, rawToken, ttlSeconds, organizationId = null, organizationKind = null, organizationName = null,
}) {
  const now = Date.now();
  await env.STAFF_DB.prepare(
    `INSERT INTO staff_sessions
      (session_digest, staff_id, expires_at, created_at, last_seen_at, organization_id, organization_kind, organization_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    await sha256Base64Url(rawToken), staffId, now + ttlSeconds * 1000, now, now,
    organizationId, organizationKind, organizationName,
  ).run();
}

// 审计条目只记录报表名或匿名个案编号，不含员工原文，也不含 anon_id。
export function audit(env, staffId, action, objectType = null, objectId = null, result = 'ok') {
  return env.STAFF_DB.prepare(
    'INSERT INTO staff_audit (id, staff_id, action, object_type, object_id, result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(newId('aud'), staffId, action, objectType, objectId, result, Date.now()).run();
}

export function handleError(error, event) {
  if (error instanceof ApiError) {
    const headers = error.code === 'STAFF_SESSION_REQUIRED' ? { 'set-cookie': clearStaffCookie() } : {};
    return json({ ok: false, reasonCode: error.code, message: error.userMessage }, error.status, headers);
  }
  console.error(JSON.stringify({ event, reasonCode: 'INTERNAL_ERROR' }));
  return json({ ok: false, reasonCode: 'INTERNAL_ERROR', message: '服务暂时不可用' }, 500);
}
