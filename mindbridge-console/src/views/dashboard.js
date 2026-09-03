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
  const topics = data.topics || [];
  const maxTopic = Math.max(...topics.map((t) => t.count), 1);

  return el('div', { class: 'inner' }, [
    el('div', { class: 'demo-banner' }, [
      el('b', { text: '⚠ 演示数据说明：' }),
      el('span', { text: '本页以预置样本为基线，并叠加当前 Demo 产生的活动事件；不代表真实组织数据。真实部署中，不足 10 人的结果不予展示。' }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi(`${data.coverage.rate}<small>%</small>`, '员工覆盖率', data.coverage.delta ? `较上月 ${data.coverage.delta}` : '暂无环比'),
      kpi(
        data.temperature?.value === null || data.temperature?.value === undefined
          ? '<span class="na">样本不足</span>'
          : `${data.temperature.value}<small>/10</small>`,
        '全员情绪温度',
        data.temperature?.delta ? `较上周 ${data.temperature.delta}` : '暂无环比',
      ),
      kpi(`${data.risk.greenShare}<small>%</small>`, '绿色 · 日常占比', '多为轻量情绪'),
      kpi(
        data.risk.redOnTimeRate === null || data.risk.redOnTimeRate === undefined
          ? '<span class="na">暂无个案</span>'
          : `${data.risk.redOnTimeRate}<small>%</small>`,
        '红色个案 SLA 内响应率',
        data.risk.redBreached ? `${data.risk.redBreached} 例超时` : `${data.risk.redCases} 例中零漏接`,
      ),
    ]),
    el('div', { class: 'grid2' }, [
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '组织议题热度' }), el('span', { class: 'src', text: '来源：匿名广场 · 发帖时分类，不读取原文' })]),
        el('div', { class: 'cs', text: '员工主动谈论什么 —— 回答「公司出什么事了」' }),
        topics.length
          ? el('div', {}, topics.map((t, i) => el('div', { class: 'tbar' }, [
            el('span', { class: 'tn', text: t.topic }),
            el('div', { class: 'tt' }, [(() => {
              const bar = el('i');
              bar.style.width = `${Math.round((t.count / maxTopic) * 100)}%`;
              return bar;
            })()]),
            // 展示真实条数，不编造趋势箭头。
            el('span', { class: `tv ${i === 0 ? 'up' : ''}`, text: `${t.count} 条` }),
          ])))
          : el('div', { class: 'cs', text: '本周期内还没有可归类的广场内容。' }),
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
              el('td', { class: 'mono', text: String(d.headcount) }),
              el('td', { attrs: { colspan: 4 }, text: `有效样本 ${d.sampleSize} 人（少于 ${data.minSample} 人）· 按隐私规则不予展示` }),
            ]);
          }
          return el('tr', {}, [
            el('td', { text: d.name }),
            el('td', { class: 'mono', text: String(d.headcount) }),
            el('td', { class: 'mono', text: `${d.participationRate}%` }),
            el('td', { class: 'mono', text: String(d.moodTemp) }),
            el('td', { text: d.mainTopic }),
            el('td', {}, [el('span', { class: `pill ${d.level || 'g'}`, text: d.status })]),
          ]);
        })),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [
        el('span', { text: '团队节奏' }),
        el('span', { class: 'src', text: data.rhythm?.connected ? '来源：钉钉考勤（已连接）' : '来源：钉钉考勤（未接入）' }),
      ]),
      el('div', { class: 'cs', text: '回答「他们有多忙」—— 全部为行为元数据，不含任何消息内容。未开启或样本不足时不展示数值。' }),
      el('div', { class: 'rhy' }, (data.rhythm?.metrics || []).map((m) => {
        // 状态如实呈现：没开就说没开，没同步就说没同步，样本不够就说样本不够。
        const stateText = {
          disabled: '未开启该项感知',
          not_synced: '已开启，尚未同步',
          suppressed: `有效样本 ${m.sampleSize ?? 0} 人，低于 ${data.minSample} 人`,
        };
        return el('div', { class: `ri${m.state === 'ok' ? '' : ' ri-na'}` }, [
          el('div', { class: 'rv', html: m.state === 'ok' ? m.value : '<span class="na">—</span>' }),
          el('div', { class: 'rl', text: m.label }),
          el('div', { class: 'rt', text: m.state === 'ok' ? m.note : stateText[m.state] }),
        ]);
      })),
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
function metricCell(row, key, suffix = '') {
  if (row.suppressed) return el('td', { class: 'mono mut', text: '—' });
  const value = row.value?.[key];
  if (value === null || value === undefined) return el('td', { class: 'mono mut', text: '—' });
  return el('td', { class: 'mono', text: `${value}${suffix}` });
}

