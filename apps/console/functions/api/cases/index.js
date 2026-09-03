// 个案调度：疗愈师专用。console 自身不存个案数据，全部经内部令牌向 care 取。
import { json } from '../_lib/http.js';
import { ApiError, audit, handleError, readJson, requireStaff } from '../_lib/staff.js';

async function careFetch(env, path, init = {}) {
  const token = env.INTERNAL_SERVICE_TOKEN;
  if (typeof token !== 'string' || token.length < 32) {
    throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');
  }
  const response = await fetch(`${env.CARE_API_ORIGIN}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);
  if (!response) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '个案数据暂时取不到');
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(body.reasonCode || 'CARE_UPSTREAM_FAILED', response.status === 403 ? 403 : 502,
      body.reasonCode === 'CONTEXT_NOT_AUTHORIZED' ? '员工尚未同意查看对话上下文' : '操作没有成功');
  }
  return body;
}

export async function onRequestGet({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'healer');
    const body = await careFetch(env, '/api/internal/cases');
    await audit(env, staff.staffId, 'view_cases', 'report', 'case_list', 'ok');
    return json(body);
  } catch (error) {
    return handleError(error, 'cases_list_failed');
  }
}

export async function onRequestPost({ request, env }) {
  let staff = null;
  let action = null;
  let caseCode = null;
  try {
    staff = await requireStaff(request, env, 'healer');
    const body = await readJson(request);
    action = body?.action;
    caseCode = body?.caseCode;
    if (!['claim', 'start', 'close', 'refer', 'note', 'request_context', 'read_context'].includes(action)) {
      throw new ApiError('ACTION_UNKNOWN', 400, '未知操作');
    }
    if (typeof caseCode !== 'string' || !caseCode) throw new ApiError('CASE_CODE_REQUIRED', 400, '缺少个案编号');
    const result = await careFetch(env, '/api/internal/cases', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...body, staffId: staff.staffId }),
    });
    // 每一次个案操作都留痕，尤其是读取上下文。
    await audit(env, staff.staffId, action === 'read_context' ? 'read_case_context' : `case_${action}`, 'case', caseCode, 'ok');
    return json(result);
  } catch (error) {
    // 被拒绝的查看同样要留痕，且必须记到具体个案上。
    if (staff && error instanceof ApiError && error.code === 'CONTEXT_NOT_AUTHORIZED') {
      await audit(env, staff.staffId, 'read_case_context', 'case', caseCode || 'unknown', 'denied')
        .catch(() => {});
    }
    return handleError(error, 'case_action_failed');
  }
}
