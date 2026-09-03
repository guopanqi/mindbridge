// 员工对收到的支持资源做反馈：参加了 / 完成了 / 打分。
// 这是「活动效果」看板唯一的真实数据来源；不采集任何文字反馈。
import { json } from './_lib/http.js';
import { ApiError, aggregateStatement, handleError, readJson, requireSession } from './_lib/care.js';

const STATES = ['offered', 'joined', 'completed', 'declined'];

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const body = await readJson(request);
    const id = body?.id;
    const state = body?.state;
    const rating = body?.rating;
    if (typeof id !== 'string' || !id) throw new ApiError('RESOURCE_ID_REQUIRED', 400, '缺少资源标识');
    if (!STATES.includes(state)) throw new ApiError('STATE_INVALID', 400, '未知的状态');
    if (rating !== undefined && rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      throw new ApiError('RATING_INVALID', 400, '评分需要在 1-5 之间');
    }
    const row = await env.CARE_DB
      .prepare('SELECT id, resource_name, resource_level FROM resource_events WHERE id = ? AND anon_id = ?')
      .bind(id, anonId).first();
    if (!row) throw new ApiError('RESOURCE_NOT_FOUND', 404, '这条推荐不存在或不属于你');

    const now = Date.now();
    await env.CARE_DB.batch([
      env.CARE_DB.prepare(
        'UPDATE resource_events SET state = ?, rating = COALESCE(?, rating), feedback_at = ?, updated_at = ? WHERE id = ? AND anon_id = ?'
      ).bind(state, rating ?? null, rating ? now : null, now, id, anonId),
      aggregateStatement(env, { eventType: `resource_${state}`, level: 'green', at: now }),
    ]);
    return json({ ok: true, id, state, rating: rating ?? null });
  } catch (error) {
    return handleError(error, 'resource_feedback_failed');
  }
}
