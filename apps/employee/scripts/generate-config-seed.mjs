// 干预矩阵与资源目录的出厂默认值；它们是目录数据，不参与对话判断。
import { writeFileSync } from 'node:fs';
import { INTERVENTION_DEFAULTS } from '../functions/api/_lib/intervention-defaults.js';

const esc = (s) => String(s).replace(/'/g, "''");
const now = Date.now();
const lines = ['-- 由 scripts/generate-config-seed.mjs 生成，勿手改。'];

const catalog = new Map();
let order = 0;
for (const [emotion, item] of Object.entries(INTERVENTION_DEFAULTS)) {
  order += 1;
  catalog.set(item.res.n, { level: 'L1', desc: item.res.d, icon: item.res.i });
  catalog.set(item.yellow.n, { level: 'L2', desc: item.yellow.d, icon: item.yellow.i });
  lines.push(
    `INSERT INTO intervention_matrix (emotion, icon, l1_name, l1_desc, l2_name, l2_desc, l3_action, enabled, sort_order, updated_at)`
    + ` VALUES ('${esc(emotion)}', '${esc(item.em)}', '${esc(item.res.n)}', '${esc(item.res.d)}', '${esc(item.yellow.n)}', '${esc(item.yellow.d)}', '疗愈师介入', 1, ${order}, ${now})`
    + ` ON CONFLICT(emotion) DO NOTHING;`
  );
}

// 目录里额外补充演示里出现过的活动，供 HR 在下拉中选择。
const extra = [
  ['积极心理与管理提升培训', 'L2', '管理者专场 · 压力与团队情绪管理', '🎓'],
  ['心理嘉年华游园会', 'L2', '全员活动 · 低门槛的心理健康入口', '🎪'],
  ['芳香疗愈体验', 'L2', '线下体验 · 感官放松', '🌸'],
  ['巴林特小组', 'L2', '同伴督导 · 适合助人岗位', '🫂'],
  ['正念音频包', 'L1', '即时可用 · 通用正念练习', '🎧'],
  ['情绪书写练习', 'L1', '5 分钟表达性写作', '✍️'],
  ['工间舒展操引导', 'L1', '3 分钟 · 缓解久坐紧绷', '🤸'],
];
for (const [name, level, desc, icon] of extra) {
  if (!catalog.has(name)) catalog.set(name, { level, desc, icon });
}
for (const [name, meta] of catalog) {
  lines.push(
    `INSERT INTO resource_catalog (name, level, description, icon, enabled)`
    + ` VALUES ('${esc(name)}', '${meta.level}', '${esc(meta.desc)}', '${esc(meta.icon)}', 1)`
    + ` ON CONFLICT(name) DO NOTHING;`
  );
}

// 办公数据感知：默认全部关闭。开启与否由 HR 显式配置，且必须对应已开通的钉钉权限点。
const signals = [
  ['attendance_off_duty', '下班打卡时间分布', '考勤', 'dingtalk_attendance', '打卡记录时间，用于识别持续晚归', '考勤打卡数据读权限', 1],
  ['attendance_late_share', '晚间下班打卡占比', '考勤', 'dingtalk_attendance', '口径：20:00 之后的下班打卡占比', '考勤打卡数据读权限', 2],
  ['approval_overtime', '加班与调休审批量', '审批', 'dingtalk_approval', '审批单数量，不含审批内容', '审批实例读权限', 3],
  ['todo_pending', '未完成待办均值', '待办', 'dingtalk_todo', '待办条数，不含待办标题与内容', '待办任务读权限', 4],
  ['im_content', '会话内容', '即时消息', 'none', '本系统不申请该权限，永远拿不到消息内容', '会话内容存档权限（不申请）', 99],
];
for (const [key, label, category, source, detail, perm, sort] of signals) {
  lines.push(
    `INSERT INTO sensing_signals (key, label, category, source, detail, enabled, requires_permission, sort_order, updated_at)`
    + ` VALUES ('${esc(key)}', '${esc(label)}', '${esc(category)}', '${esc(source)}', '${esc(detail)}', 0, '${esc(perm)}', ${sort}, ${now})`
    + ` ON CONFLICT(key) DO NOTHING;`
  );
}

writeFileSync('seed/config_defaults.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${lines.length - 1} 条配置默认值 → seed/config_defaults.sql`);
