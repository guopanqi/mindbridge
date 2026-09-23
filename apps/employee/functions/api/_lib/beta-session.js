import { randomToken, sha256Base64Url } from './crypto.js';
import { readCookie, sessionCookie } from './http.js';
import { writeProductEvent } from './product-events.js';

const SESSION_SECONDS = 86400;
export const DEVICE_SECONDS = 180 * 86400;

export async function issueBetaSession(env, anonId, organizationId) {
  const raw = randomToken();
  const digest = await sha256Base64Url(raw);
  const now = Date.now();
  await env.CARE_DB.prepare(
    "INSERT INTO sessions (session_digest, anon_id, organization_id, entry_channel, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, 'beta_web', ?, ?, ?)"
  ).bind(digest, anonId, organizationId, now + SESSION_SECONDS * 1000, now, now).run();
  return sessionCookie(raw, SESSION_SECONDS);
}

export async function renewBetaSession(request, env) {
  const credential = readCookie(request, '__Host-mb_device');
  if (!credential || !/^[A-Za-z0-9_-]{40,100}$/.test(credential)) return null;
  const digest = await sha256Base64Url(credential);
  const membership = await env.CARE_DB.prepare(
    `SELECT m.anon_id, m.organization_id FROM beta_memberships m
     JOIN organizations o ON o.id = m.organization_id
     WHERE m.browser_credential_digest = ? AND m.revoked_at IS NULL
       AND o.status = 'active' AND o.kind = 'beta'`
  ).bind(digest).first();
  if (!membership) return null;
  await env.CARE_DB.prepare('UPDATE beta_memberships SET last_seen_at = ? WHERE anon_id = ?')
    .bind(Date.now(), membership.anon_id).run();
  const cookie = await issueBetaSession(env, membership.anon_id, membership.organization_id);
  await writeProductEvent(env, { anonId: membership.anon_id, organizationId: membership.organization_id, entryChannel: 'beta_web' }, 'session_started');
  return { cookie, anonId: membership.anon_id, organizationId: membership.organization_id };
}
