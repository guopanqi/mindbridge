// Pass only a code-owned SQL alias, never user input.
export function activityAvailableSql(alias = 'a') {
  if (!/^[a-z_]+$/i.test(alias)) throw new Error('Invalid SQL alias');
  return `${alias}.enabled = 1 AND ${alias}.content_available = 1 AND EXISTS (SELECT 1 FROM resource_catalog availability_catalog WHERE availability_catalog.activity_id = ${alias}.id AND availability_catalog.enabled = 1)`;
}
