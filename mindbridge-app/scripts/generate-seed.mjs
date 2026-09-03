// 生成路演演示数据。所有行都带 data_origin='demo_seed'，可被单独查询与清理。
//
// 禁止：不得包含真实员工姓名、工号、联系方式或可识别案例；
// 不得伪造钉钉考勤、病假或聊天接口返回。这里只生成本系统自己会产生的事件。
import { writeFileSync, mkdirSync } from 'node:fs';

const DAYS = 90;
const HEADCOUNT = 200;
const TENANT = { name: '星原科技', industry: '互联网/IT' };
const ORIGIN = 'demo_seed';

// 确定性随机，保证每次生成的演示数据一致，便于反复彩排。
let state = 20260903;
function rnd() {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
}
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (min, max) => min + Math.floor(rnd() * (max - min + 1));

const MOODS = [['很好', 1], ['还行', 2], ['有点累', 3], ['很低落', 4], ['快撑不住', 5]];
const EMOTIONS = ['焦虑', '疲惫', '烦躁', '低落', '紧张', '孤独', '委屈', '愤怒', '迷茫'];
const RESOURCES = [
  ['三分钟呼吸着陆法', 'L1'], ['工间身体扫描音频', 'L1'], ['情绪暂停提醒卡片', 'L1'],
  ['每日三件好事打卡', 'L1'], ['渐进式肌肉放松音频', 'L1'], ['职业价值锚点练习', 'L1'],
  ['情绪红绿灯正念工作坊', 'L2'], ['能量唤醒工作坊', 'L2'], ['跨团队疗愈小组', 'L2'],
  ['身份重塑叙事疗愈小组', 'L2'], ['拳力以赴·解压拳击', 'L2'],
];
// 演示用的广场内容：泛化表达，不指向任何真实个人或事件。
const POSTS = [
  '连着两周赶版本，今天终于按时下班了，居然有点不适应。',
  '想问问大家，怎么把工作情绪留在工位上不带回家。',
  '被反馈说方案不够细，改了三版，有点怀疑自己。',
  '午休去楼下走了二十分钟，下午确实清醒一些。',
  '新来的同事很努力，看到他就想起刚入职的自己。',
  '不太敢在会上表达不同意见，怕被觉得不配合。',
  '孩子生病请了两天假，回来发现工作堆着，压力有点大。',
  '最近睡眠很浅，半夜会醒，不知道有没有人一样。',
  '做完一个大项目反而空落落的，正常吗。',
  '想换个方向但不确定值不值得，四十岁前还来得及吗。',
  '今天被同事顺手帮了一把，小事，但心里暖了一下。',
  '开了一天会，什么活都没干成，晚上又要加班补。',
];
const ALIAS = ['小舟', '小林', '小河', '晚风', '青柠', '南山', '木棉', '小满', '拾光', '云间', '海盐', '知了'];

