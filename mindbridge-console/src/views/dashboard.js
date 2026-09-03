import { api } from '../api.js';
import { clear, el, toast } from '../dom.js';

let root;
let days = 90;
let currentPane = 'dash';
let cachedData = null;

const SUPPRESSED_TEXT = (min) => `样本不足 ${min} 人，不予展示`;
const SVG_NS = 'http://www.w3.org/2000/svg';

// 8 行业 Benchmark 常模库（取自 Demo）
const INDUSTRY_BENCH = {
  '互联网/IT': { companies: 18, employees: 8420, use: 31, complete: 66, rating: 4.3, activities: [['情绪红绿灯正念工作坊', 38, 72, 4.5], ['身份重塑叙事疗愈小组', 27, 81, 4.6], ['三分钟呼吸着陆法', 44, 76, 4.3]] },
  '金融/银行': { companies: 12, employees: 6110, use: 26, complete: 63, rating: 4.2, activities: [['积极心理与管理提升培训', 35, 68, 4.3], ['跨团队疗愈小组', 22, 79, 4.5], ['正念音频包', 31, 70, 4.1]] },
  '医护/护理': { companies: 9, employees: 5270, use: 34, complete: 71, rating: 4.5, activities: [['巴林特小组', 29, 84, 4.7], ['困境盲盒工作坊', 24, 77, 4.5], ['工间舒展操引导', 42, 73, 4.3]] },
  '教育': { companies: 11, employees: 3890, use: 29, complete: 69, rating: 4.4, activities: [['奥尔夫音乐疗愈', 32, 78, 4.6], ['ABC情绪理论工作坊', 27, 73, 4.4], ['工间舒展操引导', 35, 68, 4.2]] },
  '客服/服务业': { companies: 15, employees: 7020, use: 37, complete: 67, rating: 4.4, activities: [['「心流插花」艺术疗愈', 41, 75, 4.7], ['正念冥想工作坊', 35, 72, 4.5], ['芳香疗愈体验', 33, 70, 4.4]] },
  '制造业': { companies: 14, employees: 9630, use: 24, complete: 65, rating: 4.2, activities: [['沙盘疗愈·心声共鸣', 26, 78, 4.5], ['拳力以赴·解压拳击', 31, 69, 4.3], ['心灵驿站·常态化专业支持', 28, 74, 4.4]] },
  '科技企业': { companies: 10, employees: 4560, use: 33, complete: 70, rating: 4.5, activities: [['身份重塑叙事疗愈小组', 30, 83, 4.7], ['跨团队疗愈小组', 25, 79, 4.6], ['正念音频包', 39, 71, 4.3]] },
  '公益组织': { companies: 7, employees: 1840, use: 41, complete: 73, rating: 4.6, activities: [['巴林特小组', 36, 85, 4.8], ['心理嘉年华游园会', 48, 74, 4.6], ['情绪书写练习', 43, 76, 4.5]] },
};

const INDUSTRY_TOPICS = {
  '互联网/IT': [['技术替代焦虑', 31, 8], ['项目赶工与加班', 27, 4], ['晋升与职业路径', 18, 2], ['跨团队协作', 14, -3]],
  '金融/银行': [['业绩与指标压力', 34, 6], ['客户关系消耗', 23, 2], ['晋升竞争', 19, 3], ['跨团队协作', 12, -1]],
  '医护/护理': [['共情疲劳', 32, 5], ['轮班与睡眠', 26, 4], ['高风险责任', 21, 1], ['团队支持不足', 13, -2]],
  '教育': [['多重角色耗竭', 30, 4], ['家校沟通', 25, 3], ['行政事务负担', 20, 2], ['职业意义感', 15, -1]],
  '客服/服务业': [['客户情绪冲突', 35, 7], ['质检与绩效压力', 24, 3], ['轮班疲劳', 18, 2], ['情绪隔离困难', 14, -2]],
  '制造业': [['轮班与身体疲劳', 33, 5], ['安全责任压力', 23, 2], ['团队沟通', 17, 1], ['职业发展', 13, -1]],
  '科技企业': [['技术迭代焦虑', 36, 9], ['远程协作孤立', 22, 3], ['赶工压力', 20, 4], ['职业身份变化', 14, 2]],
  '公益组织': [['共情疲劳', 38, 6], ['使命感过载', 26, 4], ['资源不足', 19, 3], ['工作边界', 11, -2]],
};

