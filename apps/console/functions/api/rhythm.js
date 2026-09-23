// 办公数据感知：查询与钉钉的真实连接状态，或触发一次同步。
// 连接状态必须如实反映；拿不到就说拿不到，不允许回落到任何示例数值。
import { careToken, isEnterpriseSession } from './_lib/care.js';
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, requireStaff } from './_lib/staff.js';

async function call(env, method) {
  const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/rhythm?days=7`, {
    method,
    headers: { authorization: `Bearer ${careToken(env)}` },
    signal: AbortSignal.timeout(25000),
  }).catch(() => null);
  if (!upstream) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '无法连接考勤数据接口');
  return upstream.json();
}

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'hr_viewer');
    if (!isEnterpriseSession(staff)) {
      throw new ApiError('FORBIDDEN', 403, '公开组织没有钉钉考勤数据');
    }
    return json(await call(env, 'GET'));
  } catch (error) {
    return handleError(error, 'rhythm_probe_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'admin');
    if (!isEnterpriseSession(staff)) {
      throw new ApiError('FORBIDDEN', 403, '公开组织不能同步钉钉考勤');
    }
    const result = await call(env, 'POST');
    await audit(env, staff.staffId, 'sync_rhythm', 'config', 'dingtalk_attendance', result.ok ? 'ok' : 'failed');
    return json(result);
  } catch (error) {
    return handleError(error, 'rhythm_sync_failed');
  }
}