const esc = (s) => String(s).replace(/'/g, "''");
const lines = [];
const emit = (sql) => lines.push(sql);

const DAY_MS = 86400000;
const now = Date.now();
const startOfDay = (offset) => now - offset * DAY_MS;
const bucket = (ts) => new Date(ts).toISOString().slice(0, 10);

// 演示人群：仅生成本系统内部的匿名主体，不含任何组织身份字段。
const people = [];
for (let i = 0; i < HEADCOUNT; i++) {
  const anonId = `mbdemo_${String(i + 1).padStart(3, '0')}`;
  people.push(anonId);
  const name = `${ALIAS[i % ALIAS.length]}-${(i * 7919 % 65536).toString(16).toUpperCase().padStart(4, '0')}`;
  const created = startOfDay(between(30, DAYS));
  emit(`INSERT OR IGNORE INTO profiles (anon_id, display_name, context_tag, created_at, updated_at, data_origin) VALUES ('${anonId}', '${esc(name)}', 'none', ${created}, ${created}, '${ORIGIN}');`);
}

emit(`DELETE FROM tenant_profile WHERE id = 'demo';`);
emit(`INSERT INTO tenant_profile (id, display_name, headcount, industry, data_origin, updated_at) VALUES ('demo', '${esc(TENANT.name)}', ${HEADCOUNT}, '${esc(TENANT.industry)}', '${ORIGIN}', ${now});`);

let seq = 0;
const id = (prefix) => `${prefix}_seed${String(++seq).padStart(6, '0')}`;

for (let d = DAYS - 1; d >= 0; d--) {
  const ts = startOfDay(d);
  const day = bucket(ts);
  const weekday = new Date(ts).getUTCDay();
  const workday = weekday !== 0 && weekday !== 6;
  // 压力随迭代周期起伏：月末与周中偏高，周末回落。
  const cycle = Math.sin((DAYS - d) / 9) * 0.35 + (workday ? 0.25 : -0.35);
  const checkins = workday ? between(38, 62) : between(8, 18);

  for (let i = 0; i < checkins; i++) {
    const anonId = pick(people);
    const base = 2.4 + cycle + (rnd() - 0.5) * 1.6;
    const index = Math.max(0, Math.min(4, Math.round(base) - 1));
    const [mood, score] = MOODS[index];
    const at = ts + between(8, 21) * 3600000;
    emit(`INSERT INTO mood_checkins (id, anon_id, mood, stress_score, created_at, bucket_day, data_origin) VALUES ('${id('mood')}', '${anonId}', '${esc(mood)}', ${score}, ${at}, '${day}', '${ORIGIN}');`);
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'mood_checkin', '${esc(mood)}', NULL, '${day}', ${at}, '${ORIGIN}');`);
  }

  const chats = workday ? between(14, 30) : between(3, 9);
  for (let i = 0; i < chats; i++) {
    const emotion = pick(EMOTIONS);
    const roll = rnd();
    const level = roll > 0.965 ? 'red' : roll > 0.85 ? 'yellow' : 'green';
    const at = ts + between(9, 23) * 3600000;
    const anonId = pick(people);
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'chat_message', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}');`);
    if (level !== 'green') {
      emit(`INSERT INTO risk_events (id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES ('${id('risk')}', '${anonId}', NULL, '${level}', '演示数据 · 规则命中', '${esc(emotion)}', 'rules-v1', ${at}, '${ORIGIN}');`);
      emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'risk_flagged', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}');`);
    }
    if (rnd() > 0.55) {
      const [name, resLevel] = pick(RESOURCES);
      const state = rnd() > 0.45 ? (rnd() > 0.5 ? 'completed' : 'joined') : 'offered';
      emit(`INSERT INTO resource_events (id, anon_id, conversation_id, resource_name, resource_level, risk_level, state, created_at, updated_at, data_origin) VALUES ('${id('res')}', '${anonId}', NULL, '${esc(name)}', '${resLevel}', '${level}', '${state}', ${at}, ${at}, '${ORIGIN}');`);
      emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'resource_offered', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}');`);
    }
  }

  if (workday && rnd() > 0.45) {
    const at = ts + between(10, 22) * 3600000;
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'wall_post', NULL, 'green', '${day}', ${at}, '${ORIGIN}');`);
  }
}

// 广场演示帖子以明文存储，content_key_version 标为 'plain'。
// 这是一个显式豁免：演示文案本身不含任何敏感信息，且必须能被所有演示账号读到。
// 真实员工帖子永远走加密路径；读取侧只在 data_origin='demo_seed' 时才接受 'plain'。
const REPLIES = ['我也是，抱抱。', '听起来真的不容易。', '我懂这种感觉。', '谢谢你说出来。', '这两天我也一样。'];
for (let i = 0; i < POSTS.length; i++) {
  const postId = `post_seed${String(i + 1).padStart(4, '0')}`;
  const author = pick(people);
  const at = startOfDay(between(0, 12)) + between(9, 21) * 3600000;
  emit(`INSERT INTO posts (id, anon_id, body_cipher, content_key_version, emotion, created_at, data_origin) VALUES ('${postId}', '${author}', '${esc(POSTS[i])}', 'plain', NULL, ${at}, '${ORIGIN}');`);
  emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'wall_post', NULL, 'green', '${bucket(at)}', ${at}, '${ORIGIN}');`);
  for (let h = 0, hugs = between(0, 9); h < hugs; h++) {
    const hugger = pick(people);
    emit(`INSERT OR IGNORE INTO post_reactions (post_id, anon_id, kind, created_at, data_origin) VALUES ('${postId}', '${hugger}', 'hug', ${at + h * 60000}, '${ORIGIN}');`);
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'wall_hug', NULL, 'green', '${bucket(at)}', ${at}, '${ORIGIN}');`);
  }
  for (let r = 0, reps = between(0, 3); r < reps; r++) {
    emit(`INSERT INTO post_replies (id, post_id, anon_id, body_cipher, content_key_version, created_at, data_origin) VALUES ('rep_seed${String(i + 1).padStart(4, '0')}${r}', '${postId}', '${pick(people)}', '${esc(pick(REPLIES))}', 'plain', ${at + (r + 1) * 900000}, '${ORIGIN}');`);
  }
}

// 演示个案体系：覆盖待响应 (pending)、处理中 (active)、已闭环 (done) 三态
const app1At = now - 3600000;
const app1Sla = now + 5400000; // 剩余 1.5h
const app1Prof = JSON.stringify({ job: '后端研发', deptType: '研发中心', level: '一线骨干', workType: '高负荷项目' });
const app1Tags = JSON.stringify(['危机表达', '身心耗竭', '累']);
const app1Log = JSON.stringify(['10:24 员工已授权转接']);

emit(`DELETE FROM appointments WHERE data_origin = '${ORIGIN}' OR case_code IN ('MB-MWA5A8', 'MB-K9J2L1', 'MB-P3X8Y2');`);
emit(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, created_at, updated_at, data_origin) VALUES ('app_seed_001', 'MB-MWA5A8', '${people[0]}', 'conv_seed_mwa5a8', 'red', 'pending', 1, '希望约一次线上沟通，晚上方便', 'plain', '研发中心', '${esc(app1Prof)}', '${esc(app1Tags)}', NULL, '${esc(app1Log)}', ${app1Sla}, ${app1At}, ${app1At}, '${ORIGIN}');`);

