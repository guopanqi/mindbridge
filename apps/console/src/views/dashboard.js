import { api } from '../api.js';
import { clear, el, toast } from '../dom.js';

let root;
let days = 90;
let dataOrigin = 'live';
let currentPane = 'dash';
let cachedData = null;
let organizationKind = 'enterprise';
let viewerRoles = [];

export function setOrganizationKind(kind) {
  organizationKind = kind === 'beta' ? 'beta' : 'enterprise';
  dataOrigin = 'live';
}

export function setViewerRoles(roles) {
  viewerRoles = Array.isArray(roles) ? roles : [];
}

const isTemplateEditor = () => viewerRoles.includes('internal_tester');

const SUPPRESSED_TEXT = (min) => `样本不足 ${min} 人，不予展示`;
const numberText = (value, suffix = '') => value === null || value === undefined ? '不予展示' : `${value}${suffix}`;
const originNote = (data) => data.origin === 'demo_seed' ? '当前为本组织演示数据，不代表真实使用；与真实数据分别统计。' : data.internalTest ? '内部测试视图：当前仅统计本组织真实使用，最小样本为 1 人。' : '当前仅统计本组织真实使用；样本不足 10 人的指标不予展示。';
const SVG_NS = 'http://www.w3.org/2000/svg';

// 8 行业 Benchmark 常模库（取自 Demo）

// 干预阶梯矩阵配置库（取自 Demo）

function kpi(value, label, hint) {
  return el('div', { class: 'kp' }, [
    el('div', { class: 'v', html: value }),
    el('div', { class: 'l', text: label }),
    hint ? el('div', { class: 't', text: hint }) : null,
  ]);
}

// 情绪温度趋势折线图：口径是 10 分制（10 = 全部对话都是绿色），纵轴只画 5～10 这一段，波动才看得出来。
function trendChart(points, minSample) {
  const Y_MIN = 5;
  const Y_MAX = 10;
  const width = 720;
  const height = 180;
  const pad = { top: 14, right: 12, bottom: 22, left: 30 };
  if (!points || !points.some((p) => !p.suppressed)) {
    return el('p', { class: 'empty', text: SUPPRESSED_TEXT(minSample) });
  }
  const xStep = (width - pad.left - pad.right) / Math.max(1, points.length - 1);
  const yFor = (v) => pad.top + ((Y_MAX - Math.max(Y_MIN, Math.min(Y_MAX, v))) / (Y_MAX - Y_MIN)) * (height - pad.top - pad.bottom);
  // 日度样本只有二三十条，逐日画会是锯齿；按 7 天滑动平均画，趋势才读得出来。断点照旧断开。
  const smoothed = points.map((point, index) => {
    if (point.suppressed) return point;
    const window = points.slice(Math.max(0, index - 6), index + 1).filter((p) => !p.suppressed);
    return { ...point, value: window.reduce((sum, p) => sum + p.value, 0) / window.length };
  });
  const segments = [];
  let current = [];
  smoothed.forEach((point, index) => {
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
  svg.setAttribute('aria-label', `近 ${points.length} 天情绪温度趋势`);
  for (const level of [5, 6, 7, 8, 9, 10]) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', String(pad.left));
    line.setAttribute('x2', String(width - pad.right));
    line.setAttribute('y1', String(yFor(level)));
    line.setAttribute('y2', String(yFor(level)));
    line.setAttribute('class', 'grid');
    svg.append(line);
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', '6');
    label.setAttribute('y', String(yFor(level) + 4));
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
      text: `${first?.bucket || ''} → ${last?.bucket || ''} · 7 天滑动平均 · 10 分表示当日对话全部为绿色；分数越低，表示需要关注的对话占比越高 · 断点表示当日样本不足 ${minSample} 人`,
    }),
  ]);
}

