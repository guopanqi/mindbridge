// 活动参与浮层：开始 → 逐步引导 → 提交页 → 完成。
//
// 没有前测和后测。开始前拦一道打分，会在人最没耐心的时刻筛掉最需要的那批人；
// 做完立刻自评又只测得到几分钟就消退的即时反应。两者都不足以支撑「效果」结论。
// 提交页只留一个可选的帮助度，不选也照常完成；留存效果由完成 3 天后的回访承担。
import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';

let overlay;
let onClose = () => {};
let state = null;
let showingPost = false;
// 选中但还没提交的评价。必须和 state.progress.helpfulness（服务端已保存的值）分开：
// 用同一个变量的话，一点选项就会被判定成「已评价」，提交按钮当场消失，请求根本发不出去。
let helpfulnessDraft = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = el('div', { class: 'act-overlay', attrs: { role: 'dialog', 'aria-modal': 'true' } });
  overlay.hidden = true;
  document.body.append(overlay);
  return overlay;
}

function header() {
  return el('div', { class: 'act-head' }, [
    el('button', {
      class: 'act-back', text: '‹', attrs: { type: 'button', 'aria-label': '关闭' },
      on: { click: () => close() },
    }),
    el('div', {}, [
      el('p', { class: 'act-title', text: state.title }),
      el('p', { class: 'act-meta', text: [state.form, state.duration].filter(Boolean).join(' · ') }),
    ]),
  ]);
}

async function send(payload) {
  const result = await api.activityProgress({ eventId: state.progress.eventId, ...payload });
  state = result.activity;
  render();
}

function renderIntro() {
  return el('div', { class: 'act-body' }, [
    el('p', { class: 'act-desc', text: state.description }),
    state.kind === 'offline'
      ? el('div', { class: 'act-info' }, [
        el('p', { text: `时间：${state.schedule || '待定'}` }),
        el('p', { text: `地点：${state.location || '待定'}` }),
      ])
      : null,
    el('button', {
      class: 'primary act-cta',
      text: state.kind === 'offline' ? '我要报名' : '开始',
      attrs: { type: 'button' },
      on: {
        click: async () => {
          try {
            await send({ action: 'start' });
          } catch (error) {
            toast(error instanceof ApiError && error.userMessage ? error.userMessage : '没能开始，请稍后再试。');
          }
        },
      },
    }),
    el('button', {
      class: 'link act-skip', text: '这个不适合我', attrs: { type: 'button' },
      on: {
        click: async () => {
          try {
            await api.activityProgress({ eventId: state.progress.eventId, action: 'skip' });
            toast('好，下次给你换一个。');
            close();
          } catch {
            toast('操作没有成功。');
          }
        },
      },
    }),
  ]);
}

const STAGE_RENDERERS = {
  prompt: () => [],
  note: () => [],
  input: stage => [
    el('textarea', { class: 'act-input', attrs: { rows: 5, placeholder: stage.hint || '写点什么…' } }),
    el('p', { class: 'act-note', text: '写下的内容只留在这个页面，不会上传，也不会被保存。' }),
  ],
  choice: stage => {
    const reflection = el('p', { class: 'act-reflection', text: '' });
    return [el('div', { class: 'act-choices' }, (stage.options || []).map(option => el('button', {
      class: 'act-choice', text: option.label, attrs: { type: 'button' },
      on: { click: event => {
        for (const node of event.currentTarget.parentElement.children) node.classList.remove('on');
        event.currentTarget.classList.add('on');
        reflection.textContent = option.reflection || option.desc || '';
      } },
    }))), reflection];
  },
};

function renderStage() {
  const index = state.progress.stageIndex || 0;
  const stage = state.stages[index];
  const isLast = index >= state.stages.length - 1;

  const nodes = [
    el('div', { class: 'act-progress' }, state.stages.map((_, i) => el('i', { class: i <= index ? 'on' : '' }))),
    el('p', { class: 'act-step-title', text: stage?.title || '' }),
    stage?.hint ? el('p', { class: 'act-step-hint', text: stage.hint }) : null,
  ];

  const renderer = Object.hasOwn(STAGE_RENDERERS, stage?.type) ? STAGE_RENDERERS[stage.type] : null;
  if (renderer) nodes.push(...renderer(stage));
  else if (stage?.fallbackHint) nodes.push(el('p', { class: 'act-note', text: stage.fallbackHint }));
  else {
    nodes.push(el('p', { class: 'act-note', text: '当前版本暂不支持这个活动步骤，请更新后再继续。' }));
    return el('div', { class: 'act-body' }, nodes);
  }
  nodes.push(el('button', {
    class: 'primary act-cta',
    text: isLast ? '做完了' : '下一步',
    attrs: { type: 'button' },
    on: {
      click: async () => {
        if (isLast) {
          showingPost = true;
          render();
          return;
        }
        try {
          await send({ action: 'stage', stageIndex: index + 1 });
        } catch {
          toast('没能继续，请稍后再试。');
        }
      },
    },
  }));

  return el('div', { class: 'act-body' }, nodes);
}

