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
  assert.equal(report.tenant.kind, 'enterprise');

  const open = await onRequestGet({
    request: new Request('https://example.test/api/internal/metrics?days=7&organizationId=org_open', { headers: { authorization: `Bearer ${token}` } }),
    env: { CARE_DB, INTERNAL_SERVICE_TOKEN: token, DINGTALK_ORG_ID: 'org_enterprise_primary' },
  });
  assert.equal(open.status, 200);
  const openReport = await open.json();
  assert.equal(openReport.coverage.activeUsers.value, 10);
  assert.equal(openReport.liveEventCount, 10);
  assert.equal(openReport.tenant.name, 'org_open');
  assert.equal(openReport.tenant.kind, 'beta');
});

test('演示数据只属于公开组织，企业不能读取旧的全局种子', async (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) sqlite.exec(readFileSync(new URL(f, dir), 'utf8'));
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  for (const [org, kind] of [['org_enterprise_primary', 'enterprise'], ['org_open', 'beta']]) {
    sqlite.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,?,'active',?,?)")
      .run(org, org, kind, now, now);
  }
  const put = (id, org) => sqlite.prepare(
    "INSERT INTO aggregate_events(id,event_type,level,bucket_day,created_at,data_origin,organization_id) VALUES (?,'chat_message','green',?,?,'demo_seed',?)"
  ).run(id, day, now, org);
  for (let i = 0; i < 5; i++) put(`agg_legacy_${i}`, null);
  for (let i = 0; i < 3; i++) put(`agg_ent_${i}`, 'org_enterprise_primary');
  for (let i = 0; i < 4; i++) put(`agg_beta_${i}`, 'org_open');
  const CARE_DB = {
    prepare(sql) {
      let args = [];
      return { bind(...v) { args = v; return this; }, async first() { return sqlite.prepare(sql).get(...args) || null; }, async all() { return { results: sqlite.prepare(sql).all(...args) }; } };
    },
  };
  const token = 'x'.repeat(40);
  const env = { CARE_DB, INTERNAL_SERVICE_TOKEN: token, DINGTALK_ORG_ID: 'org_enterprise_primary' };
  const ent = await onRequestGet({
    request: new Request('https://example.test/api/internal/metrics?days=7&origin=demo_seed', { headers: { authorization: `Bearer ${token}` } }),
    env,
  });
  assert.equal(ent.status, 404);
  const beta = await (await onRequestGet({
    request: new Request('https://example.test/api/internal/metrics?days=7&origin=demo_seed&organizationId=org_open', { headers: { authorization: `Bearer ${token}` } }),
    env,
  })).json();
  assert.equal(beta.origins.demo_seed.eventCount, 4);
  assert.equal(beta.tenant.name, 'org_open');
  assert.equal(beta.tenant.kind, 'beta');
});

test('评审假号改标为演示数据，真实参与者保持 live', (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter((name) => name.endsWith('.sql') && name < '0029_review_seed_origin.sql')) {
    sqlite.exec(readFileSync(new URL(f, dir), 'utf8'));
  }
  const reviewOrg = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e';
  const now = Date.now();
  sqlite.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,'评审体验组','beta','active',?,?)")
    .run(reviewOrg, now, now);
  for (const anon of ['rvseed_001', 'real_reviewer']) {
    sqlite.prepare("INSERT INTO subject_organizations(anon_id,organization_id,entry_channel,created_at,last_seen_at) VALUES (?,?,'beta_web',?,?)")
      .run(anon, reviewOrg, now, now);
    sqlite.prepare("INSERT INTO messages(id,conversation_id,anon_id,role,body_cipher,content_key_version,created_at,data_origin) VALUES (?,?,?,'user','cipher','v1',?,'live')")
      .run(`msg_${anon}`, `conv_${anon}`, anon, now);
  }
  const day = new Date(now).toISOString().slice(0, 10);
  for (const id of ['agg_rv00001', 'agg_real']) {
    sqlite.prepare("INSERT INTO aggregate_events(id,event_type,level,bucket_day,created_at,data_origin,organization_id) VALUES (?,'chat_message','green',?,?,'live',?)")
      .run(id, day, now, reviewOrg);
  }
  sqlite.exec(readFileSync(new URL('0029_review_seed_origin.sql', dir), 'utf8'));
  assert.equal(sqlite.prepare("SELECT data_origin FROM messages WHERE anon_id='rvseed_001'").get().data_origin, 'demo_seed');
  assert.equal(sqlite.prepare("SELECT data_origin FROM messages WHERE anon_id='real_reviewer'").get().data_origin, 'live');
  assert.equal(sqlite.prepare("SELECT data_origin FROM aggregate_events WHERE id='agg_rv00001'").get().data_origin, 'demo_seed');
  assert.equal(sqlite.prepare("SELECT data_origin FROM aggregate_events WHERE id='agg_real'").get().data_origin, 'live');
});