// 为 MB-MWA5A8 提供可查看上下文与已同意状态
emit(`INSERT OR REPLACE INTO context_requests (id, appointment_id, anon_id, staff_id, reason, status, created_at, decided_at, expires_at, data_origin) VALUES ('ctx_seed_001', 'app_seed_001', '${people[0]}', 'healer_demo', '评估危机程度并制定安全支持计划', 'approved', ${app1At}, ${app1At + 60000}, ${now + 86400000}, '${ORIGIN}');`);
emit(`INSERT OR REPLACE INTO messages (id, conversation_id, anon_id, role, body_cipher, content_key_version, created_at, data_origin) VALUES ('msg_seed_001', 'conv_seed_mwa5a8', '${people[0]}', 'user', '最近真的太累了，感觉撑不住了，活着好像没有什么意义', 'plain', ${app1At - 120000}, '${ORIGIN}');`);
emit(`INSERT OR REPLACE INTO messages (id, conversation_id, anon_id, role, body_cipher, content_key_version, created_at, data_origin) VALUES ('msg_seed_002', 'conv_seed_mwa5a8', '${people[0]}', 'assistant', '我听到你的疲惫与沉重了。请先停下手中的工作，如果需要，专业持证疗愈师可以为你提供一对一的倾听与支持。', 'plain', ${app1At - 60000}, '${ORIGIN}');`);

// 活跃处理中个案（SLA 剩余 25 分钟，触发黄色预警）
const app2At = now - 5700000;
const app2Sla = now + 1500000;
const app2Prof = JSON.stringify({ job: '在线客服', deptType: '客服中心', level: '一线员工', workType: '轮班制' });
const app2Tags = JSON.stringify(['客户情绪', '崩溃']);
const app2Log = JSON.stringify(['09:15 员工已授权转接', '09:30 疗愈师已开始联系']);
emit(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, claimed_by, claimed_at, created_at, updated_at, data_origin) VALUES ('app_seed_002', 'MB-K9J2L1', '${people[1]}', NULL, 'red', 'active', 0, '最近客户投诉很多，经常做噩梦，情绪快失控了', 'plain', '客服中心', '${esc(app2Prof)}', '${esc(app2Tags)}', NULL, '${esc(app2Log)}', ${app2Sla}, 'staff_healer_01', ${now - 1200000}, ${app2At}, ${now}, '${ORIGIN}');`);

// 已闭环个案
const app3At = now - 86400000;
const app3Closed = app3At + 18 * 60000;
const app3Prof = JSON.stringify({ job: '大客户销售', deptType: '销售中心', level: '资深经理', workType: '常规' });
const app3Tags = JSON.stringify(['指标焦虑']);
const app3Log = JSON.stringify(['昨天 16:40 员工已授权转接', '昨天 16:58 完成首次会谈 · 已安排后续疗愈']);
emit(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, claimed_by, claimed_at, closed_at, created_at, updated_at, data_origin) VALUES ('app_seed_003', 'MB-P3X8Y2', '${people[2]}', NULL, 'red', 'done', 0, '业绩压力很大，整晚失眠', 'plain', '销售中心', '${esc(app3Prof)}', '${esc(app3Tags)}', 18, '${esc(app3Log)}', ${app3At + 7200000}, 'staff_healer_01', ${app3At + 300000}, ${app3Closed}, ${app3At}, ${app3Closed}, '${ORIGIN}');`);

// 团队节奏演示基线数据
const today = bucket(now);
emit(`DELETE FROM org_rhythm WHERE data_origin = '${ORIGIN}';`);
emit(`INSERT OR REPLACE INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at) VALUES ('rhy_seed_001', '${today}', 'median_off_duty_minutes', 1242, 145, 'minutes', 'dingtalk_attendance', '${ORIGIN}', ${now});`);
emit(`INSERT OR REPLACE INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at) VALUES ('rhy_seed_002', '${today}', 'late_off_duty_share', 38, 145, 'percent', 'dingtalk_attendance', '${ORIGIN}', ${now});`);
emit(`INSERT OR REPLACE INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at) VALUES ('rhy_seed_003', '${today}', 'off_duty_records', 145, 145, 'number', 'dingtalk_attendance', '${ORIGIN}', ${now});`);

mkdirSync('seed', { recursive: true });
writeFileSync('seed/demo_seed.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${lines.length} 条语句 → seed/demo_seed.sql`);


