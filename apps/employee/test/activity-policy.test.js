import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { activitySql, catalogSql } from '../scripts/activity-content.mjs';
import { executeTool } from '../functions/api/_lib/harness/tools.js';
import { onRequestGet as resourcesGet, onRequestPost as resourcesPost } from '../functions/api/resources.js';
import { onRequestGet as configGet, onRequestPut as configPut } from '../functions/api/internal/config.js';
import { sha256Base64Url } from '../functions/api/_lib/crypto.js';

// Real SQLite adapter: executes production SQL; no matching SQL strings or canned results.
async function setup(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const migrations = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(migrations).sort().filter(f => f.endsWith('.sql') && f <= '0019_activity_policy.sql')) {
    db.exec(readFileSync(new URL(file, migrations), 'utf8'));
  }
  const sample = JSON.parse(readFileSync(new URL('../content/activities/breathing.json', import.meta.url)));
  const docs = [
    { ...sample, id: 'custom-l1', title: '文字灯塔练习', level: 'L1' },
    { ...sample, id: 'custom-l2', title: '深入灯塔练习', level: 'L2' },
    { ...sample, id: 'draft', title: '尚未开放的灯塔', available: false },
  ];
  for (const a of docs) { db.exec(activitySql(a)); db.exec(catalogSql({ name: `资源-${a.id}`, activityId: a.id })); }
  db.exec("INSERT INTO intervention_matrix (emotion,l1_name,l2_name,updated_at) VALUES ('焦虑','旧L1展示名','旧L2展示名',0)");
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?, ?)').run(await sha256Base64Url('policy-test'), 'person', Date.now() + 60000, 0, 0);
  const env = {
    INTERNAL_SERVICE_TOKEN: 'policy-test-internal-token-32-chars',
    CARE_DB: {
      prepare(sql) {
        let args = [];
        return { bind(...values) { args = values; return this; },
          async first() { return db.prepare(sql).get(...args) || null; },
          async all() { return { results: db.prepare(sql).all(...args) }; },
          async run() { const result = db.prepare(sql).run(...args); return { success: true, meta: { changes: Number(result.changes) } }; },
        };
      },
      async batch(statements) {
        db.exec('BEGIN');
        try { const results = []; for (const s of statements) results.push(await s.run()); db.exec('COMMIT'); return results; }
        catch (error) { db.exec('ROLLBACK'); throw error; }
      },
    },
  };
  const invoke = async (handler, method, body, internal = false) => {
    const headers = internal ? { authorization: `Bearer ${env.INTERNAL_SERVICE_TOKEN}` } : { cookie: '__Host-mb_session=policy-test' };
    const response = await handler({ env, request: new Request('https://example.test/api/test', { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) }) });
    return { status: response.status, body: await response.json() };
  };
  const put = body => invoke(configPut, 'PUT', body, true);
  const recommend = assessment => executeTool(env, { name: 'search_activities', arguments: { query: '灯塔', limit: 3 } }, assessment);
  return { db, docs, env, invoke, put, recommend };
}

test('HR 启停立即同时约束资源浏览、自主选择和 Harness 推荐', async t => {
  const { put, invoke, recommend } = await setup(t);
  assert.equal((await put({ kind: 'activity', activityId: 'custom-l1', enabled: false })).status, 200);
  assert.ok(!(await invoke(resourcesGet, 'GET')).body.resources.some(a => a.id === 'custom-l1'));
  assert.equal((await invoke(resourcesPost, 'POST', { activityId: 'custom-l1' })).status, 404);
  assert.ok(!(await recommend({})).activities.some(a => a.id === 'custom-l1'));
  assert.equal((await put({ kind: 'activity', activityId: 'custom-l1', enabled: true })).status, 200);
  assert.ok((await invoke(resourcesGet, 'GET')).body.resources.some(a => a.id === 'custom-l1'));
  assert.ok((await recommend({})).activities.some(a => a.id === 'custom-l1'));
  const selection = await invoke(resourcesPost, 'POST', { activityId: 'custom-l1' });
  assert.equal(selection.status, 200);
  assert.equal((await invoke(resourcesPost, 'POST', { activityId: 'custom-l1' })).body.eventId, selection.body.eventId);
});

