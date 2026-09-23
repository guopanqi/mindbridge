// 疗愈师个案接口。console 通过内部服务令牌调用，care 负责所有隐私判定。
//
// 默认返回的个案不包含任何原文；对话上下文只有在员工本人当场同意后才返回，
// 并且每次返回都由调用方（console）写审计。
import { json } from '../_lib/http.js';
import {
  newId, openBody, sealBody,
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

// Worker 里的本地时间是 UTC，日志里的时刻要按企业所在时区写，否则和前端按本机时区显示的「触发时间」对不上。
const TIME_FORMAT = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
const formatTime = (ts) => TIME_FORMAT.format(new Date(ts));

async function listCases(env) {
  const { results } = await env.CARE_DB.prepare(
    `SELECT a.id, a.case_code, a.conversation_id, a.risk_level, a.status, a.share_context, a.note_cipher,
            a.content_key_version, a.created_at, a.claimed_by, a.claimed_at, a.closed_at,
            a.work_profile_json, a.tags_json, a.response_minutes, a.log_json, a.sla_at,
            a.organization_id, o.display_name AS org_name,
            (SELECT COUNT(*) FROM case_notes n WHERE n.appointment_id = a.id) AS note_count,
            (SELECT CASE WHEN status IN ('pending','approved') AND expires_at <= ? THEN 'expired'
              WHEN EXISTS (SELECT 1 FROM consent_grants g WHERE g.anon_id=c.anon_id AND g.scope='share_context_with_healer' AND g.revoked_at>=COALESCE(c.decided_at,c.created_at)) THEN 'revoked'
              ELSE status END FROM context_requests c WHERE c.appointment_id = a.id ORDER BY created_at DESC LIMIT 1) AS context_status
     FROM appointments a LEFT JOIN organizations o ON o.id = a.organization_id
     WHERE a.status != 'cancelled' AND a.risk_level = 'red'
     ORDER BY a.created_at DESC LIMIT 50`
  ).bind(Date.now()).all();
  const cases = [];
  for (const row of results || []) {
    // 预约备注是员工主动填写要给疗愈师看的内容，属于已授权范围。
    const note = row.note_cipher
      ? await openBody(env, row.note_cipher, row.content_key_version, noteAad(row.id))
      : null;

    let workProfile = null;
    if (row.work_profile_json) {
      try { workProfile = JSON.parse(row.work_profile_json); } catch {}
    }
    let tags = [];
    if (row.tags_json) {
      try { tags = JSON.parse(row.tags_json); } catch {}
    }
    let log = [];
    if (row.log_json) {
      try { log = JSON.parse(row.log_json); } catch {}
    } else {
      log = [`${formatTime(row.created_at)} 员工已提交支持请求`];
      if (row.claimed_at) log.push(`${formatTime(row.claimed_at)} 已受理 · 处理中`);
      if (row.closed_at) log.push(`${formatTime(row.closed_at)} 完成首次会谈 · 已安排后续疗愈`);
    }

    const contextStatus = row.context_status || 'none';
    // 列表不是授权读取端点。原文仅由 read_context 按具体 staff、有效期检查后返回。
    const textSnippets = [];

    // 状态映射为 Demo 标准三态：pending / active / done
    let status = 'pending';
    if (row.closed_at || row.status === 'closed' || row.status === 'done') {
      status = 'done';
    } else if (row.status === 'active' || row.claimed_by) {
      status = 'active';
    }

    cases.push({
      id: row.id,
      caseCode: row.case_code,
      riskLevel: row.risk_level,
      status,
      workProfile,
      tags,
      sla: row.sla_at || (row.created_at + 2 * 3600 * 1000),
      resp: row.response_minutes || (row.closed_at ? Math.max(1, Math.round((row.closed_at - row.created_at) / 60000)) : null),
      log,
      textSnippets,
      claimed: Boolean(row.claimed_by),
      claimedBy: row.claimed_by,
      organizationId: row.organization_id || null,
      organizationName: row.org_name || null,
      noteFromEmployee: note,
      noteCount: row.note_count,
      contextStatus,
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
      .prepare('SELECT id, anon_id, conversation_id, status, claimed_by, created_at, log_json FROM appointments WHERE case_code = ?')
      .bind(caseCode).first();
    if (!appointment) return json({ ok: false, reasonCode: 'CASE_NOT_FOUND' }, 404);
    if (appointment.status === 'cancelled') return json({ ok: false, reasonCode: 'CASE_NOT_FOUND' }, 404);
    if (appointment.claimed_by && appointment.claimed_by !== staffId) {
      return json({ ok: false, reasonCode: 'CASE_ALREADY_CLAIMED' }, 409);
    }
    const now = Date.now();
    const timeStr = formatTime(now);

    let logs = [];
    if (appointment.log_json) {
      try { logs = JSON.parse(appointment.log_json); } catch {}
    }

    if (action === 'claim' || action === 'start') {
      if (['done', 'closed'].includes(appointment.status)) return json({ ok: false, reasonCode: 'CASE_CLOSED' }, 409);
      if (appointment.claimed_by && appointment.claimed_by !== staffId) {
        return json({ ok: false, reasonCode: 'CASE_ALREADY_CLAIMED' }, 409);
      }
      const newStatus = action === 'start' ? 'active' : 'claimed';
      const actionMsg = action === 'start' ? `${timeStr} 疗愈师已开始跟进` : `${timeStr} 疗愈师已受理 · 处理中`;
      logs.push(actionMsg);
      const result = await env.CARE_DB.prepare("UPDATE appointments SET status = ?, claimed_by = ?, claimed_at = COALESCE(claimed_at, ?), log_json = ?, updated_at = ? WHERE id = ? AND status IN ('requested','claimed','active') AND (claimed_by IS NULL OR claimed_by = ?)")
          .bind(newStatus, staffId, now, JSON.stringify(logs), now, appointment.id, staffId).run();
      if (!result.meta?.changes) return json({ ok: false, reasonCode: 'CASE_CHANGED' }, 409);
      return json({ ok: true, status: newStatus, log: logs });
    }

    if (action === 'close') {
      const respMinutes = Math.max(1, Math.round((now - appointment.created_at) / 60000));
      logs.push(`${timeStr} 本次支持已结束`);
      const result = await env.CARE_DB.prepare(
        "UPDATE appointments SET status = 'done', closed_at = ?, response_minutes = ?, log_json = ?, updated_at = ? WHERE id = ? AND status IN ('claimed','active') AND claimed_by = ?"
      ).bind(now, respMinutes, JSON.stringify(logs), now, appointment.id, staffId).run();
      if (!result.meta?.changes) return json({ ok: false, reasonCode: 'CASE_CHANGED' }, 409);
      return json({ ok: true, status: 'done', responseMinutes: respMinutes, log: logs });
    }

    if (action === 'refer') {
      logs.push(`${timeStr} 已记录专业转介评估 · 具体机构由专业团队线下流程决定`);
      const result = await env.CARE_DB.prepare(
        "UPDATE appointments SET log_json = ?, updated_at = ? WHERE id = ? AND status!='cancelled' AND (claimed_by IS NULL OR claimed_by=?)"
      ).bind(JSON.stringify(logs), now, appointment.id, staffId).run();
      if (!result.meta?.changes) return json({ ok: false, reasonCode: 'CASE_CHANGED' }, 409);
      return json({ ok: true, log: logs });
    }

    if (action === 'note') {
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text || text.length > 500) return json({ ok: false, reasonCode: 'NOTE_INVALID' }, 400);
      const id = newId('note');
      const sealed = await sealBody(env, text, caseNoteAad(id));
      logs.push(`${timeStr} 疗愈师记录干预备忘`);
      const [inserted] = await env.CARE_DB.batch([
        env.CARE_DB.prepare(
          "INSERT INTO case_notes (id, appointment_id, staff_id, body_cipher, content_key_version, created_at, data_origin) SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM appointments WHERE id=? AND status!='cancelled' AND (claimed_by IS NULL OR claimed_by=?))"
        ).bind(id, appointment.id, staffId, sealed.cipher, sealed.version, now, 'live', appointment.id, staffId),
        env.CARE_DB.prepare('UPDATE appointments SET log_json = ?, updated_at = ? WHERE id = ? AND changes()=1')
          .bind(JSON.stringify(logs), now, appointment.id),
      ]);
      if (!inserted.meta?.changes) return json({ ok: false, reasonCode: 'CASE_CHANGED' }, 409);
      return json({ ok: true, log: logs });
    }

    if (action === 'request_context') {
      const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 200) : '';
      if (!reason) return json({ ok: false, reasonCode: 'REASON_REQUIRED' }, 400);
      const pending = await env.CARE_DB.prepare(
        "SELECT id FROM context_requests WHERE appointment_id = ? AND status = 'pending' AND expires_at > ?"
      ).bind(appointment.id, now).first();
      if (pending) return json({ ok: true, status: 'pending' });
      logs.push(`${timeStr} 申请查看对话上下文（理由：${reason}）`);
      const [inserted] = await env.CARE_DB.batch([
        env.CARE_DB.prepare(
          "INSERT INTO context_requests (id, appointment_id, anon_id, staff_id, reason, status, created_at, expires_at, data_origin) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM appointments WHERE id=? AND status!='cancelled' AND (claimed_by IS NULL OR claimed_by=?))"
        ).bind(newId('ctx'), appointment.id, appointment.anon_id, staffId, reason, 'pending', now, now + CONTEXT_TTL_MS, 'live', appointment.id, staffId),
        env.CARE_DB.prepare('UPDATE appointments SET log_json = ?, updated_at = ? WHERE id = ? AND changes()=1')
          .bind(JSON.stringify(logs), now, appointment.id),
      ]);
      if (!inserted.meta?.changes) return json({ ok: false, reasonCode: 'CASE_CHANGED' }, 409);
      return json({ ok: true, status: 'pending', log: logs });
    }

    if (action === 'read_context') {
      const granted = await env.CARE_DB.prepare(
        "SELECT c.id FROM context_requests c JOIN appointments a ON a.id=c.appointment_id WHERE c.appointment_id = ? AND c.staff_id = ? AND c.status = 'approved' AND c.expires_at > ? AND a.status!='cancelled' AND NOT EXISTS (SELECT 1 FROM consent_grants g WHERE g.anon_id=c.anon_id AND g.scope='share_context_with_healer' AND g.revoked_at>=c.decided_at) ORDER BY c.decided_at DESC LIMIT 1"
      ).bind(appointment.id, staffId, now).first();
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
