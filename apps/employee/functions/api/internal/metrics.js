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

// 情绪温度改由对话的风险等级构成得出：10 分 = 全部对话都是绿色。
//
// 原口径来自每日心情打卡，那个入口已经下线。这里不改用对话情绪词换算，
// 因为情绪是词不是量表，把「紧张/低落/疲惫」折算成分数需要一套自己发明的权重，
// 那等于凭空造一个心理量表。绿/黄/红是产品本来就在用的真实分级，直接用它。
//
// share 为非绿对话占比（0～1）。
const toTemperature = (share) => (
  share === null || share === undefined ? null : Math.round((10 - 9 * share) * 10) / 10
);

const nonGreenShare = (row) => {
  const total = (row?.green || 0) + (row?.non_green || 0);
  return total ? (row.non_green || 0) / total : null;
};

const deltaLabel = (current, previous) => {
  if (current === null || previous === null || previous === undefined || current === undefined) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  if (diff === 0) return '持平';
  return `${diff > 0 ? '+' : ''}${diff}`;
};

// 阈值按新口径重新标定：8.5 分 ≈ 非绿对话不超过 1/6，7.0 分 ≈ 不超过 1/3。
const deptStatus = (temp) => {
  if (temp === null) return { status: null, level: null };
  if (temp >= 8.5) return { status: '良好', level: 'g' };
  if (temp >= 7) return { status: '需关注', level: 'y' };
  return { status: '需干预', level: 'r' };
};

function originClause(origin) {
  return origin === 'all' ? { sql: '', binds: [] } : { sql: ' AND data_origin = ?', binds: [origin] };
}

