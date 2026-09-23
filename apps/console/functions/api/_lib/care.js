// console → care 内部调用：始终带上会话所属组织，避免串读其他组织。
import { ApiError } from './staff.js';

export function careToken(env) {
  const token = env.INTERNAL_SERVICE_TOKEN;
  if (typeof token !== 'string' || token.length < 32) {
    throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');
  }
  return token;
}

export function enterpriseOrganizationId(env) {
  return env.DINGTALK_ORG_ID || 'org_enterprise_primary';
}

export function organizationQuery(staff, env) {
  const id = staff.organizationId || enterpriseOrganizationId(env);
  return `organizationId=${encodeURIComponent(id)}`;
}

export function isEnterpriseSession(staff) {
  return (staff.organizationKind || 'enterprise') === 'enterprise';
}
