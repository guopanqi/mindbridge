// 行业基准：跨企业匿名对照。
//
// 当前只有一个真实租户，因此整表都是 data_origin='demo_seed' 的模拟对照，
// 接口原样带出 origin，由 UI 据此标注，而不是把「模拟」写死在前端。
// 接入多租户后，同一张表写入 live 行即可，接口与前端都不用改。
import { json } from '../_lib/http.js';
import { MIN_SAMPLE } from '../_lib/metrics.js';

// 形成行业基准的门槛：至少这么多家企业，且总员工数达标，否则不予展示。
const MIN_COMPANIES = 5;
const MIN_EMPLOYEES = 500;

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

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  try {
    const [benchmarks, topics, effects] = await Promise.all([
      env.CARE_DB.prepare('SELECT * FROM industry_benchmarks ORDER BY industry').all(),
      env.CARE_DB.prepare('SELECT * FROM industry_topics ORDER BY industry, share DESC').all(),
      env.CARE_DB.prepare('SELECT * FROM industry_activity_effects ORDER BY industry, participation_rate DESC').all(),
    ]);

    const shape = (row) => {
      // 企业数或样本量不达标的行业不出数，规则与部门维度一致。
      const eligible = row.companies >= MIN_COMPANIES && row.employees >= MIN_EMPLOYEES;
      return {
        industry: row.industry,
        simulated: row.data_origin === 'demo_seed',
        eligible,
        companies: row.companies,
        employees: row.employees,
        useRate: eligible ? row.use_rate : null,
        completionRate: eligible ? row.completion_rate : null,
        avgRating: eligible ? row.avg_rating : null,
      };
    };

    const byIndustry = {};
    for (const row of topics.results || []) {
      (byIndustry[row.industry] ||= { topics: [], effects: [] }).topics.push({
        topic: row.topic, share: row.share, delta: row.delta, simulated: row.data_origin === 'demo_seed',
      });
    }
    for (const row of effects.results || []) {
      (byIndustry[row.industry] ||= { topics: [], effects: [] }).effects.push({
        activity: row.activity,
        participationRate: row.participation_rate,
        completionRate: row.completion_rate,
        avgRating: row.avg_rating,
        simulated: row.data_origin === 'demo_seed',
      });
    }

    return json({
      ok: true,
      minSample: MIN_SAMPLE,
      thresholds: { minCompanies: MIN_COMPANIES, minEmployees: MIN_EMPLOYEES },
      benchmarks: (benchmarks.results || []).map(shape),
      detail: byIndustry,
    });
  } catch {
    console.error(JSON.stringify({ event: 'industry_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
