import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { onRequestPost } from '../functions/api/auth/healer.js';

function d1(db) {
  return {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) { args = values; return this; },
        async first() { return db.prepare(sql).get(...args) || null; },
        async run() { return db.prepare(sql).run(...args); },
      };
    },
  };
}

test('预置的全局疗愈师以唯一登录名进入，旧密钥与邀请码不再有效', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/staff/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  }
  const now = Date.now();
  db.prepare(`INSERT INTO staff
    (staff_id, tenant_id, display_name, login_name, roles, auth_method, status, created_at, updated_at)
    VALUES (?, 'external', ?, ?, 'healer', 'name_login', 'active', ?, ?)`).run('stf_test', '李佳', '李佳', now, now);
  const env = { STAFF_DB: d1(db), STAFF_SESSION_TTL_SECONDS: '3600' };
  const login = (body) => onRequestPost({
    request: new Request('https://example.test/api/auth/healer', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    }), env,
  });
  const success = await login({ username: '李佳' });
  assert.equal(success.status, 200);
  assert.equal((await success.json()).displayName, '李佳');
  assert.match(success.headers.get('set-cookie'), /^__Host-mb_staff=/);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM staff_sessions').get().n, 1);
  assert.equal((await login({ accessKey: 'old-key' })).status, 400);
  assert.equal((await login({ accessCode: 'old-code' })).status, 400);
  assert.equal((await login({ username: '不存在' })).status, 401);
  assert.throws(() => db.prepare(`INSERT INTO staff
    (staff_id, tenant_id, display_name, login_name, roles, auth_method, status, created_at, updated_at)
    VALUES ('duplicate', 'external', '另一个人', '李佳', 'healer', 'name_login', 'active', ?, ?)`).run(now, now));
});
