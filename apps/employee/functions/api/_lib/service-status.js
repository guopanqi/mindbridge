export const SERVICE_STATUSES = ['coming_soon', 'open', 'paused', 'retired'];

export async function readServiceStatus(env, serviceId) {
  return env.CARE_DB.prepare('SELECT status, preview_visible FROM service_status WHERE service_id = ?')
    .bind(serviceId).first();
}

export function serviceOpenSql(alias = 'a') {
  if (!/^[a-z_]+$/i.test(alias)) throw new Error('Invalid SQL alias');
  return `EXISTS (SELECT 1 FROM service_status service_state WHERE service_state.service_id = 'activity:' || ${alias}.id AND service_state.status = 'open')`;
}
