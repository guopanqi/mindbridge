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
  for (const f of readdirSync(dir).sort().filter(f => f.endsWith('.sql'))) db.exec(readFileSync(new URL(f, dir), 'utf8'));
  db.exec(activitySql(sample));
  db.exec(catalogSql({ name: 'Independent catalog label', activityId: sample.id }));
  db.prepare('INSERT INTO sessions (session_digest, anon_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)').run(await sha256Base64Url('test'), 'person', Date.now() + 100000, 0, 0);
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
  db.exec(activitySql({ ...sample, title: 'New title', contentVersion: sample.contentVersion + 1, stages: [{ type: 'prompt', title: 'Changed' }] }));
  assert.equal(db.prepare("SELECT title FROM activities WHERE id='breathing'").get().title, 'New title');
  const progress = await post({ action: 'stage', stageIndex: 0 });
  assert.equal(progress.body.activity.title, sample.title);
  assert.equal(progress.body.activity.stages.length, sample.stages.length);
  assert.equal((await post({ action: 'stage', stageIndex: 99 })).status, 409);
  for (let stageIndex = 1; stageIndex < sample.stages.length; stageIndex++) await post({ action: 'stage', stageIndex });
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
  db.exec(activitySql({ ...sample, contentVersion: sample.contentVersion + 1 }));
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
  assert.equal((await post({ action: 'stage', stageIndex: 0 })).status, 200);
  db.exec("UPDATE resource_events SET anon_id='someone_else'");
  assert.equal((await post({ action: 'stage', stageIndex: 2 })).status, 404);
  db.close();
});

test('独立活动使用单个 component 段与文字兜底', () => {
  // 呼吸的体验本体是专属组件（宽 → 窄 → 宽三段 180 秒），JSON 只保留目录元数据和
  // component 占位段；旧客户端用 fallbackHint 跑完整文字版，不会卡在原地。
  assert.equal(sample.stages.length, 1);
  assert.equal(sample.stages[0].type, 'component');
  assert.equal(sample.stages[0].component, 'breathing-space');
  assert.ok(typeof sample.stages[0].fallbackHint === 'string' && sample.stages[0].fallbackHint.length > 50);
  const pmr = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/pmr.json', import.meta.url))));
  assert.equal(pmr.stages.length, 1);
  assert.equal(pmr.stages[0].type, 'component');
  assert.equal(pmr.stages[0].component, 'pmr');
  assert.ok(pmr.stages[0].fallbackHint.length > 50);
  const returnRhythm = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/return-rhythm.json', import.meta.url))));
  assert.equal(returnRhythm.stages.length, 1);
  assert.equal(returnRhythm.stages[0].component, 'return-rhythm');
  assert.ok(returnRhythm.stages[0].fallbackHint.length > 50);
  const scan = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/bodyscan-text.json', import.meta.url))));
  assert.equal(scan.stages.length, 1);
  assert.equal(scan.stages[0].component, 'body-scan');
  assert.ok(scan.stages[0].fallbackHint.length > 50);
  const stretch = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/stretch-guide.json', import.meta.url))));
  assert.equal(stretch.stages.length, 1);
  assert.equal(stretch.stages[0].component, 'stretch-guide');
  assert.ok(stretch.stages[0].fallbackHint.length > 50);
  const anchor = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/value-anchor.json', import.meta.url))));
  assert.equal(anchor.stages.length, 1);
  assert.equal(anchor.stages[0].type, 'component');
  assert.equal(anchor.stages[0].component, 'value-anchor');
  assert.ok(anchor.stages[0].fallbackHint.length > 50);
});

test('情绪书写是独立组件：单个 component 段 + 文字兜底', () => {
  const activity = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/writing-practice.json', import.meta.url))));
  assert.equal(activity.stages.length, 1);
  assert.equal(activity.stages[0].type, 'component');
  assert.equal(activity.stages[0].component, 'writing-practice');
  assert.ok(typeof activity.stages[0].fallbackHint === 'string' && activity.stages[0].fallbackHint.length > 50);
});

test('暂停卡是独立组件：单个 component 段 + 文字兜底', () => {
  const activity = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/pause-card.json', import.meta.url))));
  assert.equal(activity.stages.length, 1);
  assert.equal(activity.stages[0].type, 'component');
  assert.equal(activity.stages[0].component, 'pause-card');
  assert.ok(typeof activity.stages[0].fallbackHint === 'string' && activity.stages[0].fallbackHint.length > 50);
});

test('三件好事是独立组件：单个 component 段 + 文字兜底', () => {
  const activity = validateActivity(JSON.parse(readFileSync(new URL('../content/activities/gratitude-checkin.json', import.meta.url))));
  assert.equal(activity.stages.length, 1);
  assert.equal(activity.stages[0].type, 'component');
  assert.equal(activity.stages[0].component, 'gratitude');
  assert.ok(typeof activity.stages[0].fallbackHint === 'string' && activity.stages[0].fallbackHint.length > 50);
});

test('可拓展媒体配置必须有安全的真实地址或完整模拟时间线', () => {
  const media = { type: 'media', title: '测试视频', presentation: 'video', src: '/media/demo.mp4' };
  validateActivity({ ...sample, stages: [media] });
  validateActivity({ ...sample, stages: [{ ...media, src: 'https://media.example/demo.mp4' }] });
  for (const src of ['javascript:alert(1)', '//other.example/demo.mp4', '/\\other.example/video.mp4']) {
    assert.throws(() => validateActivity({ ...sample, stages: [{ ...media, src }] }));
  }
  const demo = { type: 'media', title: '模拟', presentation: 'audio' };
  assert.throws(() => validateActivity({ ...sample, stages: [demo] }));
  validateActivity({ ...sample, stages: [{ ...demo, segments: [{ title: '开始', seconds: 3 }] }] });
});
