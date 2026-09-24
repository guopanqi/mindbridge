// 仅供 console 的内部测试员查看：指定组织内匿名主体的行为时间线，不返回原文。
import { json } from '../_lib/http.js';

function authorized(request, env) {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  const actual = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!expected || !actual || actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

const STAT_TYPES = new Set(['chat_message', 'resource_offered', 'resource_self_selected', 'activity_started', 'activity_completed']);
const productStat = {
  chat_message_sent: 'chat_message',
  activity_started: 'activity_started',
  activity_completed: 'activity_completed',
};

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  const url = new URL(request.url);
  const organizationId = url.searchParams.get('organizationId');
  if (!organizationId || organizationId !== env.INTERNAL_TEST_ORG_ID) {
    return json({ ok: false, reasonCode: 'FORBIDDEN' }, 403);
  }
  const anonId = url.searchParams.get('anonId');
  if (anonId && !/^[A-Za-z0-9_-]{1,100}$/.test(anonId)) return json({ ok: false, reasonCode: 'ANON_ID_INVALID' }, 400);
  try {
    const { results: participants } = await env.CARE_DB.prepare(
      `SELECT so.anon_id AS anonId, p.display_name AS displayName, so.last_seen_at AS lastSeenAt,
              (SELECT COUNT(*) FROM messages m WHERE m.anon_id=so.anon_id AND m.role='user' AND m.data_origin='live') AS messageCount,
              (SELECT COUNT(*) FROM resource_events r WHERE r.anon_id=so.anon_id AND r.data_origin='live') AS activityCount
       FROM subject_organizations so LEFT JOIN profiles p ON p.anon_id=so.anon_id
       WHERE so.organization_id=? ORDER BY so.last_seen_at DESC LIMIT 100`
    ).bind(organizationId).all();
    if (!anonId) return json({ ok: true, organizationId, participants: participants || [], events: [] });
    if (!(participants || []).some((p) => p.anonId === anonId)) return json({ ok: false, reasonCode: 'ANON_ID_NOT_IN_ORG' }, 404);

    const [product, resources] = await Promise.all([
      env.CARE_DB.prepare(
        `SELECT event_name AS name, occurred_at AS at, object_type AS objectType, object_id AS objectId
         FROM product_events WHERE organization_id=? AND anon_id=? AND data_origin='live'
         ORDER BY occurred_at DESC LIMIT 100`
      ).bind(organizationId, anonId).all(),
      env.CARE_DB.prepare(
        `SELECT id, resource_name AS name, activity_id AS activityId, source, state, created_at AS at, updated_at AS updatedAt
         FROM resource_events WHERE anon_id=? AND data_origin='live' ORDER BY created_at DESC LIMIT 100`
      ).bind(anonId).all(),
    ]);
    const events = [
      ...(product.results || []).map((row) => ({ kind: 'product', name: row.name, at: row.at,
        objectType: row.objectType, objectId: row.objectId, statistic: productStat[row.name] || null })),
      ...(resources.results || []).map((row) => ({ kind: 'recommendation', name: row.source === 'self_browse' ? 'activity_self_selected' : 'activity_recommended',
        at: row.at, objectId: row.id, activityId: row.activityId, activityName: row.name,
        state: row.state, updatedAt: row.updatedAt,
        statistic: row.source === 'self_browse' ? 'resource_self_selected' : 'resource_offered' })),
    ].sort((a, b) => b.at - a.at).slice(0, 150);

    if (events.length) {
      const earliest = events.at(-1).at;
      const latest = events[0].at;
      const { results: stats } = await env.CARE_DB.prepare(
        `SELECT event_type AS name, created_at AS at FROM aggregate_events
         WHERE organization_id=? AND data_origin='live' AND created_at BETWEEN ? AND ?
         ORDER BY created_at DESC LIMIT 300`
      ).bind(organizationId, earliest, latest).all();
      const seen = new Set((stats || []).filter((s) => STAT_TYPES.has(s.name)).map((s) => `${s.at}:${s.name}`));
      for (const event of events) {
        if (event.statistic) event.statisticRecorded = seen.has(`${event.at}:${event.statistic}`);
      }
    }
    return json({ ok: true, organizationId, participants: participants || [], anonId, events,
      statisticNote: '统计事件按同组织、同毫秒和类型核对；旧事件或极端并发可能无法逐人证明归属。' });
  } catch {
    console.error(JSON.stringify({ event: 'internal_test_timeline_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
