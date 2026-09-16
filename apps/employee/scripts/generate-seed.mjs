// 生成路演演示数据。所有行都带 data_origin='demo_seed'，可被单独查询与清理。
//
// 禁止：不得包含真实员工姓名、工号、联系方式或可识别案例；
// 不得伪造钉钉考勤、病假或聊天接口返回。这里只生成本系统自己会产生的事件。
import { writeFileSync, mkdirSync } from 'node:fs';
import { classifyTopic } from '../functions/api/_lib/topics.js';
const DAYS = 180;  // 需要两个完整周期，看板的环比才有意义
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

const EMOTIONS = ['焦虑', '疲惫', '烦躁', '低落', '紧张', '孤独', '委屈', '愤怒', '迷茫'];
const RESOURCES = [
  ['三分钟呼吸着陆法', 'L1'], ['工间身体扫描音频', 'L1'], ['情绪暂停提醒卡片', 'L1'],
  ['每日三件好事打卡', 'L1'], ['渐进式肌肉放松音频', 'L1'], ['职业价值锚点练习', 'L1'],
  ['情绪红绿灯正念工作坊', 'L2'], ['能量唤醒工作坊', 'L2'], ['跨团队疗愈小组', 'L2'],
  ['身份重塑叙事疗愈小组', 'L2'], ['拳力以赴·解压拳击', 'L2'],
];
// 演示用的广场内容：泛化表达，不指向任何真实个人或事件。
// 演示用广场内容：按议题分组，泛化表达，不指向任何真实个人或事件。
const POST_POOL = {
  '加班强度': [
    '连着两周赶版本，今天终于按时下班了，居然有点不适应。',
    '开了一天会，什么活都没干成，晚上又要加班补。',
    '这个月第三个周末在公司度过了，有点麻木。',
    '排期一压再压，感觉自己像个永远追不上的人。',
  ],
  '管理与沟通': [
    '被反馈说方案不够细，改了三版，有点怀疑自己。',
    '不太敢在会上表达不同意见，怕被觉得不配合。',
    '当众被点名之后，一整天都缓不过来。',
    '想问问怎么跟上级说"我做不完"这句话。',
  ],
  '晋升与调薪': [
    '这次调薪没有我，说不失望是假的。',
    '同期的人升上去了，我还在原地，有点急。',
    '绩效面谈说我"再等等"，等到什么时候呢。',
  ],
  '身心状态': [
    '最近睡眠很浅，半夜会醒，不知道有没有人一样。',
    '午休去楼下走了二十分钟，下午确实清醒一些。',
    '轮班调过来之后，生物钟彻底乱了。',
    '胃又开始不舒服了，一忙起来就这样。',
  ],
  '跨部门协作': [
    '需求方改了三次口径，我们这边全推倒重来。',
    '对接了一周才发现两边理解的不是一件事。',
    '想问问大家，怎么把工作情绪留在工位上不带回家。',
  ],
  '工作意义感': [
    '做完一个大项目反而空落落的，正常吗。',
    '有时候不知道自己每天在忙什么，只是在忙。',
    '新来的同事很努力，看到他就想起刚入职的自己。',
  ],
  '家庭与照护': [
    '孩子生病请了两天假，回来发现工作堆着，压力有点大。',
    '返岗之后节奏一直没调回来，家里公司两头顾。',
  ],
  '职业方向': [
    '想换个方向但不确定值不值得，四十岁前还来得及吗。',
    '技术更新太快，有点担心自己跟不上。',
  ],
};
const POSITIVE_POSTS = [
  '今天被同事顺手帮了一把，小事，但心里暖了一下。',
  '参加了那个正念工作坊，比想象中有用。',
];

const ALIAS = ['小舟', '小林', '小河', '晚风', '青柠', '南山', '木棉', '小满', '拾光', '云间', '海盐', '知了'];

