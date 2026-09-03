// 资源库：员工主动浏览全部资源。
// 浏览不产生任何风险判定；点「开始」才会建立参与记录。
import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';
import { openActivity } from './activity.js';

let root;
let cache = [];
let filter = 'all';

const FILTERS = [
  ['all', '全部'],
  ['L1', '自助资源'],
  ['L2', '团体活动'],
];

async function start(item, reload) {
  try {
    const { eventId } = await api.startResource(item.id);
    await openActivity(eventId, reload);
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '打不开这个资源，请稍后再试。');
  }
}

function card(item, reload) {
  return el('div', { class: 'lib-card' }, [
    el('div', { class: 'lib-head' }, [
      el('span', { class: 'lib-title', text: item.title }),
      item.doneCount > 0 ? el('span', { class: 'lib-done', text: `已做 ${item.doneCount} 次` }) : null,
    ]),
    item.suitedFor ? el('p', { class: 'lib-suited', text: item.suitedFor }) : null,
    item.coreMethod ? el('p', { class: 'lib-core', text: item.coreMethod }) : null,
    el('div', { class: 'lib-meta' }, [
      el('span', { text: item.form || (item.kind === 'offline' ? '线下活动' : '线上自助') }),
      item.duration ? el('span', { text: item.duration }) : null,
      item.kind === 'offline' && item.schedule ? el('span', { text: item.schedule }) : null,
    ]),
    el('button', {
      class: 'secondary small',
      text: item.kind === 'offline' ? '了解并报名' : '开始',
      attrs: { type: 'button' },
      on: { click: () => void start(item, reload) },
    }),
  ]);
}

function render() {
  const reload = () => void loadResources();
  const visible = cache.filter((item) => filter === 'all' || item.level === filter);
  clear(root).append(
    el('p', { class: 'lib-intro', text: '这里是全部可用的支持资源。你可以自己挑，不用等系统推荐。浏览不会被记录成任何情绪信号。' }),
    el('div', { class: 'chip-row' }, FILTERS.map(([key, label]) => el('button', {
      class: `chip${filter === key ? ' on' : ''}`,
      text: label,
      attrs: { type: 'button', 'aria-pressed': filter === key },
      on: { click: () => { filter = key; render(); } },
    }))),
    visible.length
      ? el('div', { class: 'lib-list' }, visible.map((item) => card(item, reload)))
      : el('p', { class: 'empty', text: '这个分类下暂时没有资源。' }),
  );
}

export function renderResources(container) {
  root = container;
}

export async function loadResources() {
  try {
    const body = await api.resources();
    cache = body.resources;
    render();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    clear(root).append(el('p', { class: 'empty', text: '资源库暂时打不开，请稍后再试。' }));
  }
}
