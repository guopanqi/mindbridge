export function enterpriseOrganizationId(env) {
  return env.DINGTALK_ORG_ID || 'org_enterprise_primary';
}

export async function ensureEnterpriseOrganization(env) {
  const organizationId = enterpriseOrganizationId(env);
  const now = Date.now();
  await env.CARE_DB.prepare(
    "INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at) VALUES (?, ?, 'enterprise', 'active', ?, ?) ON CONFLICT(id) DO NOTHING"
  ).bind(organizationId, '钉钉企业组织', now, now).run();
  return organizationId;
}

export async function ensureEnterpriseSubject(env, anonId) {
  const organizationId = enterpriseOrganizationId(env);
  const now = Date.now();
  await env.CARE_DB.batch([
    env.CARE_DB.prepare(
      "INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at) VALUES (?, ?, 'enterprise', 'active', ?, ?) ON CONFLICT(id) DO NOTHING"
    ).bind(organizationId, '钉钉企业组织', now, now),
    env.CARE_DB.prepare(
      `INSERT INTO subject_organizations (anon_id, organization_id, entry_channel, created_at, last_seen_at)
       VALUES (?, ?, 'dingtalk', ?, ?) ON CONFLICT(anon_id) DO UPDATE SET last_seen_at = excluded.last_seen_at`
    ).bind(anonId, organizationId, now, now),
  ]);
  return organizationId;
}
