// 匿名预约：疗愈师侧在 Stage 4 实现，这里只做员工侧的提交、查看与取消。
// 个案编号是给疗愈师看的唯一标识，它由随机值生成，不从 anon_id 派生。
import { json } from '../_lib/http.js';
import { cardUpdate, readConsentCard } from '../_lib/conversation/card-state.js';
import {
  ApiError, aggregateStatement, ensureProfile, handleError, newId,
  openBody, readJson, requireSession, requireText, sealBody,
} from '../_lib/care.js';

// 真人服务是稀缺队列，不是可以并发占用的工单池。一个人同一时间只保留
// 一条未闭环预约；被接单/跟进同样属于未闭环，避免重复占用疗愈师容量。
const MAX_OPEN = 1;
const noteAad = (id) => `care:appointment:${id}`;

function caseCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `MB-${[...bytes].map((b) => alphabet[b % alphabet.length]).join('')}`;
}

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { results } = await env.CARE_DB.prepare(
      'SELECT id, case_code, risk_level, status, share_context, note_cipher, content_key_version, created_at, cancelled_at FROM appointments WHERE anon_id = ? ORDER BY created_at DESC LIMIT 20'
    ).bind(anonId).all();
    const items = [];
    for (const row of results || []) {
      const note = row.note_cipher
        ? await openBody(env, row.note_cipher, row.content_key_version, noteAad(row.id))
        : null;
      items.push({
        id: row.id,
        caseCode: row.case_code,
        riskLevel: row.risk_level,
        status: row.status,
        shareContext: row.share_context === 1,
        note,
        at: row.created_at,
        cancelledAt: row.cancelled_at,
      });
    }
    return json({ ok: true, appointments: items });
  } catch (error) {
    return handleError(error, 'appointment_list_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const body = await readJson(request);
    const source = body?.messageId ? await readConsentCard(env, anonId, requireText(body.messageId, { min: 1, max: 100, field: 'messageId' })) : null;
    if (source?.card.appointmentId) {
      const previous = await env.CARE_DB.prepare('SELECT id, case_code, status FROM appointments WHERE id=? AND anon_id=?').bind(source.card.appointmentId, anonId).first();
      if (!previous) throw new ApiError('CARD_STATE_CHANGED', 409, '关联预约已不可用，请刷新对话。');
      return json({ ok: true, id: previous.id, caseCode: previous.case_code, status: previous.status });
    }
    const shareContext = body?.shareContext === true;
    const note = body?.note ? requireText(body.note, { min: 1, max: 300, field: 'note' }) : null;
    const riskLevel = ['green', 'yellow', 'red'].includes(body?.riskLevel) ? body.riskLevel : 'yellow';

    const open = await env.CARE_DB
      .prepare("SELECT COUNT(*) AS n FROM appointments WHERE anon_id = ? AND status IN ('requested','claimed','active')")
      .bind(anonId).first();
    if ((open?.n || 0) >= MAX_OPEN) {
      throw new ApiError('APPOINTMENT_LIMIT', 429, '你已有一条未结束的预约（即使疗愈师已经接单也一样）。请先等待、取消，或等这次服务结束后再约。');
    }

    const id = newId('apt');
    const now = Date.now();
    // 前端不知道会话 id（也不该知道），预约默认关联该匿名主体最近一次对话，
    // 供员工同意后疗愈师查看上下文；未授权前这个关联不会暴露任何内容。
    const latest = await env.CARE_DB
      .prepare('SELECT id FROM conversations WHERE anon_id = ? ORDER BY last_message_at DESC LIMIT 1')
      .bind(anonId).first();
    const sealed = note ? await sealBody(env, note, noteAad(id)) : null;
    const code = caseCode();
    const statements = [
      env.CARE_DB.prepare(
        `INSERT INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, created_at, updated_at, data_origin)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE anon_id=? AND status IN ('requested','claimed','active'))
         ${source ? 'AND EXISTS (SELECT 1 FROM messages WHERE id=? AND anon_id=? AND body_cipher=?)' : ''}`
      ).bind(
        id, code, anonId, source?.row.conversation_id || latest?.id || null,
        riskLevel, 'requested', shareContext ? 1 : 0,
        sealed?.cipher || null, sealed?.version || null, now, now, 'live', anonId,
        ...(source ? [source.row.id, anonId, source.row.body_cipher] : [])
      ),
      aggregateStatement(env, { eventType: 'appointment_requested', level: riskLevel, at: now, ifChanged: true }),
    ];
    if (shareContext) {
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO consent_grants (id, anon_id, scope, granted_at, data_origin) SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM appointments WHERE id=?)'
      ).bind(newId('cst'), anonId, 'share_context_with_healer', now, 'live', id));
    }
    if (source) statements.push(await cardUpdate(env, anonId, source, { appointmentId: id, decision: 'submitted' }, id));
    const [inserted] = await env.CARE_DB.batch(statements);
    if (!inserted.meta?.changes) throw new ApiError('APPOINTMENT_LIMIT', 409, '你已有一条未结束的预约，请在「我的预约」查看进度。');
    return json({ ok: true, id, caseCode: code, status: 'requested' });
  } catch (error) {
    return handleError(error, 'appointment_create_failed');
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new ApiError('APPOINTMENT_ID_REQUIRED', 400, '缺少预约标识');
    const now = Date.now();
    const [result] = await env.CARE_DB.batch([
      env.CARE_DB.prepare(
        "UPDATE appointments SET status = 'cancelled', share_context=0, cancelled_at = COALESCE(cancelled_at, ?), updated_at = ? WHERE id = ? AND anon_id = ?"
      ).bind(now, now, id, anonId),
      env.CARE_DB.prepare("UPDATE context_requests SET status='revoked', decided_at=? WHERE appointment_id=? AND anon_id=? AND status IN ('pending','approved')").bind(now, id, anonId),
    ]);
    if (!result.meta?.changes) throw new ApiError('APPOINTMENT_NOT_FOUND', 404, '这条预约不存在');
    return json({ ok: true });
  } catch (error) {
    return handleError(error, 'appointment_cancel_failed');
  }
}