function originCard(title, summary, note) {
  return el('div', { class: 'origin-card' }, [
    el('h3', { text: title }),
    el('p', { class: 'origin-note', text: note }),
    el('dl', {}, [
      el('div', {}, [el('dt', { text: '事件总数' }), el('dd', { text: summary.eventCount === null ? '样本不足，不予展示' : String(summary.eventCount) })]),
      el('div', {}, [
        el('dt', { text: '活跃人数' }),
        el('dd', { text: summary.activeUsers.suppressed ? '不予展示' : String(summary.activeUsers.value) }),
      ]),
      el('div', {}, [
        el('dt', { text: '风险人数' }),
        el('dd', {
          text: summary.riskBands.suppressed
            ? '不予展示'
            : `黄 ${numberText(summary.riskBands.yellow)} · 红 ${numberText(summary.riskBands.red)}`,
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
      el('b', { text: data.origin === 'demo_seed' ? '演示数据：' : '数据说明：' }),
      el('span', { text: originNote(data) }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi(data.coverage.rate == null && data.tenant.kind === 'beta'
        ? data.coverage.activeUsers?.suppressed ? '<span class="na">不予展示</span>' : `${data.coverage.activeUsers?.value ?? 0}<small> 人</small>`
        : numberText(data.coverage.rate, '%'),
      data.tenant.kind === 'beta' ? '实际参与人数' : '员工覆盖率',
      data.tenant.kind === 'beta' ? '公开组织暂无全员花名册，以实际参与人数呈现' : data.coverage.delta ? `较上月 ${data.coverage.delta} · 有过发言的员工` : '有过发言的员工占全员'),
      kpi(
        data.temperature?.value === null || data.temperature?.value === undefined
          ? '<span class="na">样本不足</span>'
          : `${data.temperature.value}<small>/10</small>`,
        '全员情绪温度',
        // 口径已从每日心情打卡改为对话的绿/黄/红构成，这里必须写清楚，
        // 否则同一个数字在两套口径之间被当成可比的趋势。
        data.temperature?.delta ? `较上周 ${data.temperature.delta} · 按对话分级` : '按对话绿黄红构成',
      ),
      kpi(numberText(data.risk.greenShare, '%'), '绿色 · 日常占比', '以日常轻度情绪为主'),
      kpi(
        data.risk.redOnTimeRate === null || data.risk.redOnTimeRate === undefined
          ? `<span class="na">${data.risk.redCases === 0 ? '暂无个案' : '不予展示'}</span>`
          : `${data.risk.redOnTimeRate}<small>%</small>`,
        '红色个案 SLA 内响应率',
        data.risk.redCases === 0 ? '暂无红色个案' : data.risk.redCases === null ? '样本不足，暂不展示' : data.risk.redBreached
          ? `${data.risk.redBreached} 例超时`
          : `${data.risk.redCases} 例建案中，无超时`,
      ),
    ]),
    el('div', { class: 'grid2' }, [
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '组织议题热度' }), el('span', { class: 'src', text: '来源：匿名广场 · 发帖时分类，不读取原文' })]),
        el('div', { class: 'cs', text: '员工主动谈论什么 —— 呈现员工主动讨论的议题分布' }),
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
          : el('div', { class: 'cs', text: '本周期暂无可归类的广场内容。' }),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '情绪分布 · 本周' }), el('span', { class: 'src', text: '来源：私密通道' })]),
        el('div', { class: 'cs', text: '员工整体情绪状态的风险等级构成' }),
        el('div', { class: 'dl' }, [
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#2d8a5e' }), el('span', { text: '绿色 · 日常' }), el('span', { class: 'dv', text: numberText(data.risk.greenShare, '%') })]),
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#c07a2c' }), el('span', { text: '黄色 · 需关注' }), el('span', { class: 'dv', text: numberText(data.risk.yellowPeople) })]),
          el('div', { class: 'dr' }, [el('span', { class: 'sq', style: 'background:#c9503a' }), el('span', { text: '红色 · 需专业支持' }), el('span', { class: 'dv', text: numberText(data.risk.redPeople) })]),
        ]),
        // 红色信号不等于个案：必须员工本人同意才会建案并转给疗愈师。
        // 把这个漏斗写清楚，否则「信号 9 次、个案 5 例」看起来像漏接了 4 次。
        el('div', { class: 'redbox' }, [
          el('div', { class: 'funnel' }, [
            el('div', { class: 'fn' }, [
              el('b', { text: numberText(data.risk.redCount) }),
              el('span', { text: '次红色信号' }),
            ]),
            el('span', { class: 'fn-arrow', text: '→' }),
            el('div', { class: 'fn' }, [
              el('b', { text: numberText(data.risk.redCases) }),
              el('span', { text: '例经员工同意建案' }),
            ]),
            el('span', { class: 'fn-arrow', text: '→' }),
            el('div', { class: 'fn' }, [
              el('b', { text: numberText(data.risk.redHandledRate, '%') }),
              el('span', { text: '已由疗愈师跟进' }),
            ]),
          ]),
          el('p', { class: 'fn-note', text: '出现红色信号后，系统将向员工说明情况并征得其同意后方可建案；未经员工同意不会建案，也不会通知任何人。因此信号数量与建案数量并不完全对应。' }),
          el('p', { class: 'no', text: '个案详情仅对疗愈师开放。' }),
        ]),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', { text: '部门概览' }),
      el('div', { class: 'cs', text: `仅显示有效样本 ≥${min} 人的部门` }),
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
              el('td', { attrs: { colspan: 4 }, text: `有效样本少于 ${data.minSample} 人 · 按隐私规则不予展示` }),
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
      el('div', { class: 'cs', text: '反映团队忙碌程度 —— 仅使用考勤、审批等行为统计，不含任何消息内容。未开启或样本不足时不展示数值。' }),
      el('div', { class: 'rhy' }, (data.rhythm?.metrics || []).map((m) => {
        // 状态如实呈现：没开就说没开，没同步就说没同步，样本不够就说样本不够。
        const stateText = {
          disabled: '该项数据采集尚未开启',
          not_synced: '已开启，尚未同步',
          suppressed: `有效样本 ${m.sampleSize ?? 0} 人，低于 ${data.minSample} 人`,
        };
        return el('div', { class: `ri${m.state === 'ok' ? '' : ' ri-na'}` }, [
          el('div', { class: 'rv', html: m.state === 'ok' ? m.value : '<span class="na">—</span>' }),
          el('div', { class: 'rl', text: m.label }),
          el('div', { class: 'rt', text: m.state === 'ok' ? m.note : stateText[m.state] }),
        ]);
      })),
      el('div', { class: 'rhynote', html: '<b>未开通「会话内容存档」权限。</b>消息条数、@次数、夜间消息占比等与消息内容相关的指标不在采集范围内。<br>以上指标均为 ≥10 人聚合展示，不进入个人档案，不用于绩效、晋升或续聘评估。' }),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', { text: '情绪温度趋势' }),
      el('div', { class: 'cs', text: '每日对话中绿色的占比越高，温度越高。10 分表示当天全部对话都是绿色。原心情打卡入口已停止使用，本曲线不再依赖员工额外填写。' }),
      trendChart(data.moodTrend, min),
    ]),
    organizationKind === 'beta' && data.origins.demo_seed?.eventCount ? el('div', { class: 'cardC' }, [
      el('h4', { text: '本组织演示数据' }),
      el('div', { class: 'cs', text: '演示数据仅用于当前组织的形态预览，与真实使用分别统计。' }),
      el('div', { class: 'origin-grid' }, [
        originCard('演示数据', data.origins.demo_seed, '用于预览组织报表的完整形态，不代表真实使用'),
        originCard('真实数据', data.origins.live, '评审实际使用；样本不足时不展示具体指标'),
      ]),
    ]) : null,
    el('div', { class: 'blind' }, [
      el('h5', { text: '本系统不提供以下数据' }),
      el('ul', {}, [
        el('li', { text: '任何员工的姓名、工号、账号' }),
        el('li', { text: '任何一条倾诉或发帖的原文' }),
        el('li', { text: '任何一条聊天记录、聊天对象、消息条数' }),
        el('li', { text: '红色个案的详情与跟进内容' }),
        el('li', { text: '样本不足 10 人的部门数据' }),
      ]),
    ]),
    el('p', { class: 'privacy-footnote', text: `本页所有指标均为匿名聚合结果。任何维度样本量低于 ${min} 人时不展示；该阈值由系统设定，企业管理员无法调整。本页不提供查看个人数据的入口。` }),
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
  return el('div', { class: 'inner' }, [
    el('div', { class: 'demo-banner' }, [
      el('b', { text: '数据说明：' }),
      el('span', { text: originNote(data) }),
    ]),
    el('div', { class: 'kpis' }, [
      kpi(ov.participationRate == null ? '<span class="na">样本不足</span>' : `${ov.participationRate}<small>%</small>`,
        '综合参与率', '已参与 ÷ 已推荐'),
      kpi(ov.completionRate == null ? '<span class="na">样本不足</span>' : `${ov.completionRate}<small>%</small>`,
        '综合完成率', '已完成 ÷ 已参与'),
      kpi(ov.repeatRate == null ? '<span class="na">样本不足</span>' : `${ov.repeatRate}<small>%</small>`,
        '复用率', '完成过的人里再做一次的比例'),
      kpi(overall.helpfulRate === null || overall.helpfulRate === undefined ? '<span class="na">反馈不足</span>' : `${overall.helpfulRate}<small>%</small>`,
        '说有帮助的比例', overall.feedbackRate == null ? `需至少 ${data.minSample} 份评价` : `评价率 ${overall.feedbackRate}%`),
    ]),

    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '不同身份标签的活动表现' }), el('span', { class: 'src', text: '去标识化聚合' })]),
      el('div', { class: 'cs', text: `仅展示群体趋势。有效样本少于 ${data.minSample} 人的标签不予展示；任何角色均无法查看员工个人的标签选择。` }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '身份标签' }), el('th', { text: '推荐次数' }), el('th', { text: '参与率' }),
          el('th', { text: '完成率' }), el('th', { text: '有帮助占比' }), el('th', { text: '评价率' }),
        ])]),
        el('tbody', {}, (data.activityByAudience || []).map((row) => (row.suppressed
          ? el('tr', { class: 'masked' }, [
            el('td', { text: row.label }),
            el('td', { attrs: { colspan: 5 }, text: `有效样本少于 ${data.minSample} 人 · 按隐私规则不予展示` }),
          ])
          : el('tr', {}, [
            el('td', { text: row.label }),
            metricCell(row, 'recommended'),
            metricCell(row, 'participationRate', '%'),
            metricCell(row, 'completionRate', '%'),
            metricCell(row, 'helpfulRate', '%'),
            metricCell(row, 'feedbackRate', '%'),
          ])))),
      ]),
    ]),
    el('div', { class: 'cardC' }, [
      el('h4', {}, [el('span', { text: '单项活动表现' }), el('span', { class: 'src', text: '按推荐次数排序' })]),
      el('div', { class: 'cs', text: '本页不设「效果」指标：活动不再要求前后自评，仅呈现参与、完成与员工主动评价。「有帮助占比」仅统计已评价用户，须结合「评价率」解读；评价率过低时不代表全体。' }),
      el('table', {}, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '活动' }), el('th', { text: '层级' }), el('th', { text: '推荐次数' }),
          el('th', { text: '参与率' }), el('th', { text: '完成率' }),
          el('th', { text: '有帮助占比' }), el('th', { text: '评价率' }),
        ])]),
        el('tbody', {}, (data.activityPerformance || []).map((row) => (row.suppressed
          ? el('tr', { class: 'masked' }, [
            el('td', { text: row.label }),
            el('td', { text: row.level }),
            el('td', { attrs: { colspan: 5 }, text: `有效样本少于 ${data.minSample} 人 · 不予展示` }),
          ])
          : el('tr', {}, [
            el('td', { text: row.label }),
            el('td', { text: row.level }),
            metricCell(row, 'recommended'),
            metricCell(row, 'participationRate', '%'),
            metricCell(row, 'completionRate', '%'),
            metricCell(row, 'helpfulRate', '%'),
            metricCell(row, 'feedbackRate', '%'),
          ])))),
      ]),
    ]),
  ]);
}

