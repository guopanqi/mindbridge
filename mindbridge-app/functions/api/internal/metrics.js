// Care Domain 对管理端暴露的唯一接口。
//
// 边界：console 不绑定 CARE_DB，只能通过这个接口取数；接口固定输出经过阈值抑制的
// 聚合结果，不接受任意筛选，也没有任何个案查询能力。
// 因此新增筛选参数前必须重新评估交叉推断风险。
import { json } from '../_lib/http.js';
import { MIN_SAMPLE, percentage, riskBand, suppress, suppressSeries } from '../_lib/metrics.js';

const DEFAULT_DAYS = 90;
const MAX_DAYS = 180;

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request, env) {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  if (typeof expected !== 'string' || expected.length < 32) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  return timingSafeEqual(header.slice(7), expected);
}

// data_origin 过滤：'all' 不加条件，其余按值精确匹配。
function originClause(origin, column = 'data_origin') {
  if (origin === 'all') return { sql: '', binds: [] };
  return { sql: ` AND ${column} = ?`, binds: [origin] };
}

async function summarize(env, since, origin) {
  const o = originClause(origin);
  const [users, events, risks] = await Promise.all([
    env.CARE_DB.prepare(`SELECT COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ?${o.sql}`)
      .bind(since, ...o.binds).first(),
    env.CARE_DB.prepare(`SELECT COUNT(*) AS n FROM aggregate_events WHERE created_at > ?${o.sql}`)
      .bind(since, ...o.binds).first(),
    env.CARE_DB.prepare(`SELECT level, COUNT(DISTINCT anon_id) AS people FROM risk_events WHERE created_at > ?${o.sql} GROUP BY level`)
      .bind(since, ...o.binds).all(),
  ]);
  const byLevel = Object.fromEntries((risks.results || []).map((r) => [r.level, r.people]));
  const people = users?.n || 0;
  return {
    activeUsers: suppress(people, people),
    // 事件总数不按任何维度切分，因此可以出数；风险区间是按人切分的，样本不足必须一起抑制，
    // 否则在只有两名真实员工时，"红色 1-5 人"几乎等同于点名。
    eventCount: events?.n || 0,
    riskBands: people >= MIN_SAMPLE
      ? { yellow: riskBand(byLevel.yellow || 0), red: riskBand(byLevel.red || 0) }
      : { suppressed: true, reason: 'MIN_SAMPLE', minSample: MIN_SAMPLE },
  };
}

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) {
    return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  }
  try {
    const url = new URL(request.url);
    const requested = Number.parseInt(url.searchParams.get('days') || '', 10);
    const days = Number.isFinite(requested) ? Math.max(7, Math.min(requested, MAX_DAYS)) : DEFAULT_DAYS;
    const since = Date.now() - days * 86400000;

    const [tenant, trend, active, riskRows, greenRow, emotions, resources, wall, liveEvents] = await Promise.all([
      env.CARE_DB.prepare('SELECT display_name, headcount, industry, data_origin FROM tenant_profile WHERE id = ?')
        .bind('demo').first(),
      env.CARE_DB.prepare(
        'SELECT bucket_day AS bucket, AVG(stress_score) AS value, COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ? GROUP BY bucket_day ORDER BY bucket_day'
      ).bind(since).all(),
      env.CARE_DB.prepare('SELECT COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ?').bind(since).first(),
      env.CARE_DB.prepare(
        'SELECT level, COUNT(*) AS events, COUNT(DISTINCT anon_id) AS people FROM risk_events WHERE created_at > ? GROUP BY level'
      ).bind(since).all(),
      env.CARE_DB.prepare(
        "SELECT COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND level = 'green' AND created_at > ?"
      ).bind(since).first(),
      env.CARE_DB.prepare(
        "SELECT emotion, COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND emotion IS NOT NULL AND created_at > ? GROUP BY emotion ORDER BY n DESC LIMIT 6"
      ).bind(since).all(),
      env.CARE_DB.prepare(
        `SELECT resource_name AS name, resource_level AS level, COUNT(*) AS offered,
                COUNT(DISTINCT anon_id) AS people,
                SUM(CASE WHEN state IN ('joined','completed') THEN 1 ELSE 0 END) AS joined,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) AS completed
         FROM resource_events WHERE created_at > ? GROUP BY resource_name, resource_level ORDER BY offered DESC LIMIT 8`
      ).bind(since).all(),
      env.CARE_DB.prepare(
        "SELECT SUM(CASE WHEN event_type = 'wall_post' THEN 1 ELSE 0 END) AS posts, SUM(CASE WHEN event_type = 'wall_hug' THEN 1 ELSE 0 END) AS hugs FROM aggregate_events WHERE created_at > ?"
      ).bind(since).first(),
      env.CARE_DB.prepare("SELECT COUNT(*) AS n FROM aggregate_events WHERE data_origin = 'live' AND created_at > ?")
        .bind(since).first(),
    ]);

    const headcount = tenant?.headcount || 0;
    const activeUsers = active?.n || 0;
    const byLevel = Object.fromEntries((riskRows.results || []).map((r) => [r.level, r]));
    const greenCount = greenRow?.n || 0;
    const yellowCount = byLevel.yellow?.events || 0;
    const redCount = byLevel.red?.events || 0;
    const totalChat = greenCount + yellowCount + redCount;
    const emotionTotal = (emotions.results || []).reduce((sum, row) => sum + row.n, 0);

    return json({
      ok: true,
      minSample: MIN_SAMPLE,
      window: { days, since },
      tenant: {
        name: tenant?.display_name || '未配置',
        headcount,
        industry: tenant?.industry || '',
        // 人数基线来自预置演示数据，UI 必须持续标注。
        simulatedBaseline: tenant?.data_origin === 'demo_seed',
      },
      coverage: {
        activeUsers: suppress(activeUsers, activeUsers),
        // 演示期间真实员工会叠加在 200 人模拟基线之上，覆盖率封顶 100%。
        rate: headcount ? Math.min(100, percentage(activeUsers, headcount)) : 0,
      },
      moodTrend: suppressSeries((trend.results || []).map((r) => ({
        bucket: r.bucket,
        value: Math.round(r.value * 100) / 100,
        sampleSize: r.n,
      }))),
      risk: {
        greenShare: totalChat ? percentage(greenCount, totalChat) : 0,
        // 人数一律以区间输出，避免小团队里等同于点名。
        yellowPeople: riskBand(byLevel.yellow?.people || 0),
        redPeople: riskBand(byLevel.red?.people || 0),
        totalConversations: totalChat,
      },
      topEmotions: emotionTotal >= MIN_SAMPLE
        ? (emotions.results || []).map((r) => ({ emotion: r.emotion, share: percentage(r.n, emotionTotal) }))
        : [],
      resources: (resources.results || []).map((r) => ({
        name: r.name,
        level: r.level,
        ...suppress({
          offered: r.offered,
          joinRate: percentage(r.joined, r.offered),
          completeRate: percentage(r.completed, r.offered),
        }, r.people),
      })),
      activity: { posts: wall?.posts || 0, hugs: wall?.hugs || 0 },
      // 模拟基线与真实事件必须可分别查询，这是路演如实标注的前提。
      origins: {
        demo_seed: await summarize(env, since, 'demo_seed'),
        live: await summarize(env, since, 'live'),
      },
      liveEventCount: liveEvents?.n || 0,
    });
  } catch {
    console.error(JSON.stringify({ event: 'metrics_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
