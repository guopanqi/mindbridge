// 情绪打卡：HR 看板压力趋势曲线的真实数据来源，本身不含任何原文。
import { json } from './_lib/http.js';
import {
  ApiError, aggregateStatement, dayBucket, ensureProfile, handleError, newId, readJson, requireSession,
} from './_lib/care.js';

export const MOODS = ['很好', '还行', '有点累', '很低落', '快撑不住'];
const SCORES = { 很好: 1, 还行: 2, 有点累: 3, 很低落: 4, 快撑不住: 5 };

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const today = dayBucket(Date.now());
    const row = await env.CARE_DB
      .prepare('SELECT mood, created_at FROM mood_checkins WHERE anon_id = ? AND bucket_day = ? ORDER BY created_at DESC LIMIT 1')
      .bind(anonId, today).first();
    const { results } = await env.CARE_DB.prepare(
      'SELECT mood, stress_score, created_at FROM mood_checkins WHERE anon_id = ? ORDER BY created_at DESC LIMIT 14'
    ).bind(anonId).all();
    return json({
      ok: true,
      moods: MOODS,
      today: row ? { mood: row.mood, at: row.created_at } : null,
      recent: (results || []).map((r) => ({ mood: r.mood, score: r.stress_score, at: r.created_at })),
    });
  } catch (error) {
    return handleError(error, 'checkin_read_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const mood = (await readJson(request))?.mood;
    if (!MOODS.includes(mood)) throw new ApiError('MOOD_INVALID', 400, '未知的心情选项');
    const now = Date.now();
    const day = dayBucket(now);
    // 每天只保留最后一次打卡，避免同一个人把趋势刷歪。
    await env.CARE_DB.batch([
      env.CARE_DB.prepare('DELETE FROM mood_checkins WHERE anon_id = ? AND bucket_day = ?').bind(anonId, day),
      env.CARE_DB.prepare(
        'INSERT INTO mood_checkins (id, anon_id, mood, stress_score, created_at, bucket_day, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId('mood'), anonId, mood, SCORES[mood], now, day, 'live'),
      aggregateStatement(env, { eventType: 'mood_checkin', emotion: mood, at: now }),
    ]);
    return json({ ok: true, mood, at: now });
  } catch (error) {
    return handleError(error, 'checkin_write_failed');
  }
}
