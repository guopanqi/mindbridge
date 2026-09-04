import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Inbox, validateMessage, webhookUrl, processOne, renderMessages } from '../src/core.js';
const config = {corpId:'corp',robotCode:'robot',careOrigin:'https://care.example',h5Origin:'https://care.example',relayToken:'test'};
const message = () => ({conversationType:'1',msgtype:'text',senderCorpId:'corp',chatbotCorpId:'corp',robotCode:'robot',senderStaffId:'staff',msgId:'msg',text:{content:'private-test-content'},sessionWebhook:'https://oapi.dingtalk.com/robot/sendBySession?session=secret',sessionWebhookExpiredTime:Date.now()+600000});
test('only private text; exact corporate identity and official webhook',() => {
  assert.equal(validateMessage({...message(),conversationType:'2'},config),null);
  assert.throws(() => validateMessage({...message(),senderCorpId:'other'},config));
  assert.throws(() => validateMessage({...message(),senderStaffId:null},config));
  for (const url of ['http://oapi.dingtalk.com/robot/sendBySession','https://oapi.dingtalk.com.evil/robot/sendBySession','https://oapi.dingtalk.com/robot/send','https://u:p@oapi.dingtalk.com/robot/sendBySession']) assert.throws(() => webhookUrl(url));
});
test('encrypted durable inbox, dedup, generation cached across send failure and restart',async () => {
  const dir = mkdtempSync(join(tmpdir(),'mb-stream-')), key = Buffer.alloc(32,1).toString('base64');
  let inbox = new Inbox(dir,key), calls = 0;
  try {
    const payload = validateMessage(message(),config);
    const id = inbox.put(payload); assert.equal(inbox.put(payload),id);
    await processOne(inbox,config,async url => { calls++; if (String(url).includes('/api/internal/bot')) return Response.json({ok:true,messages:[{role:'assistant',text:'reply'}]}); throw new Error('network'); });
    assert.equal(calls,2); assert.equal(inbox.db.prepare('SELECT state FROM inbox').get().state,'generated');
    inbox.close(); inbox = new Inbox(dir,key);
    inbox.db.prepare('UPDATE inbox SET next_at=0').run();
    await processOne(inbox,config,async url => String(url).includes('/api/internal/bot') ? Response.json({ok:true,messages:[{role:'assistant',text:'reply'}]}) : Response.json({errcode:0}));
    assert.equal(inbox.db.prepare('SELECT state FROM inbox').get().state,'sent');
    inbox.close(); inbox = null;
    assert.equal(readFileSync(join(dir,'inbox.sqlite')).includes(Buffer.from('private-test-content')),false);
  } finally { inbox?.close(); rmSync(dir,{recursive:true,force:true}); }
});
test('cards link to authenticated H5, never authorize',() => {
  const text = renderMessages([{role:'assistant',card:{title:'预约',eventId:'a&b'}}],config.h5Origin);
  assert.match(text,/eventId=a%26b/); assert.match(text,/查看并确认/);
});
test('delayed generated reply respects clear tombstone; long and unsupported messages get bounded notice',async () => {
  const dir = mkdtempSync(join(tmpdir(),'mb-stream-')), inbox = new Inbox(dir,Buffer.alloc(32,3).toString('base64'));
  try {
    const id = inbox.put(validateMessage(message(),config));
    inbox.generated(id,{ok:true,messages:[{role:'assistant',text:'sensitive reply'}]});
    let count = 0;
    await processOne(inbox,config,async url => { count++; assert.match(String(url),/internal\/bot/); return new Response(null,{status:410}); });
    assert.equal(count,1); assert.equal(inbox.db.prepare('SELECT state FROM inbox').get().state,'cleared');
    const long = validateMessage({...message(),msgId:'long',text:{content:'x'.repeat(801)}},config);
    assert.equal(long.text,''); assert.match(long.localNotice,/800/); inbox.put(long);
    await processOne(inbox,config,async url => { assert.match(String(url),/oapi/); return Response.json({errcode:0}); });
    assert.ok(validateMessage({...message(),msgtype:'picture'},config).localNotice);
  } finally { inbox.close(); rmSync(dir,{recursive:true,force:true}); }
});
test('cleared message is terminal and never delivered; crisis contacts survive rendering',async () => {
  const dir = mkdtempSync(join(tmpdir(),'mb-stream-')), inbox = new Inbox(dir,Buffer.alloc(32,2).toString('base64'));
  try {
    inbox.put(validateMessage(message(),config));
    await processOne(inbox,config,async () => new Response(null,{status:410}));
    assert.equal(inbox.db.prepare('SELECT state FROM inbox').get().state,'cleared');
    assert.equal(inbox.next(),undefined);
    assert.match(renderMessages([{role:'crisis',card:{resources:[{name:'热线',contact:'12356'}],disclaimer:'由你决定'}}],config.h5Origin),/12356/);
  } finally { inbox.close(); rmSync(dir,{recursive:true,force:true}); }
});
test('ten failed attempts become observable terminal state rather than silently retry forever',() => {
  const dir = mkdtempSync(join(tmpdir(),'mb-stream-')), inbox = new Inbox(dir,Buffer.alloc(32,4).toString('base64'));
  try {
    const id = inbox.put(validateMessage(message(),config));
    inbox.retry({id,attempts:9,result:null},Date.now());
    const row = inbox.db.prepare('SELECT state,attempts,last_error FROM inbox WHERE id=?').get(id);
    assert.equal(row.state,'failed'); assert.equal(row.attempts,10); assert.equal(row.last_error,'REQUEST_FAILED');
    assert.equal(inbox.next(Date.now()+999999),undefined);
  } finally { inbox.close(); rmSync(dir,{recursive:true,force:true}); }
});