function industryRow(cells, cls) {
  return el('tr', cls ? { class: cls } : {}, cells);
}

function renderIndustryPane(data) {
  const container = el('div', { class: 'inner' });
  let selected = data.tenant?.industry || null;

  async function renderInner() {
    clear(container);
    container.append(el('div', { class: 'cardC' }, [el('div', { class: 'cs', text: '正在读取行业基准…' })]));
    let ind;
    try {
      ind = await api.industry();
    } catch (error) {
      clear(container).append(el('div', { class: 'cardC' }, [
        el('div', { class: 'cs', text: error.userMessage || '行业数据暂时取不到。' }),
      ]));
      return;
    }
    if (!selected) selected = ind.benchmarks[0]?.industry || null;
    const own = ind.benchmarks.find((b) => b.industry === (data.tenant?.industry || selected));
    const view = ind.benchmarks.find((b) => b.industry === selected);
    const detail = ind.detail?.[selected] || { topics: [], effects: [] };
    // 「模拟」这个标注来自数据本身的 data_origin，不是写死在界面上的字。
    const simulated = ind.benchmarks.some((b) => b.simulated);
    const ov = data.activityOverall?.value || {};

    const cmp = (mine, theirs, unit = 'pt') => {
      if (mine === null || mine === undefined || theirs === null || theirs === undefined) {
        return el('td', { class: 'mut', text: '—' });
      }
      const diff = Math.round((mine - theirs) * 10) / 10;
      return el('td', {}, [el('span', {
        class: `pill ${diff >= 0 ? 'g' : 'y'}`,
        text: `${diff >= 0 ? '高于' : '低于'}均值 ${Math.abs(diff)}${unit}`,
      })]);
    };

    clear(container);
    // 直接 append(null) 会插入字面量 "null" 文本节点，这里必须过滤。
    container.append(...[
      simulated ? el('div', { class: 'demo-banner' }, [
        el('b', { text: '跨企业对照为模拟数据：' }),
        el('span', { text: `当前只有一个真实租户，行业基准由预置样本生成，用于说明产品形态。表中「${data.tenant?.name || '本企业'}」一列是真实聚合。` }),
      ]) : null,

      el('div', { class: 'cardC' }, [
        el('h4', {}, [
          el('span', { text: `本企业 vs ${own?.industry || '行业'}基准` }),
          el('span', { class: 'src', text: `样本：${own?.companies ?? 0} 家企业 · ${own?.employees ?? 0} 人` }),
        ]),
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: '指标' }),
            el('th', { text: `${data.tenant?.name || '本企业'}（真实）` }),
            el('th', { text: '行业均值（模拟）' }),
            el('th', { text: '相对位置' }),
          ])]),
          el('tbody', {}, [
            industryRow([
              el('td', { text: '员工覆盖率' }),
              el('td', { class: 'mono', text: data.coverage.rate === null ? '—' : `${data.coverage.rate}%` }),
              el('td', { class: 'mono', text: own?.useRate === null || own?.useRate === undefined ? '—' : `${own.useRate}%` }),
              cmp(data.coverage.rate, own?.useRate),
            ]),
            industryRow([
              el('td', { text: '活动完成率' }),
              el('td', { class: 'mono', text: ov.completionRate === undefined ? '—' : `${ov.completionRate}%` }),
              el('td', { class: 'mono', text: own?.completionRate === null || own?.completionRate === undefined ? '—' : `${own.completionRate}%` }),
              cmp(ov.completionRate, own?.completionRate),
            ]),
            // 「活动满意度」这一行已移除：本企业改用「说有帮助的比例」，
            // 行业基准池仍是旧的 5 分制，两者不是同一个量，并排显示会得出错误结论。
          ]),
        ]),
        el('div', { class: 'privacy-rule', text: `行业基准需至少 ${ind.thresholds.minCompanies} 家企业且合计 ${ind.thresholds.minEmployees} 人以上才形成；企业无法查看其他企业名称或单家明细。本企业数据以去标识化形式进入统计池。` }),
      ]),

      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: '按行业浏览' }), el('span', { class: 'src', text: '匿名聚合' })]),
        (() => {
          const select = el('select', { class: 'cfg-select' });
          for (const b of ind.benchmarks) {
            const option = el('option', { text: `${b.industry}（${b.companies} 家）`, attrs: { value: b.industry } });
            if (b.industry === selected) option.selected = true;
            select.append(option);
          }
          select.addEventListener('change', () => { selected = select.value; void renderInner(); });
          return select;
        })(),
        view && !view.eligible
          ? el('div', { class: 'cs', text: `该行业样本为 ${view.companies} 家企业 / ${view.employees} 人，尚未达到展示门槛，暂不展示。` })
          : el('div', { class: 'kpis' }, [
            kpi(`${view?.useRate ?? '—'}<small>%</small>`, '员工覆盖率', '行业均值'),
            kpi(`${view?.completionRate ?? '—'}<small>%</small>`, '活动完成率', '行业均值'),
            kpi(`${view?.avgRating ?? '—'}<small>/5</small>`, '活动满意度', '行业均值'),
            kpi(`${view?.companies ?? '—'}<small>家</small>`, '统计池企业数', `合计 ${view?.employees ?? 0} 人`),
          ]),
      ]),

      detail.topics.length ? el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: `${selected} · 行业议题分布` }), el('span', { class: 'src', text: '跨企业匿名聚合' })]),
        el('div', {}, detail.topics.map((t) => {
          const max = Math.max(...detail.topics.map((x) => x.share), 1);
          return el('div', { class: 'tbar' }, [
            el('span', { class: 'tn', text: t.topic }),
            el('div', { class: 'tt' }, [(() => {
              const bar = el('i');
              bar.style.width = `${Math.round((t.share / max) * 100)}%`;
              return bar;
            })()]),
            el('span', { class: `tv ${t.delta > 0 ? 'up' : ''}`, text: `${t.share}%${t.delta ? ` (${t.delta > 0 ? '+' : ''}${t.delta})` : ''}` }),
          ]);
        })),
      ]) : null,

      detail.effects.length ? el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: `${selected} · 活动效果` }), el('span', { class: 'src', text: '跨企业匿名聚合' })]),
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: '活动' }), el('th', { text: '参与率' }), el('th', { text: '完成率' }), el('th', { text: '满意度' }),
          ])]),
          el('tbody', {}, detail.effects.map((e) => el('tr', {}, [
            el('td', { text: e.activity }),
            el('td', { class: 'mono', text: `${e.participationRate}%` }),
            el('td', { class: 'mono', text: `${e.completionRate}%` }),
            el('td', { class: 'mono', text: `${e.avgRating} / 5` }),
          ]))),
        ]),
      ]) : null,

      // 八行业总览：一张表横向比较，「高表现活动」只给行业聚合里满意度最高的那一项，不落到企业。
      el('div', { class: 'cardC' }, [
        el('h4', {}, [el('span', { text: `${ind.benchmarks.length} 行业 Benchmark 总览` }), el('span', { class: 'src', text: '跨企业匿名统计' })]),
        el('div', { class: 'cs', text: '快速比较各行业的服务使用与活动效果；「高表现活动」只展示行业聚合结果。点某一行可切换上方浏览的行业。' }),
        el('table', { class: 'industry-all' }, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: '行业' }), el('th', { text: '企业样本' }), el('th', { text: '员工样本' }),
            el('th', { text: '员工覆盖率' }), el('th', { text: '活动完成率' }), el('th', { text: '满意度' }), el('th', { text: '高表现活动' }),
          ])]),
          el('tbody', {}, ind.benchmarks.map((b) => {
            const effects = ind.detail[b.industry]?.effects || [];
            const best = [...effects].sort((x, y) => y.avgRating - x.avgRating || y.completionRate - x.completionRate)[0];
            const row = el('tr', { class: b.industry === selected ? 'is-current' : '' }, [
              el('td', { text: b.industry }),
              el('td', { class: 'mono', text: String(b.companies) }),
              el('td', { class: 'mono', text: b.employees.toLocaleString() }),
              ...(b.eligible ? [
                el('td', { class: 'mono', text: `${b.useRate}%` }),
                el('td', { class: 'mono', text: `${b.completionRate}%` }),
                el('td', { class: 'mono', text: Number(b.avgRating).toFixed(1) }),
                el('td', { text: best ? `${best.activity}（${best.avgRating} / 5）` : '—' }),
               ] : [el('td', { class: 'masked', attrs: { colspan: 4 }, text: '样本未达门槛，暂不展示' })]),
            ]);
            row.addEventListener('click', () => { selected = b.industry; void renderInner(); });
            return row;
          })),
        ]),
      ]),

      el('div', { class: 'privacy-rule' }, [
        el('b', { text: '行业数据边界：' }),
        el('span', { text: '不向任何企业披露其他企业名称、客户编码或单家企业明细；不进入员工姓名、工号、倾诉原文或个人活动记录；企业数或员工样本量不足时不生成 Benchmark；行业数据仅用于同行参照、服务配置与疗愈效果分析。' }),
      ]),
    ].filter(Boolean));
  }

  void renderInner();
  return container;
}

