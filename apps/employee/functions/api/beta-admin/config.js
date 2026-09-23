import { adminOrganization, validSameOrigin } from '../_lib/beta-admin.js';
import { readOrganizationConfig, updateOrganizationConfig } from '../_lib/organization-config.js';
import { json } from '../_lib/http.js';

export async function onRequestGet({ request, env }) {
  const org = await adminOrganization(request, env);
  if (!org) return json({ ok: false, reasonCode: 'ADMIN_SESSION_REQUIRED' }, 401);
  return json(await readOrganizationConfig(env, org.id));
}

export async function onRequestPut({ request, env }) {
  if (!validSameOrigin(request)) return json({ ok: false, reasonCode: 'ORIGIN_INVALID' }, 403);
  const org = await adminOrganization(request, env);
  if (!org) return json({ ok: false, reasonCode: 'ADMIN_SESSION_REQUIRED' }, 401);
  const body = await request.json().catch(() => null);
  if (!body) return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400);
  const result = await updateOrganizationConfig(env, org.id, body, `beta_admin:${org.id}`);
  return json(result.body, result.status);
}