function renderActivitiesPane(data) {
  const overall = data.activityOverall || {};
  const ov = overall.value || {};
  const ind = data.tenant?.industry;
  const bench = INDUSTRY_BENCH[ind] || null;

  // 本企业数值全部来自真实聚合；行业均值是模拟对照，两者在表头明确区分。
  const compare = (mine, theirs, suffix = '%') => {
    if (mine === null || mine === undefined || !theirs) return el('td', { class: 'mut', text: '—' });
    const diff = Math.round((mine - theirs) * 10) / 10;
    const cls = diff >= 0 ? 'g' : 'y';
    return el('td', {}, [el('span', { class: `pill ${cls}`, text: `${diff >= 0 ? '高于' : '低于'}均值 ${Math.abs(diff)}${suffix === '%' ? 'pt' : ''}` })]);
  };

  return el('div', { class: 'inner' }, [
    el('div', { class: 'demo-banner' }, [
      el('b', { text: '数据说明：' }),
      el('span', { text: '本企业数值来自真实聚合（模拟基线人群 + 现场真实事件）。行业均值为模拟的跨企业对照，用于说明产品形态。样本不足的行不予展示。' }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi(ov.participationRate === undefined ? '<span class="na">样本不足</span>' : `${ov.participationRate}<small>%</small>`,
        '综合参与率', '已参与 ÷ 已推荐'),
      kpi(ov.completionRate === undefined ? '<span class="na">样本不足</span>' : `${ov.completionRate}<small>%</small>`,
        '综合完成率', '已完成 ÷ 已参与'),
      kpi(overall.avgRating === null || overall.avgRating === undefined ? '<span class="na">反馈不足</span>' : `${overall.avgRating}<small>/5</small>`,
        '综合满意度', `需至少 ${data.minSample} 份反馈`),
      kpi(`${overall.feedbackCount ?? 0}<small>份</small>`, '有效反馈', '员工主动提交的评分'),
    ]),
    bench ? el('div', { class: 'cardC' }, [
      el('h4', {}, [
        el('span', { text: `行业 Benchmark · ${ind}` }),
        el('span', { class: 'src', text: '行业均值为模拟对照' }),
      ]),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '指标' }),
          el('th', { text: `${data.tenant?.name || '本企业'}（真实聚合）` }),
          el('th', { text: '行业均值（模拟）' }),
          el('th', { text: '相对位置' }),
        ])]),
        el('tbody', {}, [
          el('tr', {}, [
            el('td', { text: '员工覆盖率' }),
            el('td', { class: 'mono', text: data.coverage.rate === null ? '—' : `${data.coverage.rate}%` }),
            el('td', { class: 'mono', text: `${bench.use}%` }),
            compare(data.coverage.rate, bench.use),
          ]),
          el('tr', {}, [
            el('td', { text: '活动参与率' }),
            el('td', { class: 'mono', text: ov.participationRate === undefined ? '—' : `${ov.participationRate}%` }),
            el('td', { class: 'mono', text: `${bench.use}%` }),
            compare(ov.participationRate, bench.use),
          ]),
          el('tr', {}, [
            el('td', { text: '活动完成率' }),
            el('td', { class: 'mono', text: ov.completionRate === undefined ? '—' : `${ov.completionRate}%` }),
            el('td', { class: 'mono', text: `${bench.complete}%` }),
            compare(ov.completionRate, bench.complete),
          ]),
          el('tr', {}, [
            el('td', { text: '活动满意度' }),
            el('td', { class: 'mono', text: overall.avgRating ? `${overall.avgRating} / 5` : '—' }),
            el('td', { class: 'mono', text: `${bench.rating} / 5` }),
            compare(overall.avgRating, bench.rating, ''),
          ]),
        ]),
      ]),
      el('div', { class: 'privacy-rule', text: '行业基准仅在满足最小企业数与最小样本量后展示；本企业数据以去标识化形式进入统计池，企业无法查看其他企业名称或单家明细。' }),
    ]) : null,
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '不同身份标签的活动表现' }), el('span', { class: 'src', text: '去标识化聚合' })]),
      el('div', { class: 'cs', text: `只显示群体趋势。有效样本少于 ${data.minSample} 人的标签不予展示，HRBP 无法查看任何员工的标签选择。` }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '身份标签' }), el('th', { text: '推荐次数' }), el('th', { text: '参与率' }),
          el('th', { text: '完成率' }), el('th', { text: '满意度' }),
        ])]),
        el('tbody', {}, (data.activityByAudience || []).map((row) => (row.suppressed
          ? el('tr', { class: 'masked' }, [
            el('td', { text: row.label }),
            el('td', { attrs: { colspan: 4 }, text: `有效样本少于 ${data.minSample} 人 · 按隐私规则不予展示` }),
          ])
          : el('tr', {}, [
            el('td', { text: row.label }),
            metricCell(row, 'recommended'),
            metricCell(row, 'participationRate', '%'),
            metricCell(row, 'completionRate', '%'),
            metricCell(row, 'avgRating'),
          ])))),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '单项活动表现' }), el('span', { class: 'src', text: '按推荐次数排序' })]),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '活动' }), el('th', { text: '层级' }), el('th', { text: '推荐次数' }),
          el('th', { text: '参与率' }), el('th', { text: '完成率' }), el('th', { text: '满意度' }),
        ])]),
        el('tbody', {}, (data.activityPerformance || []).map((row) => (row.suppressed
          ? el('tr', { class: 'masked' }, [
            el('td', { text: row.label }),
            el('td', { text: row.level }),
            el('td', { attrs: { colspan: 4 }, text: `有效样本少于 ${data.minSample} 人 · 不予展示` }),
          ])
          : el('tr', {}, [
            el('td', { text: row.label }),
            el('td', { text: row.level }),
            metricCell(row, 'recommended'),
            metricCell(row, 'participationRate', '%'),
            metricCell(row, 'completionRate', '%'),
            metricCell(row, 'avgRating'),
          ])))),
      ]),
    ]),
  ]);
}

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
function levelSelect(catalog, level, current, onChange) {
  const select = el('select', { class: 'cfg-select' });
  for (const item of catalog.filter((c) => c.level === level)) {
    const option = el('option', { text: `${item.icon || ''} ${item.name}`.trim(), attrs: { value: item.name } });
    if (item.name === current) option.selected = true;
    select.append(option);
  }
  select.addEventListener('change', () => onChange(select.value));
  return select;
}

