import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { ADMIN_SECONDS, adminCookie, validSameOrigin } from '../_lib/beta-admin.js';
import { json } from '../_lib/http.js';

export async function onRequestPost({ request, env }) {
  if (!validSameOrigin(request)) return json({ ok: false, reasonCode: 'ORIGIN_INVALID' }, 403);
  const body = await request.json().catch(() => null);
  const token = body?.token;
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    return json({ ok: false, reasonCode: 'ADMIN_LINK_INVALID' }, 403);
  }
  const row = await env.CARE_DB.prepare(`SELECT o.id, o.display_name FROM beta_admin_credentials c
    JOIN organizations o ON o.id = c.organization_id
    WHERE c.token_digest = ? AND c.revoked_at IS NULL AND o.kind = 'beta' AND o.status = 'active'`)
    .bind(await sha256Base64Url(token)).first();
  if (!row) return json({ ok: false, reasonCode: 'ADMIN_LINK_INVALID' }, 403);
  const raw = randomToken();
  const now = Date.now();
  await env.CARE_DB.prepare('INSERT INTO beta_admin_sessions (session_digest, organization_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256Base64Url(raw), row.id, now + ADMIN_SECONDS * 1000, now).run();
  return json({ ok: true, organization: { id: row.id, name: row.display_name } }, 200, { 'set-cookie': adminCookie(raw) });
}
