import { serviceOpenSql } from './service-status.js';

// Pass only a code-owned SQL alias, never user input.
export function activityAvailableSql(alias = 'a', organizationId = null) {
  if (!/^[a-z_]+$/i.test(alias)) throw new Error('Invalid SQL alias');
  const base = `${alias}.enabled = 1 AND ${alias}.content_available = 1 AND ${serviceOpenSql(alias)} AND EXISTS (SELECT 1 FROM resource_catalog availability_catalog WHERE availability_catalog.activity_id = ${alias}.id AND availability_catalog.enabled = 1)`;
  if (!organizationId) return base;
  if (!/^org_[A-Za-z0-9_]{1,80}$/.test(organizationId)) throw new Error('Invalid organization id');
  return `${base} AND COALESCE((SELECT enabled FROM organization_activity_settings org_activity WHERE org_activity.organization_id = '${organizationId}' AND org_activity.activity_id = ${alias}.id), 1) = 1`;
}
