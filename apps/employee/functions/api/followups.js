// 活动回访。到期时间是真实自然日间隔，没有推送通道时由员工下次打开树洞时看到。
//
// 不伪造「系统已推送提醒」：delivered_at 记录的是真正被展示给员工的时刻。
import { json } from './_lib/http.js';
import { ApiError, aggregateStatement, handleError, readJson, requireSession } from './_lib/care.js';

const ANSWERS = ['好一些了', '差不多', '更难受了'];

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const now = Date.now();
    const row = await env.CARE_DB.prepare(
      `SELECT id, activity_title, question, due_at FROM follow_ups
       WHERE anon_id = ? AND state = 'scheduled' AND due_at <= ?
       ORDER BY due_at LIMIT 1`
    ).bind(anonId, now).first();
    if (!row) {
      const next = await env.CARE_DB.prepare(
        "SELECT due_at, activity_title FROM follow_ups WHERE anon_id = ? AND state = 'scheduled' ORDER BY due_at LIMIT 1"
      ).bind(anonId).first();
      return json({ ok: true, due: null, next: next ? { at: next.due_at, title: next.activity_title } : null });
    }
    // 第一次被读到才算送达，这个时间戳是真的。
    await env.CARE_DB.prepare('UPDATE follow_ups SET delivered_at = COALESCE(delivered_at, ?) WHERE id = ?')
      .bind(now, row.id).run();
    return json({
      ok: true,
      due: { id: row.id, title: row.activity_title, question: row.question, answers: ANSWERS },
      next: null,
    });
  } catch (error) {
    return handleError(error, 'followup_read_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId, organizationId } = await requireSession(request, env);
    const body = await readJson(request);
    const id = body?.id;
    const answer = body?.answer;
    if (typeof id !== 'string' || !id) throw new ApiError('FOLLOWUP_ID_REQUIRED', 400, '缺少回访标识');
    if (answer !== null && !ANSWERS.includes(answer)) throw new ApiError('ANSWER_INVALID', 400, '未知的选项');
    const now = Date.now();
    const result = await env.CARE_DB.prepare(
      "UPDATE follow_ups SET state = ?, answer = ?, answered_at = ? WHERE id = ? AND anon_id = ? AND state = 'scheduled'"
    ).bind(answer === null ? 'skipped' : 'answered', answer, now, id, anonId).run();
    if (!result.meta?.changes) throw new ApiError('FOLLOWUP_NOT_FOUND', 404, '这条回访已经处理过了');
    if (answer !== null) {
      await env.CARE_DB.batch([
        aggregateStatement(env, { eventType: 'followup_answered', emotion: answer, level: 'green', at: now, organizationId }),
      ]);
    }
    return json({ ok: true });
  } catch (error) {
    return handleError(error, 'followup_write_failed');
  }
}
