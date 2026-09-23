import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { onRequestPost } from '../functions/api/suggestions.js';
import { sha256Base64Url, toBase64Url } from '../functions/api/_lib/crypto.js';
import { openBody } from '../functions/api/_lib/care.js';

async function fixture() {
  const db = new DatabaseSync(':memory:');
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  }
  const now = Date.now();
  db.prepare('INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run('org_beta_test', '测试组织', 'beta', 'active', now, now);
  db.prepare('INSERT INTO sessions (session_digest, anon_id, expires_at, created_at, last_seen_at, organization_id, entry_channel) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(await sha256Base64Url('test'), 'person', now + 100000, now, now, 'org_beta_test', 'beta_web');
  const env = {
    CARE_CONTENT_KEY_V1: toBase64Url(crypto.getRandomValues(new Uint8Array(32))),
    CARE_CONTENT_KEY_VERSION: 'v1',
    CARE_DB: {
      prepare(sql) {
        let args = [];
        return {
          bind(...values) { args = values; return this; },
          async first() { return db.prepare(sql).get(...args) || null; },
          async run() {
            const result = db.prepare(sql).run(...args);
            return { meta: { changes: result.changes } };
          },
        };
      },
    },
  };
  const post = async (body, cookie = '__Host-mb_session=test') => {
    const response = await onRequestPost({
      env,
      request: new Request('https://example.test/api/suggestions', {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    });
    return { status: response.status, body: await response.json() };
  };
  return { db, env, post };
}

test('已登录参与者可以提交建议，空内容和联系方式会被拒绝', async () => {
  const { db, env, post } = await fixture();
  const saved = await post({ text: '活动页的开始按钮不够明显' });
  assert.equal(saved.status, 200);
  const row = db.prepare('SELECT id, body, content_key_version FROM suggestions').get();
  assert.equal(row.content_key_version, 'v1');
  assert.notEqual(row.body, '活动页的开始按钮不够明显');
  assert.equal(await openBody(env, row.body, row.content_key_version, `care:suggestion:${row.id}`), '活动页的开始按钮不够明显');
  assert.equal((await post({ text: '   ' })).status, 400);
  assert.equal((await post({ text: '请打我 13800138000' })).status, 422);
  assert.equal((await post({}, '')).status, 401);
  db.close();
});

test('短时间连续提交会被拦住', async () => {
  const { db, post } = await fixture();
  for (let i = 0; i < 5; i += 1) assert.equal((await post({ text: `建议 ${i}` })).status, 200);
  const limited = await post({ text: '再来一条' });
  assert.equal(limited.status, 429);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM suggestions').get().n, 5);
  db.close();
});
