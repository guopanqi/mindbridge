import { careToken, organizationQuery } from './_lib/care.js';
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, requireStaff } from './_lib/staff.js';

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'internal_tester');
    if (!staff.organizationId || staff.organizationId !== env.INTERNAL_TEST_ORG_ID) {
      throw new ApiError('FORBIDDEN', 403, '当前账号没有这个权限');
    }
    const anonId = new URL(request.url).searchParams.get('anonId');
    if (anonId && !/^[A-Za-z0-9_-]{1,100}$/.test(anonId)) throw new ApiError('ANON_ID_INVALID', 400, '匿名 ID 无效');
    const query = `${organizationQuery(staff, env)}${anonId ? `&anonId=${encodeURIComponent(anonId)}` : ''}`;
    const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/test-timeline?${query}`, {
      headers: { authorization: `Bearer ${careToken(env)}` }, signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!upstream || !upstream.ok) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '测试时间线暂时取不到');
    const body = await upstream.json();
    await audit(env, staff.staffId, 'view_internal_timeline', 'organization', staff.organizationId, 'ok');
    return json(body);
  } catch (error) {
    return handleError(error, 'internal_test_timeline_proxy_failed');
  }
}