async function summarize(env, since, origin) {
  const o = originClause(origin);
  const [users, events, risks] = await Promise.all([
    env.CARE_DB.prepare(`SELECT COUNT(DISTINCT anon_id) AS n FROM messages WHERE role = 'user' AND created_at > ?${o.sql}`)
      .bind(since, ...o.binds).first(),
    env.CARE_DB.prepare(`SELECT COUNT(*) AS n FROM aggregate_events WHERE created_at > ?${o.sql}`)
      .bind(since, ...o.binds).first(),
    env.CARE_DB.prepare(`SELECT level, COUNT(DISTINCT anon_id) AS people FROM risk_events WHERE created_at > ?${o.sql} GROUP BY level`)
      .bind(since, ...o.binds).all(),
  ]);
  const byLevel = Object.fromEntries((risks.results || []).map((r) => [r.level, r.people]));
  return {
    activeUsers: suppress(users?.n || 0, users?.n || 0),
    eventCount: origin === 'demo_seed' ? events?.n || 0 : null,
    eventCountSuppressed: origin !== 'demo_seed',
    riskBands: { suppressed: (users?.n || 0) < MIN_SAMPLE, yellow: (byLevel.yellow || 0) >= MIN_SAMPLE ? riskBand(byLevel.yellow) : null, red: (byLevel.red || 0) >= MIN_SAMPLE ? riskBand(byLevel.red) : null },
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

    // 不混合模拟与真实样本来凑k，避免通过已知基线相减推算真实小样本。
    const origin = url.searchParams.get('origin') === 'demo_seed' ? 'demo_seed' : 'live';
    const scoped = /\b(FROM|JOIN) (mood_checkins|messages|aggregate_events|risk_events|resource_events|posts|profiles|appointments)\b/g;
    const q = (sql, ...binds) => env.CARE_DB.prepare(sql.replace(scoped, (_m, op, table) => `${op} (SELECT * FROM ${table} WHERE data_origin='${origin}')`)).bind(...binds);

    const [
      tenant, trend, active, prevActive, stress, prevStress, riskRows, greenRow,
      emotions, resources, wall, liveEvents, topicRows, deptRows, deptMood, deptEmotion,
      rhythmRows, sensingRows, redCases, ctxRows, activityOverallRow, perfRows,
    ] = await Promise.all([
      q('SELECT display_name, headcount, industry, data_origin FROM tenant_profile WHERE id = ?', 'demo').first(),
      // 趋势按天统计对话的绿/非绿构成；样本量用当天对话条数，低于阈值的点单独抑制。
      q(`SELECT bucket_day AS bucket,
                SUM(CASE WHEN level = 'green' THEN 1 ELSE 0 END) AS green,
                SUM(CASE WHEN level IN ('yellow','red') THEN 1 ELSE 0 END) AS non_green,
                COUNT(*) AS n
         FROM aggregate_events WHERE event_type = 'chat_message' AND created_at > ?
         GROUP BY bucket_day ORDER BY bucket_day`, since).all(),
      q("SELECT COUNT(DISTINCT anon_id) AS n FROM messages WHERE role = 'user' AND created_at > ?", since).first(),
      q("SELECT COUNT(DISTINCT anon_id) AS n FROM messages WHERE role = 'user' AND created_at > ? AND created_at <= ?", prevSince, since).first(),
      q(`SELECT SUM(CASE WHEN level = 'green' THEN 1 ELSE 0 END) AS green,
                SUM(CASE WHEN level IN ('yellow','red') THEN 1 ELSE 0 END) AS non_green,
                COUNT(*) AS n
         FROM aggregate_events WHERE event_type = 'chat_message' AND created_at > ?`, since).first(),
      q(`SELECT SUM(CASE WHEN level = 'green' THEN 1 ELSE 0 END) AS green,
                SUM(CASE WHEN level IN ('yellow','red') THEN 1 ELSE 0 END) AS non_green,
                COUNT(*) AS n
         FROM aggregate_events WHERE event_type = 'chat_message' AND created_at > ? AND created_at <= ?`, prevSince, since).first(),
      q('SELECT level, COUNT(*) AS events, COUNT(DISTINCT anon_id) AS people FROM risk_events WHERE created_at > ? GROUP BY level', since).all(),
      q("SELECT COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND level = 'green' AND created_at > ?", since).first(),
      q("SELECT emotion, COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND emotion IS NOT NULL AND created_at > ? GROUP BY emotion ORDER BY n DESC LIMIT 6", since).all(),
      q(`SELECT resource_name AS name, resource_level AS level, COUNT(*) AS offered, COUNT(DISTINCT anon_id) AS people,
                SUM(CASE WHEN state IN ('joined','completed') THEN 1 ELSE 0 END) AS joined,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(DISTINCT CASE WHEN state IN ('joined','completed') THEN anon_id END) AS joined_people,
                COUNT(DISTINCT CASE WHEN state='completed' THEN anon_id END) AS completed_people
         FROM resource_events WHERE created_at > ? GROUP BY resource_name, resource_level ORDER BY offered DESC LIMIT 8`, since).all(),
      q("SELECT SUM(CASE WHEN event_type = 'wall_post' THEN 1 ELSE 0 END) AS posts, SUM(CASE WHEN event_type = 'wall_hug' THEN 1 ELSE 0 END) AS hugs FROM aggregate_events WHERE created_at > ?", since).first(),
      q("SELECT COUNT(*) AS n FROM aggregate_events WHERE data_origin = 'live' AND created_at > ?", since).first(),
      // 组织议题：发帖时已分类，这里只计数，不接触原文。
      q('SELECT topic, COUNT(*) AS n, COUNT(DISTINCT anon_id) AS people FROM posts WHERE topic IS NOT NULL AND deleted_at IS NULL AND created_at > ? GROUP BY topic ORDER BY n DESC LIMIT 6', since).all(),
      q("SELECT department AS name, COUNT(*) AS headcount FROM profiles WHERE department IS NOT NULL GROUP BY department ORDER BY headcount DESC").all(),
      // 部门温度必须和全员温度同一个口径：都按对话条数的绿/非绿构成算。
      // 换成「触发过黄红的人数 ÷ 说过话的人数」会让一次黄色就把这个人整段时间算进去，
      // 部门分数系统性偏低，几乎所有部门都显示需干预。
      q(`SELECT p.department AS name, COUNT(DISTINCT m.anon_id) AS people,
                SUM(CASE WHEN m.risk_level = 'green' THEN 1 ELSE 0 END) AS green,
                SUM(CASE WHEN m.risk_level IN ('yellow','red') THEN 1 ELSE 0 END) AS non_green
         FROM messages m JOIN profiles p ON p.anon_id = m.anon_id
         WHERE m.role = 'user' AND m.created_at > ? AND p.department IS NOT NULL GROUP BY p.department`, since).all(),
      q(`SELECT p.department AS name, po.topic, COUNT(*) AS n, COUNT(DISTINCT po.anon_id) AS people
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
                COUNT(e.helpfulness) AS feedback,
                SUM(CASE WHEN e.helpfulness = '有帮助' THEN 1 ELSE 0 END) AS helpful,
                COUNT(DISTINCT e.anon_id) AS people,
                COUNT(DISTINCT CASE WHEN e.state IN ('joined','completed') THEN e.anon_id END) AS joined_people,
                COUNT(DISTINCT CASE WHEN e.state='completed' THEN e.anon_id END) AS completed_people
         FROM resource_events e LEFT JOIN profiles p ON p.anon_id = e.anon_id
         WHERE e.created_at > ? GROUP BY COALESCE(p.context_tag,'none')`, since).all(),
      q(`SELECT COUNT(*) AS recommended,
                SUM(CASE WHEN state IN ('joined','completed') THEN 1 ELSE 0 END) AS participated,
                SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(helpfulness) AS feedback,
                SUM(CASE WHEN helpfulness = '有帮助' THEN 1 ELSE 0 END) AS helpful,
                COUNT(DISTINCT anon_id) AS people,
                COUNT(DISTINCT CASE WHEN state IN ('joined','completed') THEN anon_id END) AS joined_people,
                COUNT(DISTINCT CASE WHEN state='completed' THEN anon_id END) AS completed_people,
                -- 复用率：做完还愿意再做一次，是比任何自评都硬的信号，而且不用问任何人。
                (SELECT COUNT(DISTINCT anon_id) FROM (
                   SELECT anon_id FROM resource_events
                   WHERE state = 'completed' AND created_at > ?
                   GROUP BY anon_id, activity_id HAVING COUNT(*) > 1)) AS repeat_people
         FROM resource_events WHERE created_at > ?`, since, since).first(),
      q(`SELECT e.resource_name AS label, e.resource_level AS level, COUNT(*) AS recommended,
                SUM(CASE WHEN e.state IN ('joined','completed') THEN 1 ELSE 0 END) AS participated,
                SUM(CASE WHEN e.state = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(e.helpfulness) AS feedback,
                SUM(CASE WHEN e.helpfulness = '有帮助' THEN 1 ELSE 0 END) AS helpful,
                COUNT(DISTINCT e.anon_id) AS people,
                COUNT(DISTINCT CASE WHEN e.state IN ('joined','completed') THEN e.anon_id END) AS joined_people,
                COUNT(DISTINCT CASE WHEN e.state='completed' THEN e.anon_id END) AS completed_people
         FROM resource_events e LEFT JOIN activities a ON a.id = e.activity_id
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

    const temperature = (stress?.n || 0) >= MIN_SAMPLE ? toTemperature(nonGreenShare(stress)) : null;
    const prevTemperature = (prevStress?.n || 0) >= MIN_SAMPLE ? toTemperature(nonGreenShare(prevStress)) : null;

    const coverageRate = headcount && activeUsers >= MIN_SAMPLE ? Math.min(100, percentage(activeUsers, headcount)) : null;
    const prevCoverageRate = headcount && prevActive?.n >= MIN_SAMPLE ? Math.min(100, percentage(prevActive.n, headcount)) : null;

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
          name: dept.name, headcount: dept.headcount, sampleSize: null, suppressed: true,
          participationRate: null, moodTemp: null, mainTopic: null, status: null, level: null,
        };
      }
      const temp = toTemperature(nonGreenShare(mood));
      return {
        name: dept.name,
        headcount: dept.headcount,
        sampleSize: people,
        suppressed: false,
        participationRate: percentage(people, dept.headcount),
        moodTemp: temp,
        mainTopic: topTopicByDept[dept.name]?.people >= MIN_SAMPLE ? topTopicByDept[dept.name].topic : null,
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
        sampleSize: state === 'ok' ? row?.sample_size ?? null : null,
        syncedAt: row?.bucket_day || null,
      };
    };
    const pad = (n) => String(n).padStart(2, '0');

    const report = {
      ok: true,
      origin,
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
        bucket: r.bucket, value: toTemperature(nonGreenShare(r)), sampleSize: r.n,
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
      topics: (topicRows.results || []).filter(r => r.people >= MIN_SAMPLE).map((r) => ({ topic: r.topic, count: r.n })),
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
      // 活动效果不再声称测到了状态改善：没有前测，能报告的只有参与、完成、复用和评价。
      // 帮助度是选填的，所以「有帮助占比」必须和「评价率」一起给——
      // 只给占比会让一小撮愿意评价的人看起来像全体。
      activityOverall: {
        ...suppress({
          recommended: activityOverallRow?.recommended || 0,
          participationRate: activityOverallRow?.joined_people >= MIN_SAMPLE ? percentage(activityOverallRow.participated, activityOverallRow.recommended) : null,
          completionRate: activityOverallRow?.completed_people >= MIN_SAMPLE ? percentage(activityOverallRow.completed, activityOverallRow.participated) : null,
          repeatRate: activityOverallRow?.completed_people >= MIN_SAMPLE
            ? percentage(activityOverallRow.repeat_people || 0, activityOverallRow.completed_people)
            : null,
        }, activityOverallRow?.people || 0),
        feedbackCount: null,
        helpfulRate: activityOverallRow?.feedback >= MIN_SAMPLE
          ? percentage(activityOverallRow.helpful || 0, activityOverallRow.feedback)
          : null,
        feedbackRate: activityOverallRow?.feedback >= MIN_SAMPLE
          ? percentage(activityOverallRow.feedback, activityOverallRow.completed || 0)
          : null,
      },
      activityByAudience: (ctxRows.results || []).map((r) => ({
        tag: r.tag,
        label: CONTEXT_LABELS[r.tag] || r.tag,
        ...suppress({
          recommended: r.recommended,
          participationRate: r.joined_people >= MIN_SAMPLE ? percentage(r.participated, r.recommended) : null,
          completionRate: r.completed_people >= MIN_SAMPLE ? percentage(r.completed, r.participated) : null,
          helpfulRate: r.feedback >= MIN_SAMPLE && r.people >= MIN_SAMPLE ? percentage(r.helpful || 0, r.feedback) : null,
          feedbackRate: r.feedback >= MIN_SAMPLE && r.people >= MIN_SAMPLE ? percentage(r.feedback, r.completed || 0) : null,
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
          participationRate: r.joined_people >= MIN_SAMPLE ? percentage(r.participated, r.recommended) : null,
          completionRate: r.completed_people >= MIN_SAMPLE ? percentage(r.completed, r.participated) : null,
          helpfulRate: r.feedback >= MIN_SAMPLE && r.people >= MIN_SAMPLE ? percentage(r.helpful || 0, r.feedback) : null,
          feedbackRate: r.feedback >= MIN_SAMPLE && r.people >= MIN_SAMPLE ? percentage(r.feedback, r.completed || 0) : null,
          feedback: r.feedback,
        }, r.people),
      })),
      topEmotions: emotionTotal >= MIN_SAMPLE
        ? (emotions.results || []).map((r) => ({ emotion: r.emotion, share: percentage(r.n, emotionTotal) }))
        : [],
      resources: (resources.results || []).map((r) => ({
        name: r.name, level: r.level,
        ...suppress({
          offered: r.offered,
          joinRate: r.joined_people >= MIN_SAMPLE ? percentage(r.joined, r.offered) : null,
          completeRate: r.completed_people >= MIN_SAMPLE ? percentage(r.completed, r.offered) : null,
        }, r.people),
      })),
      activity: { posts: wall?.posts || 0, hugs: wall?.hugs || 0 },
      origins: {
        demo_seed: await summarize(env, since, 'demo_seed'),
        live: await summarize(env, since, 'live'),
      },
      liveEventCount: null,
    };
    // 无法从不含主体的aggregate_events证明每个情绪/事件分组达到k，真实侧保守不出数。
    if (origin === 'live') {
      report.topEmotions = [];
      report.activity = { posts: null, hugs: null };
      report.risk = Object.fromEntries(Object.keys(report.risk).map(key => [key, null]));
      report.activityOverall.helpfulRate = null;
      report.activityOverall.feedbackRate = null;
      for (const item of [...report.activityByAudience, ...report.activityPerformance]) {
        if (item.value) { item.value.helpfulRate = null; item.value.feedbackRate = null; item.value.feedback = null; }
      }
    }
    return json(report);
  } catch {
    console.error(JSON.stringify({ event: 'metrics_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
