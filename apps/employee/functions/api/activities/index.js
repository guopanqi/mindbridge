// 员工参与活动的完整流程：前测自评 → 逐步引导 → 后测自评 → 评分。
//
// 参与记录挂在 resource_events 上，保证「AI 推荐 → 参与 → 完成 → 效果」是同一条链，
// HR 端的活动效果因此有真实承载物，而不是只有一个参与计数。
import { json } from '../_lib/http.js';
import { followupQuestion } from '../_lib/followup-data.js';
import {
  ApiError, aggregateStatement, handleError, newId, readJson, requireSession, requireText,
} from '../_lib/care.js';

// 活动完成后隔多少天回访。真实自然日，不加速。
const FOLLOWUP_DELAY_DAYS = 3;

const score = (value, field) => {
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new ApiError(`${field}_INVALID`, 400, '自评分需要在 1-10 之间');
  }
  return value;
};

async function loadContext(env, anonId, eventId) {
  const event = await env.CARE_DB.prepare(
    `SELECT e.id, e.resource_name, e.resource_level, e.state, e.pre_score, e.post_score,
            e.stage_index, e.rating, e.activity_id, c.activity_id AS catalog_activity_id
     FROM resource_events e LEFT JOIN resource_catalog c ON c.name = e.resource_name
     WHERE e.id = ? AND e.anon_id = ?`
  ).bind(eventId, anonId).first();
  if (!event) throw new ApiError('RESOURCE_NOT_FOUND', 404, '这条推荐不存在或不属于你');
  const activityId = event.activity_id || event.catalog_activity_id;
  if (!activityId) throw new ApiError('ACTIVITY_UNAVAILABLE', 409, '这个资源还没有配置可参与的引导流程');
  const activity = await env.CARE_DB
    .prepare('SELECT * FROM activities WHERE id = ? AND enabled = 1').bind(activityId).first();
  if (!activity) throw new ApiError('ACTIVITY_UNAVAILABLE', 404, '活动内容暂时不可用');
  return { event, activity };
}

function shapeActivity(activity, event) {
  let stages = [];
  try {
    stages = JSON.parse(activity.stages_json || '[]');
  } catch {
    stages = [];
  }
  return {
    id: activity.id,
    title: activity.title,
    kind: activity.kind,
    form: activity.form,
    duration: activity.duration,
    description: activity.description,
    preLabel: activity.pre_label,
    lowLabel: activity.low_label,
    highLabel: activity.high_label,
    direction: activity.direction,
    scoreLabel: activity.score_label,
    schedule: activity.schedule,
    location: activity.location,
    stages,
    progress: {
      eventId: event.id,
      state: event.state,
      preScore: event.pre_score,
      postScore: event.post_score,
      stageIndex: event.stage_index || 0,
      rating: event.rating,
    },
  };
}

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const eventId = new URL(request.url).searchParams.get('eventId');
    if (!eventId) throw new ApiError('EVENT_ID_REQUIRED', 400, '缺少推荐标识');
    const { event, activity } = await loadContext(env, anonId, eventId);
    return json({ ok: true, activity: shapeActivity(activity, event) });
  } catch (error) {
    return handleError(error, 'activity_read_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const body = await readJson(request);
    const eventId = body?.eventId;
    if (typeof eventId !== 'string' || !eventId) throw new ApiError('EVENT_ID_REQUIRED', 400, '缺少推荐标识');
    const { event, activity } = await loadContext(env, anonId, eventId);
    const now = Date.now();
    const statements = [];

    if (body.action === 'start') {
      const pre = score(body.preScore, 'PRE_SCORE');
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'joined', pre_score = ?, stage_index = 0, activity_id = ?, updated_at = ? WHERE id = ? AND anon_id = ?"
      ).bind(pre, activity.id, now, eventId, anonId));
      statements.push(aggregateStatement(env, { eventType: 'activity_started', level: 'green', at: now }));
    } else if (body.action === 'stage') {
      const index = Number.isInteger(body.stageIndex) ? Math.max(0, body.stageIndex) : 0;
      statements.push(env.CARE_DB.prepare(
        'UPDATE resource_events SET stage_index = ?, updated_at = ? WHERE id = ? AND anon_id = ?'
      ).bind(index, now, eventId, anonId));
    } else if (body.action === 'complete') {
      const post = score(body.postScore, 'POST_SCORE');
      const rating = body.rating === undefined || body.rating === null
        ? null
        : (Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5
          ? body.rating
          : (() => { throw new ApiError('RATING_INVALID', 400, '评分需要在 1-5 之间'); })());
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'completed', post_score = ?, rating = COALESCE(?, rating), feedback_at = ?, updated_at = ? WHERE id = ? AND anon_id = ?"
      ).bind(post, rating, rating ? now : null, now, eventId, anonId));
      statements.push(aggregateStatement(env, { eventType: 'activity_completed', level: 'green', at: now }));
      // 回访按真实自然日间隔排期，不做演示加速。
      const dueAt = now + FOLLOWUP_DELAY_DAYS * 86400000;
      statements.push(env.CARE_DB.prepare(
        `INSERT INTO follow_ups (id, anon_id, resource_event_id, activity_id, activity_title, question, due_at, state, created_at, data_origin)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, 'live')`
      ).bind(
        newId('fup'), anonId, eventId, activity.id, activity.title,
        followupQuestion(activity.id, activity.title), dueAt, now
      ));
    } else if (body.action === 'skip') {
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'declined', updated_at = ? WHERE id = ? AND anon_id = ?"
      ).bind(now, eventId, anonId));
    } else {
      throw new ApiError('ACTION_INVALID', 400, '未知的操作');
    }

    // 书写类活动的内容不落库：它的价值在写的过程，系统没有保存的必要。
    if (typeof body.note === 'string' && body.note) requireText(body.note, { min: 1, max: 2000, field: 'note' });

    await env.CARE_DB.batch(statements);
    const refreshed = await loadContext(env, anonId, eventId);
    return json({ ok: true, activity: shapeActivity(refreshed.activity, refreshed.event) });
  } catch (error) {
    return handleError(error, 'activity_progress_failed');
  }
}