// 提交页：帮助度选填。「提交并完成」和评价在视觉上分开，
// 不选直接提交是正常路径，不做任何拦截，也不把留空当成低分。
function helpfulnessPicker() {
  const options = state.helpfulnessOptions || [];
  return el('div', {}, [
    el('p', { class: 'act-q', text: '这个活动对你有帮助吗？（可以不选）' }),
    el('div', { class: 'act-help' }, options.map((option) => el('button', {
      class: `act-help-opt${helpfulnessDraft === option ? ' on' : ''}`,
      text: option,
      attrs: { type: 'button', 'aria-pressed': helpfulnessDraft === option },
      on: {
        click: () => {
          // 再点一次取消选择，避免误触后无法回到「不评价」。
          helpfulnessDraft = helpfulnessDraft === option ? null : option;
          render();
        },
      },
    }))),
  ]);
}

function renderPostBody() {
  return el('div', { class: 'act-body' }, [
    el('p', { class: 'act-step-title', text: '做完了。' }),
    helpfulnessPicker(),
    el('button', {
      class: 'primary act-cta', text: '提交并完成', attrs: { type: 'button' },
      on: {
        click: async () => {
          try {
            await api.activityProgress({
              eventId: state.progress.eventId,
              action: 'complete',
              helpfulness: helpfulnessDraft || null,
            });
            toast('记下了。谢谢你完成它。');
            close();
          } catch (error) {
            toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交没有成功。');
          }
        },
      },
    }),
  ]);
}

// 完成之后再打开：展示结果，并允许当时跳过的人在这里补评。
function renderDoneBody() {
  return el('div', { class: 'act-body' }, [
    el('p', { class: 'act-step-title', text: '已完成' }),
    state.progress.helpfulness
      ? el('p', { class: 'act-note', text: `你的评价：${state.progress.helpfulness}` })
      : el('div', {}, [
        helpfulnessPicker(),
        el('button', {
          class: 'secondary act-cta', text: '提交评价', attrs: { type: 'button' },
          on: {
            click: async () => {
              if (!helpfulnessDraft) {
                close();
                return;
              }
              try {
                await send({ action: 'rate', helpfulness: helpfulnessDraft });
                toast('谢谢你的反馈。');
              } catch (error) {
                toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交没有成功。');
              }
            },
          },
        }),
      ]),
    el('button', {
      class: 'link act-skip', text: '关闭', attrs: { type: 'button' },
      on: { click: () => close() },
    }),
  ]);
}

// 线下活动报名后不能立刻问「做完了感觉怎么样」——活动还没发生。
// 报名后停在确认页，等员工真的参加完再回来评价。
function renderBooked() {
  return el('div', { class: 'act-body' }, [
    el('div', { class: 'act-booked' }, [
      el('p', { class: 'act-step-title', text: '已报名' }),
      el('p', { class: 'act-step-hint', text: `时间：${state.schedule || '待企业安排'}` }),
      el('p', { class: 'act-step-hint', text: `地点：${state.location || '待企业安排'}` }),
    ]),
    el('p', { class: 'act-note', text: '报名成功不算参与。等你真的到场参加完，再回来这里确认。' }),
    el('button', {
      class: 'primary act-cta', text: '我已参加', attrs: { type: 'button' },
      on: {
        click: () => {
          showingPost = true;
          render();
        },
      },
    }),
    el('button', {
      class: 'link act-skip', text: '还没参加，先关掉', attrs: { type: 'button' },
      on: { click: () => close() },
    }),
  ]);
}

function render() {
  const node = ensureOverlay();
  clear(node);
  if (!state) return;
  let body;
  if (state.progress.state === 'completed') body = renderDoneBody();
  else if (showingPost) body = renderPostBody();
  else if (state.progress.state === 'joined' && state.stages.length) body = renderStage();
  else if (state.progress.state === 'joined' && state.kind === 'offline') body = renderBooked();
  else if (state.progress.state === 'joined') body = renderPostBody();
  else body = renderIntro();
  node.append(el('div', { class: 'act-sheet' }, [header(), body]));
  node.hidden = false;
}

export function close() {
  showingPost = false;
  helpfulnessDraft = null;
  state = null;
  if (overlay && !overlay.hidden) {
    // 等收下去的动画放完再真正隐藏；直接 hidden 会让卡片凭空消失。
    const node = overlay;
    node.classList.add('closing');
    const done = () => {
      node.classList.remove('closing');
      node.hidden = true;
      clear(node);
    };
    node.addEventListener('animationend', done, { once: true });
    // 系统关掉动画时 animationend 不会触发，这里兜底。
    setTimeout(() => { if (!node.hidden) done(); }, 320);
  }
  // 关闭时一律刷新列表：中途报名、跳过、评分都会改变状态，
  // 只在「提交」时刷新会让列表显示过期状态。
  onClose();
}

export async function openActivity(eventId, afterClose) {
  onClose = typeof afterClose === 'function' ? afterClose : () => {};
  try {
    const result = await api.activity(eventId);
    state = result.activity;
    showingPost = false;
    helpfulnessDraft = null;
    const node = ensureOverlay();
    // 进场动画只在这里加一次，render() 之后的每一步都不再重播。
    node.classList.add('opening');
    setTimeout(() => node.classList.remove('opening'), 320);
    render();
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '活动内容打不开，请稍后再试。');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay && !overlay.hidden) close();
});
