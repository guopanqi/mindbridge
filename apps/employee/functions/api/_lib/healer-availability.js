import { readServiceStatus } from './service-status.js';

export async function healerReferralEnabled(env, organizationId) {
  if (!organizationId) return false;
  const [service, row] = await Promise.all([
    readServiceStatus(env, 'healer-referral'),
    env.CARE_DB.prepare(
    'SELECT enabled FROM organization_healer_settings WHERE organization_id = ?'
    ).bind(organizationId).first(),
  ]);
  // 没有组织覆写时采用标准配置（启用）；产品侧状态独立决定是否实际开放。
  return service?.status === 'open' && row?.enabled !== 0;
}
