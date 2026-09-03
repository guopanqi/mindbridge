import { json } from './_lib/http.js';

export async function onRequestGet({ env }) {
  const subjectVersion = env.STAFF_SUBJECT_KEY_VERSION || 'v1';
  const required = [
    'DINGTALK_CORP_ID',
    'DINGTALK_SSO_SECRET',
    'STAFF_LOOKUP_KEY_V1',
    `STAFF_SUBJECT_KEY_${subjectVersion.toUpperCase()}`,
    'INTERNAL_SERVICE_TOKEN',
    'CARE_API_ORIGIN',
  ];
  const missing = required.filter((name) => !env[name]);
  let staffDb = false;
  try {
    await env.STAFF_DB.prepare('SELECT 1').first();
    staffDb = true;
  } catch {
    console.error(JSON.stringify({ event: 'health_check_failed', dependency: 'STAFF_DB' }));
  }
  // 确认 console 没有拿到 care 数据库 binding —— 这是架构约束，不是可选项。
  const careBindingAbsent = typeof env.CARE_DB === 'undefined';
  const ok = missing.length === 0 && staffDb && careBindingAbsent;
  return json({
    ok,
    service: 'mindbridge-console',
    staffDb,
    careBindingAbsent,
    missingConfig: missing,
  }, ok ? 200 : 503);
}
