// 资源库：员工可以主动浏览全部可用资源，不必等系统推荐。
//
// 浏览本身不产生任何风险判定，也不写聚合事件；
// 只有员工真的开始参与时，才创建一条 resource_event 进入「推荐→参与→完成」同一条链。
import { json } from './_lib/http.js';
import { activityAvailableSql } from './_lib/activity-availability.js';
import {
  ApiError, aggregateStatement, ensureProfile, handleError, newId, readJson, requireSession,
} from './_lib/care.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId, organizationId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const { results } = await env.CARE_DB.prepare(
      `SELECT a.id, a.title, a.kind, a.form, a.duration, a.description, a.suited_for, a.core_method,
              a.level, a.schedule, a.location,
              (SELECT COUNT(*) FROM resource_events e
                WHERE e.anon_id = ? AND e.state = 'completed'
                  AND e.activity_id = a.id) AS done_count
       FROM activities a WHERE ${activityAvailableSql('a', organizationId)}
       ORDER BY a.level, a.kind, a.title`
    ).bind(anonId).all();
    return json({
      ok: true,
      resources: (results || []).map((r) => ({
        id: r.id,
        title: r.title,
        kind: r.kind,
        level: r.level,
        form: r.form,
        duration: r.duration,
        description: r.description,
        suitedFor: r.suited_for,
        coreMethod: r.core_method,
        schedule: r.schedule,
        location: r.location,
        doneCount: r.done_count,
      })),
    });
  } catch (error) {
    return handleError(error, 'resource_list_failed');
  }
}

// 员工主动选择一个资源开始参与：创建一条 resource_event，来源标记为自主浏览。
export async function onRequestPost({ request, env }) {
  try {
    const { anonId, organizationId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const activityId = (await readJson(request))?.activityId;
    if (typeof activityId !== 'string' || !activityId) {
      throw new ApiError('ACTIVITY_ID_REQUIRED', 400, '缺少活动标识');
    }
    const activity = await env.CARE_DB
      .prepare(`SELECT id, title, level FROM activities WHERE id = ? AND ${activityAvailableSql('activities', organizationId)}`)
      .bind(activityId).first();
    if (!activity) throw new ApiError('ACTIVITY_UNAVAILABLE', 404, '这个资源暂时不可用');

    // 已有一条未完成的同资源记录就复用，避免同一个人反复点开产生一堆空记录。
    const existing = await env.CARE_DB.prepare(
      `SELECT id FROM resource_events
       WHERE anon_id = ? AND activity_id = ? AND state IN ('offered','joined')
       ORDER BY created_at DESC LIMIT 1`
    ).bind(anonId, activityId).first();
    if (existing) return json({ ok: true, eventId: existing.id, reused: true });

    const id = newId('res');
    const now = Date.now();
    const [inserted] = await env.CARE_DB.batch([
      env.CARE_DB.prepare(
        `INSERT INTO resource_events (id, anon_id, conversation_id, resource_name, resource_level,
           risk_level, state, created_at, updated_at, data_origin, activity_id, source)
         SELECT ?, ?, NULL, ?, ?, 'green', 'offered', ?, ?, 'live', ?, 'self_browse'
         WHERE NOT EXISTS (SELECT 1 FROM resource_events WHERE anon_id=? AND activity_id=? AND state IN ('offered','joined'))`
      ).bind(id, anonId, activity.title, activity.level || 'L1', now, now, activityId, anonId, activityId),
      aggregateStatement(env, { eventType: 'resource_self_selected', level: 'green', at: now, organizationId, ifChanged: true }),
    ]);
    if (!inserted.meta.changes) {
      const concurrent = await env.CARE_DB.prepare("SELECT id FROM resource_events WHERE anon_id=? AND activity_id=? AND state IN ('offered','joined') ORDER BY created_at DESC LIMIT 1").bind(anonId, activityId).first();
      if (!concurrent) throw new ApiError('RESOURCE_CHANGED', 409, '活动状态已变化，请重试');
      return json({ ok: true, eventId: concurrent.id, reused: true });
    }
    return json({ ok: true, eventId: id, reused: false });
  } catch (error) {
    return handleError(error, 'resource_start_failed');
  }
}
