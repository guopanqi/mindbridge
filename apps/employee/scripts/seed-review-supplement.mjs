#!/usr/bin/env node
// 评审组织补充种子：集中主题的 demo_seed 广场帖（让议题图出数）+ 已结束的
// demo_seed 红色示例个案（让模拟基线的红色漏斗闭环）。
// - 帖子明文 + demo_seed：墙内可见，看板议题只读本组织；
// - 个案 status=done：躺在已结束里，不会出现在疗愈师待办中。
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyTopic } from '../functions/api/_lib/topics.js';

const [orgId] = process.argv.slice(2);
if (!orgId || !/^org_beta_[a-f0-9]{32}$/.test(orgId)) {
  throw new Error('用法：node scripts/seed-review-supplement.mjs org_beta_<32位hex>');
}
const esc = (s) => String(s).replace(/'/g, "''");
const q = (v) => `'${esc(v)}'`;
const DAY_MS = 86400000;
const now = Date.now();
const lines = [];

// 10 个不同假号在同一议题下发帖：议题图要求单议题 ≥10 个不同发言人才出数。
const TOPIC_POSTS = [
  '排期又提前了，这个月已经是第三次改时间。',
  '连着两周赶版本，今天终于按时下班，居然有点不适应。',
  '开了一天会，什么活都没干成，晚上又要加班补。',
  '需求方改了三次口径，我们这边全推倒重来。',
  '这个月第三个周末在公司度过了，有点麻木。',
  '上线前夜全员待命，心跳和报警短信一样响。',
  '测试环境挂了，联调排到半夜，咖啡续了三杯。',
  '版本回滚那次，全组一句话没说，把事扛下来了。',
  '迭代越排越密，感觉自己像个永远追不上的人。',
  '周五晚上八点，办公室的灯还全亮着。',
];
TOPIC_POSTS.forEach((text, i) => {
  const author = `rvseed_${String(i + 1).padStart(3, '0')}`;
  const topic = classifyTopic(text) || '加班强度';
  const at = now - (13 - i) * DAY_MS;
  lines.push(`INSERT OR IGNORE INTO posts (id, anon_id, organization_id, body_cipher, content_key_version, emotion, topic, created_at, data_origin) VALUES ('rv_topic_${String(i + 1).padStart(2, '0')}', '${author}', '${orgId}', ${q(text)}, 'plain', NULL, ${q(topic)}, ${at}, 'demo_seed');`);
});

const tstr = (ts) => new Date(ts).toTimeString().slice(0, 5);
const doneCases = [
  ['app_rvs_01', 'MB-RVS1A2', 'rvseed_004', 30, 32],
  ['app_rvs_02', 'MB-RVS3B4', 'rvseed_005', 55, 41],
];
for (const [id, code, anon, hoursAgo, resp] of doneCases) {
  const at = now - hoursAgo * 3600000;
  const closed = at + resp * 60000;
  const log = JSON.stringify([`${tstr(at)} 员工已提交支持请求，个案已建立`, `${tstr(at + 5 * 60000)} 已受理 · 处理中`, `${tstr(closed)} 本次支持已结束`]);
  lines.push(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, claimed_by, claimed_at, closed_at, created_at, updated_at, data_origin, organization_id) VALUES ('${id}', '${code}', '${anon}', NULL, 'red', 'done', 0, NULL, NULL, '评审体验组', '{}', '["疲惫"]', ${resp}, '${esc(log)}', ${at + 2 * 3600000}, 'staff_healer_01', ${at + 5 * 60000}, ${closed}, ${at}, ${now}, 'demo_seed', '${orgId}');`);
}

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(appDir, 'seed'), { recursive: true });
const out = resolve(appDir, `seed/review_supplement_${orgId}.sql`);
writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`组织 ${orgId}：${lines.length} 条语句 → ${out}`);
