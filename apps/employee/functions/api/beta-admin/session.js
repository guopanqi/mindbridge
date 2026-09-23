import { sha256Base64Url } from '../_lib/crypto.js';
import { ADMIN_COOKIE, adminOrganization, clearAdminCookie, validSameOrigin } from '../_lib/beta-admin.js';
import { json, readCookie } from '../_lib/http.js';

export async function onRequestGet({ request, env }) {
  const org = await adminOrganization(request, env);
  return org ? json({ authenticated: true, organization: org }) : json({ authenticated: false }, 401);
}

export async function onRequestDelete({ request, env }) {
  if (!validSameOrigin(request)) return json({ ok: false, reasonCode: 'ORIGIN_INVALID' }, 403);
  const raw = readCookie(request, ADMIN_COOKIE);
  if (raw) await env.CARE_DB.prepare('DELETE FROM beta_admin_sessions WHERE session_digest = ?')
    .bind(await sha256Base64Url(raw)).run();
  return json({ authenticated: false }, 200, { 'set-cookie': clearAdminCookie() });
}
