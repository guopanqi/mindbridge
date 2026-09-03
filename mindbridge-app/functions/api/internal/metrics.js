// Care Domain 对管理端暴露的唯一取数接口。
//
// 三条硬规则：
// 1. 输出里不得出现 anon_id、个案编号、原文或任何可定位到个人的字段；
// 2. 任何维度样本量低于 MIN_SAMPLE 一律不出数，返回抑制标记而不是真实值；
// 3. 这里不允许出现任何写死的示例数值——查不到就返回 null，由前端显示"未接入/样本不足"。
//    经过一次 API 的假数据会被误当成真数据，这比前端写死更危险。
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
  return header.startsWith('Bearer ') && timingSafeEqual(header.slice(7), expected);
}

// 压力分 1（很好）～5（快撑不住）换算成 10 分制情绪温度，越高越好。
const toTemperature = (avgStress) => (
  avgStress === null || avgStress === undefined ? null : Math.round(((5 - avgStress) / 4 * 9 + 1) * 10) / 10
);

const deltaLabel = (current, previous) => {
  if (current === null || previous === null || previous === undefined || current === undefined) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  if (diff === 0) return '持平';
  return `${diff > 0 ? '+' : ''}${diff}`;
};

const deptStatus = (temp) => {
  if (temp === null) return { status: null, level: null };
  if (temp >= 6.5) return { status: '良好', level: 'g' };
  if (temp >= 5.5) return { status: '需关注', level: 'y' };
  return { status: '需干预', level: 'r' };
};

function originClause(origin) {
  return origin === 'all' ? { sql: '', binds: [] } : { sql: ' AND data_origin = ?', binds: [origin] };
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
  return {
    activeUsers: suppress(users?.n || 0, users?.n || 0),
    eventCount: events?.n || 0,
    riskBands: { yellow: riskBand(byLevel.yellow || 0), red: riskBand(byLevel.red || 0) },
  };
}

