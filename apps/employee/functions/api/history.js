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
        `SELECT e.id, e.resource_name, e.resource_level, e.state, e.helpfulness, e.created_at,
                e.source, e.offer_reason, e.updated_at,
                COALESCE(e.activity_id, c.activity_id) AS activity_id,
                COALESCE(a.kind, 'online') AS activity_kind
         FROM resource_events e
         LEFT JOIN resource_catalog c ON c.name = e.resource_name
         LEFT JOIN activities a ON a.id = COALESCE(e.activity_id, c.activity_id)
         WHERE e.anon_id = ? ORDER BY e.created_at DESC LIMIT 50`
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
        id: r.id, name: r.resource_name, level: r.resource_level, state: r.state,
        helpfulness: r.helpfulness, at: r.created_at, updatedAt: r.updated_at, kind: r.activity_kind,
        source: r.source, reason: r.offer_reason,
        // 「再做一次」要新建一条参与记录，不能复用已完成的旧记录。
        activityId: r.activity_id,
      })),
      retentionDays: 180,
    });
  } catch (error) {
    return handleError(error, 'history_read_failed');
  }
}
