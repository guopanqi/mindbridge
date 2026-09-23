import { sha256Base64Url } from './crypto.js';
import { readCookie } from './http.js';

export const ADMIN_COOKIE = '__Host-mb_admin';
export const ADMIN_SECONDS = 7 * 86400;
export const adminCookie = (value) => `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${ADMIN_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
export const clearAdminCookie = () => `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;

export async function adminOrganization(request, env) {
  const raw = readCookie(request, ADMIN_COOKIE);
  if (!raw || !/^[A-Za-z0-9_-]{40,100}$/.test(raw)) return null;
  const row = await env.CARE_DB.prepare(`SELECT o.id, o.display_name FROM beta_admin_sessions s
    JOIN beta_admin_credentials c ON c.organization_id = s.organization_id AND c.revoked_at IS NULL
    JOIN organizations o ON o.id = s.organization_id AND o.kind = 'beta' AND o.status = 'active'
    WHERE s.session_digest = ? AND s.expires_at > ?`)
    .bind(await sha256Base64Url(raw), Date.now()).first();
  return row ? { id: row.id, name: row.display_name } : null;
}

// 员工端有两个对外主机：直连的 Pages 项目域名与公开转发层。
// 经转发层代理时，浏览器 Origin 是转发层而 request.url 是项目域名，
// 此时仍视为同源（两者都是我们自己的域名，CSRF 攻击者控制不了其中任何一个）。
const KNOWN_APP_ORIGINS = new Set([
  'https://mindbridge-beta.pages.dev',
  'https://mindbridge-app-8j6.pages.dev',
]);

export function validSameOrigin(request) {
  const origin = request.headers.get('origin');
  const current = new URL(request.url).origin;
  if (origin === current) return true;
  return KNOWN_APP_ORIGINS.has(origin) && KNOWN_APP_ORIGINS.has(current);
}
