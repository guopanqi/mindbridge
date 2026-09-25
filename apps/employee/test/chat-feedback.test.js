import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { sha256Base64Url } from '../functions/api/_lib/crypto.js';
import { onRequestGet, onRequestPost } from '../functions/api/chat/feedback.js';

test('聊天满三轮才展示一次反馈，回答后仍显示已提交状态', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) db.exec(readFileSync(new URL(file, dir), 'utf8'));
  const now = Date.now();
  db.prepare("INSERT INTO organizations (id,display_name,kind,status,created_at,updated_at) VALUES ('org_beta_test','测试','beta','active',?,?)").run(now, now);
  db.prepare("INSERT INTO sessions (session_digest,anon_id,organization_id,entry_channel,expires_at,created_at,last_seen_at) VALUES (?,'person','org_beta_test','beta_web',?,?,?)")
    .run(await sha256Base64Url('test'), now + 60000, now, now);
  db.prepare("INSERT INTO conversations (id,anon_id,channel,turn_count,started_at,last_message_at) VALUES ('conv_test','person','h5',2,?,?)").run(now, now);
  db.prepare("INSERT INTO messages (id,conversation_id,anon_id,role,body_cipher,content_key_version,created_at) VALUES ('msg_test','conv_test','person','assistant','test','v1',?)").run(now);
  const env = { APP_VERSION: 'test', CARE_DB: { prepare(sql) { let args = []; return {
    bind(...values) { args = values; return this; },
    async first() { return db.prepare(sql).get(...args) || null; },
    async run() { const result = db.prepare(sql).run(...args); return { meta: { changes: Number(result.changes) } }; },
  }; } } };
  const get = async () => (await onRequestGet({ env, request: new Request('https://example.test/api/chat/feedback', { headers: { cookie: '__Host-mb_session=test' } }) })).json();
  assert.equal((await get()).feedback, null);
  db.prepare("UPDATE conversations SET turn_count=3 WHERE id='conv_test'").run();
  const first = (await get()).feedback;
  assert.ok(first.id);
  assert.equal(first.answer, null);
  assert.equal((await get()).feedback.id, first.id);
  const response = await onRequestPost({ env, request: new Request('https://example.test/api/chat/feedback', { method: 'POST', headers: { cookie: '__Host-mb_session=test', 'content-type': 'application/json' }, body: JSON.stringify({ id: first.id, answer: 'helpful' }) }) });
  assert.equal(response.status, 200);
  assert.equal((await get()).feedback.answer, 'helpful');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM experience_feedback').get().n, 1);
});
