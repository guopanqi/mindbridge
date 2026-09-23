#!/usr/bin/env node
// 给独立评审组织播模拟数据：广场帖（含抱抱/回复）+ 3 个示例个案（待响应/处理中/已结束各一）。
//
// 隔离原则（勿放宽）：
// - 所有行都带 organization_id=评审组织；广场按组织隔离，企业墙看不到；
// - 帖子用 data_origin='demo_seed' + 明文（读取侧只对 demo_seed 接受 plain），
//   且 summarize 只统计 messages/aggregate_events/risk_events——这三张表本脚本一行不写，
//   HR 模拟基线数字不受影响；
// - 示例个案同样标记 demo_seed，按来源组织区分，不计入真实使用报表。
// - 假号前缀 rvseed_，不与 mbdemo_/mbreview_ 重叠，避免会话判定误伤。
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyTopic } from '../functions/api/_lib/topics.js';

const [orgId] = process.argv.slice(2);
if (!orgId || !/^org_beta_[a-f0-9]{32}$/.test(orgId)) {
  throw new Error('用法：node scripts/seed-review-org.mjs org_beta_<32位hex>');
}

let state = 20260924;
const rnd = () => {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
};
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (min, max) => min + Math.floor(rnd() * (max - min + 1));
const esc = (s) => String(s).replace(/'/g, "''");

const DAY_MS = 86400000;
const now = Date.now();
const ORG = '评审体验组';

// 泛化表达的评审广场文案，不指向任何真实个人或事件。
const POSTS = [
  '第一次点开这个树洞，先来广场看看大家。',
  '连着加了几天班，今晚提前一小时下班，感觉赚到了。',
  '开了一整天会，脑子嗡嗡的，来这里透口气。',
  '被改了三版方案，有点丧，但还是想把它做好。',
  '午休下楼走了两圈，下午状态好了不少，推荐。',
  '最近睡眠很浅，不知道有没有人一样。',
  '孩子开学第一周，手忙脚乱但挺开心。',
  '不太敢在会上说不同意见，怕被觉得不配合。',
  '调薪没有轮到我，说不失落是假的。',
  '做完一个大项目反而空落落的，正常吗。',
  '需求又改了，全组陪着返工，说不累是假的。',
  '今天被同事顺手帮了一把，小事，但心里暖了一下。',
  '试了下呼吸练习，睡前做确实容易静下来。',
  '返岗两周，节奏还没找回来，两头顾有点累。',
  '技术更新太快，周末补了两天课，焦虑少了一点。',
  '轮班之后生物钟乱了，有调过来的朋友吗。',
  '当众被点名之后，一整天都缓不过来。',
  '想问问大家，怎么把工作情绪留在工位上不带回家。',
  '同期升上去了，我还在原地，有点急。',
  '胃又开始不舒服，一忙起来就这样。',
  '新来的同事很拼，看到他想起刚入职的自己。',
  '周末什么都没干，就发了会儿呆，居然满血了。',
  '跟上级说了做不完，比想象中平静地接受了。',
  '参加了正念工作坊，比想象中有用。',
];
const REPLIES = ['我也是，抱抱。', '听起来真的不容易。', '我懂这种感觉。', '谢谢你说出来。', '这两天我也一样。', '要不要一起去楼下走走。'];
const ALIAS = ['小舟', '晚风', '青柠', '南山', '木棉', '小满', '拾光', '云间', '海盐', '知了', '小河', '晨雾'];
const TAGS = ['none', 'highIntensity', 'newcomer', 'manager', 'techTransition', 'none'];

const lines = [];
const q = (v) => `'${esc(v)}'`;

for (let i = 0; i < 12; i++) {
  const anon = `rvseed_${String(i + 1).padStart(3, '0')}`;
  const name = `${ALIAS[i % ALIAS.length]}-${((i + 3) * 7919 % 65536).toString(16).toUpperCase().padStart(4, '0')}`;
  const created = now - between(10, 14) * DAY_MS;
  lines.push(`INSERT OR IGNORE INTO profiles (anon_id, display_name, context_tag, department, created_at, updated_at, data_origin) VALUES ('${anon}', ${q(name)}, '${TAGS[i % TAGS.length]}', '${ORG}', ${created}, ${created}, 'demo_seed');`);
}

let postSeq = 0;
for (let d = 13; d >= 0; d--) {
  const count = d % 3 === 0 ? 3 : between(1, 2);
  for (let k = 0; k < count && postSeq < POSTS.length; k++) {
    const text = POSTS[postSeq];
    const author = `rvseed_${String((postSeq % 12) + 1).padStart(3, '0')}`;
    const topic = classifyTopic(text);
    const postId = `rv_post_${String(++postSeq).padStart(3, '0')}`;
    const at = now - d * DAY_MS - between(1, 10) * 3600000;
    lines.push(`INSERT OR IGNORE INTO posts (id, anon_id, organization_id, body_cipher, content_key_version, emotion, topic, created_at, data_origin) VALUES ('${postId}', '${author}', '${orgId}', ${q(text)}, 'plain', NULL, ${topic ? q(topic) : 'NULL'}, ${at}, 'demo_seed');`);
    for (let h = 0, hugs = between(0, 8); h < hugs; h++) {
      const who = `rvseed_${String(between(1, 12)).padStart(3, '0')}`;
      lines.push(`INSERT OR IGNORE INTO post_reactions (post_id, anon_id, kind, created_at, data_origin) VALUES ('${postId}', '${who}', 'hug', ${at + h * 60000}, 'demo_seed');`);
    }
    for (let r = 0, reps = between(0, 2); r < reps; r++) {
      const who = `rvseed_${String(between(1, 12)).padStart(3, '0')}`;
      lines.push(`INSERT OR IGNORE INTO post_replies (id, post_id, anon_id, body_cipher, content_key_version, created_at, data_origin) VALUES ('rep_${postId}_${r}', '${postId}', '${who}', ${q(pick(REPLIES))}, 'plain', ${at + (r + 1) * 900000}, 'demo_seed');`);
    }
  }
}

const tstr = (ts) => new Date(ts).toTimeString().slice(0, 5);
const cases = [
  {
    id: 'app_rv_01', code: 'MB-RV7K2A', anon: 'rvseed_001', risk: 'yellow', status: 'requested',
    created: now - 30 * 60000, sla: now + 90 * 60000, claimed: null, closed: null, resp: null,
    log: [`${tstr(now - 30 * 60000)} 员工已提交支持请求，个案已建立`],
  },
  {
    id: 'app_rv_02', code: 'MB-RV3M8Q', anon: 'rvseed_002', risk: 'red', status: 'active',
    created: now - 5 * 3600000, sla: now - 5 * 3600000 + 2 * 3600000, claimed: now - 4.5 * 3600000, closed: null, resp: null,
    log: [`${tstr(now - 5 * 3600000)} 员工已提交支持请求，个案已建立`, `${tstr(now - 4.5 * 3600000)} 已受理 · 处理中`, `${tstr(now - 4 * 3600000)} 疗愈师已开始跟进`],
  },
  {
    id: 'app_rv_03', code: 'MB-RV9D4W', anon: 'rvseed_003', risk: 'yellow', status: 'done',
    created: now - 26 * 3600000, sla: now - 26 * 3600000 + 2 * 3600000, claimed: now - 25.5 * 3600000, closed: now - 25 * 3600000, resp: 38,
    log: [`${tstr(now - 26 * 3600000)} 员工已提交支持请求，个案已建立`, `${tstr(now - 25.5 * 3600000)} 已受理 · 处理中`, `${tstr(now - 25 * 3600000)} 本次支持已结束`],
  },
];
for (const c of cases) {
  lines.push(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, claimed_by, claimed_at, closed_at, created_at, updated_at, data_origin, organization_id) VALUES ('${c.id}', '${c.code}', '${c.anon}', NULL, '${c.risk}', '${c.status}', 0, NULL, NULL, '${ORG}', '{}', '["疲惫"]', ${c.resp ?? 'NULL'}, '${esc(JSON.stringify(c.log))}', ${c.sla}, ${c.claimed ? "'staff_healer_01'" : 'NULL'}, ${c.claimed ?? 'NULL'}, ${c.closed ?? 'NULL'}, ${c.created}, ${now}, 'demo_seed', '${orgId}');`);
}

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(appDir, 'seed'), { recursive: true });
const out = resolve(appDir, `seed/review_org_${orgId}.sql`);
writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`组织 ${orgId}：${lines.length} 条语句 → ${out}`);