// 干预阶梯矩阵配置库（取自 Demo）
const MATRIX_BASE = [
  { em: '😰', sig: '焦虑', hit: 214, L1: '三分钟呼吸着陆法', L2: '情绪红绿灯正念工作坊', L3: '疗愈师介入' },
  { em: '😮‍💨', sig: '疲惫', hit: 187, L1: '工间身体扫描音频', L2: '能量唤醒工作坊', L3: '疗愈师介入' },
  { em: '😤', sig: '烦躁', hit: 118, L1: '情绪暂停提醒卡片', L2: '身体觉知与释放', L3: '疗愈师介入' },
  { em: '😔', sig: '低落', hit: 96, L1: '每日三件好事打卡', L2: '身份重塑叙事疗愈小组', L3: '疗愈师介入' },
  { em: '😬', sig: '紧张', hit: 84, L1: '渐进式肌肉放松音频', L2: '情绪红绿灯正念工作坊', L3: '疗愈师介入' },
  { em: '🫥', sig: '孤独', hit: 62, L1: '正念音频包', L2: '跨团队疗愈小组', L3: '疗愈师介入' },
  { em: '🥺', sig: '委屈', hit: 53, L1: '情绪书写练习', L2: '「心流插花」艺术疗愈', L3: '疗愈师介入' },
  { em: '😡', sig: '愤怒', hit: 41, L1: '情绪暂停提醒卡片', L2: '拳力以赴·解压拳击', L3: '疗愈师介入' },
  { em: '🌫️', sig: '迷茫', hit: 39, L1: '职业价值锚点练习', L2: '身份重塑叙事疗愈小组', L3: '疗愈师介入' },
];

const TEMPLATES = {
  '互联网/IT': { name: '互联网/IT 模板', desc: '聚焦赶工焦虑、加班与身份重塑' },
  '金融/银行': { name: '金融/高压服务 模板', desc: '聚焦业绩指标、客户消耗与心理韧性' },
  '医护/护理': { name: '医护/专业关照 模板', desc: '聚焦共情疲劳、巴林特小组与轮班舒缓' },
  '客服/服务业': { name: '客服/情绪劳动 模板', desc: '聚焦客户冲突、情绪隔离与艺术疗愈' },
  '制造业': { name: '智能制造 模板', desc: '聚焦身心疲劳、常态化驻场与解压拳击' },
};

let sensingSwitches = { attendance: true, approval: true, calendar: true, todos: true };

function kpi(value, label, hint) {
  return el('div', { class: 'kp' }, [
    el('div', { class: 'v', html: value }),
    el('div', { class: 'l', text: label }),
    hint ? el('div', { class: 't', text: hint }) : null,
  ]);
}

// 压力趋势折线图
function trendChart(points, minSample) {
  const width = 720;
  const height = 180;
  const pad = { top: 14, right: 12, bottom: 22, left: 30 };
  if (!points || !points.some((p) => !p.suppressed)) {
    return el('p', { class: 'empty', text: SUPPRESSED_TEXT(minSample) });
  }
  const xStep = (width - pad.left - pad.right) / Math.max(1, points.length - 1);
  const yFor = (v) => pad.top + ((5 - v) / 4) * (height - pad.top - pad.bottom);
  const segments = [];
  let current = [];
  points.forEach((point, index) => {
    if (point.suppressed) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push(`${pad.left + index * xStep},${yFor(point.value)}`);
  });
  if (current.length) segments.push(current);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'trend');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `近 ${points.length} 天压力指数趋势`);
  for (const level of [1, 2, 3, 4, 5]) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', pad.left);
    line.setAttribute('x2', width - pad.right);
    line.setAttribute('y1', yFor(level));
    line.setAttribute('y2', yFor(level));
    line.setAttribute('class', 'grid');
    svg.append(line);
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', 6);
    label.setAttribute('y', yFor(level) + 4);
    label.setAttribute('class', 'axis');
    label.textContent = String(level);
    svg.append(label);
  }
  for (const segment of segments) {
    const path = document.createElementNS(SVG_NS, 'polyline');
    path.setAttribute('points', segment.join(' '));
    path.setAttribute('class', 'line');
    svg.append(path);
  }
  const first = points.find((p) => !p.suppressed);
  const last = [...points].reverse().find((p) => !p.suppressed);
  return el('div', {}, [
    svg,
    el('p', {
      class: 'chart-caption',
      text: `${first?.bucket || ''} → ${last?.bucket || ''} · 数值越高压力越大 · 断点表示当日样本不足 ${minSample} 人`,
    }),
  ]);
}

function originCard(title, summary, note) {
  return el('div', { class: 'origin-card' }, [
    el('h3', { text: title }),
    el('p', { class: 'origin-note', text: note }),
    el('dl', {}, [
      el('div', {}, [el('dt', { text: '事件总数' }), el('dd', { text: String(summary.eventCount) })]),
      el('div', {}, [
        el('dt', { text: '活跃人数' }),
        el('dd', { text: summary.activeUsers.suppressed ? '不予展示' : String(summary.activeUsers.value) }),
      ]),
      el('div', {}, [
        el('dt', { text: '风险人数' }),
        el('dd', {
          text: summary.riskBands.suppressed
            ? '不予展示'
            : `黄 ${summary.riskBands.yellow} · 红 ${summary.riskBands.red}`,
        }),
      ]),
    ]),
  ]);
}

