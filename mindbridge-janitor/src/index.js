// 保留期清理的定时驱动。
//
// 设计取舍：清理规则实现在 care 侧（functions/api/internal/retention.js），
// 这个 Worker 只负责按时触发并重试，避免同一套保留规则出现两份实现。
//
// 单次调用按批处理，因此这里循环调用直到本轮没有可删数据或达到上限，
// 上限用于防止异常情况下无限循环打满配额。
const MAX_ROUNDS = 20;

async function runPurge(env) {
  const token = env.INTERNAL_SERVICE_TOKEN;
  if (typeof token !== 'string' || token.length < 32) {
    throw new Error('INTERNAL_SERVICE_TOKEN missing');
  }
  let total = 0;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const response = await fetch(`${env.CARE_API_ORIGIN}/api/internal/retention`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) throw new Error(`retention endpoint returned ${response.status}`);
    const body = await response.json();
    total += body.total || 0;
    if (!body.total) return { total, rounds: round + 1, drained: true };
  }
  return { total, rounds: MAX_ROUNDS, drained: false };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const result = await runPurge(env);
        // 只记录条数，不记录被删内容。
        console.log(JSON.stringify({ event: 'retention_cron', cron: event.cron, ...result }));
      } catch (error) {
        console.error(JSON.stringify({ event: 'retention_cron_failed', message: String(error?.message || error) }));
      }
    })());
  },

  // 手动触发入口，便于验收；同样需要内部令牌。
  async fetch(request, env) {
    const header = request.headers.get('authorization') || '';
    const expected = env.INTERNAL_SERVICE_TOKEN || '';
    if (!expected || header !== `Bearer ${expected}`) {
      return Response.json({ ok: false, reasonCode: 'UNAUTHORIZED' }, { status: 401 });
    }
    try {
      return Response.json({ ok: true, ...await runPurge(env) });
    } catch (error) {
      console.error(JSON.stringify({ event: 'retention_manual_failed' }));
      return Response.json({ ok: false, reasonCode: 'PURGE_FAILED' }, { status: 500 });
    }
  },
};
