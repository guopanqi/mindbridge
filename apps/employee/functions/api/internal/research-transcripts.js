// 仅供内部研究命令行使用。独立令牌、组织能力与日期范围同时校验。
import { openBody } from '../_lib/care.js';
import { json } from '../_lib/http.js';

function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const cell = (value) => {
  const raw = value == null ? '' : String(value);
  const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"', '""')}"`;
};

export async function onRequestGet({ request, env }) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  if (typeof env.RESEARCH_EXPORT_TOKEN !== 'string' || env.RESEARCH_EXPORT_TOKEN.length < 32 || !equal(token, env.RESEARCH_EXPORT_TOKEN)) {
    return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  }
  const url = new URL(request.url);
  const organizationId = url.searchParams.get('organizationId');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const cursor = Number(url.searchParams.get('cursor') || 0);
  if (!/^org_[a-z0-9_]{3,80}$/.test(organizationId || '') || !/^\d{4}-\d\d-\d\d$/.test(from || '') || !/^\d{4}-\d\d-\d\d$/.test(to || '') || !Number.isSafeInteger(cursor) || cursor < 0) {
    return json({ ok: false, reasonCode: 'INVALID_QUERY' }, 400);
  }
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`) + 86400000;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end - start > 31 * 86400000 || end > Date.now() + 86400000) {
    return json({ ok: false, reasonCode: 'INVALID_DATE_RANGE' }, 400);
  }
  const organization = await env.CARE_DB.prepare(
    `SELECT o.id FROM organizations o JOIN organization_capabilities c ON c.organization_id=o.id
     WHERE o.id=? AND o.kind='beta' AND c.capability='research_transcript_export' AND c.enabled=1`
  ).bind(organizationId).first();
  if (!organization) return json({ ok: false, reasonCode: 'EXPORT_NOT_ENABLED' }, 403);
  const { results } = await env.CARE_DB.prepare(
    `SELECT m.id, m.conversation_id, m.anon_id, m.role, m.body_cipher, m.content_key_version, m.created_at
     FROM messages m JOIN subject_organizations s ON s.anon_id=m.anon_id AND s.organization_id=?
     WHERE m.created_at>=? AND m.created_at<? AND m.data_origin='live' AND m.role IN ('user','assistant')
     ORDER BY m.created_at, m.id LIMIT 201 OFFSET ?`
  ).bind(organizationId, start, end, cursor).all();
  const rows = results || [];
  const lines = [];
  for (const row of rows.slice(0, 200)) {
    const body = await openBody(env, row.body_cipher, row.content_key_version, `care:message:${row.conversation_id}`);
    if (body === null) return json({ ok: false, reasonCode: 'DECRYPT_FAILED' }, 500);
    lines.push([organizationId, row.anon_id, row.conversation_id, row.id, row.role, new Date(row.created_at).toISOString(), body].map(cell).join(','));
  }
  console.info(JSON.stringify({ event: 'research_transcript_export', organizationId, from, to, cursor, count: lines.length }));
  return json({ ok: true, rows: lines, nextCursor: rows.length > 200 ? cursor + 200 : null });
}
