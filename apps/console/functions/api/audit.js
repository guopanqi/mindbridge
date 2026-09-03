// 系统级审计视图：管理员可以看到自己组织内工作人员做过什么。
import { json } from './_lib/http.js';
import { handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'admin');
    const { results } = await env.STAFF_DB.prepare(
      `SELECT a.created_at, a.action, a.object_type, a.object_id, a.result, s.display_name
       FROM staff_audit a LEFT JOIN staff s ON s.staff_id = a.staff_id
       ORDER BY a.created_at DESC LIMIT 50`
    ).all();
    return json({
      ok: true,
      viewer: staff.displayName,
      entries: (results || []).map((r) => ({
        at: r.created_at,
        actor: r.display_name || '未知',
        action: r.action,
        object: r.object_id ? `${r.object_type || ''}:${r.object_id}` : (r.object_type || ''),
        result: r.result,
      })),
    });
  } catch (error) {
    return handleError(error, 'audit_read_failed');
  }
}