// ---------------- Pane 1: 组织看板 ----------------
function renderDashPane(data) {
  const min = data.minSample;
  const topics = data.topics || {};
  const maxTopic = Math.max(...Object.values(topics), 1);

  return el('div', { class: 'inner' }, [
    el('div', { class: 'demo-banner' }, [
      el('b', { text: '⚠ 演示数据说明：' }),
      el('span', { text: '本页以预置样本为基线，并叠加当前 Demo 产生的活动事件；不代表真实组织数据。真实部署中，不足 10 人的结果不予展示。' }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi(`${data.coverage.rate}<small>%</small>`, '员工覆盖率', `↑ 较上月 ${data.coverage.delta || '+6pt'}`),
      kpi(`${data.temperature?.value || 6.4}<small>/10</small>`, '全员情绪温度', `↑ ${data.temperature?.delta || '+0.8'}`),
      kpi(`${data.risk.greenShare}<small>%</small>`, '绿色 · 日常占比', '多为轻量情绪'),
      kpi(`${data.risk.redHandledRate || '100%'}<small></small>`, '红色个案疗愈师接管率', '零漏接'),
    ]),
    el('div', { class: 'grid2' }, [
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '组织议题热度 · 本周' }), el('span', { class: 'src', text: '来源：匿名广场' })]),
        el('div', { class: 'cs', text: '员工主动谈论什么 —— 回答「公司出什么事了」' }),
        el('div', {}, Object.entries(topics).map(([name, val], i) => el('div', { class: 'tbar' }, [
          el('span', { class: 'tn', text: name }),
          el('div', { class: 'tt' }, [(() => {
            const bar = el('i');
            bar.style.width = `${Math.round((val / maxTopic) * 100)}%`;
            return bar;
          })()]),
          el('span', { class: `tv ${i === 0 ? 'up' : ''}`, text: i === 0 ? '↑ 38%' : i === 1 ? '↑ 12%' : '— 持平' }),
        ]))),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '情绪分布 · 本周' }), el('span', { class: 'src', text: '来源：私密通道' })]),
        el('div', { class: 'cs', text: '聚合后的风险等级 —— 回答「人怎么样了」' }),
        el('div', { class: 'dl' }, [
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#2d8a5e' }), el('span', { text: '绿色 · 日常' }), el('span', { class: 'dv', text: `${data.risk.greenShare}%` })]),
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#c07a2c' }), el('span', { text: '黄色 · 需关注' }), el('span', { class: 'dv', text: `${data.risk.yellowPeople}` })]),
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#c9503a' }), el('span', { text: '红色 · 已转疗愈师' }), el('span', { class: 'dv', text: `${data.risk.redPeople}` })]),
        ]),
        el('div', { class: 'redbox', html: `红色个案共 <b>${data.risk.redCount || 0}</b> 例，均已由持证疗愈师接管。<br><span class="no">你无权查看个案详情。</span>` }),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', { text: '部门概览' }),
      el('div', { class: 'cs', text: '仅显示有效样本 ≥10 人的部门' }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '部门' }), el('th', { text: '人数' }), el('th', { text: '参与率' }),
          el('th', { text: '情绪温度' }), el('th', { text: '主导议题' }), el('th', { text: '状态' }),
        ])]),
        el('tbody', {}, (data.departments || []).map((d) => {
          if (d.suppressed) {
            return el('tr', { class: 'masked' }, [
              el('td', { text: d.name }),
              el('td', { class: 'mono', text: String(d.count) }),
              el('td', { attrs: { colspan: 4 }, text: `有效样本 ${d.count} 人 (<10) · 按隐私规则不予展示` }),
            ]);
          }
          return el('tr', {}, [
            el('td', { text: d.name }),
            el('td', { class: 'mono', text: String(d.count) }),
            el('td', { class: 'mono', text: `${d.participationRate}%` }),
            el('td', { class: 'mono', text: String(d.moodTemp) }),
            el('td', { text: d.mainTopic }),
            el('td', {}, [el('span', { class: `pill ${d.level || 'g'}`, text: d.status })]),
          ]);
        })),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '团队节奏 · 研发中心' }), el('span', { class: 'src', text: '来源：钉钉考勤 / 审批 / 待办' })]),
      el('div', { class: 'cs', text: '回答「他们有多忙」—— 全部为行为元数据，不含任何消息内容' }),
      el('div', { class: 'rhy' }, [
        el('div', { class: 'ri' }, [
          el('div', { class: 'rv', text: data.rhythm?.medianOffDuty || '20:42' }),
          el('div', { class: 'rl', text: '下班打卡中位时间' }),
          el('div', { class: 'rt', text: '仅反映打卡记录时间' }),
        ]),
        el('div', { class: 'ri' }, [
          el('div', { class: 'rv', text: data.rhythm?.lateOffDutyShare || '38%' }),
          el('div', { class: 'rl', text: '晚间下班打卡占比' }),
          el('div', { class: 'rt', text: '口径：20:00 后' }),
        ]),
        el('div', { class: 'ri' }, [
          el('div', { class: 'rv', text: data.rhythm?.overtimeApproval || '14 次' }),
          el('div', { class: 'rl', text: '加班·调休审批' }),
          el('div', { class: 'rt up', text: data.rhythm?.overtimeWeekend || '其中 9 次在周末' }),
        ]),
        el('div', { class: 'ri' }, [
          el('div', { class: 'rv', text: data.rhythm?.pendingTasks || '14 项' }),
          el('div', { class: 'rl', text: '未完成待办均值' }),
          el('div', { class: 'rt', text: data.rhythm?.pendingTrend || '较上周持平' }),
        ]),
      ]),
      el('div', { class: 'rhynote', html: '<b>本系统未申请「会话内容存档」权限。</b> 消息条数、@次数、夜间消息占比这类数据，我们拿不到，也不打算拿。<br>以上指标按 ≥10 人聚合，不落个人档案，不与绩效、晋升、续聘挂钩。' }),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', { text: '压力指数趋势' }),
      trendChart(data.moodTrend, min),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', { text: '数据来源分离' }),
      el('div', { class: 'cs', text: '模拟基线与真实事件分别统计，可分别清理。真实事件样本不足时同样受阈值保护，这不是故障。' }),
      el('div', { class: 'origin-grid' }, [
        originCard('模拟基线', data.origins.demo_seed, '预置演示数据，用于呈现 200 人规模下的形态'),
        originCard('本次真实事件', data.origins.live, '现场真实钉钉员工产生，已并入上方聚合'),
      ]),
    ]),
    el('div', { class: 'blind' }, [
      el('h5', { text: '你在本系统中看不到什么' }),
      el('ul', {}, [
        el('li', { text: '任何员工的姓名、工号、账号' }),
        el('li', { text: '任何一条倾诉或发帖的原文' }),
        el('li', { text: '任何一条聊天记录、聊天对象、消息条数' }),
        el('li', { text: '红色个案的详情与处置内容' }),
        el('li', { text: '样本不足 10 人的部门数据' }),
      ]),
    ]),
    el('p', { class: 'privacy-footnote', text: `本页所有指标均为匿名聚合结果。任何维度样本量低于 ${min} 人时不出数，该阈值写死在代码中、企业管理员无法调整。本页不存在下钻到个人的入口。` }),
  ]);
}

