// 行业基准演示数据。全部标记 data_origin='demo_seed'，可与真实数据分别清理。
import { writeFileSync } from 'node:fs';

const BENCH = {
  '互联网/IT': { companies: 18, employees: 8420, use: 31, complete: 66, rating: 4.3, activities: [['情绪红绿灯正念工作坊', 38, 72, 4.5], ['身份重塑叙事疗愈小组', 27, 81, 4.6], ['三分钟呼吸着陆法', 44, 76, 4.3]] },
  '金融/银行': { companies: 12, employees: 6110, use: 26, complete: 63, rating: 4.2, activities: [['积极心理与管理提升培训', 35, 68, 4.3], ['跨团队疗愈小组', 22, 79, 4.5], ['正念音频包', 31, 70, 4.1]] },
  '医护/护理': { companies: 9, employees: 5270, use: 34, complete: 71, rating: 4.5, activities: [['巴林特小组', 29, 84, 4.7], ['困境盲盒工作坊', 24, 77, 4.5], ['工间舒展操引导', 42, 73, 4.3]] },
  '教育': { companies: 11, employees: 3890, use: 29, complete: 69, rating: 4.4, activities: [['奥尔夫音乐疗愈', 32, 78, 4.6], ['ABC情绪理论工作坊', 27, 73, 4.4], ['工间舒展操引导', 35, 68, 4.2]] },
  '客服/服务业': { companies: 15, employees: 7020, use: 37, complete: 67, rating: 4.4, activities: [['「心流插花」艺术疗愈', 41, 75, 4.7], ['正念冥想工作坊', 35, 72, 4.5], ['芳香疗愈体验', 33, 70, 4.4]] },
  '制造业': { companies: 14, employees: 9630, use: 24, complete: 65, rating: 4.2, activities: [['沙盘疗愈·心声共鸣', 26, 78, 4.5], ['拳力以赴·解压拳击', 31, 69, 4.3], ['心灵驿站·常态化专业支持', 28, 74, 4.4]] },
  '科技企业': { companies: 10, employees: 4560, use: 33, complete: 70, rating: 4.5, activities: [['身份重塑叙事疗愈小组', 30, 83, 4.7], ['跨团队疗愈小组', 25, 79, 4.6], ['正念音频包', 39, 71, 4.3]] },
  '公益组织': { companies: 7, employees: 1840, use: 41, complete: 73, rating: 4.6, activities: [['巴林特小组', 36, 85, 4.8], ['心理嘉年华游园会', 48, 74, 4.6], ['情绪书写练习', 43, 76, 4.5]] },
};

const TOPICS = {
  '互联网/IT': [['技术替代焦虑', 31, 8], ['项目赶工与加班', 27, 4], ['晋升与职业路径', 18, 2], ['跨团队协作', 14, -3]],
  '金融/银行': [['业绩与指标压力', 34, 6], ['客户关系消耗', 23, 2], ['晋升竞争', 19, 3], ['跨团队协作', 12, -1]],
  '医护/护理': [['共情疲劳', 32, 5], ['轮班与睡眠', 26, 4], ['高风险责任', 21, 1], ['团队支持不足', 13, -2]],
  '教育': [['多重角色耗竭', 30, 4], ['家校沟通', 25, 3], ['行政事务负担', 20, 2], ['职业意义感', 15, -1]],
  '客服/服务业': [['客户情绪冲突', 35, 7], ['质检与绩效压力', 24, 3], ['轮班疲劳', 18, 2], ['情绪隔离困难', 14, -2]],
  '制造业': [['轮班与身体疲劳', 33, 5], ['安全责任压力', 23, 2], ['团队沟通', 17, 1], ['职业发展', 13, -1]],
  '科技企业': [['技术迭代焦虑', 36, 9], ['远程协作孤立', 22, 3], ['赶工压力', 20, 4], ['职业身份变化', 14, 2]],
  '公益组织': [['共情疲劳', 38, 6], ['使命感过载', 26, 4], ['资源不足', 19, 3], ['工作边界', 11, -2]],
};

const esc = (s) => String(s).replace(/'/g, "''");
const now = Date.now();
const lines = ['-- 由 scripts/generate-industry-seed.mjs 生成，勿手改。'];
for (const [industry, b] of Object.entries(BENCH)) {
  lines.push(`INSERT OR REPLACE INTO industry_benchmarks (industry, companies, employees, use_rate, completion_rate, avg_rating, data_origin, updated_at) VALUES ('${esc(industry)}', ${b.companies}, ${b.employees}, ${b.use}, ${b.complete}, ${b.rating}, 'demo_seed', ${now});`);
  for (const [activity, participation, completion, rating] of b.activities) {
    lines.push(`INSERT OR REPLACE INTO industry_activity_effects (industry, activity, participation_rate, completion_rate, avg_rating, data_origin) VALUES ('${esc(industry)}', '${esc(activity)}', ${participation}, ${completion}, ${rating}, 'demo_seed');`);
  }
  for (const [topic, share, delta] of TOPICS[industry] || []) {
    lines.push(`INSERT OR REPLACE INTO industry_topics (industry, topic, share, delta, data_origin) VALUES ('${esc(industry)}', '${esc(topic)}', ${share}, ${delta}, 'demo_seed');`);
  }
}
writeFileSync('seed/industry.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${lines.length - 1} 条行业基准 → seed/industry.sql`);
