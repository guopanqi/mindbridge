import { activityAvailableSql } from '../activity-availability.js';
const LIMIT_MAX = 3;
const TOPIC_ACTIVITY_IDS = [
  [/呼吸/, ['breathing']],
  [/失眠|睡不|睡眠/, ['pmr', 'breathing']],
  [/焦虑|紧张|压力/, ['breathing', 'pmr']],
  [/疲惫|很累|累了/, ['bodyscan-text', 'stretch-guide']],
  [/孤独|一个人|没人/, ['gratitude-checkin', 'writing-practice']],
  [/委屈|难过|低落/, ['writing-practice', 'gratitude-checkin']],
  [/职业|工作|主管/, ['value-anchor', 'identity-group']],
];

export async function searchActivities(env, args = {}, { excludeIds = [] } = {}) {
  const limit = Math.max(1, Math.min(LIMIT_MAX, Number(args.limit) || 2));
  const excluded = [...new Set(excludeIds)].filter(id => typeof id === 'string').slice(-12);
  const excludeSql = excluded.length ? ` AND id NOT IN (${excluded.map(() => '?').join(',')})` : '';
  const availableSql = `${activityAvailableSql('activities')}${excludeSql}`;
  const rawQuery = typeof args.query === 'string' ? args.query.trim().slice(0, 200) : '';
  const preferredIds = TOPIC_ACTIVITY_IDS.find(([pattern]) => pattern.test(rawQuery))?.[1] || null;
  if (preferredIds) {
    const candidates = preferredIds.filter(id => !excluded.includes(id));
    if (candidates.length) {
      const placeholders = candidates.map(() => '?').join(',');
      const { results } = await env.CARE_DB.prepare(
        `SELECT id, title, kind, level, form, duration, description, schedule, location
         FROM activities WHERE ${activityAvailableSql('activities')} AND id IN (${placeholders})`
      ).bind(...candidates).all();
      const byId = new Map((results || []).map((item) => [item.id, item]));
      const available = candidates.map((id) => byId.get(id)).filter(Boolean);
      if (available.length) return { activities: available.slice(0, limit), status: 'available' };
    }
  }
  // 模型给的 query 常是"胡思乱想 停不下来 放松"这样的长串，整串 LIKE 必然零命中。
  // 拆成词逐个匹配，按命中的词数排序，任一词命中即可返回。
  const terms = tokenizeQuery(rawQuery);
  const statement = terms.length
    ? env.CARE_DB.prepare(
        `SELECT id, title, kind, level, form, duration, description, schedule, location,
                (${terms.map(() => '(title LIKE ?) + (description LIKE ?) + (form LIKE ?)').join(' + ')}) AS score
         FROM activities
         WHERE ${availableSql} AND (${terms.map(() => '(title LIKE ? OR description LIKE ? OR form LIKE ?)').join(' OR ')})
         ORDER BY score DESC, title
         LIMIT ?`
      ).bind(
        ...terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]),
        ...excluded,
        ...terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]),
        limit
      )
    : env.CARE_DB.prepare(
        `SELECT id, title, kind, level, form, duration, description, schedule, location
         FROM activities WHERE ${availableSql} ORDER BY title LIMIT ?`
      ).bind(...excluded, limit);
  const { results } = await statement.all();
  // 词级匹配仍然为空时兜底给通用活动，好过让模型面对空结果再发一次检索。
  if (!results?.length && terms.length) {
    const { results: fallback } = await env.CARE_DB.prepare(
      `SELECT id, title, kind, level, form, duration, description, schedule, location
       FROM activities WHERE ${availableSql} ORDER BY title LIMIT ?`
    ).bind(...excluded, limit).all();
    if (fallback?.length) return { activities: fallback, status: 'available', fallback: true };
  }
  if (results?.length) return { activities: results, status: 'available' };
  if (excluded.length) {
    const { results: any } = await env.CARE_DB.prepare(`SELECT id FROM activities WHERE ${activityAvailableSql('activities')} LIMIT ?`).bind(1).all();
    if (any?.length) return { activities: [], status: 'exhausted' };
  }
  return { activities: [], status: 'unavailable' };
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
  // 明确浏览活动与自动情绪干预是两种意图。浏览使用与活动库一致的启停规则，
  // 不应被某个情绪的一对一默认映射锁死在同一个活动里。
  if (assessment.explicitRequest) return searchActivities(env, toolCall.arguments, { excludeIds: assessment.excludeIds });
  if (assessment.emotion) {
    const policy = await env.CARE_DB.prepare('SELECT enabled, l1_activity_id, l2_activity_id FROM intervention_matrix WHERE emotion=?').bind(assessment.emotion).first();
    if (policy?.enabled === 0) return { activities: [], status: 'policy_disabled' };
    const id = assessment.level === 'yellow' ? policy?.l2_activity_id : policy?.l1_activity_id;
    if (id) {
      const activity = await env.CARE_DB.prepare(`SELECT * FROM activities WHERE id=? AND level=? AND ${activityAvailableSql('activities')}`).bind(id, assessment.level === 'yellow' ? 'L2' : 'L1').first();
      if (activity && assessment.excludeIds?.includes(activity.id)) return { activities: [], status: 'configured_repeated' };
      return { activities: activity ? [activity] : [], status: activity ? 'available' : 'configured_unavailable' };
    }
  }
  return searchActivities(env, toolCall.arguments, { excludeIds: assessment.excludeIds });
}
