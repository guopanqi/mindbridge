// 「我的」和「我的活动」原本要打 5 个接口才能出内容，每次切页都是 5 次往返。
// 这里把它们的 GET 结果合成一次请求；逻辑不复制一份，直接复用各自的处理器，
// 避免聚合接口和单接口日后各说各话。会话校验由 requireSession 在请求内去重。
import { json } from './_lib/http.js';
import { handleError } from './_lib/care.js';
import { onRequestGet as meGet } from './me.js';
import { onRequestGet as historyGet } from './history.js';
import { onRequestGet as appointmentsGet } from './appointments/index.js';
import { onRequestGet as consentsGet } from './consents.js';
import { onRequestGet as authorizationsGet } from './authorizations.js';

async function readPart(handler, context) {
  const response = await handler(context);
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body?.reasonCode || 'BOOTSTRAP_PART_FAILED');
    error.response = response;
    error.body = body;
    throw error;
  }
  return body;
}

export async function onRequestGet(context) {
  try {
    const [me, history, appointments, consents, authorizations] = await Promise.all([
      readPart(meGet, context),
      readPart(historyGet, context),
      readPart(appointmentsGet, context),
      readPart(consentsGet, context),
      readPart(authorizationsGet, context),
    ]);
    return json({
      ok: true,
      me: {
        displayName: me.displayName,
        contextTag: me.contextTag,
        contextDecided: me.contextDecided,
        firstVisit: me.firstVisit,
      },
      counts: history.counts,
      resources: history.resources,
      retentionDays: history.retentionDays,
      appointments: appointments.appointments,
      healerReferralEnabled: appointments.healerReferralEnabled,
      consents: consents.consents,
      authorizations: authorizations.requests,
    });
  } catch (error) {
    // 任一子接口失败时原样透传它的状态与 reasonCode，前端的会话过期处理才认得出来。
    if (error?.response) return json(error.body, error.response.status);
    return handleError(error, 'bootstrap_read_failed');
  }
}
