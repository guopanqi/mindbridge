// 我的活动：推荐 → 进行中/待参加 → 历史与结果，末尾进入活动库。
//
// 推荐、参与、历史原本散在「资源库」和「我的」两个页面，状态各维护一套，
// 结果是「我的」那套没人走、也没人发现它是坏的。这里合成一条链，只留一个入口。
//
// 推荐区只显示真实发生过的推荐（对话里推过来的，带当时记下的理由）。
// 按身份标签匹配的推荐需要一张 HR 侧的「标签 → 活动」映射，那张配置还不存在，
// 没有就不编：宁可显示「还没有推荐」，也不把活动库里的东西假装成为你挑的。
import { api, ApiError } from '../api.js';
import { cached, refresh } from '../store.js';
import { clear, el, timeAgo, toast } from '../dom.js';
import { openActivity } from './activity.js';
import { openLibrary } from './library.js';

let root;
let items = [];
let hydrated = false;

const KIND_LABEL = (item) => (item.kind === 'offline' ? '线下活动' : '线上自助');

const stateLabel = (item) => ({
  offered: '待尝试',
  joined: item.kind === 'offline' ? '已报名' : '进行中',
  completed: '已完成',
  declined: '已跳过',
}[item.state] || '状态待确认');

// 「再做一次」新建参与记录：一次参与是一次完整体验，
// 复用已完成的旧记录只会让人看到「已完成」而什么都做不了。
async function open(item, reload) {
  try {
    if (item.state === 'completed' || item.state === 'declined') {
      if (!item.activityId) {
        toast('这个活动暂时打不开。');
        return;
      }
      const { eventId } = await api.startResource(item.activityId);
      await openActivity(eventId, reload);
      return;
    }
    await openActivity(item.id, reload);
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '打不开这个活动，请稍后再试。');
  }
}

/**
 * @param {any} item
 * @param {() => void} reload
 * @param {{ reason?: string }} [options]
 */
function card(item, reload, options = {}) {
  const { reason } = options;
  const openLabel = {
    offered: item.kind === 'offline' ? '了解并报名' : '开始',
    joined: item.kind === 'offline' ? '查看报名' : '继续',
    completed: '再做一次',
    declined: '再看看',
  }[item.state] || '打开';

  return el('div', { class: 'act-card' }, [
    el('div', { class: 'act-card-head' }, [
      el('span', { class: 'act-card-title', text: item.name }),
      el('span', { class: 'act-card-state', text: stateLabel(item) }),
    ]),
    reason ? el('p', { class: 'act-card-reason', text: reason }) : null,
    el('p', { class: 'act-card-meta', text: `${KIND_LABEL(item)} · ${timeAgo(item.at)}` }),
    // 没评价就是没评价，不能显示成零分。
    item.state === 'completed' && item.helpfulness
      ? el('p', { class: 'act-card-meta', text: `你的评价：${item.helpfulness}` })
      : null,
    el('div', { class: 'act-card-actions' }, [
      el('button', {
        class: 'secondary small', text: openLabel, attrs: { type: 'button' },
        on: { click: () => void open(item, reload) },
      }),
      // 完成当时跳过了评价的，这里补一个入口——否则结果页永远走不到，
      // 因为「再做一次」一律新建参与记录，不会再打开旧的那条。
      item.state === 'completed' ? el('button', {
        class: 'link', text: '查看结果', attrs: { type: 'button' },
        on: { click: () => void openActivity(item.id, reload) },
      }) : null,
      item.state === 'offered' ? el('button', {
        class: 'link mut', text: '不感兴趣', attrs: { type: 'button' },
        on: {
          click: async () => {
            try {
              await api.activityProgress({ eventId: item.id, action: 'skip' });
              toast('已跳过。');
              reload();
            } catch {
              toast('操作没有成功，请稍后再试。');
            }
          },
        },
      }) : null,
    ]),
  ]);
}

function section(title, sub, nodes, emptyText) {
  return el('section', { class: 'act-section' }, [
    el('h2', { class: 'act-section-title', text: title }),
    sub ? el('p', { class: 'act-section-sub', text: sub }) : null,
    nodes.length ? el('div', { class: 'act-card-list' }, nodes) : el('p', { class: 'empty', text: emptyText }),
  ]);
}

function render() {
  const reload = () => void loadActivities();
  // 「推荐」只放真的被推荐过的：自己从活动库点进来但还没开始的，
  // 属于自己挑的、待参加的东西，放进推荐区会让人以为系统在推他没要过的活动。
  const offered = items.filter((item) => item.state === 'offered' && item.source !== 'self_browse');
  const ongoing = items.filter((item) => item.state === 'joined'
    || (item.state === 'offered' && item.source === 'self_browse'));
  const past = items.filter((item) => item.state === 'completed' || item.state === 'declined');

  clear(root).append(...[
    section(
      '为你推荐', '来自树洞对话的推荐，可自由选择。',
      offered.map((item) => card(item, reload, { reason: item.reason })),
      '还没有推荐。你也可以自己到活动库里找。',
    ),
    ongoing.length
      ? section('进行中 / 待参加', null, ongoing.map((item) => card(item, reload)), '')
      : null,
    section(
      '活动记录', null,
      past.map((item) => card(item, reload)),
      '还没有参加过活动。',
    ),
    el('button', {
      class: 'act-library-entry', attrs: { type: 'button' },
      on: { click: () => openLibrary(reload) },
    }, [
      el('span', { text: '浏览更多活动' }),
      el('span', { class: 'act-library-arrow', text: '›' }),
    ]),
  ].filter(Boolean));
}

export function renderActivities(container) {
  root = container;
}

export async function loadActivities() {
  // 同 me：先用缓存把列表画出来，再回源刷新。两个页面共用一次 bootstrap 请求。
  const snapshot = cached();
  if (snapshot) {
    items = snapshot.resources;
    hydrated = true;
  }
  if (hydrated) render();
  try {
    items = (await refresh()).resources;
    hydrated = true;
    render();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    if (!hydrated) clear(root).append(el('p', { class: 'empty', text: '活动暂时打不开，请稍后再试。' }));
    else toast('活动列表暂时刷新不出来。');
  }
}
