import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { randomToken, sha256Base64Url, toBase64Url } from '../functions/api/_lib/crypto.js';
import { onRequestPost as join } from '../functions/api/auth/invite.js';
import { onRequestGet as sessionGet } from '../functions/api/session.js';
import { onRequestGet as wallGet, onRequestPost as wallPost } from '../functions/api/wall/index.js';
import { onRequestPost as replyPost } from '../functions/api/wall/reply.js';
import { onRequestPost as reactPost } from '../functions/api/wall/react.js';

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

const cookie = (response, name) => {
  const match = response.headers.get('set-cookie')?.match(new RegExp(`${name}=([^;]+)`));
  assert.ok(match, `${name} cookie missing`);
  return `${name}=${match[1]}`;
};
const req = (path, method = 'GET', body = null, cookies = '') => new Request(`https://example.test${path}`, {
  method, headers: { cookie: cookies, ...(body ? { 'content-type': 'application/json' } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

test('邀请身份可续会话，广场在两个公开组织之间严格隔离', async (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) sqlite.exec(readFileSync(new URL(f, dir), 'utf8'));
  const now = Date.now();
  const tokens = [randomToken(), randomToken()];
  for (let i = 0; i < 2; i++) {
    sqlite.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,'beta','active',?,?)")
      .run(`org_${i}`, `组织${i}`, now, now);
    sqlite.prepare('INSERT INTO beta_invites(id,organization_id,token_digest,created_at) VALUES (?,?,?,?)')
      .run(`inv_${i}`, `org_${i}`, await sha256Base64Url(tokens[i]), now);
  }
  const env = { CARE_DB: d1(sqlite), CARE_CONTENT_KEY_V1: toBase64Url(crypto.getRandomValues(new Uint8Array(32))), APP_VERSION: 'test' };

  const joinedA = await join({ request: req('/api/auth/invite', 'POST', { token: tokens[0] }), env });
  const joinedB = await join({ request: req('/api/auth/invite', 'POST', { token: tokens[1] }), env });
  assert.equal(joinedA.status, 200);
  assert.equal(joinedB.status, 200);
  const a = cookie(joinedA, '__Host-mb_session');
  const b = cookie(joinedB, '__Host-mb_session');
  const aDevice = cookie(joinedA, '__Host-mb_device');
  assert.notEqual(a, b);

  const posted = await wallPost({ request: req('/api/wall', 'POST', { text: '今天希望有人听我说说' }, a), env });
  assert.equal(posted.status, 200);
  const postId = (await posted.json()).id;
  const own = await wallGet({ request: req('/api/wall', 'GET', null, a), env });
  const other = await wallGet({ request: req('/api/wall', 'GET', null, b), env });
  assert.equal((await own.json()).posts.length, 1);
  assert.equal((await other.json()).posts.length, 0);
  assert.equal((await replyPost({ request: req('/api/wall/reply', 'POST', { postId, text: '支持你' }, b), env })).status, 404);
  assert.equal((await reactPost({ request: req('/api/wall/react', 'POST', { postId }, b), env })).status, 404);

  const renewed = await sessionGet({ request: req('/api/session', 'GET', null, aDevice), env });
  assert.equal(renewed.status, 200);
  assert.equal((await renewed.json()).organizationId, 'org_0');
  assert.ok(cookie(renewed, '__Host-mb_session'));
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM product_events WHERE event_name='wall_post_created' AND organization_id='org_0'").get().n, 1);
});
