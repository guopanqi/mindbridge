// 疗愈师个案接口。console 通过内部服务令牌调用，care 负责所有隐私判定。
//
// 默认返回的个案不包含任何原文；对话上下文只有在员工本人当场同意后才返回，
// 并且每次返回都由调用方（console）写审计。
import { json } from '../_lib/http.js';
import {
  aggregateStatement, newId, openBody, sealBody,
} from '../_lib/care.js';
import { MIN_SAMPLE } from '../_lib/metrics.js';

const CONTEXT_TTL_MS = 24 * 3600 * 1000;
const CONTEXT_MESSAGE_LIMIT = 12;

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request, env) {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  if (typeof expected !== 'string' || expected.length < 32) return false;
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') && timingSafeEqual(header.slice(7), expected);
}

const noteAad = (id) => `care:appointment:${id}`;
const caseNoteAad = (id) => `care:case_note:${id}`;
const messageAad = (conversationId) => `care:message:${conversationId}`;

async function listCases(env) {
  const { results } = await env.CARE_DB.prepare(
    `SELECT a.id, a.case_code, a.risk_level, a.status, a.share_context, a.note_cipher,
            a.content_key_version, a.created_at, a.claimed_by, a.claimed_at, a.closed_at,
            (SELECT COUNT(*) FROM case_notes n WHERE n.appointment_id = a.id) AS note_count,
            (SELECT status FROM context_requests c WHERE c.appointment_id = a.id ORDER BY created_at DESC LIMIT 1) AS context_status
     FROM appointments a WHERE a.status != 'cancelled' ORDER BY a.created_at DESC LIMIT 50`
  ).all();
  const cases = [];
  for (const row of results || []) {
    // 预约备注是员工主动填写要给疗愈师看的内容，属于已授权范围。
    const note = row.note_cipher
      ? await openBody(env, row.note_cipher, row.content_key_version, noteAad(row.id))
      : null;
    cases.push({
      caseCode: row.case_code,
      riskLevel: row.risk_level,
      status: row.status,
      claimed: Boolean(row.claimed_by),
      claimedBy: row.claimed_by,
      noteFromEmployee: note,
      noteCount: row.note_count,
      contextStatus: row.context_status || 'none',
      at: row.created_at,
    });
  }
  return cases;
}

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  try {
    return json({ ok: true, cases: await listCases(env), minSample: MIN_SAMPLE });
  } catch {
    console.error(JSON.stringify({ event: 'cases_list_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400);
  }
  const { action, caseCode, staffId } = body || {};
  if (typeof caseCode !== 'string' || typeof staffId !== 'string' || !caseCode || !staffId) {
    return json({ ok: false, reasonCode: 'PARAMS_INVALID' }, 400);
  }
  try {
    const appointment = await env.CARE_DB
      .prepare('SELECT id, anon_id, conversation_id, status, claimed_by FROM appointments WHERE case_code = ?')
      .bind(caseCode).first();
    if (!appointment) return json({ ok: false, reasonCode: 'CASE_NOT_FOUND' }, 404);
    const now = Date.now();

    if (action === 'claim') {
      if (appointment.claimed_by && appointment.claimed_by !== staffId) {
        return json({ ok: false, reasonCode: 'CASE_ALREADY_CLAIMED' }, 409);
      }
      await env.CARE_DB.batch([
        env.CARE_DB.prepare("UPDATE appointments SET status = 'claimed', claimed_by = ?, claimed_at = ?, updated_at = ? WHERE id = ?")
          .bind(staffId, now, now, appointment.id),
        aggregateStatement(env, { eventType: 'case_claimed', at: now }),
      ]);
      return json({ ok: true, status: 'claimed' });
    }

    if (action === 'note') {
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text || text.length > 500) return json({ ok: false, reasonCode: 'NOTE_INVALID' }, 400);
      const id = newId('note');
      const sealed = await sealBody(env, text, caseNoteAad(id));
      await env.CARE_DB.prepare(
        'INSERT INTO case_notes (id, appointment_id, staff_id, body_cipher, content_key_version, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, appointment.id, staffId, sealed.cipher, sealed.version, now, 'live').run();
      return json({ ok: true });
    }

    if (action === 'request_context') {
      const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 200) : '';
      if (!reason) return json({ ok: false, reasonCode: 'REASON_REQUIRED' }, 400);
      const pending = await env.CARE_DB.prepare(
        "SELECT id FROM context_requests WHERE appointment_id = ? AND status = 'pending' AND expires_at > ?"
      ).bind(appointment.id, now).first();
      if (pending) return json({ ok: true, status: 'pending' });
      await env.CARE_DB.prepare(
        'INSERT INTO context_requests (id, appointment_id, anon_id, staff_id, reason, status, created_at, expires_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId('ctx'), appointment.id, appointment.anon_id, staffId, reason, 'pending', now, now + CONTEXT_TTL_MS, 'live').run();
      return json({ ok: true, status: 'pending' });
    }

    if (action === 'read_context') {
      const granted = await env.CARE_DB.prepare(
        "SELECT id FROM context_requests WHERE appointment_id = ? AND staff_id = ? AND status = 'approved' ORDER BY decided_at DESC LIMIT 1"
      ).bind(appointment.id, staffId).first();
      // 没有员工的明确同意就没有上下文，这里是硬拒绝，不是降级返回摘要。
      if (!granted) return json({ ok: false, reasonCode: 'CONTEXT_NOT_AUTHORIZED' }, 403);
      if (!appointment.conversation_id) return json({ ok: true, messages: [] });
      const { results } = await env.CARE_DB.prepare(
        "SELECT id, role, body_cipher, content_key_version, created_at FROM messages WHERE conversation_id = ? AND role IN ('user','assistant') ORDER BY created_at DESC LIMIT ?"
      ).bind(appointment.conversation_id, CONTEXT_MESSAGE_LIMIT).all();
      const messages = [];
      for (const row of (results || []).slice().reverse()) {
        const text = await openBody(env, row.body_cipher, row.content_key_version, messageAad(appointment.conversation_id));
        if (text !== null) messages.push({ role: row.role, text, at: row.created_at });
      }
      return json({ ok: true, messages });
    }

    return json({ ok: false, reasonCode: 'ACTION_UNKNOWN' }, 400);
  } catch {
    console.error(JSON.stringify({ event: 'case_action_failed', reasonCode: 'INTERNAL_ERROR' }));
    return json({ ok: false, reasonCode: 'INTERNAL_ERROR' }, 500);
  }
}
