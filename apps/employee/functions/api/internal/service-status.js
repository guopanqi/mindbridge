// 产品侧全局状态入口；组织管理员的配置接口不代理此路由。
import { json } from '../_lib/http.js';
import { SERVICE_STATUSES } from '../_lib/service-status.js';

function authorized(request, env) {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  return typeof expected === 'string' && expected.length >= 32
    && request.headers.get('authorization') === `Bearer ${expected}`;
}

export async function onRequestPut({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, reasonCode: 'UNAUTHORIZED' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reasonCode: 'INVALID_JSON' }, 400); }
  const { serviceId, status, previewVisible } = body || {};
  if (typeof serviceId !== 'string' || !/^(healer-referral|activity:[a-z0-9-]{1,64})$/.test(serviceId)
    || !SERVICE_STATUSES.includes(status) || typeof previewVisible !== 'boolean') {
    return json({ ok: false, reasonCode: 'SERVICE_STATUS_INVALID' }, 400);
  }
  const existing = await env.CARE_DB.prepare('SELECT service_id FROM service_status WHERE service_id = ?').bind(serviceId).first();
  if (!existing) return json({ ok: false, reasonCode: 'SERVICE_UNKNOWN' }, 404);
  if (serviceId.startsWith('activity:') && status === 'open') {
    const ready = await env.CARE_DB.prepare('SELECT content_available FROM activities WHERE id = ?').bind(serviceId.slice(9)).first();
    if (ready?.content_available !== 1) return json({ ok: false, reasonCode: 'CONTENT_NOT_READY' }, 409);
  }
  await env.CARE_DB.prepare('UPDATE service_status SET status = ?, preview_visible = ?, updated_at = ?, updated_by = ? WHERE service_id = ?')
    .bind(status, Number(previewVisible), Date.now(), typeof body.actor === 'string' ? body.actor.slice(0, 64) : null, serviceId).run();
  return json({ ok: true, serviceId, status, previewVisible });
}
