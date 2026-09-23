import { sha256Base64Url } from './_lib/crypto.js';
import { renewBetaSession } from './_lib/beta-session.js';
import { opportunisticPurge } from './internal/retention.js';
import { clearDeviceCookie, clearSessionCookie, json, readCookie } from './_lib/http.js';

export async function onRequestGet({ request, env, waitUntil }) {
  const token = readCookie(request, '__Host-mb_session');
  const digest = token ? await sha256Base64Url(token) : null;
  const now = Date.now();
  let session = digest ? await env.CARE_DB
    .prepare('SELECT session_digest, anon_id, organization_id, entry_channel FROM sessions WHERE session_digest = ? AND expires_at > ?')
    .bind(digest, now).first() : null;
  let renewedCookie = null;
  let organizationName = null;
  if (session?.entry_channel === 'beta_web') {
    const org = await env.CARE_DB.prepare("SELECT id, display_name FROM organizations WHERE id = ? AND status = 'active' AND kind = 'beta'")
      .bind(session.organization_id).first();
    if (!org) session = null;
    else organizationName = org.display_name;
  }
  if (!session) {
    const renewed = await renewBetaSession(request, env);
    if (!renewed) return json({ authenticated: false }, 401, { 'set-cookie': clearSessionCookie() });
    session = { anon_id: renewed.anonId, organization_id: renewed.organizationId, entry_channel: 'beta_web' };
    renewedCookie = renewed.cookie;
    const org = await env.CARE_DB.prepare('SELECT display_name FROM organizations WHERE id = ?')
      .bind(renewed.organizationId).first();
    organizationName = org?.display_name || null;
  } else {
    await env.CARE_DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE session_digest = ?').bind(now, digest).run();
  }
  // 保留期清理跟着会话检查顺带做一小批：我们在隐私说明里承诺了 180 天，
  // 就必须真的有东西在删。放进 waitUntil，不阻塞响应，失败也不影响业务。
  if (typeof waitUntil === 'function') {
    waitUntil(opportunisticPurge(env).catch(() => {
      console.error(JSON.stringify({ event: 'opportunistic_purge_failed' }));
    }));
  }
  return json({
    authenticated: true,
    session: 'anonymous',
    review: String(session.anon_id || '').startsWith('mbreview_'),
    entryChannel: session.entry_channel || 'dingtalk',
    organizationId: session.organization_id || null,
    organizationName,
  }, 200, renewedCookie ? { 'set-cookie': renewedCookie } : {});
}

export async function onRequestDelete({ request, env }) {
  const token = readCookie(request, '__Host-mb_session');
  if (token) {
    const digest = await sha256Base64Url(token);
    await env.CARE_DB.prepare('DELETE FROM sessions WHERE session_digest = ?').bind(digest).run();
  }
  const response = json({ authenticated: false }, 200, { 'set-cookie': clearSessionCookie() });
  response.headers.append('set-cookie', clearDeviceCookie());
  return response;
}
