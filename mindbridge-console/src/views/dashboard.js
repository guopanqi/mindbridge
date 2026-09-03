import { api } from '../api.js';
import { clear, el } from '../dom.js';

let root;
let days = 90;

const SUPPRESSED_TEXT = (min) => `样本不足 ${min} 人，不予展示`;
const SVG_NS = 'http://www.w3.org/2000/svg';

function kpi(label, value, hint) {
  return el('div', { class: 'kpi' }, [
    el('div', { class: 'kpi-value', text: value }),
    el('div', { class: 'kpi-label', text: label }),
    hint ? el('div', { class: 'kpi-hint', text: hint }) : null,
  ]);
}

// 压力趋势：被抑制的点断开曲线，不做插值——不能让抑制在视觉上消失。
function trendChart(points, minSample) {
  const width = 720;
  const height = 180;
  const pad = { top: 14, right: 12, bottom: 22, left: 30 };
  if (!points.some((p) => !p.suppressed)) {
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
  svg.setAttribute('aria-label', `近 ${points.length} 天压力指数趋势，1 表示状态很好，5 表示快撑不住`);
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

function emotionBars(items) {
  if (!items.length) return el('p', { class: 'empty', text: '样本不足，不予展示' });
  const max = Math.max(...items.map((i) => i.share));
  return el('div', { class: 'bars' }, items.map((item) => el('div', { class: 'bar-row' }, [
    el('span', { class: 'bar-name', text: item.emotion }),
    el('span', { class: 'bar-track' }, [
      (() => {
        const fill = el('i', { class: 'bar-fill' });
        fill.style.width = `${Math.max(4, (item.share / max) * 100)}%`;
        return fill;
      })(),
    ]),
    el('span', { class: 'bar-value', text: `${item.share}%` }),
  ])));
}

function resourceTable(rows, minSample) {
  return el('table', { class: 'grid-table' }, [
    el('thead', {}, [el('tr', {}, [
      el('th', { text: '资源' }), el('th', { text: '类型' }),
      el('th', { text: '推荐次数' }), el('th', { text: '参与率' }), el('th', { text: '完成率' }),
    ])]),
    el('tbody', {}, rows.map((row) => el('tr', {}, [
      el('td', { text: row.name }),
      el('td', { text: row.level === 'L2' ? '进一步支持' : '自助资源' }),
      row.suppressed
        ? el('td', { class: 'suppressed', attrs: { colspan: 3 }, text: SUPPRESSED_TEXT(minSample) })
        : el('td', { text: String(row.value.offered) }),
      row.suppressed ? null : el('td', { text: `${row.value.joinRate}%` }),
      row.suppressed ? null : el('td', { text: `${row.value.completeRate}%` }),
    ]))),
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

export function renderDashboard(container) {
  root = container;
}

export async function loadDashboard() {
  let data;
  try {
    data = await api.metrics(days);
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '数据暂时取不到。' }));
    return null;
  }
  const min = data.minSample;
  clear(root).append(
    el('div', { class: 'kpi-row' }, [
      kpi('覆盖率', `${data.coverage.rate}%`, `${data.window.days} 天内有过互动的员工占比`),
      kpi('绿色 · 日常占比', `${data.risk.greenShare}%`, `共 ${data.risk.totalConversations} 次对话`),
      kpi('黄色 · 需关注', data.risk.yellowPeople, '人数区间，不展示精确人数'),
      kpi('红色 · 已转专业支持', data.risk.redPeople, '人数区间，不展示精确人数'),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '压力指数趋势' }),
      trendChart(data.moodTrend, min),
    ]),
    el('section', { class: 'panel two-col' }, [
      el('div', {}, [el('h2', { text: '情绪信号分布' }), emotionBars(data.topEmotions)]),
      el('div', {}, [
        el('h2', { text: '广场活跃度' }),
        el('div', { class: 'kpi-row compact' }, [
          kpi('帖子', String(data.activity.posts), ''),
          kpi('抱抱', String(data.activity.hugs), ''),
        ]),
      ]),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '支持资源效果' }),
      resourceTable(data.resources, min),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '数据来源分离' }),
      el('p', { class: 'panel-sub', text: '模拟基线与真实事件分别统计，可分别清理。真实事件样本不足时同样受阈值保护，这不是故障。' }),
      el('div', { class: 'origin-grid' }, [
        originCard('模拟基线', data.origins.demo_seed, '预置演示数据，用于呈现 200 人规模下的形态'),
        originCard('本次真实事件', data.origins.live, '现场真实钉钉员工产生，已并入上方聚合'),
      ]),
    ]),
    el('p', {
      class: 'privacy-footnote',
      text: `本页所有指标均为匿名聚合结果。任何维度样本量低于 ${min} 人时不出数，该阈值写死在代码中、企业管理员无法调整。本页不存在下钻到个人的入口。`,
    }),
  );
  return data;
}

export const currentWindow = () => days;
