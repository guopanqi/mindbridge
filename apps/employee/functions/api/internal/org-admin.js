// 管理端用服务令牌兑换公开组织管理密钥 → 组织上下文。
// 凭证仍在 CARE 侧校验；会话由 console 自己签发，不在员工端落管理 Cookie。
import { sha256Base64Url } from '../_lib/crypto.js';
import { json } from '../_lib/http.js';

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request, env) {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  if (typeof expected !== 'string' || expected.length < 32) return false;
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') && timingSafeEqual(header.slice(7), expected);
}

export async function onRequestPost({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400); }
  const token = body?.token;
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    return json({ ok: false, reasonCode: 'ADMIN_LINK_INVALID' }, 403);
  }
  const row = await env.CARE_DB.prepare(`SELECT o.id, o.display_name, o.kind FROM beta_admin_credentials c
    JOIN organizations o ON o.id = c.organization_id
    WHERE c.token_digest = ? AND c.revoked_at IS NULL AND o.kind = 'beta' AND o.status = 'active'`)
    .bind(await sha256Base64Url(token)).first();
  if (!row) return json({ ok: false, reasonCode: 'ADMIN_LINK_INVALID' }, 403);
  return json({
    ok: true,
    organization: { id: row.id, name: row.display_name, kind: row.kind },
  });
}
