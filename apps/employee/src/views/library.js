// 活动库：员工主动浏览自己可见的全部活动，不必等推荐。
//
// 它是「我的活动」下面的二级页，不占一级 tab：需要它的人是少数，
// 但需要的时候必须找得到——推荐没推到、或者想再做一次别的，都从这里进。
//
// 浏览不产生任何风险判定；点「开始」才建立参与记录。
// 未开放的线下内容仅用于预览；参与入口仍由服务端的可用性规则拦截。
import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';
import { openActivity } from './activity.js';
import { activityFacts } from './activity-facts.js';

let overlay;
let onClose = () => {};
let cache = [];
let filter = 'all';

const FILTERS = [
  ['all', '全部'],
  ['online', '线上自助'],
  ['offline', '线下活动'],
];

async function start(item) {
  try {
    const { eventId } = await api.startResource(item.id);
    // 关掉活动库再开活动浮层，避免两层浮层叠在一起。
    close();
    await openActivity(eventId, onClose);
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '该活动暂时无法打开，请稍后再试。');
  }
}

function card(item) {
  const comingSoon = item.status !== 'available';
  const statusLabel = item.status === 'paused' ? '暂时暂停' : '暂未开放';
  return el('div', { class: `lib-card${comingSoon ? ' coming-soon' : ''}` }, [
    el('div', { class: 'lib-head' }, [
      el('span', { class: 'lib-title', text: item.title }),
      comingSoon ? el('span', { class: 'lib-soon', text: statusLabel }) : null,
      // 完成次数直接显示在库里：不然从库里进来的人不知道自己已经在做了。
      item.doneCount > 0 ? el('span', { class: 'lib-done', text: `已完成 ${item.doneCount} 次` }) : null,
    ]),
    item.suitedFor ? el('p', { class: 'lib-suited', text: item.suitedFor }) : null,
    item.coreMethod ? el('p', { class: 'lib-core', text: item.coreMethod }) : null,
    item.description ? el('p', { class: 'lib-desc', text: item.description }) : null,
    comingSoon ? el('p', { class: 'lib-soon-note', text: item.kind === 'offline' ? '线下场次尚未开放，具体时间和地点将在开放时公布。' : '服务暂不可用，开放后可在这里参与。' }) : activityFacts(item),
    el('button', {
      class: 'secondary small',
      text: comingSoon ? statusLabel : item.kind === 'offline' ? '了解并报名' : '开始',
      attrs: { type: 'button', disabled: comingSoon },
      on: comingSoon ? {} : { click: () => void start(item) },
    }),
  ]);
}

function render() {
  const visible = cache.filter((item) => filter === 'all' || item.kind === filter);
  clear(overlay).append(el('div', { class: 'lib-sheet' }, [
    el('div', { class: 'act-head' }, [
      el('button', {
        class: 'act-back', text: '‹', attrs: { type: 'button', 'aria-label': '返回' },
        on: { click: () => close() },
      }),
      el('div', {}, [
        el('p', { class: 'act-title', text: '活动库' }),
        el('p', { class: 'act-meta', text: '浏览不留记录，点击开始才会计入参与。' }),
      ]),
    ]),
    el('div', { class: 'lib-body' }, [
      el('div', { class: 'chip-row' }, FILTERS.map(([key, label]) => el('button', {
        class: `chip${filter === key ? ' on' : ''}`,
        text: label,
        attrs: { type: 'button', 'aria-pressed': filter === key },
        on: { click: () => { filter = key; render(); } },
      }))),
      visible.length
        ? el('div', { class: 'lib-list' }, visible.map((item) => card(item)))
        : el('p', { class: 'empty', text: '这个分类下暂时没有活动。' }),
    ]),
  ]));
  overlay.hidden = false;
}

export function close() {
  if (overlay) {
    overlay.hidden = true;
    clear(overlay);
  }
  onClose();
}

export async function openLibrary(afterClose) {
  onClose = typeof afterClose === 'function' ? afterClose : () => {};
  if (!overlay) {
    overlay = el('div', { class: 'lib-overlay', attrs: { role: 'dialog', 'aria-modal': 'true' } });
    overlay.hidden = true;
    document.body.append(overlay);
  }
  try {
    const body = await api.resources();
    cache = body.resources;
    render();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    toast('活动库暂时无法打开，请稍后再试。');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay && !overlay.hidden) close();
});
