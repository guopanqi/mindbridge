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

mkdirSync('seed', { recursive: true });
writeFileSync('seed/demo_seed.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${lines.length} 条语句 → seed/demo_seed.sql`);
