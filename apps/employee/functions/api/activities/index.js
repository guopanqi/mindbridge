// 员工参与流程：开始 → 连续体验 → 自动完成；帮助度通过 rate 独立选填。
//
// 参与记录挂在 resource_events 上，保证「AI 推荐 → 参与 → 完成 → 效果」是同一条链，
// HR 端的活动效果因此有真实承载物，而不是只有一个参与计数。
import { json } from '../_lib/http.js';
import { followupQuestion } from '../_lib/followup-data.js';
import { activityAvailableSql } from '../_lib/activity-availability.js';
import { productEventStatement, writeProductEvent } from '../_lib/product-events.js';
import {
  ApiError, handleError, newId, readJson, requireSession, requireText, dayBucket,
} from '../_lib/care.js';

// 活动完成后隔多少天回访。真实自然日，不加速。
const FOLLOWUP_DELAY_DAYS = 3;

// 帮助度是可选的主观反馈，措辞与 3 天回访保持一致，都是一次点击。
// 不填是正常情况，不能当成低分：看板只统计填了的人，并同时给出评价率。
export const HELPFULNESS = ['有帮助', '说不好', '没什么用'];

const helpfulnessOf = (value) => {
  if (value === undefined || value === null || value === '') return null;
  if (!HELPFULNESS.includes(value)) throw new ApiError('HELPFULNESS_INVALID', 400, '未知的评价选项');
  return value;
};

async function loadContext(env, anonId, eventId) {
  const event = await env.CARE_DB.prepare(
    `SELECT e.id, e.resource_name, e.resource_level, e.state,
            e.stage_index, e.helpfulness, e.activity_id, e.content_version, e.activity_snapshot_json
     FROM resource_events e
     WHERE e.id = ? AND e.anon_id = ?`
  ).bind(eventId, anonId).first();
  if (!event) throw new ApiError('RESOURCE_NOT_FOUND', 404, '这条推荐不存在或不属于你');
  const activityId = event.activity_id;
  if (!activityId) throw new ApiError('ACTIVITY_UNAVAILABLE', 409, '这个资源还没有配置可参与的引导流程');
  if (event.activity_snapshot_json) return { event, activity: JSON.parse(event.activity_snapshot_json) };
  const activity = await env.CARE_DB
    .prepare(`SELECT * FROM activities WHERE id = ? AND ${activityAvailableSql('activities')}`).bind(activityId).first();
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
    contentVersion: activity.content_version,
    title: activity.title,
    kind: activity.kind,
    form: activity.form,
    duration: activity.duration,
    description: activity.description,
    schedule: activity.schedule,
    location: activity.location,
    stages,
    progress: {
      eventId: event.id,
      state: event.state,
      stageIndex: event.stage_index || 0,
      helpfulness: event.helpfulness,
    },
    helpfulnessOptions: HELPFULNESS,
  };
}

