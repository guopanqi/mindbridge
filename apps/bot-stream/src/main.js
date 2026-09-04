import { DWClient, TOPIC_ROBOT } from 'dingtalk-stream';
import { Inbox, validateMessage, processOne } from './core.js';

process.umask(0o077);
// The published SDK logs raw network Error objects even with debug:false.
// This dedicated process deliberately reduces third-party warnings to metadata.
console.warn = () => console.info(JSON.stringify({event:'sdk_warning'}));
console.error = () => console.info(JSON.stringify({event:'runtime_error'}));
const required = name => { const value = process.env[name]; if (!value) throw new Error(`MISSING_${name}`); return value; };
const origin = name => { const u = new URL(required(name)); if (u.protocol !== 'https:' || u.username || u.password || u.pathname !== '/' || u.search || u.hash) throw new Error(`INVALID_${name}`); return u.origin; };
const config = { corpId: required('DINGTALK_CORP_ID'), robotCode: required('DINGTALK_ROBOT_CODE'), careOrigin: origin('CARE_API_ORIGIN'), h5Origin: origin('H5_ORIGIN'), relayToken: required('BOT_RELAY_TOKEN') };
const inbox = new Inbox(process.env.BOT_DATA_DIR || './data', required('BOT_INBOX_KEY'));
const client = new DWClient({ clientId: required('DINGTALK_CLIENT_ID'), clientSecret: required('DINGTALK_CLIENT_SECRET'), debug: false, keepAlive: true, subscriptions: [] });
// Same official token endpoint as SDK, with an explicit timeout (published SDK lacks one).
let accessToken, tokenExpires = 0;
config.getAccessToken = async () => {
  if (accessToken && tokenExpires > Date.now()) return accessToken;
  const url = new URL('https://oapi.dingtalk.com/gettoken');
  url.searchParams.set('appkey',required('DINGTALK_CLIENT_ID'));
  url.searchParams.set('appsecret',required('DINGTALK_CLIENT_SECRET'));
  const response = await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('TOKEN_FAILED');
  const data = await response.json();
  if (data.errcode !== 0 || !data.access_token) throw new Error('TOKEN_FAILED');
  accessToken = data.access_token; tokenExpires = Date.now() + Math.max(0,Math.min(Number(data.expires_in)||0,7200)-120)*1000;
  return accessToken;
};
const log = event => console.info(JSON.stringify({event,time:new Date().toISOString()}));
client.registerCallbackListener(TOPIC_ROBOT, frame => {
  let message;
  try { message = validateMessage(JSON.parse(frame.data),config); }
  catch { log('inbound_rejected'); client.socketCallBackResponse(frame.headers.messageId,{errcode:0}); return; }
  try {
    // validateMessage returns null for non 1:1 conversations. Without a log,
    // "never arrived" and "arrived but dropped as group chat" look identical when triaging.
    if (message) inbox.put(message); else log('inbound_ignored_not_direct');
    // Durable insert commits synchronously BEFORE acknowledgement.
    client.socketCallBackResponse(frame.headers.messageId,{errcode:0});
  } catch { log('inbox_write_failed'); /* Leave unacknowledged for server retry. */ }
});
let busy = false, stopped = false, wasConnected = false;
const timer = setInterval(async () => {
  if (client.connected !== wasConnected) {
    wasConnected = client.connected;
    log(wasConnected ? 'stream_connected' : 'stream_disconnected');
  }
  if (busy || stopped) return;
  busy = true;
  try { inbox.prune(); await processOne(inbox,config); }
  catch { log('worker_failed'); }
  finally { busy = false; }
},500);
for (const signal of ['SIGTERM','SIGINT']) process.on(signal,() => {
  stopped = true; clearInterval(timer); client.disconnect();
  // Leave encrypted in-flight records for restart recovery; do not close while processing.
  const drain = setInterval(() => { if (!busy) { clearInterval(drain); inbox.close(); process.exit(0); } },100);
});
await client.connect();
log(client.connected ? 'stream_connected' : 'stream_waiting_for_connection');
wasConnected = client.connected;
