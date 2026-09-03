// 行业洞察取数：与看板一样，console 只透传 care 的结果，不引入第二套口径。
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'hr_viewer');
    const token = env.INTERNAL_SERVICE_TOKEN;
    if (typeof token !== 'string' || token.length < 32) {
      throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');
    }
    const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/industry`, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!upstream || !upstream.ok) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '行业数据暂时取不到');
    const body = await upstream.json();
    await audit(env, staff.staffId, 'view_industry', 'report', 'industry', 'ok');
    return json(body);
  } catch (error) {
    return handleError(error, 'industry_proxy_failed');
  }
}