const esc = (s) => String(s).replace(/'/g, "''");
const lines = [];
const emit = (sql) => lines.push(sql);

const DAY_MS = 86400000;
const now = Date.now();
const startOfDay = (offset) => now - offset * DAY_MS;
const bucket = (ts) => new Date(ts).toISOString().slice(0, 10);

// 演示部门分布：法务部刻意只有 3 人，用来在部门概览里真实触发最小样本抑制。
// 每个部门给一个压力偏置与参与倾向，让部门概览真的有差异。
// bias 为正表示压力更大（打卡分数更高 → 情绪温度更低）。
const DEPARTMENTS = [
  ['研发中心', 68, { bias: 0.55, join: 0.62, topic: '加班强度' }],
  ['客服中心', 46, { bias: 0.85, join: 0.71, topic: '管理与沟通' }],
  ['销售中心', 32, { bias: -0.45, join: 0.41, topic: '晋升与调薪' }],
  ['制造中心', 40, { bias: 0.15, join: 0.48, topic: '身心状态' }],
  ['职能中台', 11, { bias: -0.1, join: 0.55, topic: '跨部门协作' }],
  ['法务部', 3, { bias: 0.0, join: 0.6, topic: '工作意义感' }],
];
const DEPT_META = Object.fromEntries(DEPARTMENTS.map(([name, , meta]) => [name, meta]));
const CONTEXT_TAGS = ['highIntensity', 'manager', 'newcomer', 'returner', 'techTransition', 'crossCulture', 'none'];
const CONTEXT_WEIGHT = [30, 22, 26, 12, 18, 10, 82];
const contextRoster = [];
for (let i = 0; i < CONTEXT_TAGS.length; i++) {
  for (let j = 0; j < CONTEXT_WEIGHT[i]; j++) contextRoster.push(CONTEXT_TAGS[i]);
}

const deptRoster = [];
for (const [name, size] of DEPARTMENTS) for (let i = 0; i < size; i++) deptRoster.push(name);

// 演示人群：仅生成本系统内部的匿名主体，不含任何组织身份字段。
const people = [];
const deptOf = {};
// 只有一部分人真正使用过 MindBridge——覆盖率必须是算出来的，不能是 100%。
const activePeople = [];
for (let i = 0; i < HEADCOUNT; i++) {
  const anonId = `mbdemo_${String(i + 1).padStart(3, '0')}`;
  people.push(anonId);
  const name = `${ALIAS[i % ALIAS.length]}-${(i * 7919 % 65536).toString(16).toUpperCase().padStart(4, '0')}`;
  const created = startOfDay(between(30, DAYS));
  const dept = deptRoster[i] || '职能中台';
  deptOf[anonId] = dept;
  if (rnd() < (DEPT_META[dept]?.join ?? 0.5)) activePeople.push(anonId);
  const tag = contextRoster[i % contextRoster.length] || 'none';
  emit(`INSERT OR IGNORE INTO profiles (anon_id, display_name, context_tag, department, created_at, updated_at, data_origin) VALUES ('${anonId}', '${esc(name)}', '${tag}', '${esc(dept)}', ${created}, ${created}, '${ORIGIN}');`);
}

emit(`DELETE FROM tenant_profile WHERE id = 'demo';`);
emit(`INSERT INTO tenant_profile (id, display_name, headcount, industry, data_origin, updated_at) VALUES ('demo', '${esc(TENANT.name)}', ${HEADCOUNT}, '${esc(TENANT.industry)}', '${ORIGIN}', ${now});`);

let seq = 0;
const id = (prefix) => `${prefix}_seed${String(++seq).padStart(6, '0')}`;

// 路演故事线：第 6～7 周前是「Q3 冲刺」，黄色对话明显抬升；随后一周集中推送呼吸着陆法，
// 完成量上去、黄色占比回落；最近几周回到基线略好于冲刺前。
const SPRINT = { from: 44, to: 31 };
const PUSH = { from: 30, to: 19 };
const storyBias = (d) => {
  if (d <= SPRINT.from && d >= SPRINT.to) return 0.09;
  if (d <= PUSH.from && d >= PUSH.to) return 0.03;
  if (d < PUSH.to) return -0.02;
  return 0;
};
const inPush = (d) => d <= PUSH.from && d >= PUSH.to;

for (let d = DAYS - 1; d >= 0; d--) {
  const ts = startOfDay(d);
  const day = bucket(ts);
  const weekday = new Date(ts).getUTCDay();
  const workday = weekday !== 0 && weekday !== 6;
  const chats = workday ? between(16, 32) + (inPush(d) ? 6 : 0) : between(10, 13);
  for (let i = 0; i < chats; i++) {
    const emotion = pick(EMOTIONS);
    const at = ts + between(9, 23) * 3600000;
    const anonId = pick(activePeople);
    // 部门差异体现在对话的黄色占比上（情绪温度就是这么算的），
    // 而不是另造一套打卡分数——打卡入口已经下线。
    const bias = (DEPT_META[deptOf[anonId]]?.bias ?? 0) * 0.06 + storyBias(d);
    const roll = rnd();
    // 危机级表达在真实企业里是低频事件。原先 3.5% 会让 90 天累计出现 60+ 次红色，
    // 与「个案需本人同意才建立」的实际转化量对不上，看板上像是大量漏接。
    const level = roll > 0.9955 ? 'red' : roll > 0.86 - bias ? 'yellow' : 'green';
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'chat_message', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}');`);
    // 覆盖率与部门温度以「真的开口说过话的人」为分母，所以演示数据也要落到 messages。
    // body_cipher 是占位值：演示租户没有真实会话密钥，指标侧也从不解密正文。
    emit(`INSERT INTO messages (id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, data_origin) VALUES ('${id('msg')}', 'demo_conv', '${anonId}', 'user', 'demo_seed_placeholder', 'demo', '${level}', ${at}, '${ORIGIN}');`);
    if (level !== 'green') {
      emit(`INSERT INTO risk_events (id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES ('${id('risk')}', '${anonId}', NULL, '${level}', '演示数据 · 规则命中', '${esc(emotion)}', 'rules-v1', ${at}, '${ORIGIN}');`);
      emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'risk_flagged', '${esc(emotion)}', '${level}', '${day}', ${at}, '${ORIGIN}');`);
    }
    if (rnd() > 0.55 || inPush(d)) {
      const [name, resLevel] = inPush(d) && rnd() < 0.7 ? RESOURCES[0] : pick(RESOURCES);
      const state = rnd() > (inPush(d) ? 0.3 : 0.45) ? (rnd() > 0.5 ? 'completed' : 'joined') : 'offered';
      // 帮助度选填：完成的人里只有一部分会评，评价率因此低于 100%，这是真实形态。
      const done = state === 'completed';
      const rated = done && rnd() > 0.4;
      const helpfulness = rated ? ['有帮助', '有帮助', '有帮助', '说不好', '没什么用'][Math.floor(rnd() * 5)] : null;
      emit(`INSERT INTO resource_events (id, anon_id, conversation_id, resource_name, resource_level, risk_level, state, helpfulness, feedback_at, created_at, updated_at, data_origin) VALUES ('${id('res')}', '${anonId}', NULL, '${esc(name)}', '${resLevel}', '${level}', '${state}', ${helpfulness ? `'${helpfulness}'` : 'NULL'}, ${rated ? at + 3600000 : 'NULL'}, ${at}, ${at}, '${ORIGIN}');`);
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
const REPLIES = ['我也是，抱抱。', '听起来真的不容易。', '我懂这种感觉。', '谢谢你说出来。', '这两天我也一样。', '要不要一起去楼下走走。'];
let postSeq = 0;
for (let d = DAYS - 1; d >= 0; d--) {
  if (rnd() > 0.7) continue;
  const posts = between(1, 4);
  for (let k = 0; k < posts; k++) {
    const author = pick(activePeople);
    const dept = deptOf[author];
    // 大概率发本部门的主导议题，其余随机，让部门议题分布真实但不机械。
    const topicId = rnd() < 0.62 ? (DEPT_META[dept]?.topic || '加班强度') : pick(Object.keys(POST_POOL));
    const usePositive = rnd() > 0.86;
    const text = usePositive ? pick(POSITIVE_POSTS) : pick(POST_POOL[topicId]);
    const topic = classifyTopic(text);
    const postId = `post_seed${String(++postSeq).padStart(4, '0')}`;
    const at = startOfDay(d) + between(9, 21) * 3600000;
    emit(`INSERT INTO posts (id, anon_id, body_cipher, content_key_version, emotion, topic, created_at, data_origin) VALUES ('${postId}', '${author}', '${esc(text)}', 'plain', NULL, ${topic ? `'${esc(topic)}'` : 'NULL'}, ${at}, '${ORIGIN}');`);
    emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'wall_post', NULL, 'green', '${bucket(at)}', ${at}, '${ORIGIN}');`);
    for (let h = 0, hugs = between(0, 11); h < hugs; h++) {
      emit(`INSERT OR IGNORE INTO post_reactions (post_id, anon_id, kind, created_at, data_origin) VALUES ('${postId}', '${pick(activePeople)}', 'hug', ${at + h * 60000}, '${ORIGIN}');`);
      emit(`INSERT INTO aggregate_events (id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES ('${id('agg')}', 'wall_hug', NULL, 'green', '${bucket(at)}', ${at}, '${ORIGIN}');`);
    }
    for (let r = 0, reps = between(0, 3); r < reps; r++) {
      emit(`INSERT INTO post_replies (id, post_id, anon_id, body_cipher, content_key_version, created_at, data_origin) VALUES ('rep_${postId}_${r}', '${postId}', '${pick(activePeople)}', '${esc(pick(REPLIES))}', 'plain', ${at + (r + 1) * 900000}, '${ORIGIN}');`);
    }
  }
}