// ---------------- Pane 2: 活动效果 ----------------
function renderActivitiesPane(data) {
  const stats = data.activityStats || {};
  const perf = data.activityPerf || {};
  const ind = data.tenant?.industry || '互联网/IT';
  const bench = INDUSTRY_BENCH[ind] || INDUSTRY_BENCH['互联网/IT'];

  return el('div', { class: 'inner' }, [
    el('div', { class: 'demo-banner' }, [
      el('b', { text: '⚠ 演示数据说明：' }),
      el('span', { text: '本页以预置样本为基线，并叠加当前 Demo 产生的活动事件；不代表真实组织数据。真实部署中，不足 10 人的结果不予展示。' }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi('43<small>%</small>', '综合参与率', '已参与 ÷ 已推荐'),
      kpi('71<small>%</small>', '综合完成率', '已完成 ÷ 已参与'),
      kpi('4.4<small>/5</small>', '综合满意度', '评分总和 ÷ 有效反馈数'),
      kpi('86<small>份</small>', '有效反馈', '已提交且评分有效的反馈数'),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: `行业 Benchmark · ${ind}` }), el('span', { class: 'src', text: 'MindBridge 跨企业匿名基准' })]),
      el('div', { class: 'cs', text: '企业只看到自己的数据与行业基准，不可查看其他企业明细。' }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [el('th', { text: '指标' }), el('th', { text: data.tenant?.name || '星原科技' }), el('th', { text: '行业均值' }), el('th', { text: '相对位置' })])]),
        el('tbody', {}, [
          el('tr', {}, [el('td', { text: 'AI 树洞月活' }), el('td', { class: 'mono', text: '42%' }), el('td', { class: 'mono', text: `${bench.use}%` }), el('td', {}, [el('span', { class: 'pill g', text: '高于均值 +11.0pt' })])]),
          el('tr', {}, [el('td', { text: '活动参与率' }), el('td', { class: 'mono', text: '43%' }), el('td', { class: 'mono', text: '31%' }), el('td', {}, [el('span', { class: 'pill g', text: '高于均值 +12.0pt' })])]),
          el('tr', {}, [el('td', { text: '活动完成率' }), el('td', { class: 'mono', text: '71%' }), el('td', { class: 'mono', text: `${bench.complete}%` }), el('td', {}, [el('span', { class: 'pill g', text: `高于均值 +${(71 - bench.complete).toFixed(1)}pt` })])]),
          el('tr', {}, [el('td', { text: '活动满意度' }), el('td', { class: 'mono', text: '4.4 / 5' }), el('td', { class: 'mono', text: `${bench.rating} / 5` }), el('td', {}, [el('span', { class: 'pill g', text: '高于均值 +0.1' })])]),
        ]),
      ]),
      el('div', { class: 'privacy-rule', text: '行业基准仅在满足最小企业数与最小样本量后展示；本企业数据会以去标识化形式进入统计池，但企业无法查看其他企业名称或单家企业明细。' }),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '不同身份标签的活动表现' }), el('span', { class: 'src', text: '去标识化聚合' })]),
      el('div', { class: 'cs', text: '只显示群体趋势，HRBP 无法查看任何员工的标签选择或活动记录。' }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [el('th', { text: '身份标签' }), el('th', { text: '有效样本' }), el('th', { text: '参与率' }), el('th', { text: '完成率' }), el('th', { text: '满意度' }), el('th', { text: '最受欢迎活动' })])]),
        el('tbody', {}, Object.entries(stats).map(([, s]) => {
          if (s.recommended < 10) {
            return el('tr', { class: 'masked' }, [
              el('td', { text: s.label }),
              el('td', { class: 'mono', text: String(s.recommended) }),
              el('td', { attrs: { colspan: 4 }, text: '样本不足 10 人 · 按隐私规则不予展示' }),
            ]);
          }
          const partPct = Math.round((s.participated / s.recommended) * 100);
          const compPct = Math.round((s.completed / s.participated) * 100);
          const ratingVal = (s.ratingTotal / s.feedback).toFixed(1);
          return el('tr', {}, [
            el('td', { text: s.label }),
            el('td', { class: 'mono', text: String(s.recommended) }),
            el('td', { class: 'mono', text: `${partPct}%` }),
            el('td', { class: 'mono', text: `${compPct}%` }),
            el('td', { class: 'mono', text: `${ratingVal} / 5 (${s.feedback}份)` }),
            el('td', { text: s.popular }),
          ]);
        })),
      ]),
      el('div', { class: 'privacy-rule', text: '隐私规则：有效样本 <10 时整行隐藏；标签不可与部门、姓名、工号交叉下钻。孕产与返岗类信息仅用于匿名支持，不得用于绩效、晋升或续聘判断。' }),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '不同线上活动的表现' }), el('span', { class: 'src', text: '全员 · 不区分身份标签' })]),
      el('div', { class: 'cs', text: '回答「哪个活动该留、哪个该换」——同一批指标，换一个切面看。线下活动依赖现场签到与满意度回收，不纳入本表。' }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [el('th', { text: '活动' }), el('th', { text: '形式' }), el('th', { text: '有效样本' }), el('th', { text: '参与率' }), el('th', { text: '完成率' }), el('th', { text: '满意度' })])]),
        el('tbody', {}, Object.entries(perf).map(([, p]) => {
          if (p.recommended < 10) {
            return el('tr', { class: 'masked' }, [
              el('td', { text: p.label }),
              el('td', { attrs: { colspan: 5 }, text: '样本不足 10 人 · 按隐私规则不予展示' }),
            ]);
          }
          const partPct = Math.round((p.participated / p.recommended) * 100);
          const compPct = Math.round((p.completed / p.participated) * 100);
          const ratingVal = (p.ratingTotal / p.feedback).toFixed(1);
          return el('tr', {}, [
            el('td', { text: p.label }),
            el('td', { text: p.form, style: 'color:var(--mut)' }),
            el('td', { class: 'mono', text: String(p.recommended) }),
            el('td', { class: 'mono', text: `${partPct}%` }),
            el('td', { class: 'mono', text: `${compPct}%` }),
            el('td', { class: 'mono', text: `${ratingVal} / 5 (${p.feedback}份)` }),
          ]);
        })),
      ]),
      el('div', { class: 'privacy-rule', text: '隐私规则：有效样本 <10 时整行隐藏，与身份标签相同的口径；本表不按身份、部门二次下钻。' }),
    ]),
  ]);
}

