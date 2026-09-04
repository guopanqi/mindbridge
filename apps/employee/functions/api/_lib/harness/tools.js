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
       FROM activities WHERE enabled = 1 AND id IN (${placeholders})`
    ).bind(...candidates).all();
    const byId = new Map((results || []).map((item) => [item.id, item]));
    return { activities: candidates.map((id) => byId.get(id)).filter(Boolean) };
  }
  const query = rawQuery.slice(0, 24);
  const pattern = `%${query.replace(/[\\%_]/g, '')}%`;
  const statement = query
    ? env.CARE_DB.prepare(
        `SELECT id, title, kind, form, duration, description, schedule, location
         FROM activities
         WHERE enabled = 1 AND (title LIKE ? OR description LIKE ? OR form LIKE ?)
         ORDER BY CASE WHEN title LIKE ? THEN 0 ELSE 1 END, title
         LIMIT ?`
      ).bind(pattern, pattern, pattern, pattern, limit)
    : env.CARE_DB.prepare(
        `SELECT id, title, kind, form, duration, description, schedule, location
         FROM activities WHERE enabled = 1 ORDER BY title LIMIT ?`
      ).bind(limit);
  const { results } = await statement.all();
  return { activities: results || [] };
}

export async function executeTool(env, toolCall) {
  if (toolCall.name !== 'search_activities') throw new Error('TOOL_NOT_ALLOWED');
  return searchActivities(env, toolCall.arguments);
}
