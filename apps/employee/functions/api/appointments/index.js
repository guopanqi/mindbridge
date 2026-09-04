// 匿名预约：疗愈师侧在 Stage 4 实现，这里只做员工侧的提交、查看与取消。
// 个案编号是给疗愈师看的唯一标识，它由随机值生成，不从 anon_id 派生。
import { json } from '../_lib/http.js';
import {
  ApiError, aggregateStatement, ensureProfile, handleError, newId,
  openBody, readJson, requireSession, requireText, sealBody,
} from '../_lib/care.js';

const MAX_OPEN = 3;
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
    const shareContext = body?.shareContext === true;
    const note = body?.note ? requireText(body.note, { min: 1, max: 300, field: 'note' }) : null;
    const riskLevel = ['green', 'yellow', 'red'].includes(body?.riskLevel) ? body.riskLevel : 'yellow';

    const open = await env.CARE_DB
      .prepare("SELECT COUNT(*) AS n FROM appointments WHERE anon_id = ? AND status IN ('requested','claimed','active')")
      .bind(anonId).first();
    if ((open?.n || 0) >= MAX_OPEN) {
      throw new ApiError('APPOINTMENT_LIMIT', 429, '你已经有待处理的预约了，先等疗愈师联系你。');
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
        'INSERT INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, created_at, updated_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        id, code, anonId, latest?.id || null,
        riskLevel, 'requested', shareContext ? 1 : 0,
        sealed?.cipher || null, sealed?.version || null, now, now, 'live'
      ),
      aggregateStatement(env, { eventType: 'appointment_requested', level: riskLevel, at: now }),
    ];
    if (shareContext) {
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO consent_grants (id, anon_id, scope, granted_at, data_origin) VALUES (?, ?, ?, ?, ?)'
      ).bind(newId('cst'), anonId, 'share_context_with_healer', now, 'live'));
    }
    await env.CARE_DB.batch(statements);
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
