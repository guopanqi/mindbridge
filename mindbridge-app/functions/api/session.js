import { sha256Base64Url } from './_lib/crypto.js';
import { opportunisticPurge } from './internal/retention.js';
import { clearSessionCookie, json, readCookie } from './_lib/http.js';

export async function onRequestGet({ request, env, waitUntil }) {
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
  // 保留期清理跟着会话检查顺带做一小批：我们在隐私说明里承诺了 180 天，
  // 就必须真的有东西在删。放进 waitUntil，不阻塞响应，失败也不影响业务。
  if (typeof waitUntil === 'function') {
    waitUntil(opportunisticPurge(env).catch(() => {
      console.error(JSON.stringify({ event: 'opportunistic_purge_failed' }));
    }));
  }
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