const CONTEXT_LABELS = {
  highIntensity: '高强度岗位', manager: '中基层管理者', newcomer: '新入职员工',
  returner: '返岗员工', techTransition: '技术转型中', crossCulture: '跨文化团队', none: '未选择标签',
};

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  try {
    const url = new URL(request.url);
    const requested = Number.parseInt(url.searchParams.get('days') || '', 10);
    const days = Number.isFinite(requested) ? Math.max(7, Math.min(requested, MAX_DAYS)) : DEFAULT_DAYS;
    const now = Date.now();
    const since = now - days * 86400000;
    const prevSince = since - days * 86400000;

    const q = (sql, ...binds) => env.CARE_DB.prepare(sql).bind(...binds);

    const [
      tenant, trend, active, prevActive, stress, prevStress, riskRows, greenRow,
      emotions, resources, wall, liveEvents, topicRows, deptRows, deptMood, deptEmotion,
      rhythmRows, sensingRows, redCases, ctxRows, activityOverallRow, perfRows,
    ] = await Promise.all([
      q('SELECT display_name, headcount, industry, data_origin FROM tenant_profile WHERE id = ?', 'demo').first(),
      q('SELECT bucket_day AS bucket, AVG(stress_score) AS value, COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ? GROUP BY bucket_day ORDER BY bucket_day', since).all(),
      q('SELECT COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ?', since).first(),
      q('SELECT COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ? AND created_at <= ?', prevSince, since).first(),
      q('SELECT AVG(stress_score) AS v, COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ?', since).first(),
      q('SELECT AVG(stress_score) AS v, COUNT(DISTINCT anon_id) AS n FROM mood_checkins WHERE created_at > ? AND created_at <= ?', prevSince, since).first(),
      q('SELECT level, COUNT(*) AS events, COUNT(DISTINCT anon_id) AS people FROM risk_events WHERE created_at > ? GROUP BY level', since).all(),
      q("SELECT COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND level = 'green' AND created_at > ?", since).first(),
      q("SELECT emotion, COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND emotion IS NOT NULL AND created_at > ? GROUP BY emotion ORDER BY n DESC LIMIT 6", since).all(),
      q(`SELECT resource_name AS name, resource_level AS level, COUNT(*) AS offered, COUNT(DISTINCT anon_id) AS people,
                SUM(CASE WHEN state IN ('joined','completed') THEN 1 ELSE 0 END) AS joined,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) AS completed
         FROM resource_events WHERE created_at > ? GROUP BY resource_name, resource_level ORDER BY offered DESC LIMIT 8`, since).all(),
      q("SELECT SUM(CASE WHEN event_type = 'wall_post' THEN 1 ELSE 0 END) AS posts, SUM(CASE WHEN event_type = 'wall_hug' THEN 1 ELSE 0 END) AS hugs FROM aggregate_events WHERE created_at > ?", since).first(),
      q("SELECT COUNT(*) AS n FROM aggregate_events WHERE data_origin = 'live' AND created_at > ?", since).first(),
      // 组织议题：发帖时已分类，这里只计数，不接触原文。
      q('SELECT topic, COUNT(*) AS n FROM posts WHERE topic IS NOT NULL AND deleted_at IS NULL AND created_at > ? GROUP BY topic ORDER BY n DESC LIMIT 6', since).all(),
      q("SELECT department AS name, COUNT(*) AS headcount FROM profiles WHERE department IS NOT NULL GROUP BY department ORDER BY headcount DESC").all(),
      q(`SELECT p.department AS name, AVG(m.stress_score) AS avg_stress, COUNT(DISTINCT m.anon_id) AS people
         FROM mood_checkins m JOIN profiles p ON p.anon_id = m.anon_id
         WHERE m.created_at > ? AND p.department IS NOT NULL GROUP BY p.department`, since).all(),
      q(`SELECT p.department AS name, po.topic, COUNT(*) AS n
         FROM posts po JOIN profiles p ON p.anon_id = po.anon_id
         WHERE po.created_at > ? AND po.deleted_at IS NULL AND po.topic IS NOT NULL AND p.department IS NOT NULL
         GROUP BY p.department, po.topic`, since).all(),
      q("SELECT metric, value, sample_size, unit, bucket_day FROM org_rhythm WHERE data_origin = 'live' ORDER BY bucket_day DESC").all().catch(() => ({ results: [] })),
      q('SELECT key, label, enabled, source FROM sensing_signals').all().catch(() => ({ results: [] })),
      q(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN status IN ('active','done') THEN 1 ELSE 0 END) AS handled,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS open,
                SUM(CASE WHEN status = 'pending' AND sla_at IS NOT NULL AND sla_at < ? THEN 1 ELSE 0 END) AS breached
         FROM appointments WHERE risk_level = 'red' AND created_at > ?`, now, since).first().catch(() => null),
      // 活动效果按人群标签统计，全部来自真实的资源推荐事件。
      q(`SELECT COALESCE(p.context_tag,'none') AS tag, COUNT(*) AS recommended,
                SUM(CASE WHEN e.state IN ('joined','completed') THEN 1 ELSE 0 END) AS participated,
                SUM(CASE WHEN e.state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(e.rating) AS feedback, AVG(e.rating) AS avg_rating,
                COUNT(DISTINCT e.anon_id) AS people
         FROM resource_events e LEFT JOIN profiles p ON p.anon_id = e.anon_id
         WHERE e.created_at > ? GROUP BY COALESCE(p.context_tag,'none')`, since).all(),
      q(`SELECT COUNT(*) AS recommended,
                SUM(CASE WHEN state IN ('joined','completed') THEN 1 ELSE 0 END) AS participated,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(rating) AS feedback, AVG(rating) AS avg_rating,
                COUNT(DISTINCT anon_id) AS people
         FROM resource_events WHERE created_at > ?`, since).first(),
      q(`SELECT e.resource_name AS label, e.resource_level AS level, COUNT(*) AS recommended,
                SUM(CASE WHEN e.state IN ('joined','completed') THEN 1 ELSE 0 END) AS participated,
                SUM(CASE WHEN e.state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(e.rating) AS feedback, AVG(e.rating) AS avg_rating,
                COUNT(DISTINCT e.anon_id) AS people,
                -- 效果 = 前后自评差值，只统计两次自评都留下的记录。
                AVG(CASE WHEN e.pre_score IS NOT NULL AND e.post_score IS NOT NULL
                         THEN e.pre_score - e.post_score END) AS effect_delta,
                SUM(CASE WHEN e.pre_score IS NOT NULL AND e.post_score IS NOT NULL THEN 1 ELSE 0 END) AS effect_samples,
                MAX(a.score_label) AS score_label, MAX(a.direction) AS direction
         FROM resource_events e LEFT JOIN resource_catalog c ON c.name = e.resource_name
              LEFT JOIN activities a ON a.id = COALESCE(e.activity_id, c.activity_id)
         WHERE e.created_at > ? GROUP BY e.resource_name, e.resource_level ORDER BY recommended DESC LIMIT 8`, since)
        .all()
        // 活动效果依赖 0012 迁移。迁移未应用时如实上报 schemaPending，
        // 既不让整页 500，也不静默当成「没有数据」——那两种都会掩盖部署问题。
        .catch((error) => ({ results: null, failed: String(error?.message || error) })),
    ]);

    const headcount = tenant?.headcount || 0;
    const activeUsers = active?.n || 0;
    const byLevel = Object.fromEntries((riskRows.results || []).map((r) => [r.level, r]));
    const greenCount = greenRow?.n || 0;
    const totalChat = greenCount + (byLevel.yellow?.events || 0) + (byLevel.red?.events || 0);
    const emotionTotal = (emotions.results || []).reduce((sum, row) => sum + row.n, 0);

    const temperature = (stress?.n || 0) >= MIN_SAMPLE ? toTemperature(stress.v) : null;
    const prevTemperature = (prevStress?.n || 0) >= MIN_SAMPLE ? toTemperature(prevStress.v) : null;

    const coverageRate = headcount ? Math.min(100, percentage(activeUsers, headcount)) : null;
    const prevCoverageRate = headcount && prevActive?.n ? Math.min(100, percentage(prevActive.n, headcount)) : null;

    // 部门概览：人数、参与率、情绪温度、主导议题全部真算，样本不足的部门自动被抑制。
    const moodByDept = Object.fromEntries((deptMood.results || []).map((r) => [r.name, r]));
    const topTopicByDept = {};
    for (const row of deptEmotion.results || []) {
      const current = topTopicByDept[row.name];
      if (!current || row.n > current.n) topTopicByDept[row.name] = row;
    }
    const departments = (deptRows.results || []).map((dept) => {
      const mood = moodByDept[dept.name];
      const people = mood?.people || 0;
      if (people < MIN_SAMPLE) {
        return {
          name: dept.name, headcount: dept.headcount, sampleSize: people, suppressed: true,
          participationRate: null, moodTemp: null, mainTopic: null, status: null, level: null,
        };
      }
      const temp = toTemperature(mood.avg_stress);
      return {
        name: dept.name,
        headcount: dept.headcount,
        sampleSize: people,
        suppressed: false,
        participationRate: percentage(people, dept.headcount),
        moodTemp: temp,
        mainTopic: topTopicByDept[dept.name]?.topic || null,
        ...deptStatus(temp),
      };
    });

    // 团队节奏：只有真的从钉钉同步到并且样本足够时才给数值，否则明确说明状态。
    const sensing = Object.fromEntries((sensingRows.results || []).map((r) => [r.key, r]));
    const rhythmLatest = {};
    for (const row of rhythmRows.results || []) {
      if (!rhythmLatest[row.metric]) rhythmLatest[row.metric] = row;
    }
    const rhythmMetric = (key, metric, label, note, format) => {
      const signal = sensing[key];
      const row = rhythmLatest[metric];
      let state = 'ok';
      if (!signal || signal.enabled !== 1) state = 'disabled';
      else if (!row) state = 'not_synced';
      else if (row.sample_size < MIN_SAMPLE) state = 'suppressed';
      return {
        key, label, note, state,
        value: state === 'ok' ? format(row.value) : null,
        sampleSize: state === 'suppressed' || state === 'ok' ? row?.sample_size ?? null : null,
        syncedAt: row?.bucket_day || null,
      };
    };
    const pad = (n) => String(n).padStart(2, '0');

    return json({
      ok: true,
      minSample: MIN_SAMPLE,
      window: { days, since },
      tenant: {
        name: tenant?.display_name || null,
        headcount: headcount || null,
        industry: tenant?.industry || null,
        simulatedBaseline: tenant?.data_origin === 'demo_seed',
      },
      coverage: {
        activeUsers: suppress(activeUsers, activeUsers),
        rate: coverageRate,
        delta: deltaLabel(coverageRate, prevCoverageRate) ? `${deltaLabel(coverageRate, prevCoverageRate)}pt` : null,
      },
      temperature: { value: temperature, delta: deltaLabel(temperature, prevTemperature) },
      moodTrend: suppressSeries((trend.results || []).map((r) => ({
        bucket: r.bucket, value: Math.round(r.value * 100) / 100, sampleSize: r.n,
      }))),
      risk: {
        greenShare: totalChat ? percentage(greenCount, totalChat) : null,
        yellowPeople: riskBand(byLevel.yellow?.people || 0),
        redPeople: riskBand(byLevel.red?.people || 0),
        redCount: byLevel.red?.events || 0,
        totalConversations: totalChat,
        // 接管情况全部来自真实预约状态；没有红色个案时返回 null，不假装 100%。
        // 「SLA 内响应率」而不是「已接管率」：刚提交且仍在 SLA 内的个案不算漏接。
        redHandledRate: redCases?.total ? percentage(redCases.handled || 0, redCases.total) : null,
        redOnTimeRate: redCases?.total
          ? percentage(redCases.total - (redCases.breached || 0), redCases.total)
          : null,
        redOpen: redCases?.open || 0,
        redBreached: redCases?.breached || 0,
        redCases: redCases?.total || 0,
      },
      topics: (topicRows.results || []).map((r) => ({ topic: r.topic, count: r.n })),
      departments,
      rhythm: {
        connected: Boolean(rhythmRows.results?.length),
        metrics: [
          rhythmMetric('attendance_off_duty', 'median_off_duty_minutes', '下班打卡中位时间', '仅反映打卡记录时间',
            (v) => `${pad(Math.floor(v / 60))}:${pad(Math.round(v % 60))}`),
          rhythmMetric('attendance_late_share', 'late_off_duty_share', '晚间下班打卡占比', '口径：20:00 后',
            (v) => `${Math.round(v)}%`),
          rhythmMetric('approval_overtime', 'overtime_approvals', '加班·调休审批', '审批单数量，不含内容',
            (v) => `${Math.round(v)} 次`),
          rhythmMetric('todo_pending', 'pending_todos', '未完成待办均值', '待办条数，不含标题',
            (v) => `${Math.round(v)} 项`),
        ],
      },
      // 活动整体效果：满意度与有效反馈来自员工真实提交的评分，没有评分就返回 null。
      activityOverall: {
        ...suppress({
          recommended: activityOverallRow?.recommended || 0,
          participationRate: percentage(activityOverallRow?.participated || 0, activityOverallRow?.recommended || 0),
          completionRate: percentage(activityOverallRow?.completed || 0, activityOverallRow?.participated || 0),
        }, activityOverallRow?.people || 0),
        feedbackCount: activityOverallRow?.feedback || 0,
        avgRating: activityOverallRow?.feedback >= MIN_SAMPLE
          ? Math.round((activityOverallRow.avg_rating || 0) * 10) / 10
          : null,
      },
      activityByAudience: (ctxRows.results || []).map((r) => ({
        tag: r.tag,
        label: CONTEXT_LABELS[r.tag] || r.tag,
        ...suppress({
          recommended: r.recommended,
          participationRate: percentage(r.participated, r.recommended),
          completionRate: percentage(r.completed, r.participated),
          avgRating: r.feedback >= 3 ? Math.round((r.avg_rating || 0) * 10) / 10 : null,
          feedback: r.feedback,
        }, r.people),
      })),
      // perfRows.results 为 null 表示 0012 迁移尚未在该环境应用。
      // 如实上报，既不让整页 500，也不静默当成「没有数据」。
      schemaPending: perfRows.results === null ? ['0012_activities'] : [],
      activityPerformance: (perfRows.results || []).map((r) => ({
        label: r.label,
        level: r.level,
        ...suppress({
          recommended: r.recommended,
          participationRate: percentage(r.participated, r.recommended),
          completionRate: percentage(r.completed, r.participated),
          avgRating: r.feedback >= 3 ? Math.round((r.avg_rating || 0) * 10) / 10 : null,
          feedback: r.feedback,
          // 改善幅度已按 direction 归一：正数一律表示变好，前端不需要再推理方向。
          // 至少 3 份前后自评才展示，避免个位数样本被当成结论。
          improvement: r.effect_samples >= 3
            ? Math.round(((r.direction === 'up' ? -1 : 1) * (r.effect_delta || 0)) * 10) / 10
            : null,
          effectSamples: r.effect_samples || 0,
          scoreLabel: r.score_label || null,
        }, r.people),
      })),
      topEmotions: emotionTotal >= MIN_SAMPLE
        ? (emotions.results || []).map((r) => ({ emotion: r.emotion, share: percentage(r.n, emotionTotal) }))
        : [],
      resources: (resources.results || []).map((r) => ({
        name: r.name, level: r.level,
        ...suppress({
          offered: r.offered,
          joinRate: percentage(r.joined, r.offered),
          completeRate: percentage(r.completed, r.offered),
        }, r.people),
      })),
      activity: { posts: wall?.posts || 0, hugs: wall?.hugs || 0 },
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
