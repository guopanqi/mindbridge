import { sha256Base64Url } from './_lib/crypto.js';
import { clearStaffCookie, json, readCookie, STAFF_COOKIE } from './_lib/http.js';
import { handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env);
    return json({ ok: true, authenticated: true, displayName: staff.displayName, roles: staff.roles });
  } catch (error) {
    if (error?.code === 'STAFF_SESSION_REQUIRED') return json({ ok: true, authenticated: false }, 401);
    return handleError(error, 'staff_session_failed');
  }
}

export async function onRequestDelete({ request, env }) {
  const token = readCookie(request, STAFF_COOKIE);
  if (token) {
    const digest = await sha256Base64Url(token);
    await env.STAFF_DB.prepare('DELETE FROM staff_sessions WHERE session_digest = ?').bind(digest).run();
  }
  return json({ ok: true, authenticated: false }, 200, { 'set-cookie': clearStaffCookie() });
}
