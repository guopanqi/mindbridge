import { ApiError, openBody, sealBody } from '../care.js';

export async function readConsentCard(env, anonId, messageId) {
  const row = await env.CARE_DB.prepare("SELECT id, conversation_id, body_cipher, content_key_version FROM messages WHERE id=? AND anon_id=? AND role='consent'").bind(messageId, anonId).first();
  if (!row) throw new ApiError('CARD_NOT_FOUND', 404, '这张卡片不存在，请刷新对话。');
  const card = JSON.parse(await openBody(env, row.body_cipher, row.content_key_version, `care:message:${row.conversation_id}`));
  if (!card?.actions?.some(action => action.action === 'request_appointment')) throw new ApiError('CARD_ACTION_INVALID', 400, '这张卡片不支持转接。');
  return { row, card };
}

export async function cardUpdate(env, anonId, source, patch, appointmentId = null) {
  const sealed = await sealBody(env, JSON.stringify({ ...source.card, ...patch }), `care:message:${source.row.conversation_id}`);
  return env.CARE_DB.prepare(`UPDATE messages SET body_cipher=?, content_key_version=? WHERE id=? AND anon_id=? AND body_cipher=?
    ${appointmentId ? 'AND EXISTS (SELECT 1 FROM appointments WHERE id=? AND anon_id=?)' : ''}`)
    .bind(sealed.cipher, sealed.version, source.row.id, anonId, source.row.body_cipher, ...(appointmentId ? [appointmentId, anonId] : []));
}

// 消息保存原始内容和动作关联；当前状态始终从业务记录投影，不能复制一份过期状态。
export async function hydrateCards(env, anonId, messages) {
  const resources = messages.filter(message => message.role === 'resource' && message.card?.eventId);
  if (resources.length) {
    const ids = [...new Set(resources.map(message => message.card.eventId))];
    const { results } = await env.CARE_DB.prepare(`SELECT id, state, stage_index, helpfulness FROM resource_events WHERE anon_id=? AND id IN (${ids.map(() => '?').join(',')})`).bind(anonId, ...ids).all();
    const events = new Map((results || []).map(event => [event.id, event]));
    for (const message of resources) {
      const event = events.get(message.card.eventId);
      message.card.progress = event ? { state: event.state, stageIndex: event.stage_index, helpfulness: event.helpfulness } : { state: 'unavailable' };
    }
  }
  const consents = messages.filter(message => message.role === 'consent' && message.card);
  if (consents.length) {
    const ids = [...new Set(consents.map(message => message.card.appointmentId).filter(Boolean))];
    const { results } = await env.CARE_DB.prepare(`SELECT id, case_code, status FROM appointments WHERE anon_id=? AND
      (status IN ('requested','claimed','active') ${ids.length ? `OR id IN (${ids.map(() => '?').join(',')})` : ''}) ORDER BY created_at DESC`).bind(anonId, ...ids).all();
    const open = (results || []).find(row => ['requested', 'claimed', 'active'].includes(row.status));
    for (const message of consents) {
      const linked = (results || []).find(row => row.id === message.card.appointmentId);
      const appointment = linked || open;
      message.card.support = appointment
        ? { status: appointment.status, caseCode: appointment.case_code, linked: Boolean(linked) }
        : { status: message.card.appointmentId ? 'unavailable' : message.card.decision || 'offered' };
    }
  }
  return messages;
}
