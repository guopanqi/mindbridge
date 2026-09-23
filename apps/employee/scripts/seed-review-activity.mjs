#!/usr/bin/env node
// 评审组织的模拟使用数据。只写该组织的 demo_seed 口径，绝不伪装成真实使用。
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [orgId] = process.argv.slice(2);
if (!orgId || !/^org_beta_[a-f0-9]{32}$/.test(orgId)) {
  throw new Error('用法：node scripts/seed-review-activity.mjs org_beta_<32位hex>');
}

let state = 20260925;
const rnd = () => {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
};
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (min, max) => min + Math.floor(rnd() * (max - min + 1));
const esc = (s) => String(s).replace(/'/g, "''");

const DAY_MS = 86400000;
const now = Date.now();
const DAYS = 45;
const bucket = (ts) => new Date(ts).toISOString().slice(0, 10);
const EMOTIONS = ['焦虑', '疲惫', '烦躁', '低落', '紧张', '孤独', '委屈', '迷茫'];
const RESOURCES = [
  ['三分钟呼吸着陆法', 'L1', 'breathing'],
  ['工间身体扫描', 'L1', 'bodyscan-text'],
  ['午间正念工作坊', 'L2', 'mindfulness-workshop'],
];

const lines = [];
let seq = 0;
const ORIGIN = 'demo_seed';
const TAG = 'rvs';
const id = (p) => `${p}_${TAG}${String(++seq).padStart(5, '0')}`;
const anons = Array.from({ length: 12 }, (_, i) => `rvseed_${String(i + 1).padStart(3, '0')}`);

// 假号挂为组织成员：成员口径的 live 查询（消息/风险/资源/画像/个案）才能读到它们。
// 企业口径按企业组织成员过滤，互不相交，进不了企业报表。
for (const anon of anons) {
  lines.push(`INSERT OR IGNORE INTO subject_organizations (anon_id, organization_id, entry_channel, created_at, last_seen_at) VALUES ('${anon}', '${orgId}', 'beta_web', ${now - 44 * DAY_MS}, ${now});`);
}

for (let d = DAYS - 1; d >= 0; d--) {
  const ts = now - d * DAY_MS;
  const day = bucket(ts);
  const weekday = new Date(ts).getUTCDay();
  const chats = (weekday === 0 || weekday === 6) ? between(8, 12) : between(16, 24);
  for (let i = 0; i < chats; i++) {
    const anon = pick(anons);
    const at = ts + between(9, 22) * 3600000;
    const roll = rnd();
    const level = roll > 0.985 ? 'red' : roll > 0.82 ? 'yellow' : 'green';
    const emotion = pick(EMOTIONS);
    lines.push(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin, organization_id) VALUES ('${id('agg')}', 'chat_message', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}', '${orgId}');`);
    lines.push(`INSERT INTO messages (id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, data_origin) VALUES ('${id('msg')}', 'rvconv_${anon.slice(-3)}', '${anon}', 'user', 'review_seed_placeholder', 'v1', '${level}', ${at}, '${ORIGIN}');`);
    if (level !== 'green') {
      lines.push(`INSERT INTO risk_events (id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES ('${id('risk')}', '${anon}', NULL, '${level}', '内测模拟 · 规则命中', '${esc(emotion)}', 'rules-v1', ${at}, '${ORIGIN}');`);
      lines.push(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin, organization_id) VALUES ('${id('agg')}', 'risk_flagged', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}', '${orgId}');`);
    }
    if (rnd() > 0.6) {
      const [name, resLevel, activityId] = pick(RESOURCES);
      const r = rnd();
      const st = r > 0.45 ? 'completed' : r > 0.2 ? 'joined' : 'offered';
      const rated = st === 'completed' && rnd() > 0.4;
      const helpful = rated ? pick(['有帮助', '有帮助', '有帮助', '说不好', '没什么用']) : null;
      lines.push(`INSERT INTO resource_events (id, anon_id, conversation_id, activity_id, resource_name, resource_level, risk_level, state, helpfulness, feedback_at, created_at, updated_at, data_origin) VALUES ('${id('res')}', '${anon}', NULL, '${activityId}', '${esc(name)}', '${resLevel}', '${level}', '${st}', ${helpful ? `'${helpful}'` : 'NULL'}, ${rated ? at + 3600000 : 'NULL'}, ${at}, ${at}, '${ORIGIN}');`);
      lines.push(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin, organization_id) VALUES ('${id('agg')}', 'resource_offered', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}', '${orgId}');`);
    }
  }
}

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(appDir, 'seed'), { recursive: true });
const out = resolve(appDir, `seed/review_activity_${orgId}_${ORIGIN}.sql`);
writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`组织 ${orgId}：${lines.length} 条语句 → ${out}`);