// 补充红色个案，使接管率与 SLA 指标自洽：
// 共 6 例，1 例待响应且仍在 SLA 内（不算漏接），2 例处理中，3 例已闭环。
const EXTRA_CASES = [
  ['MB-T4R7N2', 'active', '研发中心', 3, null],
  ['MB-Q8V1C5', 'done', '制造中心', 26, 22],
  ['MB-Z2H6M9', 'done', '客服中心', 48, 15],
];
EXTRA_CASES.forEach(([code, status, dept, hoursAgo, resp], idx) => {
  const at = now - hoursAgo * 3600000;
  const sla = at + 4 * 3600000;
  const closed = resp ? at + resp * 60000 : null;
  const log = JSON.stringify([`${new Date(at).toTimeString().slice(0, 5)} 员工授权转接，个案建立`]);
  emit(`INSERT OR REPLACE INTO appointments (id, case_code, anon_id, conversation_id, risk_level, status, share_context, note_cipher, content_key_version, department, work_profile_json, tags_json, response_minutes, log_json, sla_at, claimed_by, claimed_at, closed_at, created_at, updated_at, data_origin) VALUES ('app_seed_1${idx}', '${code}', '${people[10 + idx]}', NULL, 'red', '${status}', 0, NULL, NULL, '${esc(dept)}', '{}', '[]', ${resp ?? 'NULL'}, '${esc(log)}', ${sla}, 'staff_healer_01', ${at + 240000}, ${closed ?? 'NULL'}, ${at}, ${now}, '${ORIGIN}');`);
});

