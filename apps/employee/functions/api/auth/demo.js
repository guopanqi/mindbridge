// 比赛评审临时入口：仅在 REVIEW_DEMO=on 时签发独立的匿名演示会话。
// 不经过身份中继，也不写入任何钉钉身份；比赛结束关闭变量即可整体失效。
import { randomToken, sha256Base64Url } from '../_lib/crypto.js';
import { json, sessionCookie } from '../_lib/http.js';

const TTL_SECONDS = 12 * 3600;

export async function onRequestPost({ env }) {
  if (String(env.REVIEW_DEMO || '').toLowerCase() !== 'on') {
    return json({ message: '评审入口未开启', reasonCode: 'REVIEW_DEMO_DISABLED' }, 403);
  }

  const rawSession = randomToken();
  const sessionDigest = await sha256Base64Url(rawSession);
  const anonId = `mbreview_${crypto.randomUUID().replace(/-/g, '')}`;
  const now = Date.now();
  await env.CARE_DB.prepare(
    'INSERT INTO sessions (session_digest, anon_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(sessionDigest, anonId, now + TTL_SECONDS * 1000, now, now).run();

  return json(
    { authenticated: true, review: true, message: '评审会话已建立' },
    200,
    { 'set-cookie': sessionCookie(rawSession, TTL_SECONDS) }
  );
}
