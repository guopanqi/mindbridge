import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { onRequestGet } from '../functions/api/internal/metrics.js';

test('企业报表只计本企业，公开组织数据不混入', async (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) sqlite.exec(readFileSync(new URL(f, dir), 'utf8'));
  const now = Date.now();
  for (const [org, kind] of [['org_enterprise_primary', 'enterprise'], ['org_open', 'beta']]) {
    sqlite.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,?,'active',?,?)")
      .run(org, org, kind, now, now);
    for (let i = 0; i < 10; i++) {
      const anon = `${org}_${i}`;
      sqlite.prepare('INSERT INTO subject_organizations(anon_id,organization_id,entry_channel,created_at,last_seen_at) VALUES (?,?,?,?,?)')
        .run(anon, org, kind === 'enterprise' ? 'dingtalk' : 'beta_web', now, now);
      sqlite.prepare("INSERT INTO messages(id,conversation_id,anon_id,role,body_cipher,content_key_version,created_at,data_origin) VALUES (?,?,?,'user','cipher','v1',?,'live')")
        .run(`msg_${anon}`, `conv_${anon}`, anon, now);
      sqlite.prepare("INSERT INTO aggregate_events(id,event_type,level,bucket_day,created_at,data_origin,organization_id) VALUES (?,'chat_message','green',? ,?,'live',?)")
        .run(`agg_${anon}`, new Date(now).toISOString().slice(0, 10), now, org);
    }
  }
  const CARE_DB = {
    prepare(sql) {
      let args = [];
      return { bind(...v) { args = v; return this; }, async first() { return sqlite.prepare(sql).get(...args) || null; }, async all() { return { results: sqlite.prepare(sql).all(...args) }; } };
    },
  };
  const token = 'x'.repeat(40);
  const response = await onRequestGet({
    request: new Request('https://example.test/api/internal/metrics?days=7', { headers: { authorization: `Bearer ${token}` } }),
    env: { CARE_DB, INTERNAL_SERVICE_TOKEN: token, DINGTALK_ORG_ID: 'org_enterprise_primary' },
  });
  assert.equal(response.status, 200);
  const report = await response.json();
  assert.equal(report.coverage.activeUsers.value, 10);
  assert.equal(report.liveEventCount, 10);
  assert.equal(report.tenant.name, 'org_enterprise_primary');
});
