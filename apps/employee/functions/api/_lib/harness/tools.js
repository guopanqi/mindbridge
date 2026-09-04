import { activityAvailableSql } from '../activity-availability.js';
const LIMIT_MAX = 3;
const TOPIC_ACTIVITY_IDS = [
  [/失眠|睡不|睡眠/, ['mindful-audio', 'pmr-audio', 'breathing']],
  [/焦虑|紧张|压力/, ['breathing', 'pmr-audio', 'mindfulness-group']],
  [/疲惫|很累|累了/, ['bodyscan-audio', 'stretch-video']],
  [/孤独|一个人|没人/, ['mindful-audio', 'group-04']],
  [/委屈|难过|低落/, ['writing-practice', 'gratitude-checkin']],
  [/职业|工作|主管/, ['value-anchor', 'identity-group']],
];

export async function searchActivities(env, args = {}) {
  const limit = Math.max(1, Math.min(LIMIT_MAX, Number(args.limit) || 2));
  const rawQuery = typeof args.query === 'string' ? args.query.trim().slice(0, 200) : '';
  const preferredIds = TOPIC_ACTIVITY_IDS.find(([pattern]) => pattern.test(rawQuery))?.[1] || null;
  if (preferredIds) {
    const candidates = preferredIds.slice(0, limit);
    const placeholders = candidates.map(() => '?').join(',');
    const { results } = await env.CARE_DB.prepare(
      `SELECT id, title, kind, form, duration, description, schedule, location
       FROM activities WHERE ${activityAvailableSql('activities')} AND id IN (${placeholders})`
    ).bind(...candidates).all();
    const byId = new Map((results || []).map((item) => [item.id, item]));
    const available = candidates.map((id) => byId.get(id)).filter(Boolean);
    if (available.length) return { activities: available };
  }
  // 模型给的 query 常是"胡思乱想 停不下来 放松"这样的长串，整串 LIKE 必然零命中。
  // 拆成词逐个匹配，按命中的词数排序，任一词命中即可返回。
  const terms = tokenizeQuery(rawQuery);
  const statement = terms.length
    ? env.CARE_DB.prepare(
        `SELECT id, title, kind, form, duration, description, schedule, location,
                (${terms.map(() => '(title LIKE ?) + (description LIKE ?) + (form LIKE ?)').join(' + ')}) AS score
         FROM activities
         WHERE ${activityAvailableSql('activities')} AND (${terms.map(() => '(title LIKE ? OR description LIKE ? OR form LIKE ?)').join(' OR ')})
         ORDER BY score DESC, title
         LIMIT ?`
      ).bind(
        ...terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]),
        ...terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]),
        limit
      )
    : env.CARE_DB.prepare(
        `SELECT id, title, kind, form, duration, description, schedule, location
         FROM activities WHERE ${activityAvailableSql('activities')} ORDER BY title LIMIT ?`
      ).bind(limit);
  const { results } = await statement.all();
  // 词级匹配仍然为空时兜底给通用活动，好过让模型面对空结果再发一次检索。
  if (!results?.length && terms.length) {
    const { results: fallback } = await env.CARE_DB.prepare(
      `SELECT id, title, kind, form, duration, description, schedule, location
       FROM activities WHERE ${activityAvailableSql('activities')} ORDER BY title LIMIT ?`
    ).bind(limit).all();
    return { activities: fallback || [] };
  }
  return { activities: results || [] };
}

// 中文没有空格分词：先按空白与标点切，再把过长的中文片段按 2 字滑窗拆成可匹配的词。
function tokenizeQuery(raw) {
  const chunks = raw.split(/[\s,，、。;；:：!！?？/|]+/).map((item) => item.replace(/[\\%_]/g, '').trim()).filter(Boolean);
  const terms = [];
  for (const chunk of chunks) {
    if (chunk.length <= 4) {
      terms.push(chunk);
      continue;
    }
    for (let i = 0; i + 2 <= chunk.length && i < 8; i += 2) terms.push(chunk.slice(i, i + 2));
  }
  return [...new Set(terms)].slice(0, 6);
}

export async function executeTool(env, toolCall, assessment = {}) {
  if (toolCall.name !== 'search_activities') throw new Error('TOOL_NOT_ALLOWED');
  if (assessment.emotion) {
    const policy = await env.CARE_DB.prepare('SELECT enabled, l1_activity_id, l2_activity_id FROM intervention_matrix WHERE emotion=?').bind(assessment.emotion).first();
    if (policy?.enabled === 0) return { activities: [] };
    const id = assessment.level === 'yellow' ? policy?.l2_activity_id : policy?.l1_activity_id;
    if (id) {
      const activity = await env.CARE_DB.prepare(`SELECT * FROM activities WHERE id=? AND level=? AND ${activityAvailableSql('activities')}`).bind(id, assessment.level === 'yellow' ? 'L2' : 'L1').first();
      return { activities: activity ? [activity] : [] };
    }
  }
  return searchActivities(env, toolCall.arguments);
}
