import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { activitySql, catalogSql } from '../scripts/activity-content.mjs';
import { randomToken, sha256Base64Url } from '../functions/api/_lib/crypto.js';
import { readOrganizationConfig, updateOrganizationConfig } from '../functions/api/_lib/organization-config.js';
import { searchActivities, executeTool } from '../functions/api/_lib/harness/tools.js';

function d1(db) {
  return {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) { args = values; return this; },
        async first() { return db.prepare(sql).get(...args) || null; },
        async all() { return { results: db.prepare(sql).all(...args) }; },
        async run() { const result = db.prepare(sql).run(...args); return { meta: { changes: Number(result.changes) } }; },
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try { const rows = []; for (const statement of statements) rows.push(await statement.run()); db.exec('COMMIT'); return rows; }
      catch (error) { db.exec('ROLLBACK'); throw error; }
    },
  };
}

test('公开组织配置只影响本组织，且不能启用钉钉感知', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) db.exec(readFileSync(new URL(file, dir), 'utf8'));
  const now = Date.now();
  for (const id of ['org_beta_a', 'org_beta_b']) db.prepare(
    "INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,'beta','active',?,?)"
  ).run(id, id, now, now);
  const source = JSON.parse(readFileSync(new URL('../content/activities/breathing.json', import.meta.url)));
  for (const activity of [source, { ...source, id: 'second-l1', title: '第二个自助活动', level: 'L1' }]) {
    db.exec(activitySql(activity));
    db.exec(catalogSql({ name: activity.title, activityId: activity.id }));
  }
  const env = { CARE_DB: d1(db) };
  const disable = await updateOrganizationConfig(env, 'org_beta_a', { kind: 'activity', activityId: 'breathing', enabled: false }, 'test');
  assert.equal(disable.status, 200);
  assert.equal((await searchActivities(env, { query: '呼吸' }, { organizationId: 'org_beta_a' })).activities.some((x) => x.id === 'breathing'), false);
  assert.equal((await searchActivities(env, { query: '呼吸' }, { organizationId: 'org_beta_b' })).activities.some((x) => x.id === 'breathing'), true);
  const mapping = await updateOrganizationConfig(env, 'org_beta_a', { kind: 'matrix', emotion: '焦虑', l1ActivityId: 'second-l1' }, 'test');
  assert.equal(mapping.status, 200);
  const a = await readOrganizationConfig(env, 'org_beta_a');
  const b = await readOrganizationConfig(env, 'org_beta_b');
  assert.equal(a.matrix.find((x) => x.emotion === '焦虑').l1.activityId, 'second-l1');
  assert.equal(b.matrix.find((x) => x.emotion === '焦虑').l1.activityId, 'breathing');
  const recommended = await executeTool(env, { name: 'search_activities', arguments: { query: '焦虑' } },
    { organizationId: 'org_beta_a', emotion: '焦虑', level: 'green' });
  assert.equal(recommended.activities[0]?.id, 'second-l1');
  const forbidden = await updateOrganizationConfig(env, 'org_beta_a', { kind: 'sensing', key: 'attendance_off_duty', enabled: true }, 'test');
  assert.equal(forbidden.status, 400);
});

