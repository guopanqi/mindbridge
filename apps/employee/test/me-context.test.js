import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { randomToken, sha256Base64Url, toBase64Url } from '../functions/api/_lib/crypto.js';
import { onRequestPost as join } from '../functions/api/auth/invite.js';
import { onRequestGet as meGet, onRequestPost as mePost } from '../functions/api/me.js';

function d1(sqlite) {
  return {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) { args = values; return this; },
        async first() { return sqlite.prepare(sql).get(...args) || null; },
        async all() { return { results: sqlite.prepare(sql).all(...args) }; },
        async run() { const r = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const results = []; for (const statement of statements) results.push(await statement.run()); sqlite.exec('COMMIT'); return results; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
}

const req = (path, method = 'GET', body = null, cookies = '') => new Request(`https://example.test${path}`, {
  method, headers: { cookie: cookies, ...(body ? { 'content-type': 'application/json' } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

async function joinedSession(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) sqlite.exec(readFileSync(new URL(f, dir), 'utf8'));
  const now = Date.now();
  sqlite.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,'测试组','beta','active',?,?)")
    .run('org_ctx', now, now);
  const token = randomToken();
  sqlite.prepare('INSERT INTO beta_invites(id,organization_id,token_digest,created_at) VALUES (?,?,?,?)')
    .run('inv_ctx', 'org_ctx', await sha256Base64Url(token), now);
  const env = { CARE_DB: d1(sqlite), CARE_CONTENT_KEY_V1: toBase64Url(crypto.getRandomValues(new Uint8Array(32))), APP_VERSION: 'test' };
  const joined = await join({ request: req('/api/auth/invite', 'POST', { token }), env });
  assert.equal(joined.status, 200);
  const session = joined.headers.get('set-cookie')?.match(/__Host-mb_session=([^;]+)/)?.[0];
  assert.ok(session);
  return { env, session };
}

test('首次进入未决定处境；跳过记为 none 后不再打扰', async (t) => {
  const { env, session } = await joinedSession(t);
  const before = await (await meGet({ request: req('/api/me', 'GET', null, session), env })).json();
  assert.equal(before.contextDecided, false);

  // 客户端「暂不选择」对应服务端 'none'：记为已决定，但不带任何处境含义。
  const skipped = await mePost({ request: req('/api/me', 'POST', { contextTag: 'none' }, session), env });
  assert.equal(skipped.status, 200);
  assert.equal((await skipped.json()).contextDecided, true);

  const after = await (await meGet({ request: req('/api/me', 'GET', null, session), env })).json();
  assert.equal(after.contextDecided, true);
  assert.equal(after.contextTag, 'none');
});

test('未知处境标签仍被拒绝', async (t) => {
  const { env, session } = await joinedSession(t);
  const bad = await mePost({ request: req('/api/me', 'POST', { contextTag: 'boss' }, session), env });
  assert.equal(bad.status, 400);
  const still = await (await meGet({ request: req('/api/me', 'GET', null, session), env })).json();
  assert.equal(still.contextDecided, false);
});
