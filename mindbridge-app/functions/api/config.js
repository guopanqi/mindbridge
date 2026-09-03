import { json } from './_lib/http.js';

export function onRequestGet({ env }) {
  if (!env.DINGTALK_CLIENT_ID || !env.DINGTALK_CORP_ID) {
    return json({ message: '应用客户端配置缺失', reasonCode: 'APP_CONFIGURATION_MISSING' }, 503);
  }
  return json({ clientId: env.DINGTALK_CLIENT_ID, corpId: env.DINGTALK_CORP_ID });
}
