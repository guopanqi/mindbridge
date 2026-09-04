// 管理端取数：console 没有 CARE_DB binding，只能通过内部服务令牌调用 care 的聚合接口。
// 这里不做任何再加工，原样透传阈值抑制后的结果，避免在管理端引入第二套统计口径。
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'hr_viewer');
    const token = env.INTERNAL_SERVICE_TOKEN;
    if (typeof token !== 'string' || token.length < 32) {
      throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');
    }
    const days = new URL(request.url).searchParams.get('days') || '90';
    const origin = new URL(request.url).searchParams.get('origin') === 'demo_seed' ? 'demo_seed' : 'live';
    const upstream = await fetch(
      `${env.CARE_API_ORIGIN}/api/internal/metrics?days=${encodeURIComponent(days)}&origin=${origin}`,
      { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) }
    ).catch(() => null);
    if (!upstream || !upstream.ok) {
      throw new ApiError('CARE_UPSTREAM_FAILED', 502, '聚合数据暂时取不到，请稍后重试');
    }
    const body = await upstream.json();
    await audit(env, staff.staffId, 'view_dashboard', 'report', `metrics:${days}d`, 'ok');
    return json(body);
  } catch (error) {
    return handleError(error, 'metrics_proxy_failed');
  }
}
