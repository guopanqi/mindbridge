// 企业管理端与公开组织共用此接口；按 organizationId 隔离读写。
import { json } from '../_lib/http.js';
import { readOrganizationConfig, updateOrganizationConfig } from '../_lib/organization-config.js';
import { ensureEnterpriseOrganization } from '../_lib/organizations.js';

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

async function resolveOrganization(request, env, body = null) {
  const url = new URL(request.url);
  const requested = (typeof body?.organizationId === 'string' && body.organizationId)
    || url.searchParams.get('organizationId');
  if (requested) {
    if (!/^[A-Za-z0-9_-]+$/.test(requested)) return { error: 'ORGANIZATION_INVALID' };
    const row = await env.CARE_DB.prepare(
      'SELECT id, kind FROM organizations WHERE id = ? AND status = ?'
    ).bind(requested, 'active').first();
    if (!row) return { error: 'ORGANIZATION_UNKNOWN' };
    return { id: row.id, kind: row.kind };
  }
  return { id: await ensureEnterpriseOrganization(env), kind: 'enterprise' };
}

export async function onRequestGet({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  const org = await resolveOrganization(request, env);
  if (org.error) return json({ ok: false, reasonCode: org.error }, org.error === 'ORGANIZATION_INVALID' ? 400 : 404);
  const result = await readOrganizationConfig(env, org.id, {
    includeEnterpriseSignals: org.kind === 'enterprise',
  });
  return result ? json(result) : json({ ok: false, reasonCode: 'ORGANIZATION_UNKNOWN' }, 404);
}

export async function onRequestPut({ request, env }) {
  if (!authorize(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400); }
  const actor = typeof body?.actor === 'string' ? body.actor.slice(0, 64) : null;
  const org = await resolveOrganization(request, env, body);
  if (org.error) return json({ ok: false, reasonCode: org.error }, org.error === 'ORGANIZATION_INVALID' ? 400 : 404);
  const result = await updateOrganizationConfig(env, org.id, body, actor, {
    allowSensing: org.kind === 'enterprise',
  });
  return json(result.body, result.status);
}
