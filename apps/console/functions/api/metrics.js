// 管理端取数：console 没有 CARE_DB binding，只能通过内部服务令牌调用 care 的聚合接口。
// 这里不做任何再加工，原样透传阈值抑制后的结果，避免在管理端引入第二套统计口径。
import { careToken, organizationQuery } from './_lib/care.js';
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'hr_viewer');
    const days = new URL(request.url).searchParams.get('days') || '90';
    const origin = new URL(request.url).searchParams.get('origin') === 'demo_seed' ? 'demo_seed' : 'live';
    // 小样本视图不再只限全局 INTERNAL_TEST_ORG_ID：beta 组织的管理链接（orgKey 会话）
    // 默认可看本组织小样本真实报表；全局内部测试入口保持兼容。
    const betaAdminView = staff.organizationKind === 'beta' && staff.roles.includes('admin') && origin === 'live';
    const internalTest = (staff.roles.includes('internal_tester') && staff.organizationId === env.INTERNAL_TEST_ORG_ID)
      || betaAdminView;
    const upstream = await fetch(
      `${env.CARE_API_ORIGIN}/api/internal/metrics?days=${encodeURIComponent(days)}&origin=${origin}&${organizationQuery(staff, env)}${internalTest ? '&internalTest=1' : ''}`,
      { headers: { authorization: `Bearer ${careToken(env)}` }, signal: AbortSignal.timeout(10000) }
    ).catch(() => null);
    if (!upstream || !upstream.ok) {
      throw new ApiError('CARE_UPSTREAM_FAILED', 502, '聚合数据暂时取不到，请稍后重试');
    }
    const body = await upstream.json();
    await audit(env, staff.staffId, internalTest ? 'view_dashboard_internal_test' : 'view_dashboard', 'report', `metrics:${days}d:${staff.organizationId || 'enterprise'}`, 'ok');
    return json(body);
  } catch (error) {
    return handleError(error, 'metrics_proxy_failed');
  }
}
