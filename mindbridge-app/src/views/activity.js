// 活动参与浮层：前测自评 → 逐步引导 → 后测自评 → 评分。
//
// 效果度量靠前后自评差值，所以前测必须在开始引导之前完成，后测必须在结束之后。
// 中途退出不会留下任何效果值，避免伪造出「做完就变好」的结论。
import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';

let overlay;
let onClose = () => {};
let state = null;
let showingPost = false;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = el('div', { class: 'act-overlay', attrs: { role: 'dialog', 'aria-modal': 'true' } });
  overlay.hidden = true;
  document.body.append(overlay);
  return overlay;
}

function scoreScale(label, low, high, current, onPick) {
  return el('div', { class: 'act-scale' }, [
    el('p', { class: 'act-q', text: label }),
    el('div', { class: 'act-dots' }, Array.from({ length: 10 }, (_, i) => el('button', {
      class: `act-dot${current === i + 1 ? ' on' : ''}`,
      text: String(i + 1),
      attrs: { type: 'button', 'aria-label': `${i + 1} 分` },
      on: { click: () => onPick(i + 1) },
    }))),
    el('div', { class: 'act-ends' }, [
      el('span', { text: `1 · ${low}` }),
      el('span', { text: `10 · ${high}` }),
    ]),
  ]);
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
    scoreScale(
      state.preLabel || '现在的状态打几分？',
      state.lowLabel || '很轻',
      state.highLabel || '很重',
      state.progress.preScore,
      (value) => {
        state.progress.preScore = value;
        render();
      },
    ),
    el('button', {
      class: 'primary act-cta',
      text: state.kind === 'offline' ? '我要报名' : '开始',
      attrs: { type: 'button' },
      on: {
        click: async () => {
          if (!state.progress.preScore) {
            toast('先给现在的状态打个分吧。');
            return;
          }
          try {
            await send({ action: 'start', preScore: state.progress.preScore });
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

function renderStage() {
  const index = state.progress.stageIndex || 0;
  const stage = state.stages[index];
  const isLast = index >= state.stages.length - 1;

  const nodes = [
    el('div', { class: 'act-progress' }, state.stages.map((_, i) => el('i', { class: i <= index ? 'on' : '' }))),
    el('p', { class: 'act-step-title', text: stage?.title || '' }),
    stage?.hint ? el('p', { class: 'act-step-hint', text: stage.hint }) : null,
  ];

  if (stage?.type === 'choice') {
    const reflection = el('p', { class: 'act-reflection', text: '' });
    nodes.push(el('div', { class: 'act-choices' }, (stage.options || []).map((option) => el('button', {
      class: 'act-choice', attrs: { type: 'button' },
      on: {
        click: (event) => {
          const box = event.currentTarget.parentElement;
          for (const node of box.querySelectorAll('.act-choice')) node.classList.remove('on');
          event.currentTarget.classList.add('on');
          reflection.textContent = option.reflection || '';
        },
      },
    }, [
      el('span', { class: 'act-choice-ico', text: option.icon || '·' }),
      el('span', { class: 'act-choice-body' }, [
        el('b', { text: option.label }),
        option.desc ? el('span', { class: 'act-choice-desc', text: option.desc }) : null,
      ]),
    ]))));
    nodes.push(reflection);
  }

  if (stage?.type === 'input') {
    nodes.push(el('textarea', { class: 'act-input', attrs: { rows: 5, placeholder: stage.hint || '写点什么…' } }));
    nodes.push(el('p', { class: 'act-note', text: '写下的内容只留在这个页面，不会上传，也不会被保存。' }));
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

function renderPostBody() {
  return el('div', { class: 'act-body' }, [
    el('p', { class: 'act-step-title', text: '做完了。现在感觉怎么样？' }),
    scoreScale(
      state.preLabel || '现在的状态打几分？',
      state.lowLabel || '很轻',
      state.highLabel || '很重',
      state.progress.postScore,
      (value) => {
        state.progress.postScore = value;
        render();
      },
    ),
    el('p', { class: 'act-q', text: '这个活动对你有帮助吗？' }),
    el('div', { class: 'act-stars' }, [1, 2, 3, 4, 5].map((n) => el('button', {
      class: `star${(state.progress.rating || 0) >= n ? ' on' : ''}`,
      text: '★',
      attrs: { type: 'button', 'aria-label': `${n} 分` },
      on: {
        click: () => {
          state.progress.rating = n;
          render();
        },
      },
    }))),
    el('button', {
      class: 'primary act-cta', text: '提交', attrs: { type: 'button' },
      on: {
        click: async () => {
          if (!state.progress.postScore) {
            toast('先给现在的状态打个分。');
            return;
          }
          const pre = state.progress.preScore || 0;
          const post = state.progress.postScore;
          const direction = state.direction;
          const label = state.scoreLabel || '状态';
          try {
            await api.activityProgress({
              eventId: state.progress.eventId,
              action: 'complete',
              postScore: post,
              rating: state.progress.rating || null,
            });
            const delta = pre - post;
            const better = direction === 'down' ? delta > 0 : delta < 0;
            toast(better
              ? `记下了。${label}比开始时${direction === 'down' ? '低' : '高'}了 ${Math.abs(delta)} 分。`
              : '记下了。谢谢你完成它。');
            close();
          } catch (error) {
            toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交没有成功。');
          }
        },
      },
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
    el('p', { class: 'act-note', text: `报名时你给「${state.scoreLabel || '状态'}」打了 ${state.progress.preScore} 分。参加完再回来打一次，就能看到变化。` }),
    el('button', {
      class: 'primary act-cta', text: '我已参加，现在评价', attrs: { type: 'button' },
      on: { click: () => renderPost() },
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
  if (showingPost) body = renderPostBody();
  else if (state.progress.state === 'joined' && state.stages.length) body = renderStage();
  else if (state.progress.state === 'joined' && state.kind === 'offline') body = renderBooked();
  else if (state.progress.state === 'joined') body = renderPostBody();
  else body = renderIntro();
  node.append(el('div', { class: 'act-sheet' }, [header(), body]));
  node.hidden = false;
}

export function close() {
  showingPost = false;
  state = null;
  if (overlay) {
    overlay.hidden = true;
    clear(overlay);
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
    showingPost = state.progress.state === 'completed';
    render();
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '活动内容打不开，请稍后再试。');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay && !overlay.hidden) close();
});