// 团队节奏（钉钉考勤/审批/待办的聚合元数据）：按周给最近 12 周，冲刺期下班时间与加班审批明显上抬。
// 只在模拟基线里出现；真实侧仍然只显示真的同步到的数据。
emit(`UPDATE sensing_signals SET enabled = 1 WHERE key IN ('attendance_off_duty', 'attendance_late_share', 'approval_overtime', 'todo_pending');`);
for (let w = 11; w >= 0; w--) {
  const dayOffset = w * 7;
  const at = startOfDay(dayOffset);
  const day = bucket(at);
  const sprint = dayOffset <= SPRINT.from && dayOffset >= SPRINT.to;
  const push = inPush(dayOffset);
  const rows = [
    ['median_off_duty_minutes', (sprint ? 19 * 60 + 40 : push ? 18 * 60 + 50 : 18 * 60 + 25) + between(-8, 8), 'minutes'],
    ['late_off_duty_share', (sprint ? 46 : push ? 31 : 22) + between(-3, 3), 'percent'],
    ['overtime_approvals', (sprint ? 58 : push ? 33 : 21) + between(-4, 4), 'count'],
    ['pending_todos', (sprint ? 9.2 : push ? 7.1 : 5.8) + between(-4, 4) / 10, 'count'],
  ];
  for (const [metric, value, unit] of rows) {
    emit(`INSERT OR REPLACE INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at) VALUES ('rhy_seed_${metric}_${day}', '${day}', '${metric}', ${value}, ${between(150, 178)}, '${unit}', 'dingtalk', '${ORIGIN}', ${at});`);
  }
}

mkdirSync('seed', { recursive: true });
writeFileSync('seed/demo_seed.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${lines.length} 条语句 → seed/demo_seed.sql`);


