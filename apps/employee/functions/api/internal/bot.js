// 只接受受信任的 Stream relay；不是公开钉钉 HTTP webhook。
import { json } from '../_lib/http.js';
import { ApiError, handleError, readJson, requireText } from '../_lib/care.js';
import { hmacBase64Url, sha256Base64Url } from '../_lib/crypto.js';
import { anonIdFromStaffId } from '../_lib/identity.js';
import { handleInbound } from '../_lib/conversation/service.js';
import { ensureEnterpriseSubject } from '../_lib/organizations.js';

async function authorized(request, env) {
  if (typeof env.BOT_RELAY_TOKEN !== 'string' || env.BOT_RELAY_TOKEN.length < 32) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ') || header.length > 512) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.BOT_RELAY_TOKEN), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(env.BOT_RELAY_TOKEN));
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(header.slice(7)));
}

export async function onRequestPost({ request, env }) {
  try {
    if (!await authorized(request, env)) throw new ApiError('UNAUTHORIZED', 401);
    const body = await readJson(request);
    if (!env.DINGTALK_ROBOT_CODE || body.corpId !== env.DINGTALK_CORP_ID || body.robotCode !== env.DINGTALK_ROBOT_CODE) throw new ApiError('BOT_SCOPE_INVALID', 403);
    const msgId = requireText(body.msgId, { max: 512, field: 'msgId' });
    const staffId = requireText(body.staffId, { max: 512, field: 'staffId' });
    const text = requireText(body.text, { max: 800, field: 'text' });
    const anonId = await anonIdFromStaffId(env, staffId);
    const organizationId = await ensureEnterpriseSubject(env, anonId);
    const requestKey = await sha256Base64Url(JSON.stringify([body.corpId, body.robotCode, msgId]));
    const fingerprint = await hmacBase64Url(env.BOT_RELAY_TOKEN, JSON.stringify([anonId, text]));
    return json(await handleInbound({ env, anonId, text, channel: 'dingtalk', requestKey, fingerprint,
      session: { anonId, organizationId, entryChannel: 'dingtalk' } }));
  } catch (error) { return handleError(error, 'bot_inbound_failed'); }
}