function renderCfgPane() {
  const container = el('div', { class: 'inner' });

  async function renderInner() {
    clear(container);
    container.append(el('div', { class: 'cardC' }, [el('div', { class: 'cs', text: '正在读取配置…' })]));
    let config;
    try {
      config = await api.config();
    } catch (error) {
      clear(container).append(el('div', { class: 'cardC' }, [
        el('div', { class: 'cs', text: error.userMessage || '配置暂时取不到。' }),
      ]));
      return;
    }

    const save = async (payload, successText) => {
      try {
        await api.saveConfig(payload);
        toast(successText);
        await renderInner();
      } catch (error) {
        toast(error.userMessage || '保存失败');
        await renderInner();
      }
    };

    clear(container);
    container.append(
      el('div', { class: 'cardC' }, [
        el('h4', { text: '干预内容矩阵' }),
        el('div', { class: 'cs', text: `这是生效中的配置，不是示意图。改动保存后，员工端下一次触发该情绪信号时拿到的就是新资源。命中次数为最近 ${config.windowDays} 天的真实统计。` }),
        el('div', { class: 'mx-wrap' }, [
          el('table', { class: 'mx' }, [
            el('thead', {}, [el('tr', {}, [
              el('th', { text: '情绪信号' }),
              el('th', { text: '命中' }),
              el('th', { class: 'g', html: '一级干预 · 绿色<span class="lvsub">个人自助资源</span>' }),
              el('th', { class: 'y', html: '二级干预 · 黄色<span class="lvsub">团体活动与工作坊</span>' }),
              el('th', { class: 'r', html: '三级干预 · 红色<span class="lvsub">专业疗愈师介入</span>' }),
              el('th', { text: '启用' }),
            ])]),
            el('tbody', {}, config.matrix.map((row) => el('tr', { class: row.enabled ? '' : 'row-off' }, [
              el('td', { text: `${row.icon} ${row.emotion}` }),
              el('td', { class: 'mono', text: String(row.hits) }),
              el('td', {}, [levelSelect(config.catalog, 'L1', row.l1.name, (value) => save(
                { kind: 'matrix', emotion: row.emotion, l1Name: value },
                `「${row.emotion}」的一级资源已改为「${value}」`,
              ))]),
              el('td', {}, [levelSelect(config.catalog, 'L2', row.l2.name, (value) => save(
                { kind: 'matrix', emotion: row.emotion, l2Name: value },
                `「${row.emotion}」的二级资源已改为「${value}」`,
              ))]),
              el('td', { class: 'mut', text: row.l3 }),
              el('td', {}, [(() => {
                const box = el('input', { attrs: { type: 'checkbox' } });
                box.checked = row.enabled;
                box.addEventListener('change', () => save(
                  { kind: 'matrix', emotion: row.emotion, enabled: box.checked },
                  box.checked ? `已启用「${row.emotion}」的自动推荐` : `已停用「${row.emotion}」的自动推荐`,
                ));
                return box;
              })()]),
            ]))),
          ]),
        ]),
        el('div', { class: 'rhynote', html: '<b>红色一级不可配置。</b>危机判定与是否转接疗愈师由独立于配置的规则引擎决定，HR 无法调整触发条件，也无法关闭危机流程。' }),
      ]),
    );
  }

  void renderInner();
  return container;
}

