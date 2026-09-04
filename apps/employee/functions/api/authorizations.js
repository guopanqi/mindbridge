// 员工侧的二次授权：疗愈师申请查看对话上下文时，必须由员工本人在这里同意。
// 拒绝与同意都记录，员工也可以事后撤销（撤销走 /api/consents 的 scope 开关）。
import { json } from './_lib/http.js';
import { ApiError, aggregateStatement, handleError, readJson, requireSession } from './_lib/care.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const now = Date.now();
    const { results } = await env.CARE_DB.prepare(
      `SELECT c.id, c.reason, c.status, c.created_at, c.expires_at, a.case_code, a.risk_level
       FROM context_requests c JOIN appointments a ON a.id = c.appointment_id
       WHERE c.anon_id = ? ORDER BY c.created_at DESC LIMIT 20`
    ).bind(anonId).all();
    return json({
      ok: true,
      requests: (results || []).map((r) => ({
        id: r.id,
        caseCode: r.case_code,
        riskLevel: r.risk_level,
        reason: r.reason,
        status: ['pending', 'approved'].includes(r.status) && r.expires_at <= now ? 'expired' : r.status,
        at: r.created_at,
      })),
    });
  } catch (error) {
    return handleError(error, 'authorization_list_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const body = await readJson(request);
    const id = body?.id;
    const approve = body?.approve === true;
    if (typeof body?.approve !== 'boolean') throw new ApiError('DECISION_REQUIRED', 400, '请选择是否同意');
    if (typeof id !== 'string' || !id) throw new ApiError('REQUEST_ID_REQUIRED', 400, '缺少请求标识');
    const now = Date.now();
    const result = await env.CARE_DB.prepare(
      "UPDATE context_requests SET status = ?, decided_at = ? WHERE id = ? AND anon_id = ? AND status = 'pending' AND expires_at > ? AND EXISTS (SELECT 1 FROM appointments a WHERE a.id=context_requests.appointment_id AND a.status!='cancelled')"
    ).bind(approve ? 'approved' : 'denied', now, id, anonId, now).run();
    if (!result.meta?.changes) throw new ApiError('REQUEST_NOT_PENDING', 404, '这条请求已经处理过或已过期');
    await env.CARE_DB.batch([
      aggregateStatement(env, { eventType: approve ? 'context_approved' : 'context_denied', at: now }),
    ]);
    return json({ ok: true, status: approve ? 'approved' : 'denied' });
  } catch (error) {
    return handleError(error, 'authorization_decide_failed');
  }
}
