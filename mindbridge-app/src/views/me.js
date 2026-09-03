import { api } from '../api.js';
import { clear, el, openSheet, timeAgo, toast } from '../dom.js';

export const CONTEXT_LABELS = {
  none: '未选择',
  highIntensity: '高强度岗位员工',
  manager: '中基层管理者',
  newcomer: '新入职员工',
  returner: '女性返岗员工',
  techTransition: '面临技术焦虑 / 转型',
  crossCulture: '跨文化 / 国际员工',
};

let root;
let state = { contextTag: 'none' };
let onClearChat = async () => {};

function contextPicker(reload) {
  return el('div', { class: 'chip-row' }, Object.entries(CONTEXT_LABELS).map(([tag, label]) => el('button', {
    class: `chip${state.contextTag === tag ? ' on' : ''}`,
    text: label,
    attrs: { type: 'button', 'aria-pressed': state.contextTag === tag },
    on: {
      click: async () => {
        try {
          await api.setContext(tag);
          state.contextTag = tag;
          reload();
          toast('已更新。这只影响回应的措辞，不会改变风险判定。');
        } catch {
          toast('更新没有成功，请稍后再试。');
        }
      },
    },
  })));
}

function privacyNodes() {
  return [
    el('p', { text: '记录了什么：你在树洞里说的话、你在广场发布的内容，以及被推荐过哪些资源。原文以加密方式保存。' }),
    el('p', { text: '谁能看到：疗愈师只有在你同意后才会收到必要上下文；HR 只能看到部门层面的聚合趋势，看不到任何一条原文。' }),
    el('p', { text: '保留多久：倾诉原文默认保留 180 天，你也可以随时在「我的」里一键清空。' }),
    el('p', { text: '你的钉钉姓名和工号没有进入这套业务系统，它们只在登录那一刻被用于确认你属于本企业。' }),
  ];
}

export function renderMe(container, options = {}) {
  root = container;
  if (options.onClearChat) onClearChat = options.onClearChat;
}

export async function loadMe() {
  const reload = () => void loadMe();
  let body = { counts: { messages: 0, posts: 0 }, resources: [], retentionDays: 180 };
  try {
    const [me, history] = await Promise.all([api.me(), api.history()]);
    state.contextTag = me.contextTag;
    body = history;
  } catch {
    toast('部分信息暂时读不出来。');
  }
  clear(root).append(
    el('section', { class: 'panel' }, [
      el('h2', { text: '我的处境标签' }),
      el('p', { class: 'panel-sub', text: '可选。它只影响回应里的上下文理解，不改变情绪识别与预警规则。' }),
      contextPicker(reload),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '我的记录' }),
      el('div', { class: 'stat-row' }, [
        el('div', { class: 'stat' }, [el('b', { text: String(body.counts.messages) }), el('span', { text: '条倾诉' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(body.counts.posts) }), el('span', { text: '条广场发布' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(body.retentionDays) }), el('span', { text: '天后自动过期' })]),
      ]),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '收到过的支持资源' }),
      body.resources.length
        ? el('ul', { class: 'res-list' }, body.resources.map((item) => el('li', {}, [
          el('span', { class: 'res-name', text: item.name }),
          el('span', { class: 'res-meta', text: `${item.level === 'L2' ? '进一步支持' : '自助资源'} · ${timeAgo(item.at)}` }),
        ])))
        : el('p', { class: 'empty', text: '还没有推荐记录。' }),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '我的控制权' }),
      el('button', {
        class: 'secondary', text: '清空我的倾诉记录', attrs: { type: 'button' },
        on: {
          click: async () => {
            if (!window.confirm('清空后无法恢复，确定吗？')) return;
            try {
              await onClearChat();
              toast('已清空。');
              reload();
            } catch {
              toast('清空没有成功，请稍后再试。');
            }
          },
        },
      }),
      el('button', {
        class: 'ghost wide', text: '查看数据与隐私说明', attrs: { type: 'button' },
        on: { click: () => openSheet('你的数据在这套系统里怎么走', privacyNodes()) },
      }),
    ]),
  );
}

export const privacySheet = () => openSheet('你的数据在这套系统里怎么走', privacyNodes());
