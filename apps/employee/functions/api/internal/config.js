// 干预阶梯与办公数据感知的配置读写。
//
// 这是真实配置，不是展示表：intervention_matrix 会被员工端 chat 流程读取，
// 改动在下一次推荐时立即生效。sensing_signals 控制哪些行为元数据被采集。
import { json } from '../_lib/http.js';
import { newId } from '../_lib/care.js';
import { MIN_SAMPLE } from '../_lib/metrics.js';

const WINDOW_DAYS = 90;

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
  const since = Date.now() - WINDOW_DAYS * 86400000;
  const [matrix, catalog, signals, hits, rhythm] = await Promise.all([
    env.CARE_DB.prepare('SELECT * FROM intervention_matrix ORDER BY sort_order').all(),
    env.CARE_DB.prepare("SELECT name, level, description, icon FROM resource_catalog WHERE enabled = 1 ORDER BY level, name").all(),
    env.CARE_DB.prepare('SELECT * FROM sensing_signals ORDER BY sort_order').all(),
    // 命中次数来自真实聚合事件，不是常量。
    env.CARE_DB.prepare(
      "SELECT emotion, COUNT(*) AS n FROM aggregate_events WHERE event_type = 'chat_message' AND emotion IS NOT NULL AND created_at > ? GROUP BY emotion"
    ).bind(since).all(),
    env.CARE_DB.prepare(
      'SELECT metric, value, sample_size, unit, created_at FROM org_rhythm WHERE data_origin = ? ORDER BY bucket_day DESC LIMIT 12'
    ).bind('live').all(),
  ]);

  const hitMap = Object.fromEntries((hits.results || []).map((r) => [r.emotion, r.n]));
  return json({
    ok: true,
    minSample: MIN_SAMPLE,
    windowDays: WINDOW_DAYS,
    matrix: (matrix.results || []).map((row) => ({
      emotion: row.emotion,
      icon: row.icon,
      l1: { name: row.l1_name, description: row.l1_desc },
      l2: { name: row.l2_name, description: row.l2_desc },
      l3: row.l3_action,
      enabled: row.enabled === 1,
      hits: hitMap[row.emotion] || 0,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
    })),
    catalog: catalog.results || [],
    sensing: (signals.results || []).map((row) => ({
      key: row.key,
      label: row.label,
      category: row.category,
      source: row.source,
      detail: row.detail,
      enabled: row.enabled === 1,
      requiresPermission: row.requires_permission,
      // source === 'none' 表示这条信号本系统永不采集，界面上不允许开启。
      lockedOff: row.source === 'none',
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
    })),
    rhythmSamples: rhythm.results || [],
  });
}

export async function onRequestPut({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400);
  }
  const actor = typeof body?.actor === 'string' ? body.actor.slice(0, 64) : null;
  const now = Date.now();

  if (body?.kind === 'matrix') {
    const { emotion, l1Name, l2Name, enabled } = body;
    if (typeof emotion !== 'string' || !emotion) return json({ ok: false, reasonCode: 'EMOTION_REQUIRED' }, 400);
    const known = await env.CARE_DB.prepare('SELECT emotion FROM intervention_matrix WHERE emotion = ?').bind(emotion).first();
    if (!known) return json({ ok: false, reasonCode: 'EMOTION_UNKNOWN' }, 404);
    // 资源必须来自目录，避免配置出一个员工端根本发不出去的名字。
    const lookup = async (name) => (name
      ? env.CARE_DB.prepare('SELECT name, description FROM resource_catalog WHERE name = ? AND enabled = 1').bind(name).first()
      : null);
    const [l1, l2] = await Promise.all([lookup(l1Name), lookup(l2Name)]);
    if (l1Name && !l1) return json({ ok: false, reasonCode: 'L1_NOT_IN_CATALOG' }, 400);
    if (l2Name && !l2) return json({ ok: false, reasonCode: 'L2_NOT_IN_CATALOG' }, 400);
    await env.CARE_DB.prepare(
      `UPDATE intervention_matrix SET
         l1_name = COALESCE(?, l1_name), l1_desc = COALESCE(?, l1_desc),
         l2_name = COALESCE(?, l2_name), l2_desc = COALESCE(?, l2_desc),
         enabled = COALESCE(?, enabled), updated_at = ?, updated_by = ?
       WHERE emotion = ?`
    ).bind(
      l1?.name ?? null, l1?.description ?? null,
      l2?.name ?? null, l2?.description ?? null,
      typeof enabled === 'boolean' ? (enabled ? 1 : 0) : null,
      now, actor, emotion
    ).run();
    return json({ ok: true, emotion });
  }

  if (body?.kind === 'sensing') {
    const { key, enabled } = body;
    if (typeof key !== 'string' || !key) return json({ ok: false, reasonCode: 'KEY_REQUIRED' }, 400);
    const row = await env.CARE_DB.prepare('SELECT key, source FROM sensing_signals WHERE key = ?').bind(key).first();
    if (!row) return json({ ok: false, reasonCode: 'SIGNAL_UNKNOWN' }, 404);
    // 明确声明不采集的信号，任何人都不能从界面上打开。
    if (row.source === 'none' && enabled) return json({ ok: false, reasonCode: 'SIGNAL_PERMANENTLY_OFF' }, 409);
    await env.CARE_DB.prepare('UPDATE sensing_signals SET enabled = ?, updated_at = ?, updated_by = ? WHERE key = ?')
      .bind(enabled ? 1 : 0, now, actor, key).run();
    return json({ ok: true, key, enabled: Boolean(enabled) });
  }

  return json({ ok: false, reasonCode: 'KIND_INVALID' }, 400);
}
