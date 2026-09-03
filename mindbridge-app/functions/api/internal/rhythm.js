// 团队节奏同步：从钉钉拉行为元数据，只把组织级聚合写入 care。
//
// GET  ?probe=1 只返回连接状态与字段形态（不含任何数据），用于确认权限是否已开通。
// POST 执行一次同步。
//
// 阈值同样适用：样本量不足时写入记录但读取侧抑制，不在这里静默丢弃，
// 以便管理端能区分"没连上"和"连上了但样本不够"。
import { json } from '../_lib/http.js';
import { newId, dayBucket } from '../_lib/care.js';
import { MIN_SAMPLE } from '../_lib/metrics.js';
import {
  aggregateAttendance, appAccessToken, fetchAttendance, formatMinutes, listUserIds,
} from '../_lib/dingtalk-rhythm.js';

const DEFAULT_DAYS = 7;

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

function failure(error) {
  return {
    ok: false,
    // 只回传钉钉的错误码与提示，便于定位缺哪个权限点；不回传 token 或 userid。
    errcode: error?.errcode ?? null,
    errmsg: error?.errmsg || error?.message || 'UNKNOWN',
  };
}

async function collect(env, days) {
  const token = await appAccessToken(env);
  const userIds = await listUserIds(token);
  const to = new Date();
  const from = new Date(to.getTime() - (days - 1) * 86400000);
  const records = await fetchAttendance(token, userIds, from, to);
  return { orgSize: userIds.length, records, window: { from: from.toISOString(), to: to.toISOString(), days } };
}

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  const days = Math.max(1, Math.min(Number.parseInt(new URL(request.url).searchParams.get('days') || '', 10) || DEFAULT_DAYS, 30));
  try {
    const { orgSize, records, window } = await collect(env, days);
    const summary = aggregateAttendance(records);
    return json({
      ok: true,
      connected: true,
      orgSize,
      window,
      // 只回字段名，不回字段值：用来确认接口返回结构，不泄露任何个人打卡数据。
      recordShape: records.length ? Object.keys(records[0]).sort() : [],
      sampleSize: summary.sampleSize,
      suppressed: summary.sampleSize < MIN_SAMPLE,
      minSample: MIN_SAMPLE,
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'rhythm_probe_failed', errcode: error?.errcode ?? null }));
    return json({ ok: false, connected: false, ...failure(error) }, 200);
  }
}

export async function onRequestPost({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  const days = Math.max(1, Math.min(Number.parseInt(new URL(request.url).searchParams.get('days') || '', 10) || DEFAULT_DAYS, 30));
  try {
    const { orgSize, records } = await collect(env, days);
    const summary = aggregateAttendance(records);
    const now = Date.now();
    const day = dayBucket(now);
    const rows = [
      ['median_off_duty_minutes', summary.medianOffDutyMinutes, 'minutes'],
      ['late_off_duty_share', summary.lateOffDutyShare, 'percent'],
      ['off_duty_records', summary.offDutyCount, 'number'],
    ].filter(([, value]) => value !== null && value !== undefined);

    if (rows.length) {
      await env.CARE_DB.batch(rows.map(([metric, value, unit]) => env.CARE_DB.prepare(
        `INSERT INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'live', ?)
         ON CONFLICT(bucket_day, metric, data_origin) DO UPDATE SET
           value = excluded.value, sample_size = excluded.sample_size, created_at = excluded.created_at`
      ).bind(newId('rhy'), day, metric, value, summary.sampleSize, unit, 'dingtalk_attendance', now)));
    }

    return json({
      ok: true,
      connected: true,
      orgSize,
      sampleSize: summary.sampleSize,
      written: rows.length,
      suppressed: summary.sampleSize < MIN_SAMPLE,
      preview: {
        medianOffDuty: formatMinutes(summary.medianOffDutyMinutes),
        lateOffDutyShare: summary.lateOffDutyShare,
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'rhythm_sync_failed', errcode: error?.errcode ?? null }));
    return json({ ok: false, connected: false, ...failure(error) }, 200);
  }
}