test('行业模板：工作人员可改、企业端可套用，缺失活动整行跳过', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) db.exec(readFileSync(new URL(file, dir), 'utf8'));
  const now = Date.now();
  for (const id of ['org_beta_a', 'org_beta_b']) db.prepare(
    "INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,'beta','active',?,?)"
  ).run(id, id, now, now);
  const source = JSON.parse(readFileSync(new URL('../content/activities/breathing.json', import.meta.url)));
  for (const activity of [
    { ...source, id: 'tpl-l1', title: '模板自助活动', level: 'L1' },
    { ...source, id: 'tpl-l2', title: '模板线下小组', level: 'L2' },
  ]) {
    db.exec(activitySql(activity));
    db.exec(catalogSql({ name: activity.title, activityId: activity.id }));
  }
  const env = { CARE_DB: d1(db) };
  // 非工作人员不能改模板。
  const forbidden = await updateOrganizationConfig(env, 'org_beta_a',
    { kind: 'save_template', industry: '互联网/IT', emotion: '焦虑', l1ActivityId: 'tpl-l1', l2ActivityId: 'tpl-l2' }, 'test');
  assert.equal(forbidden.status, 403);
  // 工作人员改一行模板。
  const saved = await updateOrganizationConfig(env, 'org_beta_a',
    { kind: 'save_template', industry: '互联网/IT', emotion: '焦虑', l1ActivityId: 'tpl-l1', l2ActivityId: 'tpl-l2' }, 'stf_internal_test_org');
  assert.equal(saved.status, 200);
  const unknownEmotion = await updateOrganizationConfig(env, 'org_beta_a',
    { kind: 'save_template', industry: '互联网/IT', emotion: '不存在', l1ActivityId: 'tpl-l1' }, 'stf_internal_test_org');
  assert.equal(unknownEmotion.status, 404);
  // 模板随配置下发（含行业疗愈目标）。
  const config = await readOrganizationConfig(env, 'org_beta_a');
  assert.equal(config.industryTemplates['互联网/IT'].find((x) => x.emotion === '焦虑').l2ActivityId, 'tpl-l2');
  assert.match(config.industryGoals['互联网/IT'], /掌控时间/);
  // 企业端套用：只写本组织，未列出的情绪保持现状。
  const applied = await updateOrganizationConfig(env, 'org_beta_a', { kind: 'apply_template', industry: '互联网/IT' }, 'stf_org_x');
  assert.equal(applied.status, 200);
  assert.ok(applied.body.applied.includes('焦虑'));
  const a = await readOrganizationConfig(env, 'org_beta_a');
  const b = await readOrganizationConfig(env, 'org_beta_b');
  assert.equal(a.matrix.find((x) => x.emotion === '焦虑').l2.activityId, 'tpl-l2');
  assert.notEqual(b.matrix.find((x) => x.emotion === '焦虑').l2.activityId, 'tpl-l2');
  // 模板引用到已退役活动时：保存侧直接拒绝，套用侧整行跳过并如实报告。
  const badSave = await updateOrganizationConfig(env, 'org_beta_a',
    { kind: 'save_template', industry: '互联网/IT', emotion: '疲惫', l1ActivityId: 'gone', l2ActivityId: 'tpl-l2' }, 'stf_internal_test_org');
  assert.equal(badSave.status, 400);
  db.prepare("UPDATE industry_matrix_templates SET l1_activity_id='gone' WHERE industry='互联网/IT' AND emotion='疲惫'").run();
  const partial = await updateOrganizationConfig(env, 'org_beta_b', { kind: 'apply_template', industry: '互联网/IT' }, 'stf_org_y');
  assert.equal(partial.status, 200);
  assert.ok(partial.body.skipped.includes('疲惫'));
  assert.ok(!partial.body.applied.includes('疲惫'));
  // 未知模板名如实 404。
  const unknown = await updateOrganizationConfig(env, 'org_beta_a', { kind: 'apply_template', industry: '不存在' }, 'stf_org_x');
  assert.equal(unknown.status, 404);
});

test('内部接口按 organizationId 读写公开组织配置，且不能开钉钉感知', async (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) db.exec(readFileSync(new URL(file, dir), 'utf8'));
  const now = Date.now();
  db.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,'公开甲','beta','active',?,?)")
    .run('org_beta_a', now, now);
  const source = JSON.parse(readFileSync(new URL('../content/activities/breathing.json', import.meta.url)));
  db.exec(activitySql(source));
  db.exec(catalogSql({ name: source.title, activityId: source.id }));
  const token = 'y'.repeat(40);
  const env = { CARE_DB: d1(db), INTERNAL_SERVICE_TOKEN: token, DINGTALK_ORG_ID: 'org_enterprise_primary' };
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const { onRequestGet: configGet, onRequestPut: configPut } = await import('../functions/api/internal/config.js');
  const { onRequestPost: orgAdmin } = await import('../functions/api/internal/org-admin.js');
  const before = await configGet({
    request: new Request('https://example.test/api/internal/config?organizationId=org_beta_a', { headers }),
    env,
  });
  assert.equal(before.status, 200);
  assert.equal((await before.json()).organization.id, 'org_beta_a');
  const disable = await configPut({
    request: new Request('https://example.test/api/internal/config?organizationId=org_beta_a', {
      method: 'PUT', headers, body: JSON.stringify({ kind: 'activity', activityId: 'breathing', enabled: false }),
    }),
    env,
  });
  assert.equal(disable.status, 200);
  const sensing = await configPut({
    request: new Request('https://example.test/api/internal/config?organizationId=org_beta_a', {
      method: 'PUT', headers, body: JSON.stringify({ kind: 'sensing', key: 'attendance_off_duty', enabled: true }),
    }),
    env,
  });
  assert.equal(sensing.status, 400);
  const adminToken = randomToken();
  db.prepare('INSERT INTO beta_admin_credentials(organization_id,token_digest,created_at) VALUES (?,?,?)')
    .run('org_beta_a', await sha256Base64Url(adminToken), now);
  const exchanged = await orgAdmin({
    request: new Request('https://example.test/api/internal/org-admin', {
      method: 'POST', headers, body: JSON.stringify({ token: adminToken }),
    }),
    env,
  });
  assert.equal(exchanged.status, 200);
  assert.equal((await exchanged.json()).organization.id, 'org_beta_a');
});