// ---------------- Pane 3: 行业洞察 ----------------
function renderIndustryPane(data) {
  const currentIndustry = data.tenant?.industry || '互联网/IT';
  let selectedIndustry = currentIndustry;
  const container = el('div', { class: 'inner' });

  function renderInner() {
    clear(container);
    const b = INDUSTRY_BENCH[selectedIndustry] || INDUSTRY_BENCH['互联网/IT'];
    const topics = INDUSTRY_TOPICS[selectedIndustry] || INDUSTRY_TOPICS['互联网/IT'];
    const maxVal = Math.max(...topics.map((x) => x[1]), 1);

    container.append(
      el('div', { class: 'demo-banner' }, [
        el('b', { text: '⚠ 演示数据说明：' }),
        el('span', { text: '本页展示模拟的跨企业匿名聚合 Benchmark，用于说明真实产品的数据形态。只有达到最小企业数与最小员工样本量后才形成行业基准；HR 无法查看其他企业名称、单家企业明细或任何员工个人心理数据。' }),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '当前参照组' }), el('span', { class: 'src', text: '本企业优先' })]),
        el('div', { class: 'cs', text: '先回答“我们公司在同行里处于什么位置”。参照组同时考虑行业与企业规模。' }),
        el('div', { class: 'profile-strip' }, [
          el('div', { class: 'pp' }, [
            el('span', { text: data.tenant?.name || '星原科技' }),
            el('span', { text: selectedIndustry }),
            el('span', { text: '500–1000 人' }),
            el('span', { text: '匿名聚合' }),
          ]),
          el('div', { class: 'pn', text: `行业基准：${b.companies} 家企业 / ${b.employees.toLocaleString()} 名去标识化员工；当前企业产生的新数据进入匿名统计池，但当前对照值采用已形成的历史常模。` }),
        ]),
      ]),
      el('div', { class: 'kpis' }, [
        kpi('42<small>%</small>', 'AI 树洞月活', `行业均值 ${b.use}%`),
        kpi('43<small>%</small>', '活动参与率', '行业均值 31%'),
        kpi('71<small>%</small>', '活动完成率', `行业均值 ${b.complete}%`),
        kpi('4.4<small>/5</small>', '活动满意度', `行业均值 ${b.rating.toFixed(1)}`),
      ]),
      el('div', { class: 'grid2' }, [
        el('div', { class: 'cardC' }, [
          el('h4', {}, [el('span', { text: `本行业高频议题 · ${selectedIndustry}` }), el('span', { class: 'src', text: '跨企业匿名聚合' })]),
          el('div', { class: 'cs', text: '回答“同行最近主要在经历什么”，只展示聚合后的议题分布与趋势。' }),
          el('div', {}, topics.map(([name, val, delta]) => el('div', { class: 'tbar' }, [
            el('span', { class: 'tn', text: name }),
            el('div', { class: 'tt' }, [(() => {
              const bar = el('i');
              bar.style.width = `${Math.round((val / maxVal) * 100)}%`;
              return bar;
            })()]),
            el('span', { class: `tv ${delta > 0 ? 'up' : ''}`, text: `${val}% · ${delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${Math.abs(delta)}` : '—'}pt` }),
          ]))),
        ]),
        el('div', { class: 'cardC' }, [
          el('h4', {}, [el('span', { text: `本行业支持方式表现 · ${selectedIndustry}` })]),
          el('div', { class: 'cs', text: '回答“同行什么活动更容易被使用、完成并认可”。' }),
          el('table', {}, [
            el('thead', {}, [el('tr', {}, [el('th', { text: '支持方式' }), el('th', { text: '参与率' }), el('th', { text: '完成率' }), el('th', { text: '满意度' })])]),
            el('tbody', {}, b.activities.map((a) => el('tr', {}, [
              el('td', { text: a[0] }),
              el('td', { class: 'mono', text: `${a[1]}%` }),
              el('td', { class: 'mono', text: `${a[2]}%` }),
              el('td', { class: 'mono', text: `${Number(a[3]).toFixed(1)} / 5` }),
            ]))),
          ]),
        ]),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '跨行业探索' }), el('span', { class: 'src', text: '匿名行业数据库' })]),
        el('div', { class: 'cs', text: '用于进一步查看其他行业的使用与疗愈效果常模。这里只能下钻到行业层级，不能查看单一企业。' }),
        (() => {
          const sel = el('select');
          Object.keys(INDUSTRY_BENCH).forEach((k) => {
            const opt = el('option', { attrs: { value: k }, text: k });
            if (k === selectedIndustry) opt.selected = true;
            sel.append(opt);
          });
          sel.addEventListener('change', () => {
            selectedIndustry = sel.value;
            renderInner();
          });
          return sel;
        })(),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '八行业 Benchmark 总览' }), el('span', { class: 'src', text: '跨企业匿名统计' })]),
        el('div', { class: 'cs', text: '快速比较各行业的服务使用与活动效果；“高表现活动”只展示行业聚合结果。' }),
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: '行业' }), el('th', { text: '企业样本' }), el('th', { text: '员工样本' }),
            el('th', { text: 'AI月活' }), el('th', { text: '活动完成率' }), el('th', { text: '满意度' }), el('th', { text: '高表现活动' }),
          ])]),
          el('tbody', {}, Object.entries(INDUSTRY_BENCH).map(([k, x]) => {
            const best = [...x.activities].sort((m, n) => n[3] - m[3])[0];
            return el('tr', {}, [
              el('td', { text: k }),
              el('td', { class: 'mono', text: String(x.companies) }),
              el('td', { class: 'mono', text: x.employees.toLocaleString() }),
              el('td', { class: 'mono', text: `${x.use}%` }),
              el('td', { class: 'mono', text: `${x.complete}%` }),
              el('td', { class: 'mono', text: Number(x.rating).toFixed(1) }),
              el('td', { text: best ? best[0] : '—' }),
            ]);
          })),
        ]),
      ]),
      el('div', { class: 'blind' }, [
        el('h5', { text: '行业数据边界' }),
        el('ul', {}, [
          el('li', { text: '不向任何企业披露其他企业名称、客户编码或单家企业明细' }),
          el('li', { text: '不进入员工姓名、工号、倾诉原文或个人活动记录' }),
          el('li', { text: '企业数或员工样本量不足时不生成 Benchmark' }),
          el('li', { text: '行业数据仅用于同行参照、服务配置与疗愈效果分析' }),
        ]),
      ]),
    );
  }

  renderInner();
  return container;
}

// ---------------- Pane 4: 干预阶梯配置 ----------------
function renderCfgPane() {
  const container = el('div', { class: 'inner' });
  let matrix = [...MATRIX_BASE];

  function renderInner() {
    clear(container);
    container.append(
      el('div', { class: 'cardC' }, [
        el('div', { class: 'cfghead' }, [
          el('h4', { text: '干预内容矩阵' }),
          el('div', { class: 'template-control' }, [
            el('button', {
              class: 'tplbtn', text: '套用行业模板 ▾', attrs: { type: 'button' },
              on: {
                click: (e) => {
                  const menu = document.querySelector('#tplmenu');
                  if (menu) menu.classList.toggle('on');
                  e.stopPropagation();
                },
              },
            }),
            el('div', { class: 'tplmenu', attrs: { id: 'tplmenu' } }, Object.entries(TEMPLATES).map(([indKey, tpl]) => el('button', {
              attrs: { type: 'button' },
              html: `<b>${tpl.name}</b><small>${tpl.desc}</small>`,
              on: {
                click: () => {
                  toast(`已套用「${tpl.name}」`);
                  document.querySelector('#tplmenu')?.classList.remove('on');
                },
              },
            }))),
          ]),
        ]),
        el('div', { class: 'cs', text: '纵轴决定响应内容，横轴展示三级干预路径。绿色、黄色可配置资源与支持映射；红色由专业流程统一管理，仅作展示。' }),
        el('div', { class: 'mx-wrap' }, [
          el('table', { class: 'mx' }, [
            el('thead', {}, [el('tr', {}, [
              el('th', { text: '情绪信号' }),
              el('th', { class: 'g', html: '一级干预 · 绿色<span class="lvsub">个人自助资源</span>' }),
              el('th', { class: 'y', html: '二级干预 · 黄色<span class="lvsub">团体活动与工作坊</span>' }),
              el('th', { class: 'r', html: '三级干预 · 红色<span class="lvsub">专业疗愈师介入</span>' }),
            ])]),
            el('tbody', {}, matrix.map((row) => el('tr', {}, [
              el('td', { class: 'sig' }, [el('span', { class: 'em', text: row.em }), el('span', { text: row.sig })]),
              el('td', {}, [el('span', { class: 'chipC g', text: row.L1 })]),
              el('td', {}, [el('span', { class: 'chipC y', text: row.L2 })]),
              el('td', {}, [el('span', { class: 'chipC r', text: row.L3 })]),
            ]))),
          ]),
        ]),
      ]),
      el('div', { class: 'cardC policy-card', style: 'border-left: 4px solid var(--red);' }, [
        el('h4', { text: '红色预警 · 专业介入流程' }),
        el('div', { class: 'cs', text: '命中危机词库后停止自动内容推荐，转入人工响应流程。HRBP 可查看流程，不可修改。' }),
        el('div', { class: 'policy-list' }, [
          el('div', { class: 'policy-row' }, [
            el('span', { class: 'policy-label', text: '转接前置条件' }),
            el('span', { class: 'policy-value', text: '征得员工知情同意后，方可转接专业疗愈师' }),
            el('span', { class: 'policy-source', text: '伦理委员会规则' }),
          ]),
          el('div', { class: 'policy-row' }, [
            el('span', { class: 'policy-label', text: '首次响应 SLA' }),
            el('span', { class: 'policy-value', text: '2 小时内完成首次电话或私信确认' }),
            el('span', { class: 'policy-source', text: '服务协议' }),
          ]),
          el('div', { class: 'policy-row' }, [
            el('span', { class: 'policy-label', text: '值班疗愈师' }),
            el('span', { class: 'policy-value', text: '李佳 · UH-2024-0871 · 在岗' }),
            el('span', { class: 'policy-source', text: '实时排班' }),
          ]),
          el('div', { class: 'policy-row' }, [
            el('span', { class: 'policy-label', text: '必要时专业转介' }),
            el('span', { class: 'policy-value', text: '由 MindBridge 专业团队按危机流程评估决定，企业侧不可配置具体机构' }),
            el('span', { class: 'policy-source', text: '专业流程' }),
          ]),
        ]),
      ]),
      el('div', { class: 'cardC policy-card' }, [
        el('h4', { text: '系统升级规则' }),
        el('div', { class: 'cs', text: '规则由专业团队制定并经伦理审查，系统自动执行，HRBP 不可单方调整。' }),
        el('div', { class: 'locked-panel' }, [
          el('div', { class: 'trow' }, [
            el('span', { text: '连续 ' }), el('span', { class: 'num', text: '3' }), el('span', { text: ' 天出现「累 / 撑不住」 → 升级黄色 · 推送匹配的线下/团体支持资源' }),
          ]),
          el('div', { class: 'trow' }, [
            el('span', { text: '7 天内倾诉 ≥ ' }), el('span', { class: 'num', text: '5' }), el('span', { text: ' 次 → 保持黄色关注 · 加强资源推荐与后续回访' }),
          ]),
          el('div', { class: 'trow' }, [
            el('span', { text: '命中危机词库 → 立即征求员工同意 · 同意后方可转接疗愈师' }),
          ]),
        ]),
      ]),
      el('div', { class: 'cardC policy-card' }, [
        el('h4', { text: '隐私与伦理规则' }),
        el('div', { class: 'cs', text: '以下规则为系统隐私基线，HRBP 可查看，不可单方修改。' }),
        el('div', { class: 'locked-panel' }, [
          el('div', { class: 'trow', style: 'margin-bottom:14px' }, [
            el('span', { text: '看板最小样本量 ' }), el('span', { class: 'num', text: '10' }), el('span', { text: ' 人（低于此值的部门不出数）' }),
          ]),
          el('div', { style: 'font-size:12px;font-weight:600;margin-bottom:8px', text: '匿名广场出现危机信号时——' }),
          el('div', { class: 'radio on' }, [
            el('div', { class: 'rb' }),
            el('div', { class: 'rt', html: '<b>仅向发帖人本人发出私聊邀请</b><div style="font-size:11px;color:var(--mut)">不通知任何第三方。升级与否由员工决定。</div>' }),
          ]),
          el('div', { class: 'radio dis' }, [
            el('div', { class: 'rb' }),
            el('div', { class: 'rt', html: '<b>自动上报 HRBP</b><div style="font-size:11px;color:var(--mut)">该模式已被伦理委员会禁用：构成未告知监控</div>' }),
          ]),
        ]),
      ]),
    );
  }

  document.addEventListener('click', () => {
    document.querySelector('#tplmenu')?.classList.remove('on');
  });

  renderInner();
  return container;
}

// ---------------- Pane 5: 办公数据感知 ----------------
function renderSensingPane(data) {
  const container = el('div', { class: 'inner' });
  const items = [
    { id: 'attendance', name: '考勤打卡', desc: '上下班打卡时间、出勤天数，仅计算中位时间与晚归占比' },
    { id: 'approval', name: '审批记录', desc: '加班、调休、请假申请频次，不读取请假理由与出差明细' },
    { id: 'calendar', name: '日程密度', desc: '会议时长与排布密度，不含会议标题与会议内容' },
    { id: 'todos', name: '待办任务', desc: '待办总数量与完成积压情况，不含具体任务详情' },
  ];

  function renderInner() {
    clear(container);
    container.append(
      el('div', { class: 'cardC' }, [
        el('h4', { text: '办公数据感知能力' }),
        el('div', { class: 'cs', text: 'MindBridge 仅使用经授权的非内容型工作节奏元数据。系统不在后台读取员工群聊或私人通讯内容；如某段工作消息与压力有关，由员工本人主动转发给 MindBridge。' }),
        el('div', { class: 'grp' }, items.map((item) => {
          const on = Boolean(sensingSwitches[item.id]);
          return el('button', {
            class: `grow ${on ? 'on' : ''}`, attrs: { type: 'button' },
            on: {
              click: () => {
                sensingSwitches[item.id] = !sensingSwitches[item.id];
                toast(sensingSwitches[item.id] ? `已开启「${item.name}」元数据感知` : `已关闭「${item.name}」感知`);
                renderInner();
              },
            },
          }, [
            el('div', { class: 'gk', text: on ? '✓' : '' }),
            el('div', { class: 'gi' }, [el('div', { class: 'gn', text: item.name }), el('div', { class: 'gc', text: item.desc })]),
            el('div', { class: 'gs', text: on ? '已开启' : '已关闭' }),
          ]);
        })),
        el('div', { class: 'rhynote', style: 'margin-top:16px', html: '<b>工作消息只通过员工主动转发进入个人支持空间。</b><br>HR 无法开启群聊内容读取，也不能查看员工主动转发给 MindBridge 的具体消息。' }),
      ]),
    );
  }

  renderInner();
  return container;
}

export function renderDashboard(container) {
  root = container;
  clear(root);

  // HR 5-tab 导航栏
  const navbar = el('div', { class: 'hr-navbar', attrs: { role: 'tablist' } }, [
    el('button', { class: 'hr-nav-btn on', text: '组织看板', attrs: { 'data-pane': 'dash', role: 'tab', 'aria-selected': 'true' } }),
    el('button', { class: 'hr-nav-btn', text: '活动效果', attrs: { 'data-pane': 'activities', role: 'tab', 'aria-selected': 'false' } }),
    el('button', { class: 'hr-nav-btn', text: '行业洞察', attrs: { 'data-pane': 'industry', role: 'tab', 'aria-selected': 'false' } }),
    el('button', { class: 'hr-nav-btn', text: '干预阶梯配置', attrs: { 'data-pane': 'cfg', role: 'tab', 'aria-selected': 'false' } }),
    el('button', { class: 'hr-nav-btn', text: '办公数据感知', attrs: { 'data-pane': 'sensing', role: 'tab', 'aria-selected': 'false' } }),
  ]);

  navbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.hr-nav-btn');
    if (!btn) return;
    const pane = btn.dataset.pane;
    if (pane === currentPane) return;
    currentPane = pane;
    navbar.querySelectorAll('.hr-nav-btn').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    switchPane(currentPane);
  });

  const paneContainer = el('div', { class: 'pane-container' });
  root.append(navbar, paneContainer);
}

function switchPane(pane) {
  const container = root.querySelector('.pane-container');
  if (!container || !cachedData) return;
  clear(container);
  if (pane === 'dash') container.append(renderDashPane(cachedData));
  if (pane === 'activities') container.append(renderActivitiesPane(cachedData));
  if (pane === 'industry') container.append(renderIndustryPane(cachedData));
  if (pane === 'cfg') container.append(renderCfgPane());
  if (pane === 'sensing') container.append(renderSensingPane(cachedData));
}

export async function loadDashboard() {
  try {
    cachedData = await api.metrics(days);
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '数据暂时取不到。' }));
    return null;
  }
  switchPane(currentPane);
  return cachedData;
}

export const currentWindow = () => days;
