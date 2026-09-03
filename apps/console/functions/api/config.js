// 干预阶梯与办公数据感知的配置读写。写操作要求 admin 角色并写审计。
import { json } from './_lib/http.js';
import { ApiError, audit, handleError, readJson, requireStaff } from './_lib/staff.js';

function upstreamToken(env) {
  const token = env.INTERNAL_SERVICE_TOKEN;
  if (typeof token !== 'string' || token.length < 32) {
    throw new ApiError('APP_CONFIGURATION_MISSING', 503, '管理后台配置不完整');
  }
  return token;
}

export async function onRequestGet({ request, env }) {
  try {
    await requireStaff(request, env, 'hr_viewer');
    const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/config`, {
      headers: { authorization: `Bearer ${upstreamToken(env)}` },
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!upstream || !upstream.ok) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '配置暂时取不到');
    return json(await upstream.json());
  } catch (error) {
    return handleError(error, 'config_read_failed');
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const staff = await requireStaff(request, env, 'admin');
    const body = await readJson(request);
    const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/config`, {
      method: 'PUT',
      headers: { authorization: `Bearer ${upstreamToken(env)}`, 'content-type': 'application/json' },
      body: JSON.stringify({ ...body, actor: staff.staffId }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!upstream) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '配置没有保存成功');
    const result = await upstream.json();
    const target = body?.kind === 'matrix' ? `matrix:${body.emotion}` : `sensing:${body.key}`;
    await audit(env, staff.staffId, 'update_config', 'config', target, result.ok ? 'ok' : `denied:${result.reasonCode}`);
    if (!result.ok) {
      const messages = {
        L1_NOT_IN_CATALOG: '所选 L1 资源不在资源目录中',
        L2_NOT_IN_CATALOG: '所选 L2 资源不在资源目录中',
        SIGNAL_PERMANENTLY_OFF: '本系统不申请该权限，这项信号无法开启',
        EMOTION_UNKNOWN: '未知的情绪信号',
        SIGNAL_UNKNOWN: '未知的感知信号',
      };
      throw new ApiError(result.reasonCode, 400, messages[result.reasonCode] || '配置没有保存成功');
    }
    return json(result);
  } catch (error) {
    return handleError(error, 'config_write_failed');
  }
}
