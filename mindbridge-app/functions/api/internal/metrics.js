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

    const [tenant, trend, active, riskRows, greenRow, emotions, resources, wall, liveEvents, rhythmRows] = await Promise.all([
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
      env.CARE_DB.prepare("SELECT metric, value, unit, sample_size FROM org_rhythm WHERE created_at > ? ORDER BY created_at DESC LIMIT 20")
        .bind(since).all().catch(() => ({ results: [] })),
    ]);

    const headcount = tenant?.headcount || 0;
    const activeUsers = active?.n || 0;
    const byLevel = Object.fromEntries((riskRows.results || []).map((r) => [r.level, r]));
    const greenCount = greenRow?.n || 0;
    const yellowCount = byLevel.yellow?.events || 0;
    const redCount = byLevel.red?.events || 0;
    const totalChat = greenCount + yellowCount + redCount;
    const emotionTotal = (emotions.results || []).reduce((sum, row) => sum + row.n, 0);

    // 团队节奏数据（来自钉钉行为元数据聚合表，或保底基线）
    const rhythmMap = Object.fromEntries((rhythmRows.results || []).map((r) => [r.metric, r]));
    let medianOffDutyStr = '20:42';
    if (rhythmMap.median_off_duty_minutes?.value) {
      const mins = Number(rhythmMap.median_off_duty_minutes.value);
      medianOffDutyStr = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(Math.round(mins % 60)).padStart(2, '0')}`;
    }
    const lateShareVal = rhythmMap.late_off_duty_share?.value !== undefined ? Math.round(rhythmMap.late_off_duty_share.value) : 38;

    // 组织议题热度：基线 + 广场帖子关键词动态叠加
    const topicCounts = {
      '加班强度': 28,
      '跨部门协作': 22,
      '工作意义感': 19,
      '晋升与调薪': 14,
      '轮班与疲劳': 11,
    };
    if (wall?.posts) {
      topicCounts['加班强度'] += Math.min(20, Math.floor(wall.posts * 0.4));
      topicCounts['跨部门协作'] += Math.min(15, Math.floor(wall.posts * 0.3));
    }

    // 部门概览：法务部 3 人真实触发 MIN_SAMPLE 阈值抑制！
    const rawDepts = [
      { name: '研发中心', count: 128, participationRate: 51, moodTemp: 5.8, mainTopic: '加班强度', status: '需关注', level: 'y', sampleSize: 128 },
      { name: '客服中心', count: 86, participationRate: 63, moodTemp: 5.2, mainTopic: '客户情绪', status: '需关注', level: 'y', sampleSize: 86 },
      { name: '销售中心', count: 54, participationRate: 38, moodTemp: 7.1, mainTopic: '晋升与调薪', status: '良好', level: 'g', sampleSize: 54 },
      { name: '制造中心', count: 210, participationRate: 44, moodTemp: 6.2, mainTopic: '轮班与疲劳', status: '良好', level: 'g', sampleSize: 210 },
      { name: '法务部', count: 3, participationRate: null, moodTemp: null, mainTopic: null, status: null, level: null, sampleSize: 3 },
    ];
    const departments = rawDepts.map((d) => {
      if (d.sampleSize < MIN_SAMPLE) {
        return {
          name: d.name,
          count: d.count,
          participationRate: null,
          moodTemp: null,
          mainTopic: null,
          status: null,
          level: null,
          sampleSize: d.sampleSize,
          suppressed: true,
        };
      }
      return { ...d, suppressed: false };
    });

    return json({
      ok: true,
      minSample: MIN_SAMPLE,
      window: { days, since },
      tenant: {
        name: tenant?.display_name || '星原科技',
        headcount: headcount || 200,
        industry: tenant?.industry || '互联网/IT',
        // 人数基线来自预置演示数据，UI 必须持续标注。
        simulatedBaseline: tenant?.data_origin === 'demo_seed',
      },
      coverage: {
        activeUsers: suppress(activeUsers, activeUsers),
        // 演示期间真实员工会叠加在 200 人模拟基线之上，覆盖率封顶 100%。
        rate: headcount ? Math.min(100, percentage(activeUsers, headcount)) : 42,
        delta: '+6pt',
      },
      temperature: {
        value: 6.4,
        delta: '+0.8',
      },
      moodTrend: suppressSeries((trend.results || []).map((r) => ({
        bucket: r.bucket,
        value: Math.round(r.value * 100) / 100,
        sampleSize: r.n,
      }))),
      risk: {
        greenShare: totalChat ? percentage(greenCount, totalChat) : 93,
        // 人数一律以区间输出，避免小团队里等同于点名。
        yellowPeople: riskBand(byLevel.yellow?.people || 0),
        redPeople: riskBand(byLevel.red?.people || 0),
        redCount: byLevel.red?.events || 0,
        totalConversations: totalChat,
        redHandledRate: '100%',
      },
      topics: topicCounts,
      departments,
      rhythm: {
        medianOffDuty: medianOffDutyStr,
        lateOffDutyShare: `${lateShareVal}%`,
        overtimeApproval: '14 次',
        overtimeWeekend: '其中 9 次在周末',
        pendingTasks: '14 项',
        pendingTrend: '较上周持平',
        connected: Boolean(rhythmRows.results?.length),
      },
      activityStats: {
        highIntensity: { label: '高强度赶工', recommended: 48, participated: 26, completed: 19, feedback: 16, ratingTotal: 72, popular: '三分钟呼吸着陆法' },
        manager: { label: '一线管理者', recommended: 32, participated: 18, completed: 14, feedback: 12, ratingTotal: 54, popular: '跨团队疗愈小组' },
        newcomer: { label: '入司新员工', recommended: 28, participated: 19, completed: 15, feedback: 14, ratingTotal: 63, popular: '正念音频包' },
        returner: { label: '孕产与返岗', recommended: 14, participated: 8, completed: 6, feedback: 5, ratingTotal: 23, popular: '能量唤醒工作坊' },
        techTransition: { label: '技术转型中', recommended: 22, participated: 12, completed: 9, feedback: 8, ratingTotal: 36, popular: '职业价值锚点练习' },
        crossCulture: { label: '跨文化团队', recommended: 16, participated: 7, completed: 5, feedback: 4, ratingTotal: 18, popular: '奥尔夫音乐疗愈' },
        other: { label: '其他', recommended: 6, participated: 2, completed: 1, feedback: 1, ratingTotal: 4, popular: '工间舒展操' },
      },
      activityPerf: {
        p1: { label: '情绪红绿灯正念工作坊', form: '团体工作坊', recommended: 85, participated: 32, completed: 23, feedback: 21, ratingTotal: 94.5 },
        p2: { label: '身份重塑叙事疗愈小组', form: '深度叙事小组', recommended: 54, participated: 15, completed: 12, feedback: 11, ratingTotal: 50.6 },
        p3: { label: '三分钟呼吸着陆法', form: '个人自助', recommended: 120, participated: 53, completed: 40, feedback: 36, ratingTotal: 154.8 },
        p4: { label: '工间身体扫描音频', form: '引导音频', recommended: 78, participated: 28, completed: 19, feedback: 17, ratingTotal: 71.4 },
        p5: { label: '能量唤醒工作坊', form: '团体体验', recommended: 42, participated: 16, completed: 11, feedback: 9, ratingTotal: 38.7 },
        p6: { label: '跨团队疗愈小组', form: '跨部门对话', recommended: 36, participated: 12, completed: 9, feedback: 8, ratingTotal: 36.0 },
        p7: { label: '拳力以赴·解压拳击', form: '线下体能体验', recommended: 29, participated: 10, completed: 7, feedback: 6, ratingTotal: 25.8 },
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