function levelSelect(catalog, level, current, onChange) {
  const select = el('select', { class: 'cfg-select' });
  select.append(el('option', { text: '未指定 · 按活动检索', attrs: { value: '' } }));
  for (const item of catalog.filter((c) => c.level === level)) {
    const option = el('option', { text: `${item.icon || ''} ${item.name}${item.serviceStatus === 'open' ? '' : '（暂未开放）'}`.trim(), attrs: { value: item.activityId } });
    if (item.activityId === current) option.selected = true;
    select.append(option);
  }
  select.addEventListener('change', () => onChange(select.value));
  return select;
}

// 干预矩阵卡片右上角的模板控件：按钮 + 下拉选行业，与矩阵同一模块。
function templateControls(config, renderInner) {
  const templates = config.industryTemplates || {};
  const names = Object.keys(templates).sort();
  const applyTemplate = async (industry, btn) => {
    btn.disabled = true;
    try {
      const result = await api.saveConfig({ kind: 'apply_template', industry });
      const applied = result?.applied?.length ?? 0;
      const skipped = result?.skipped?.length ?? 0;
      toast(skipped
        ? `已套用「${industry}」${applied} 项，${skipped} 项因活动不可用已跳过（${(result.skipped || []).join('、')}）`
        : `已套用「${industry}」模板 · 可在下方矩阵继续微调`);
      await renderInner();
    } catch (error) {
      toast(error.userMessage || '套用失败');
      btn.disabled = false;
    }
  };
  const menu = el('div', { class: 'tplmenu' });
  // 副标题是该行业的疗愈目标（服务端 industry_template_meta，随方案演进维护），
  // 不是模板行内容的复述——行内容套用后直接可见，无需重复。
  const goals = config.industryGoals || {};
  for (const name of names) {
    const item = el('button', { attrs: { type: 'button' } }, [
      el('span', { text: name }),
      goals[name] ? el('small', { text: goals[name] }) : null,
    ]);
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.classList.remove('on');
      void applyTemplate(name, btn);
    });
    menu.append(item);
  }
  if (!names.length) menu.append(el('p', { class: 'cs', text: '服务端暂无行业模板，请联系工作人员维护。' }));
  const btn = el('button', { class: 'tplbtn', text: '套用行业模板 ▾', attrs: { type: 'button' } });
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.toggle('on');
    if (menu.classList.contains('on')) {
      document.addEventListener('click', () => menu.classList.remove('on'), { once: true });
    }
  });
  menu.addEventListener('click', (event) => event.stopPropagation());
  return { control: el('div', { class: 'template-control' }, [btn, menu]), names };
}

