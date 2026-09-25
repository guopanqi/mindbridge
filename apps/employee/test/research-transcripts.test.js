import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { onRequestGet as exportGet } from '../functions/api/internal/research-transcripts.js';
import { encryptText, toBase64Url } from '../functions/api/_lib/crypto.js';

test('原文导出必须有独立令牌和组织能力，且只返回该组织真实消息', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) db.exec(readFileSync(new URL(file, dir), 'utf8'));
  const now = Date.now();
  const key = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  for (const id of ['org_beta_one', 'org_beta_two']) {
    db.prepare("INSERT INTO organizations (id,display_name,kind,status,created_at,updated_at) VALUES (?,?,'beta','active',?,?)").run(id, id, now, now);
  }
  const put = async (org, anon, origin, text) => {
    const conv = `conv_${anon}`;
    const cipher = await encryptText(text, key, `care:message:${conv}`);
    db.prepare("INSERT INTO subject_organizations (anon_id,organization_id,entry_channel,created_at,last_seen_at) VALUES (?,?,'beta_web',?,?)").run(anon, org, now, now);
    db.prepare('INSERT INTO messages (id,conversation_id,anon_id,role,body_cipher,content_key_version,created_at,data_origin) VALUES (?,?,?,?,?,?,?,?)')
      .run(`msg_${anon}`, conv, anon, 'user', cipher, 'v1', now, origin);
  };
  await put('org_beta_one', 'one', 'live', '真实对话');
  await put('org_beta_one', 'seed', 'demo_seed', '演示对话');
  await put('org_beta_two', 'two', 'live', '其他组织对话');
  const env = {
    RESEARCH_EXPORT_TOKEN: 'x'.repeat(40), CARE_CONTENT_KEY_V1: key,
    CARE_DB: { prepare(sql) { let args = []; return {
      bind(...values) { args = values; return this; },
      async first() { return db.prepare(sql).get(...args) || null; },
      async all() { return { results: db.prepare(sql).all(...args) }; },
    }; } },
  };
  const call = async (token) => {
    const request = new Request(`https://example.test/api/internal/research-transcripts?organizationId=org_beta_one&from=${new Date(now).toISOString().slice(0, 10)}&to=${new Date(now).toISOString().slice(0, 10)}`, { headers: { authorization: `Bearer ${token}` } });
    const response = await exportGet({ request, env });
    return { status: response.status, body: await response.json() };
  };
  assert.equal((await call('wrong')).status, 401);
  assert.equal((await call(env.RESEARCH_EXPORT_TOKEN)).status, 403);
  db.prepare("INSERT INTO organization_capabilities (organization_id,capability,enabled,updated_at) VALUES ('org_beta_one','research_transcript_export',1,?)").run(now);
  const allowed = await call(env.RESEARCH_EXPORT_TOKEN);
  assert.equal(allowed.status, 200);
  assert.equal(allowed.body.rows.length, 1);
  assert.match(allowed.body.rows[0], /真实对话/);
  assert.doesNotMatch(allowed.body.rows[0], /演示对话|其他组织对话/);
});