function renderSensingPane() {
  const container = el('div', { class: 'inner' });

  async function renderInner() {
    clear(container);
    container.append(el('div', { class: 'cardC' }, [el('div', { class: 'cs', text: '正在读取配置与连接状态…' })]));
    let config;
    let status = null;
    try {
      config = await api.config();
    } catch (error) {
      clear(container).append(el('div', { class: 'cardC' }, [el('div', { class: 'cs', text: error.userMessage || '配置暂时取不到。' })]));
      return;
    }
    try {
      status = await api.rhythmStatus();
    } catch {
      status = null;
    }

    const save = async (payload, successText) => {
      try {
        await api.saveConfig(payload);
        toast(successText);
        await renderInner();
      } catch (error) {
        toast(error.userMessage || '保存失败');
      }
    };

    // 连接状态如实呈现：连上了说连上了，没连上说明缺哪个权限点，绝不显示示例数值。
    const connection = (() => {
      if (!status) return { cls: 'r', title: '未能查询连接状态', detail: '管理端到 care 的内部调用失败。' };
      if (!status.ok || !status.connected) {
        return {
          cls: 'r',
          title: '未连接钉钉考勤接口',
          detail: `钉钉返回 errcode ${status.errcode ?? '未知'}：${status.errmsg || '未知错误'}。通常是开发者后台尚未开通「考勤打卡数据读权限」，或权限范围未设为全部员工。`,
        };
      }
      if (status.suppressed) {
        return {
          cls: 'y',
          title: '已连接，但样本不足不予展示',
          detail: `接口调用成功，企业成员 ${status.orgSize} 人，本周有打卡记录 ${status.sampleSize} 人，低于最小样本 ${status.minSample} 人。按隐私规则不展示聚合结果——这不是故障。`,
        };
      }
      return {
        cls: 'g',
        title: '已连接钉钉考勤接口',
        detail: `企业成员 ${status.orgSize} 人，本周有效样本 ${status.sampleSize} 人，满足最小样本 ${status.minSample} 人。`,
      };
    })();

    clear(container);
    container.append(
      el('div', { class: 'cardC' }, [
        el('h4', { text: '钉钉数据连接状态' }),
        el('div', { class: `conn ${connection.cls}` }, [
          el('div', { class: 'conn-t', text: connection.title }),
          el('div', { class: 'conn-d', text: connection.detail }),
        ]),
        el('button', {
          class: 'bt pri', text: '立即同步一次', attrs: { type: 'button' },
          on: {
            click: async (event) => {
              event.target.disabled = true;
              event.target.textContent = '同步中…';
              try {
                const result = await api.syncRhythm();
                toast(result.ok
                  ? (result.suppressed ? `同步完成，有效样本 ${result.sampleSize} 人，未达展示阈值` : `同步完成，写入 ${result.written} 项指标`)
                  : `同步失败：${result.errmsg || '未知错误'}`);
              } catch (error) {
                toast(error.userMessage || '同步失败');
              }
              await renderInner();
            },
          },
        }),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', { text: '办公数据感知能力' }),
        el('div', { class: 'cs', text: '开关即时生效，控制系统是否采集对应的行为元数据。全部为非内容型元数据。' }),
        el('div', { class: 'grp' }, config.sensing.map((item) => el('button', {
          class: `grow ${item.enabled ? 'on' : ''} ${item.lockedOff ? 'locked' : ''}`,
          attrs: { type: 'button' },
          on: {
            click: () => {
              if (item.lockedOff) {
                toast('本系统不申请该权限，这项无法开启。');
                return;
              }
              void save(
                { kind: 'sensing', key: item.key, enabled: !item.enabled },
                item.enabled ? `已关闭「${item.label}」` : `已开启「${item.label}」`,
              );
            },
          },
        }, [
          el('div', { class: 'gk', text: item.lockedOff ? '✕' : (item.enabled ? '✓' : '') }),
          el('div', { class: 'gi' }, [
            el('div', { class: 'gn', text: `${item.label} · ${item.category}` }),
            el('div', { class: 'gc', text: item.detail }),
            el('div', { class: 'gc mut', text: item.requiresPermission ? `钉钉权限点：${item.requiresPermission}` : '' }),
          ]),
          el('div', { class: 'gs', text: item.lockedOff ? '永不采集' : (item.enabled ? '已开启' : '已关闭') }),
        ]))),
        el('div', { class: 'rhynote', html: '<b>本系统未申请「会话内容存档」权限。</b>消息条数、@次数、夜间消息占比这类数据，我们拿不到，也不打算拿。<br>工作消息只有在员工本人主动转发时才会进入个人支持空间，HR 无法查看转发内容。' }),
      ]),
    );
  }

  void renderInner();
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
