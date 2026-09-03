import { json } from './_lib/http.js';

export async function onRequestGet({ env }) {
  const anonVersion = env.ANON_KEY_VERSION || 'v1';
  const encryptionVersion = env.IDENTITY_ENCRYPTION_KEY_VERSION || 'v1';
  const contentVersion = env.CARE_CONTENT_KEY_VERSION || 'v1';
  const requiredConfig = [
    'DINGTALK_CLIENT_ID',
    'DINGTALK_APP_SECRET',
    'DINGTALK_CORP_ID',
    `ANON_HMAC_KEY_${anonVersion.toUpperCase()}`,
    'SUBJECT_LOOKUP_KEY_V1',
    `IDENTITY_ENCRYPTION_KEY_${encryptionVersion.toUpperCase()}`,
    `CARE_CONTENT_KEY_${contentVersion.toUpperCase()}`,
  ];
  const missing = requiredConfig.filter((name) => !env[name]);
  const databases = { identity: false, care: false };
  try {
    await env.IDENTITY_DB.prepare('SELECT 1').first();
    databases.identity = true;
  } catch {
    console.error(JSON.stringify({ event: 'health_check_failed', dependency: 'IDENTITY_DB' }));
  }
  try {
    await env.CARE_DB.prepare('SELECT 1').first();
    databases.care = true;
  } catch {
    console.error(JSON.stringify({ event: 'health_check_failed', dependency: 'CARE_DB' }));
  }
  const ok = missing.length === 0 && databases.identity && databases.care;
  return json(
    { ok, service: 'mindbridge-stage-2', databases, missingConfig: missing },
    ok ? 200 : 503
  );
}
