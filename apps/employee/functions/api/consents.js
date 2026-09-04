// 撤销同时终止已批准和待批准的上下文请求，保留审计记录。
import { json } from './_lib/http.js';
import { ApiError, handleError, newId, readJson, requireSession } from './_lib/care.js';

export const SCOPES = {
  share_context_with_healer: '允许疗愈师看到我这次对话的必要上下文',
  followup_contact: '允许 MindBridge 在活动或预约后回访我',
};

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { results } = await env.CARE_DB.prepare(
      'SELECT scope, granted_at, revoked_at FROM consent_grants WHERE anon_id = ? ORDER BY granted_at DESC'
    ).bind(anonId).all();
    const latest = new Map();
    for (const row of results || []) if (!latest.has(row.scope)) latest.set(row.scope, row);
    const activeContext = await env.CARE_DB.prepare("SELECT MAX(c.decided_at) AS granted_at FROM context_requests c JOIN appointments a ON a.id=c.appointment_id WHERE c.anon_id=? AND c.status='approved' AND c.expires_at>? AND a.status!='cancelled'").bind(anonId, Date.now()).first();
    return json({
      ok: true,
      consents: Object.entries(SCOPES).map(([scope, label]) => {
        const row = latest.get(scope);
        return {
          scope,
          label,
          granted: scope === 'share_context_with_healer' ? Boolean(activeContext?.granted_at || (row && !row.revoked_at)) : Boolean(row && !row.revoked_at),
          grantedAt: scope === 'share_context_with_healer' ? activeContext?.granted_at || row?.granted_at || null : row?.granted_at || null,
          revokedAt: row?.revoked_at || null,
        };
      }),
    });
  } catch (error) {
    return handleError(error, 'consent_list_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const body = await readJson(request);
    const scope = body?.scope;
    if (!Object.hasOwn(SCOPES, scope)) throw new ApiError('SCOPE_INVALID', 400, '未知的授权项');
    if (typeof body.granted !== 'boolean') throw new ApiError('GRANT_INVALID', 400, '请选择是否授权');
    const now = Date.now();
    if (body?.granted === false) {
      const statements = [env.CARE_DB.prepare(
        'UPDATE consent_grants SET revoked_at = ? WHERE anon_id = ? AND scope = ? AND revoked_at IS NULL'
      ).bind(now, anonId, scope)];
      if (scope === 'share_context_with_healer') {
        statements.push(
          env.CARE_DB.prepare("UPDATE context_requests SET status='revoked', decided_at=? WHERE anon_id=? AND status IN ('pending','approved')").bind(now, anonId),
          env.CARE_DB.prepare('UPDATE appointments SET share_context=0, updated_at=? WHERE anon_id=?').bind(now, anonId),
        );
      }
      await env.CARE_DB.batch(statements);
      return json({ ok: true, scope, granted: false });
    }
    await env.CARE_DB.prepare(
      'INSERT INTO consent_grants (id, anon_id, scope, granted_at, data_origin) VALUES (?, ?, ?, ?, ?)'
    ).bind(newId('cst'), anonId, scope, now, 'live').run();
    return json({ ok: true, scope, granted: true });
  } catch (error) {
    return handleError(error, 'consent_update_failed');
  }
}
