import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { handleInbound, clearConversation } from '../functions/api/_lib/conversation/service.js';
import { withConversationLock } from '../functions/api/_lib/conversation/lock.js';
import { onRequestPost as bot } from '../functions/api/internal/bot.js';

function database(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  for (const name of readdirSync(new URL('../migrations/care/', import.meta.url)).filter(n => n.endsWith('.sql')).sort()) {
    sqlite.exec(readFileSync(new URL(`../migrations/care/${name}`, import.meta.url), 'utf8'));
  }
  const CARE_DB = {
    prepare(sql) {
      let args = [];
      const stmt = {
        bind(...values) { args = values; return stmt; },
        async first() { return sqlite.prepare(sql).get(...args) || null; },
        async all() { return { results: sqlite.prepare(sql).all(...args) }; },
        async run() { const r = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return stmt;
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const out = []; for (const s of statements) out.push(await s.run()); sqlite.exec('COMMIT'); return out; }
      catch (e) { sqlite.exec('ROLLBACK'); throw e; }
    },
  };
  return { sqlite, env: { CARE_DB, CARE_CONTENT_KEY_V1: Buffer.alloc(32, 7).toString('base64url'), MODEL_API_ORIGIN: 'https://fixture.invalid', MODEL_API_KEY: 'fixture', MODEL_NAME: 'fixture' } };
}

test('两个入口共享会话；机器人重投不生成第二次；清空后重投不会恢复内容', async t => {
  const { sqlite, env } = database(t);
  let calls = 0;
  const channels = [];
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    calls++;
    channels.push(JSON.parse(JSON.parse(init.body).input).context.channel);
    return new Response(JSON.stringify({ output_text: JSON.stringify({
      reply: { text: '测试回复' }, supportAssessment: { level: 'blue', confidence: 1, safetyStatus: 'not_indicated', evidence: [] },
      statePatch: { addTopics: [], removeTopics: [], setEmotion: null, addOpenLoops: [], closeOpenLoops: [] }, toolCall: null,
    }) }));
  });
  await handleInbound({ env, anonId: 'test', text: '第一轮', channel: 'h5' });
  const args = { env, anonId: 'test', text: '第二轮', channel: 'dingtalk', requestKey: 'message-1', fingerprint: 'fingerprint' };
  const first = await handleInbound(args);
  assert.deepEqual(await handleInbound(args), first);
  assert.equal(calls, 2);
  assert.deepEqual(channels, ['h5', 'dingtalk']);
  assert.equal(sqlite.prepare('SELECT count(*) n FROM conversations').get().n, 1);
  assert.equal(sqlite.prepare('SELECT revision FROM conversation_state').get().revision, 2);
  assert.equal(sqlite.prepare('SELECT count(*) n FROM messages').get().n, 4);
  assert.ok(!sqlite.prepare('SELECT response_cipher FROM inbound_messages').get().response_cipher.includes('测试回复'));
  await assert.rejects(handleInbound({ ...args, fingerprint: 'other' }), { code: 'INBOUND_CONFLICT' });
  await clearConversation(env, 'test');
  await assert.rejects(handleInbound(args), { code: 'INBOUND_CLEARED' });
  assert.equal(calls, 2);
});

test('同一身份并发请求被拒绝；过期持有者无法写入', async t => {
  const { sqlite, env } = database(t);
  await withConversationLock(env, 'test', async ({ fence }) => {
    await assert.rejects(withConversationLock(env, 'test', async () => {}), { code: 'CONVERSATION_BUSY' });
    sqlite.prepare('UPDATE conversation_locks SET expires_at=0').run();
    await assert.rejects(env.CARE_DB.batch([fence()]), /NOT NULL/);
  });
});

test('机器人未配置认证时拒绝且不触碰身份库', async () => {
  const result = await bot({ request: new Request('https://example.test/api/internal/bot', { method: 'POST', body: '{}' }), env: {} });
  assert.equal(result.status, 401);
});
