// 数据保留期执行。
//
// 我们在隐私说明里向员工承诺「倾诉原文默认保留 180 天」，
// 因此必须真的有东西去删——只写 expires_at 而不执行，等于没有承诺。
//
// 分批删除，避免单次请求超时或打满 D1 写入配额。
import { json } from '../_lib/http.js';

const BATCH = 500;
// 顺带清理时用很小的批量：绝大多数请求会删到 0 行，成本可忽略。
const OPPORTUNISTIC_BATCH = 50;

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

// 各表的保留规则。聚合事件不含原文，按更长周期保留用于趋势对比。
function plan(now) {
  return [
    {
      table: 'inbound_messages',
      reason: '机器人结果超过七天保留期',
      sql: 'DELETE FROM inbound_messages WHERE request_key IN (SELECT request_key FROM inbound_messages WHERE expires_at < ? LIMIT ?)',
      binds: [now, BATCH],
    },
    {
      table: 'messages',
      reason: '倾诉原文超过保留期',
      sql: 'DELETE FROM messages WHERE id IN (SELECT id FROM messages WHERE expires_at IS NOT NULL AND expires_at < ? LIMIT ?)',
      binds: [now, BATCH],
    },
    {
      table: 'conversations',
      reason: '没有任何消息残留的空会话',
      sql: `DELETE FROM conversations WHERE id IN (
              SELECT c.id FROM conversations c
              LEFT JOIN messages m ON m.conversation_id = c.id
              WHERE m.id IS NULL AND c.last_message_at < ? LIMIT ?)`,
      binds: [now - 180 * 86400000, BATCH],
    },
    {
      table: 'sessions',
      reason: '过期会话',
      sql: 'DELETE FROM sessions WHERE session_digest IN (SELECT session_digest FROM sessions WHERE expires_at < ? LIMIT ?)',
      binds: [now - 86400000, BATCH],
    },
    {
      table: 'follow_ups',
      reason: '早已到期且从未被读到的回访',
      sql: "DELETE FROM follow_ups WHERE id IN (SELECT id FROM follow_ups WHERE state = 'scheduled' AND due_at < ? LIMIT ?)",
      binds: [now - 60 * 86400000, BATCH],
    },
    {
      table: 'product_events',
      reason: '逐人研究事件超过 180 天',
      sql: 'DELETE FROM product_events WHERE id IN (SELECT id FROM product_events WHERE occurred_at < ? LIMIT ?)',
      binds: [now - 180 * 86400000, BATCH],
    },
    {
      table: 'experience_feedback',
      reason: '逐人体验反馈超过 180 天',
      sql: 'DELETE FROM experience_feedback WHERE id IN (SELECT id FROM experience_feedback WHERE offered_at < ? LIMIT ?)',
      binds: [now - 180 * 86400000, BATCH],
    },
  ];
}

async function purge(env, dryRun) {
  const now = Date.now();
  const report = [];
  for (const item of plan(now)) {
    if (dryRun) {
      const countSql = item.sql
        .replace(/^DELETE FROM \w+ WHERE \w+ IN \(/, 'SELECT COUNT(*) AS n FROM (')
        .replace(/\)$/, ')');
      const row = await env.CARE_DB.prepare(countSql).bind(...item.binds).first().catch(() => null);
      report.push({ table: item.table, reason: item.reason, wouldDelete: row?.n ?? null });
      continue;
    }
    const result = await env.CARE_DB.prepare(item.sql).bind(...item.binds).run();
    report.push({ table: item.table, reason: item.reason, deleted: result.meta?.changes ?? 0 });
  }
  return report;
}

// 顺带清理：跟着正常请求做一小批，不需要独立的定时部署。
// 调用方必须用 waitUntil 包起来，绝不能阻塞响应，失败也不能影响业务。
export async function opportunisticPurge(env) {
  const now = Date.now();
  let total = 0;
  for (const item of plan(now)) {
    const binds = item.binds.map((b) => (b === BATCH ? OPPORTUNISTIC_BATCH : b));
    const result = await env.CARE_DB.prepare(item.sql).bind(...binds).run();
    total += result.meta?.changes ?? 0;
  }
  return total;
}

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  try {
    return json({ ok: true, dryRun: true, batchSize: BATCH, report: await purge(env, true) });
  } catch {
    console.error(JSON.stringify({ event: 'retention_preview_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  try {
    const report = await purge(env, false);
    const total = report.reduce((sum, item) => sum + (item.deleted || 0), 0);
    // 只记录删除条数，不记录被删内容。
    console.log(JSON.stringify({ event: 'retention_purge', total }));
    return json({ ok: true, batchSize: BATCH, total, report });
  } catch {
    console.error(JSON.stringify({ event: 'retention_purge_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