test('HR 按 activityId 配置；改标题不失联，L1/L2 按风险层级选中', async t => {
  const { put, recommend, db, docs, invoke } = await setup(t);
  assert.equal((await put({ kind: 'matrix', emotion: '焦虑', l1ActivityId: 'custom-l1', l2ActivityId: 'custom-l2', enabled: true })).status, 200);
  db.exec(activitySql({ ...docs[0], title: '全新名字', contentVersion: docs[0].contentVersion + 1 }));
  const blue = await recommend({ emotion: '焦虑', level: 'blue' });
  assert.deepEqual(blue.activities.map(a => a.id), ['custom-l1']);
  assert.equal(blue.activities[0].title, '全新名字');
  assert.equal(blue.activities[0].level, 'L1');
  const yellow = await recommend({ emotion: '焦虑', level: 'yellow' });
  assert.deepEqual(yellow.activities.map(a => a.id), ['custom-l2']);
  assert.equal(yellow.activities[0].level, 'L2');
  const configuration = (await invoke(configGet, 'GET', undefined, true)).body;
  assert.equal(configuration.matrix.find(m => m.emotion === '焦虑').l1.activityId, 'custom-l1');
  assert.ok(configuration.catalog.some(a => a.activityId === 'custom-l1' && a.name === '全新名字'));
  assert.equal((await put({ kind: 'matrix', emotion: '焦虑', l1ActivityId: 'custom-l2' })).status, 400);
});

test('没有配置时文本检索；策略禁用、目录禁用、内容未发布均不推荐', async t => {
  const { put, recommend, invoke, db } = await setup(t);
  assert.deepEqual(new Set((await recommend({})).activities.map(a => a.id)), new Set(['custom-l1', 'custom-l2']));
  assert.equal((await invoke(resourcesPost, 'POST', { activityId: 'draft' })).status, 404);
  assert.equal((await put({ kind: 'matrix', emotion: '焦虑', l1ActivityId: 'draft' })).status, 400);
  await put({ kind: 'matrix', emotion: '焦虑', l1ActivityId: 'custom-l1', enabled: false });
  assert.deepEqual((await recommend({ emotion: '焦虑', level: 'blue' })).activities, []);
  await put({ kind: 'matrix', emotion: '焦虑', enabled: true });
  db.exec("UPDATE resource_catalog SET enabled=0 WHERE activity_id='custom-l1'");
  assert.deepEqual((await recommend({ emotion: '焦虑', level: 'blue' })).activities, []);
  assert.ok(!(await invoke(resourcesGet, 'GET')).body.resources.some(a => a.id === 'custom-l1'));
  db.exec("UPDATE resource_catalog SET enabled=1 WHERE activity_id='custom-l1'; UPDATE activities SET content_available=0 WHERE id='custom-l1'");
  assert.deepEqual((await recommend({ emotion: '焦虑', level: 'blue' })).activities, []);
});

test('配置接口拒绝未授权写入', async t => {
  const { env } = await setup(t);
  const response = await configPut({ env, request: new Request('https://example.test/api/internal/config', { method: 'PUT', body: JSON.stringify({ kind: 'activity', activityId: 'custom-l1', enabled: false }) }) });
  assert.equal(response.status, 401);
});

test('内容更新改变 level 后旧配置不得跨层级推荐', async t => {
  const { put, recommend, db, docs } = await setup(t);
  await put({ kind: 'matrix', emotion: '焦虑', l1ActivityId: 'custom-l1', enabled: true });
  db.exec(activitySql({ ...docs[0], level: 'L2', contentVersion: docs[0].contentVersion + 1 }));
  assert.deepEqual((await recommend({ emotion: '焦虑', level: 'blue' })).activities, []);
});

test('同标题不同 ID 的活动不共享完成次数', async t => {
  const { db, docs, invoke } = await setup(t);
  db.exec(activitySql({ ...docs[1], title: docs[0].title, contentVersion: docs[1].contentVersion + 1 }));
  db.prepare("INSERT INTO resource_events (id,anon_id,resource_name,resource_level,risk_level,state,created_at,updated_at,data_origin,activity_id) VALUES ('done','person',?,'L1','green','completed',0,0,'live','custom-l1')").run(docs[0].title);
  const resources = (await invoke(resourcesGet, 'GET')).body.resources;
  assert.equal(resources.find(a => a.id === 'custom-l1').doneCount, 1);
  assert.equal(resources.find(a => a.id === 'custom-l2').doneCount, 0);
});
