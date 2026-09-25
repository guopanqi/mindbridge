import { ApiError, handleError, newId, readJson, requireSession } from '../_lib/care.js';
import { json } from '../_lib/http.js';

const QUESTION = 'chat_helpfulness';
const ANSWERS = new Set(['helpful', 'neutral', 'unhelpful']);
const day = (at) => new Date(at).toISOString().slice(0, 10);

async function context(env, anonId) {
  const row = await env.CARE_DB.prepare(
    `SELECT c.id, c.turn_count, c.last_message_at,
      (SELECT m.role FROM messages m WHERE m.conversation_id=c.id AND m.anon_id=? AND m.data_origin='live' AND m.role IN ('user','assistant') ORDER BY m.created_at DESC, m.rowid DESC LIMIT 1) AS last_role
     FROM conversations c WHERE c.anon_id=? AND c.channel='h5' AND c.data_origin='live' ORDER BY c.last_message_at DESC LIMIT 1`
  ).bind(anonId, anonId).first();
  if (!row || row.turn_count < 3 || row.last_role !== 'assistant' || day(row.last_message_at) !== day(Date.now())) return null;
  return `${row.id}:${day(row.last_message_at)}`;
}

export async function onRequestGet({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const contextId = await context(env, session.anonId);
    if (!contextId) return json({ ok: true, feedback: null });
    const now = Date.now();
    await env.CARE_DB.prepare(
      `INSERT OR IGNORE INTO experience_feedback
       (id, organization_id, anon_id, question_code, question_version, context_type, context_id, offered_at, app_version)
       VALUES (?, ?, ?, ?, 1, 'chat', ?, ?, ?)`
    ).bind(newId('fb'), session.organizationId, session.anonId, QUESTION, contextId, now, env.APP_VERSION || 'unversioned').run();
    const row = await env.CARE_DB.prepare(
      "SELECT id, answer_code FROM experience_feedback WHERE organization_id=? AND anon_id=? AND question_code=? AND question_version=1 AND context_type='chat' AND context_id=?"
    ).bind(session.organizationId, session.anonId, QUESTION, contextId).first();
    return json({ ok: true, feedback: { id: row.id, answer: row.answer_code } });
  } catch (error) { return handleError(error, 'chat_feedback_read_failed'); }
}

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { id, answer } = await readJson(request);
    if (!/^fb_[a-f0-9]{32}$/.test(id || '') || !ANSWERS.has(answer)) throw new ApiError('FEEDBACK_INVALID', 400, '评价无效');
    const result = await env.CARE_DB.prepare(
      `UPDATE experience_feedback SET answer_code=?, answered_at=?
       WHERE id=? AND organization_id=? AND anon_id=? AND question_code=? AND answer_code IS NULL`
    ).bind(answer, Date.now(), id, session.organizationId, session.anonId, QUESTION).run();
    if (!result.meta?.changes) throw new ApiError('FEEDBACK_ALREADY_RECORDED', 409, '这次评价已提交');
    return json({ ok: true });
  } catch (error) { return handleError(error, 'chat_feedback_write_failed'); }
}
