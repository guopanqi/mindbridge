import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

export function webhookUrl(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.hostname !== 'oapi.dingtalk.com' || u.port || u.username || u.password || u.hash || u.pathname !== '/robot/sendBySession') throw new Error('INVALID_WEBHOOK');
  return u.href;
}
export function validateMessage(m, config, now = Date.now()) {
  if (m.conversationType !== '1') return null;
  if (m.senderCorpId !== config.corpId || m.chatbotCorpId !== config.corpId || m.robotCode !== config.robotCode) throw new Error('IDENTITY_MISMATCH');
  if (![m.msgId,m.senderStaffId].every(x => typeof x === 'string' && x.length > 0 && x.length <= 512)) throw new Error('INVALID_ID');
  const text = typeof m.text?.content === 'string' ? m.text.content.trim() : '';
  const localNotice = m.msgtype !== 'text' || !text
    ? '目前机器人只支持文字消息，请发送文字，或打开 MindBridge 工作台继续。'
    : text.length > 800 ? '这条消息超过 800 字，请分成较短的文字发送。原文没有提交到对话服务。' : null;
  const expires = Number(m.sessionWebhookExpiredTime);
  if (!Number.isFinite(expires) || expires <= now) throw new Error('EXPIRED_WEBHOOK');
  return { msgId: m.msgId, staffId: m.senderStaffId, corpId: config.corpId, robotCode: config.robotCode, text: localNotice ? '' : text, ...(localNotice ? {localNotice} : {}), webhook: webhookUrl(m.sessionWebhook), expires };
}
export class Inbox {
  constructor(dir, encodedKey) {
    this.key = Buffer.from(encodedKey || '', 'base64');
    if (this.key.length !== 32) throw new Error('INVALID_INBOX_KEY');
    mkdirSync(dir, { recursive: true, mode: 0o700 }); chmodSync(dir, 0o700);
    const path = join(dir, 'inbox.sqlite');
    this.db = new DatabaseSync(path); chmodSync(path, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS inbox(id TEXT PRIMARY KEY, payload TEXT NOT NULL, result TEXT,
      state TEXT NOT NULL DEFAULT 'received', attempts INTEGER NOT NULL DEFAULT 0,
      next_at INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, last_error TEXT);
      UPDATE inbox SET state = CASE WHEN result IS NULL THEN 'received' ELSE 'generated' END WHERE state='processing';`);
  }
  seal(value, id) {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', this.key, iv);
    cipher.setAAD(Buffer.from(id));
    return Buffer.concat([iv, cipher.update(JSON.stringify(value)), cipher.final(), cipher.getAuthTag()]).toString('base64');
  }
  open(value, id) {
    const b = Buffer.from(value, 'base64'), cipher = createDecipheriv('aes-256-gcm', this.key, b.subarray(0,12));
    cipher.setAAD(Buffer.from(id)); cipher.setAuthTag(b.subarray(-16));
    return JSON.parse(Buffer.concat([cipher.update(b.subarray(12,-16)),cipher.final()]).toString());
  }
  put(payload, now = Date.now()) {
    const id = createHash('sha256').update(payload.corpId + '\0' + payload.msgId).digest('hex');
    this.db.prepare('INSERT OR IGNORE INTO inbox(id,payload,created_at) VALUES(?,?,?)').run(id,this.seal(payload,id),now);
    return id;
  }
  next(now = Date.now()) { return this.db.prepare("SELECT * FROM inbox WHERE state IN ('received','generated') AND next_at<=? ORDER BY created_at LIMIT 1").get(now); }
  generated(id,result) { this.db.prepare("UPDATE inbox SET result=?,state='generated',attempts=0 WHERE id=?").run(this.seal(result,id),id); }
  state(id,state) { this.db.prepare('UPDATE inbox SET state=? WHERE id=?').run(state,id); if (['failed','expired','cleared'].includes(state)) console.info(JSON.stringify({event:'outbox_terminal',id,state})); }
  retry(row, now) {
    const attempts = row.attempts + 1;
    this.db.prepare('UPDATE inbox SET state=?,attempts=?,next_at=?,last_error=? WHERE id=?').run(attempts >= 10 ? 'failed' : row.result ? 'generated' : 'received',attempts,now+Math.min(60000,1000*2**attempts),'REQUEST_FAILED',row.id);
    if (attempts >= 10) console.info(JSON.stringify({event:'outbox_terminal',id:row.id,state:'failed',attempts}));
  }
  prune(now = Date.now()) { this.db.prepare('DELETE FROM inbox WHERE created_at < ?').run(now-86400000); }
  close() { this.db.close(); }
}
const escape = value => String(value || '').replace(/[\\`*_{}\[\]<>]/g,'');
export function renderMessages(messages, h5Origin) {
  const url = new URL(h5Origin);
  return messages.filter(m => m.role !== 'user').map(m => {
    if (typeof m.text === 'string') return escape(m.text);
    if (!m.card) return '';
    const card = m.card;
    if (Array.isArray(card.resources)) return `${card.resources.map(r => `${escape(r.name)}：${escape(r.contact)} ${escape(r.note)}`).join('\n\n')}\n\n${escape(card.disclaimer)}`;
    const link = new URL(url);
    if (card.eventId) link.searchParams.set('eventId',card.eventId);
    return `${escape(card.title || card.name || '支持与活动')}\n\n${escape(card.body || card.description || '')}\n\n[打开 MindBridge 查看并确认](${link.href})`;
  }).filter(Boolean).join('\n\n');
}
export async function processOne(inbox, config, fetchImpl = fetch, now = Date.now()) {
  const row = inbox.next(now); if (!row) return false;
  const payload = inbox.open(row.payload,row.id);
  if (payload.expires <= now) { inbox.state(row.id,'expired'); return true; }
  try {
    let result = row.result ? inbox.open(row.result,row.id) : null;
    const requestCore = async () => {
      const { webhook, expires, localNotice, ...input } = payload;
      return fetchImpl(new URL('/api/internal/bot',config.careOrigin),{method:'POST',redirect:'error',headers:{authorization:`Bearer ${config.relayToken}`,'content-type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(15000)});
    };
    if (payload.localNotice) {
      result = {ok:true,messages:[{role:'assistant',text:payload.localNotice}]};
      if (!row.result) { inbox.generated(row.id,result); row.result = true; }
    } else if (result) {
      // Re-check server tombstone before delayed delivery; endpoint serves cached result.
      const response = await requestCore();
      if (response.status === 410) { inbox.state(row.id,'cleared'); return true; }
      if (!response.ok) throw new Error('CORE_RECHECK_FAILED');
      const cached = await response.json();
      if (cached.ok !== true || !Array.isArray(cached.messages)) throw new Error('INVALID_CORE_RESULT');
    }
    if (!result) {
      inbox.state(row.id,'processing');
      const response = await requestCore();
      if (response.status === 410) { inbox.state(row.id,'cleared'); return true; }
      if (!response.ok) throw new Error('CORE_FAILED');
      result = await response.json();
      if (result.ok !== true || !Array.isArray(result.messages)) throw new Error('INVALID_CORE_RESULT');
      inbox.generated(row.id,result); row.result = true; row.attempts = 0;
    }
    if (payload.expires <= Date.now()) { inbox.state(row.id,'expired'); return true; }
    const body = {msgtype:'markdown',markdown:{title:'MindBridge',text:renderMessages(result.messages,config.h5Origin)}};
    if (!body.markdown.text) throw new Error('EMPTY_RESPONSE');
    const headers = {'content-type':'application/json'};
    if (config.getAccessToken) headers['x-acs-dingtalk-access-token'] = await config.getAccessToken();
    const response = await fetchImpl(webhookUrl(payload.webhook),{method:'POST',redirect:'error',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    if (!response.ok || (await response.json()).errcode !== 0) throw new Error('SEND_FAILED');
    inbox.state(row.id,'sent');
  } catch { inbox.retry(row,Date.now()); }
  return true;
}
