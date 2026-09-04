import { json } from '../_lib/http.js';
import { ensureProfile, handleError, readJson, requireSession } from '../_lib/care.js';
import { clearConversation, handleInbound, loadMessages } from '../_lib/conversation/service.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    return json({ ok: true, messages: await loadMessages(env, anonId) });
  } catch (error) { return handleError(error, 'chat_history_failed'); }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { text } = await readJson(request);
    return json(await handleInbound({ env, anonId, text, channel: 'h5' }));
  } catch (error) { return handleError(error, 'chat_send_failed'); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    return json(await clearConversation(env, anonId));
  } catch (error) { return handleError(error, 'chat_clear_failed'); }
}
