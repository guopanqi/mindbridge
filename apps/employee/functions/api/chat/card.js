import { json } from '../_lib/http.js';
import { ApiError, handleError, readJson, requireSession } from '../_lib/care.js';
import { cardUpdate, readConsentCard } from '../_lib/conversation/card-state.js';

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { messageId, action } = await readJson(request);
    if (typeof messageId !== 'string' || action !== 'dismiss') throw new ApiError('CARD_ACTION_INVALID', 400, '未知卡片操作');
    const source = await readConsentCard(env, anonId, messageId);
    if (source.card.appointmentId) throw new ApiError('CARD_ALREADY_SUBMITTED', 409, '本次预约已提交，请在「我的」查看或取消。');
    if (source.card.decision === 'dismissed') return json({ ok: true });
    const result = await (await cardUpdate(env, anonId, source, { decision: 'dismissed' })).run();
    if (!result.meta?.changes) throw new ApiError('CARD_STATE_CHANGED', 409, '卡片状态已变化，请刷新。');
    return json({ ok: true });
  } catch (error) { return handleError(error, 'chat_card_action_failed'); }
}
