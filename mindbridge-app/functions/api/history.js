// 「我的」页面：员工查看自己的记录与被推荐的资源，并了解数据保留规则。
import { json } from './_lib/http.js';
import { ensureProfile, handleError, requireSession } from './_lib/care.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const [messages, posts, resources, checkins, appointments] = await Promise.all([
      env.CARE_DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE anon_id = ? AND role = 'user'").bind(anonId).first(),
      env.CARE_DB.prepare('SELECT COUNT(*) AS n FROM posts WHERE anon_id = ? AND deleted_at IS NULL').bind(anonId).first(),
      env.CARE_DB.prepare(
        'SELECT id, resource_name, resource_level, state, created_at FROM resource_events WHERE anon_id = ? ORDER BY created_at DESC LIMIT 20'
      ).bind(anonId).all(),
      env.CARE_DB.prepare('SELECT COUNT(*) AS n FROM mood_checkins WHERE anon_id = ?').bind(anonId).first(),
      env.CARE_DB.prepare("SELECT COUNT(*) AS n FROM appointments WHERE anon_id = ? AND status = 'requested'").bind(anonId).first(),
    ]);
    return json({
      ok: true,
      counts: {
        messages: messages?.n || 0,
        posts: posts?.n || 0,
        checkins: checkins?.n || 0,
        openAppointments: appointments?.n || 0,
      },
      resources: (resources.results || []).map((r) => ({
        id: r.id, name: r.resource_name, level: r.resource_level, state: r.state, at: r.created_at,
      })),
      retentionDays: 180,
    });
  } catch (error) {
    return handleError(error, 'history_read_failed');
  }
}