export async function onRequestGet({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { anonId } = session;
    const eventId = new URL(request.url).searchParams.get('eventId');
    if (!eventId) throw new ApiError('EVENT_ID_REQUIRED', 400, '缺少推荐标识');
    const { event, activity } = await loadContext(env, anonId, eventId);
    await writeProductEvent(env, session, 'activity_opened', {
      objectType: 'activity', objectId: activity.id, contentVersion: activity.content_version,
    });
    return json({ ok: true, activity: shapeActivity(activity, event) });
  } catch (error) {
    return handleError(error, 'activity_read_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { anonId } = session;
    const body = await readJson(request);
    const eventId = body?.eventId;
    if (typeof eventId !== 'string' || !eventId) throw new ApiError('EVENT_ID_REQUIRED', 400, '缺少推荐标识');
    const { event, activity } = await loadContext(env, anonId, eventId);
    const now = Date.now();
    const statements = [];
    const unchanged = () => json({ ok: true, activity: shapeActivity(activity, event) });
    const aggregate = (type) => env.CARE_DB.prepare(
      `INSERT INTO aggregate_events (id, event_type, level, bucket_day, created_at, data_origin, organization_id)
       SELECT ?, ?, 'green', ?, ?, 'live', ? WHERE changes() = 1`
    ).bind(newId('agg'), type, dayBucket(now), now, session.organizationId);

    if (body.action === 'start') {
      if (event.state === 'joined' || event.state === 'completed') return unchanged();
      if (event.state !== 'offered') throw new ApiError('ACTIVITY_STATE_INVALID', 409, '这条活动不能开始');
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'joined', stage_index = 0, activity_id = ?, content_version = ?, activity_snapshot_json = ?, updated_at = ? WHERE id = ? AND anon_id = ? AND state = 'offered'"
      ).bind(activity.id, activity.content_version, JSON.stringify(activity), now, eventId, anonId));
      statements.push(aggregate('activity_started'));
      const researchEvent = productEventStatement(env, session, 'activity_started', {
        at: now, objectType: 'activity', objectId: activity.id, contentVersion: activity.content_version,
      });
      if (researchEvent) statements.push(researchEvent);
    } else if (body.action === 'stage') {
      const index = body.stageIndex;
      const stages = JSON.parse(activity.stages_json);
      if (event.state !== 'joined' || !Number.isInteger(index) || index < 0 || index >= stages.length || index > event.stage_index + 1) throw new ApiError('STAGE_INVALID', 409, '活动步骤无效');
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET stage_index = MAX(stage_index, ?), updated_at = ? WHERE id = ? AND anon_id = ? AND state = 'joined'"
      ).bind(index, now, eventId, anonId));
    } else if (body.action === 'complete') {
      if (event.state === 'completed') return unchanged();
      if (event.state !== 'joined' || event.stage_index < JSON.parse(activity.stages_json).length - 1) throw new ApiError('ACTIVITY_STATE_INVALID', 409, '请先完成活动步骤');
      // 帮助度选填：留空照常完成，不影响完成状态，也不写反馈时间。
      const helpfulness = helpfulnessOf(body.helpfulness);
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'completed', helpfulness = COALESCE(?, helpfulness), feedback_at = ?, updated_at = ? WHERE id = ? AND anon_id = ? AND state = 'joined'"
      ).bind(helpfulness, helpfulness ? now : null, now, eventId, anonId));
      statements.push(aggregate('activity_completed'));
      const researchEvent = productEventStatement(env, session, 'activity_completed', {
        at: now, objectType: 'activity', objectId: activity.id, contentVersion: activity.content_version,
      });
      if (researchEvent) statements.push(researchEvent);
      // 回访按真实自然日间隔排期，不做演示加速。
      if (helpfulness) {
        const feedbackEvent = productEventStatement(env, session, 'activity_feedback_submitted', {
          at: now, objectType: 'activity', objectId: activity.id, contentVersion: activity.content_version,
        });
        if (feedbackEvent) statements.push(feedbackEvent);
      }
      const dueAt = now + FOLLOWUP_DELAY_DAYS * 86400000;
      statements.push(env.CARE_DB.prepare(
        `INSERT INTO follow_ups (id, anon_id, resource_event_id, activity_id, activity_title, question, due_at, state, created_at, data_origin)
         SELECT ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, 'live' WHERE changes() = 1`
      ).bind(
        newId('fup'), anonId, eventId, activity.id, activity.title,
        followupQuestion(activity.id, activity.title), dueAt, now
      ));
    } else if (body.action === 'rate') {
      // 补评：完成当时跳过了帮助度，之后在结果页再填。只允许已完成的记录补。
      if (event.state !== 'completed') throw new ApiError('ACTIVITY_STATE_INVALID', 409, '活动还没有完成');
      const helpfulness = helpfulnessOf(body.helpfulness);
      if (!helpfulness) throw new ApiError('HELPFULNESS_INVALID', 400, '请选择一个评价');
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET helpfulness = ?, feedback_at = ?, updated_at = ? WHERE id = ? AND anon_id = ? AND state = 'completed'"
      ).bind(helpfulness, now, now, eventId, anonId));
      const researchEvent = productEventStatement(env, session, 'activity_feedback_submitted', {
        at: now, objectType: 'activity', objectId: activity.id, contentVersion: activity.content_version,
      });
      if (researchEvent) statements.push(researchEvent);
    } else if (body.action === 'skip') {
      if (event.state === 'declined') return unchanged();
      if (event.state === 'completed') throw new ApiError('ACTIVITY_STATE_INVALID', 409, '已完成活动不能跳过');
      statements.push(env.CARE_DB.prepare(
        "UPDATE resource_events SET state = 'declined', updated_at = ? WHERE id = ? AND anon_id = ? AND state IN ('offered', 'joined')"
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
