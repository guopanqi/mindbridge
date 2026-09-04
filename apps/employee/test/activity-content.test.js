import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { validateActivity, classifyActivity, contentHash, activitySql, catalogSql } from '../scripts/activity-content.mjs';
import { onRequestPost, onRequestGet } from '../functions/api/activities/index.js';
import { sha256Base64Url } from '../functions/api/_lib/crypto.js';

const sample = JSON.parse(readFileSync(new URL('../content/activities/breathing.json', import.meta.url)));
async function fixture() {
  const db = new DatabaseSync(':memory:');
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const f of readdirSync(dir).sort().filter(f => f.endsWith('.sql') && f <= '0020_activity_helpfulness.sql')) db.exec(readFileSync(new URL(f, dir), 'utf8'));
  db.exec(activitySql(sample));
  db.exec(catalogSql({ name: 'Independent catalog label', activityId: sample.id }));
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?, ?)').run(await sha256Base64Url('test'), 'person', Date.now() + 100000, 0, 0);
  db.exec("INSERT INTO resource_events (id,anon_id,resource_name,resource_level,risk_level,state,created_at,updated_at,data_origin,activity_id) VALUES ('event','person','old title','L1','green','offered',0,0,'live','breathing')");
  const env = { CARE_DB: {
    prepare(sql) {
      let args = [];
      return { bind(...values) { args = values; return this; },
        async first() { return db.prepare(sql).get(...args) || null; },
        async run() { return db.prepare(sql).run(...args); },
      };
    },
    async batch(statements) { db.exec('BEGIN'); try { const out = []; for (const s of statements) out.push(await s.run()); db.exec('COMMIT'); return out; } catch (e) { db.exec('ROLLBACK'); throw e; } },
  } };
  const post = async body => {
    const response = await onRequestPost({ env, request: new Request('https://example.test/api/activities', { method: 'POST', headers: { cookie: '__Host-mb_session=test' }, body: JSON.stringify({ eventId: 'event', ...body }) }) });
    return { status: response.status, body: await response.json() };
  };
  return { db, env, post };
}

test('内容版本相同但内容改变被拒绝，顺序变化不改变哈希', () => {
  validateActivity(sample);
  assert.equal(contentHash(sample), contentHash(Object.fromEntries(Object.entries(sample).reverse())));
  assert.throws(() => classifyActivity({ ...sample, title: 'new' }, { content_version: sample.contentVersion, content_hash: contentHash(sample) }));
  assert.throws(() => validateActivity({ ...sample, stages: [{ type: 'audio', title: 'audio' }] }));
  validateActivity({ ...sample, stages: [{ type: 'audio', title: 'audio', fallbackHint: '文字替代练习' }] });
});
test('参与快照不受内容更新影响，重复开始完成不会重复统计或回访', async () => {
  const { db, post } = await fixture();
  assert.equal((await post({ action: 'complete' })).status, 409);
  assert.equal((await post({ action: 'start' })).status, 200);
  await post({ action: 'start' });
  db.exec(activitySql({ ...sample, title: 'New title', contentVersion: 3, stages: [{ type: 'prompt', title: 'Changed' }] }));
  const progress = await post({ action: 'stage', stageIndex: 1 });
  assert.equal(progress.body.activity.title, sample.title);
  assert.equal(progress.body.activity.stages.length, sample.stages.length);
  assert.equal((await post({ action: 'stage', stageIndex: 99 })).status, 409);
  await post({ action: 'stage', stageIndex: 2 });
  // 帮助度留空也照常完成，不写反馈时间；之后可以补评，重复完成不重复统计。
  assert.equal((await post({ action: 'complete' })).status, 200);
  await post({ action: 'complete', helpfulness: '有帮助' });
  assert.equal(db.prepare('SELECT COUNT(*) n FROM aggregate_events').get().n, 2);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM follow_ups').get().n, 1);
  const done = db.prepare('SELECT helpfulness, feedback_at FROM resource_events').get();
  assert.equal(done.helpfulness, null);
  assert.equal(done.feedback_at, null);
  assert.equal((await post({ action: 'rate', helpfulness: '没什么用' })).status, 200);
  assert.equal(db.prepare('SELECT helpfulness FROM resource_events').get().helpfulness, '没什么用');
  assert.equal((await post({ action: 'rate', helpfulness: '很好' })).status, 400);
  db.close();
});
test('导入不覆盖 HR enabled，未发布活动不能开始', async () => {
  const { db, post } = await fixture();
  db.exec("UPDATE activities SET enabled=0 WHERE id='breathing'");
  db.exec(activitySql({ ...sample, contentVersion: 3 }));
  assert.equal(db.prepare('SELECT enabled FROM activities').get().enabled, 0);
  assert.equal((await post({ action: 'start' })).status, 404);
  db.exec("UPDATE activities SET enabled=1,content_available=0");
  assert.equal((await post({ action: 'start' })).status, 404);
  db.close();
});
test('活动只允许所属员工访问，已开始快照在停用后仍能继续', async () => {
  const { db, env, post } = await fixture();
  const unauthorized = await onRequestGet({ env, request: new Request('https://example.test/api/activities?eventId=event') });
  assert.equal(unauthorized.status, 401);
  await post({ action: 'start' });
  db.exec('UPDATE activities SET content_available=0,enabled=0');
  assert.equal((await post({ action: 'stage', stageIndex: 1 })).status, 200);
  db.exec("UPDATE resource_events SET anon_id='someone_else'");
  assert.equal((await post({ action: 'stage', stageIndex: 2 })).status, 404);
  db.close();
});
