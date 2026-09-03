import { sha256Base64Url } from './_lib/crypto.js';
import { clearSessionCookie, json, readCookie } from './_lib/http.js';

export async function onRequestGet({ request, env }) {
  const token = readCookie(request, '__Host-mb_session');
  if (!token) return json({ authenticated: false }, 401);
  const digest = await sha256Base64Url(token);
  const now = Date.now();
  const session = await env.CARE_DB
    .prepare('SELECT session_digest FROM sessions WHERE session_digest = ? AND expires_at > ?')
    .bind(digest, now)
    .first();
  if (!session) return json({ authenticated: false }, 401, { 'set-cookie': clearSessionCookie() });
  await env.CARE_DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE session_digest = ?').bind(now, digest).run();
  return json({ authenticated: true, session: 'anonymous' });
}

export async function onRequestDelete({ request, env }) {
  const token = readCookie(request, '__Host-mb_session');
  if (token) {
    const digest = await sha256Base64Url(token);
    await env.CARE_DB.prepare('DELETE FROM sessions WHERE session_digest = ?').bind(digest).run();
  }
  return json({ authenticated: false }, 200, { 'set-cookie': clearSessionCookie() });
}
