import { json } from '../_lib/http.js';
import { ApiError, ensureProfile, handleError, readJson, requireSession } from '../_lib/care.js';
import { handleInbound, loadMessages } from '../_lib/conversation/service.js';
import { hydrateCards } from '../_lib/conversation/card-state.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    return json({ ok: true, messages: await loadMessages(env, anonId) });
  } catch (error) { return handleError(error, 'chat_history_failed'); }
}

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { anonId } = session;
    const { text } = await readJson(request);
    const result = await handleInbound({ env, anonId, text, channel: 'h5', session });
    result.messages = await hydrateCards(env, anonId, result.messages);
    return json(result);
  } catch (error) { return handleError(error, 'chat_send_failed'); }
}

export async function onRequestDelete({ request, env }) {
  try {
    await requireSession(request, env);
    // 内测要保留倾诉记录，界面上不再提供清空；直接调用接口同样拒绝。
    throw new ApiError('CLEAR_DISABLED', 403, '内测期间不能清空倾诉记录');
  } catch (error) { return handleError(error, 'chat_clear_failed'); }
}