function templateEditor(config, names) {
  const wrap = el('div', { class: 'tpl-editor' }, [
    el('p', { class: 'cs', html: '<b>工作人员维护区：</b>此处改的是服务端全局模板，只影响以后套用的组织，不改变已套用组织的现有配置。' }),
  ]);
  if (!names.length) return wrap;
  // 模板编辑只 toast 不整页重绘：下拉框里的值本身就是最新状态，重绘反而会丢光标。
  const quietSave = async (payload, successText) => {
    try { await api.saveConfig(payload); toast(successText); }
    catch (error) { toast(error.userMessage || '保存失败'); }
  };
  const picker = el('select', { class: 'cfg-select', attrs: { 'aria-label': '编辑的行业模板' } });
  for (const name of names) picker.append(el('option', { text: name, attrs: { value: name } }));
  const rows = el('div', {});
  const paint = () => {
    clear(rows);
    const list = (config.industryTemplates || {})[picker.value] || [];
    for (const item of list) {
      rows.append(el('div', { class: 'tpl-row' }, [
        el('span', { class: 'tpl-emotion', text: item.emotion }),
        levelSelect(config.catalog, 'L1', item.l1ActivityId, (value) => quietSave(
          { kind: 'save_template', industry: picker.value, emotion: item.emotion, l1ActivityId: value || null },
          `模板「${picker.value} · ${item.emotion}」一级资源已更新`,
        )),
        levelSelect(config.catalog, 'L2', item.l2ActivityId, (value) => quietSave(
          { kind: 'save_template', industry: picker.value, emotion: item.emotion, l2ActivityId: value || null },
          `模板「${picker.value} · ${item.emotion}」二级资源已更新`,
        )),
      ]));
    }
  };
  picker.addEventListener('change', paint);
  paint();
  wrap.append(picker, rows);
  return wrap;
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
    const tpl = templateControls(config, renderInner);
    container.append(
      el('div', { class: 'cardC' }, [
        el('div', { class: 'cfghead' }, [
          el('h4', { text: '干预内容矩阵' }),
          tpl.control,
        ]),
        el('div', { class: 'cs', text: '员工请求推荐时，按情绪优先匹配已配置活动；停用后该情绪不再触发推荐。触发次数样本不足，暂不展示。' }),
        el('div', { class: 'mx-wrap' }, [
          el('table', { class: 'mx' }, [
            el('thead', {}, [el('tr', {}, [
              el('th', { text: '情绪信号' }),
              el('th', { text: '触发次数' }),
              el('th', { class: 'g', html: '一级干预 · 绿色<span class="lvsub">个人自助资源</span>' }),
              el('th', { class: 'y', html: '二级干预 · 黄色<span class="lvsub">团体活动与工作坊</span>' }),
              el('th', { class: 'r', html: '三级干预 · 红色<span class="lvsub">专业疗愈师介入</span>' }),
              el('th', { text: '启用' }),
            ])]),
            el('tbody', {}, config.matrix.map((row) => el('tr', { class: row.enabled ? '' : 'row-off' }, [
              el('td', { text: `${row.icon} ${row.emotion}` }),
              el('td', { class: 'mono', text: row.hits === null ? '隐私遮蔽' : String(row.hits) }),
              el('td', {}, [levelSelect(config.catalog, 'L1', row.l1.activityId, (value) => save(
                { kind: 'matrix', emotion: row.emotion, l1ActivityId: value },
                `「${row.emotion}」的一级资源已改为「${value}」`,
              ))]),
              el('td', {}, [levelSelect(config.catalog, 'L2', row.l2.activityId, (value) => save(
                { kind: 'matrix', emotion: row.emotion, l2ActivityId: value },
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
        el('div', { class: 'rhynote', html: '<b>红色风险识别始终启用。</b>上方开关只控制疗愈师转介；关闭时仍会提供危机热线。' }),
        isTemplateEditor() ? templateEditor(config, tpl.names) : null,
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', { text: '活动开放管理' }),
        el('p', { class: 'cs', text: '此处保存本组织的选择，产品侧服务状态独立维护。尚未开放的活动也可预先配置；只有服务开放且本组织启用时，员工才能参与。' }),
        ...(config.activityCatalog || []).map(item => {
          const box = el('input', { attrs: { type: 'checkbox', 'aria-label': item.title } });
          box.checked = item.enabled === 1;
          box.addEventListener('change', () => void save({ kind: 'activity', activityId: item.id, enabled: box.checked }, '活动开放状态已保存'));
          return el('label', { class: 'cs' }, [box, el('span', { text: `${item.title}（服务${item.service_status === 'open' && item.content_available === 1 ? '开放中' : item.service_status === 'paused' ? '暂停' : '暂未开放'}）` })]);
        }),
      ]),
      el('div', { class: 'cardC' }, [
        el('h4', { text: '疗愈师转介' }),
        el('p', { class: 'cs', text: `本组织是否启用疗愈师转介。产品侧服务状态：${config.healerServiceStatus === 'open' ? '开放中' : config.healerServiceStatus === 'paused' ? '暂停' : config.healerServiceStatus === 'retired' ? '已结束' : '筹备中'}。只有服务开放且本组织启用时，员工才能预约；12356 危机热线不受影响。` }),
        (() => {
          const box = el('input', { attrs: { type: 'checkbox', 'aria-label': '开放疗愈师转介' } });
          box.checked = config.healerOrganizationEnabled === true;
          box.addEventListener('change', () => void save({ kind: 'healer_referral', enabled: box.checked }, box.checked ? '已开放疗愈师转介' : '已关闭疗愈师转介'));
          return el('label', { class: 'cs' }, [box, el('span', { text: '开放疗愈师转介与预约' })]);
        })(),
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
      if (!status) return { cls: 'r', title: '未能查询连接状态', detail: '未能查询钉钉连接状态，请稍后重试。' };
      if (!status.ok || !status.connected) {
        // 钉钉的报错里通常带着直接申请权限的链接，原样提取出来做成可点的。
        const link = (status.errmsg || '').match(/https:\/\/open-dev\.dingtalk\.com\S+?(?=,|\]|\s|$)/)?.[0] || null;
        const scope = (status.errmsg || '').match(/所需的权限：\[([^\]]+)\]/)?.[1] || null;
        return {
          cls: 'r',
          title: '未连接钉钉接口',
          detail: scope
            ? `缺少以下钉钉权限：${scope}。在钉钉开发者后台申请开通后即可连接。`
            : status.errcode
              ? `钉钉返回 errcode ${status.errcode}：${status.errmsg || '未知错误'}`
              : '调用钉钉接口失败，请检查应用配置与网络连接后重试。',
          link,
        };
      }
      // 「没连上」「连上了但没有数据」「有数据但样本不足」是三种不同的状态，
      // 混成一句会让人分不清是权限问题还是隐私保护在起作用。
      if (status.status === 'connected_no_data') {
        return {
          cls: 'y',
          title: '已连接，但所选区间内没有打卡记录',
          detail: `通讯录与考勤接口均调用成功，企业成员 ${status.orgSize} 人，近 ${status.window?.days ?? 7} 天暂无打卡记录。如企业暂无打卡行为，将显示此状态。`,
        };
      }
      if (status.suppressed) {
        return {
          cls: 'y',
          title: '已连接，但样本不足不予展示',
          detail: `接口调用成功，企业成员 ${status.orgSize} 人，取到 ${status.recordCount} 条打卡记录、覆盖 ${status.sampleSize} 人，低于最小样本 ${status.minSample} 人。按隐私规则暂不展示聚合结果。`,
        };
      }
      return {
        cls: 'g',
        title: '已连接钉钉考勤接口',
        detail: `企业成员 ${status.orgSize} 人，取到 ${status.recordCount} 条打卡记录、覆盖 ${status.sampleSize} 人，满足最小样本 ${status.minSample} 人。`,
      };
    })();

    clear(container);
    container.append(
      el('div', { class: 'cardC' }, [
        el('h4', { text: '钉钉数据连接状态' }),
        el('div', { class: `conn ${connection.cls}` }, [
          el('div', { class: 'conn-t', text: connection.title }),
          el('div', { class: 'conn-d', text: connection.detail }),
          connection.link
            ? el('a', { class: 'conn-link', text: '前往钉钉开发者后台申请该权限 →', attrs: { href: connection.link, target: '_blank', rel: 'noopener noreferrer' } })
            : null,
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
        el('div', { class: 'cs', text: '开启后，系统将采集对应的办公行为统计（不含任何消息内容），即时生效。' }),
        el('div', { class: 'grp' }, config.sensing.map((item) => el('button', {
          class: `grow ${item.enabled ? 'on' : ''} ${item.lockedOff ? 'locked' : ''}`,
          attrs: { type: 'button' },
          on: {
            click: () => {
              if (item.lockedOff) {
                toast('该能力依赖尚未开通的平台权限，无法开启。');
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
            el('div', { class: 'gc mut', text: item.requiresPermission ? `所需钉钉权限：${item.requiresPermission}` : '' }),
          ]),
          el('div', { class: 'gs', text: item.lockedOff ? '永不采集' : (item.enabled ? '已开启' : '已关闭') }),
        ]))),
        el('div', { class: 'rhynote', html: '<b>未开通「会话内容存档」权限。</b>消息条数、@次数、夜间消息占比等与消息内容相关的指标不在采集范围内。<br>员工工作消息仅在其本人主动转发时进入个人支持空间，转发内容他人不可见。' }),
      ]),
    );
  }

  void renderInner();
  return container;
}

export function renderDashboard(container) {
  root = container;
  clear(root);

  // HR 导航：公开组织与企业共用看板与配置；钉钉考勤感知只对企业开放。
  const tabs = [
    ['dash', '组织看板'],
    ['activities', '活动效果'],
    ['industry', '行业洞察'],
    ['cfg', '干预阶梯配置'],
  ];
  if (organizationKind === 'enterprise') tabs.push(['sensing', '办公数据感知']);
  if (!tabs.some(([pane]) => pane === currentPane)) currentPane = 'dash';

  const navbar = el('div', { class: 'hr-navbar', attrs: { role: 'tablist' } }, tabs.map(([pane, label]) => el('button', {
    class: `hr-nav-btn${pane === currentPane ? ' on' : ''}`,
    text: label,
    attrs: { 'data-pane': pane, role: 'tab', 'aria-selected': String(pane === currentPane) },
  })));

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
  if (organizationKind === 'beta' && cachedData.origins.demo_seed?.eventCount) {
    const source = el('select', { attrs: { 'aria-label': '数据来源' } });
    for (const [value, label] of [['live', cachedData.internalTest ? '真实数据（内部测试视图）' : '真实数据（小样本遮蔽）'], ['demo_seed', '本组织演示数据']]) {
      const option = el('option', { text: label, attrs: { value } });
      option.selected = value === dataOrigin;
      source.append(option);
    }
    source.addEventListener('change', () => { dataOrigin = source.value; void loadDashboard(); });
    container.append(source);
  }
  if (pane === 'dash') container.append(renderDashPane(cachedData));
  if (pane === 'activities') container.append(renderActivitiesPane(cachedData));
  if (pane === 'industry') container.append(renderIndustryPane(cachedData));
  if (pane === 'cfg') container.append(renderCfgPane());
  if (pane === 'sensing') container.append(renderSensingPane());
}

export async function loadDashboard() {
  try {
    cachedData = await api.metrics(days, dataOrigin);
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '数据暂时取不到。' }));
    return null;
  }
  switchPane(currentPane);
  return cachedData;
}

export const currentWindow = () => days;
