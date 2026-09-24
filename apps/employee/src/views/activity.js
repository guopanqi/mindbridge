// 活动壳：一次开始 → 引擎连续运行 → 自动记录完成 → 可选评价。
// 引擎只通知 complete 并注册 cleanup；API 写入、重试和版本快照在这里统一管理。
import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';
import { ACTIVITY_ENGINES, ACTIVITY_PRESENTATION, activityPlan, bespokeFor } from './activity-engines.js';
import { activityFacts } from './activity-facts.js';

let overlay;
let current = null;
let disposeEngine = () => {};

const messageOf = (error, fallback) => error instanceof ApiError && error.userMessage ? error.userMessage : fallback;
const active = session => current === session;

function enqueue(session, payload) {
  session.tail = session.tail.then(async () => {
    const response = await api.activityProgress({ eventId: session.eventId, ...payload });
    if (payload.action === 'start' && response.activity.contentVersion !== session.activity.contentVersion) {
      throw new Error('CONTENT_CHANGED');
    }
    if (payload.action === 'complete') {
      if (response.activity.progress.state !== 'completed') throw new Error('COMPLETION_NOT_SAVED');
      session.activity = response.activity;
      session.saved = true;
      if (active(session)) render();
    }
    return response;
  });
  // rejected tail 阻止后续写入越过失败步骤；显式同步后才恢复。
  void session.tail.catch(error => {
    if (!active(session) || session.error) return;
    session.error = error;
    render();
  });
}

function moveProgress(session, index) {
  for (let i = session.activity.progress.stageIndex + 1; i <= index; i++) enqueue(session, { action: 'stage', stageIndex: i });
  session.activity.progress.stageIndex = index;
}

function finish(session) {
  if (!active(session) || session.finished) return;
  session.finished = true;
  session.phase = 'result';
  moveProgress(session, Math.max(0, session.activity.stages.length - 1));
  enqueue(session, { action: 'complete' });
  render();
}

// 线下活动确认参加：内容里若配了收尾提问（「留意一个变化」），先问完再记录完成，
// 让线下这一次和线上练习留下同样结构的完成记录。
function attend(session) {
  if (!active(session) || session.finished) return;
  const plan = activityPlan(session.activity.stages);
  if (!plan.length) { finish(session); return; }
  session.position = 0;
  moveProgress(session, plan[0].index);
  session.phase = 'experience';
  render();
}

function begin(session) {
  if (!active(session) || session.phase === 'experience') return;
  if (session.activity.progress.state === 'offered') {
    enqueue(session, { action: 'start' });
    session.activity.progress = { ...session.activity.progress, state: 'joined', stageIndex: 0 };
  }
  if (session.activity.kind === 'offline') { session.phase = 'booked'; render(); return; }
  const plan = activityPlan(session.activity.stages);
  session.position = Math.max(0, plan.findIndex(item => item.index >= session.activity.progress.stageIndex));
  if (!plan.length) { session.error = new Error('EMPTY_ACTIVITY'); render(); return; }
  moveProgress(session, plan[session.position].index);
  session.phase = 'experience';
  render();
}

async function recover(session) {
  try {
    const response = await api.activity(session.eventId);
    if (!active(session)) return;
    const sameVersion = response.activity.contentVersion === session.activity.contentVersion;
    session.activity = response.activity;
    session.tail = Promise.resolve();
    session.error = null;
    session.saved = response.activity.progress.state === 'completed';
    if (session.saved) session.phase = 'result';
    else if (session.finished && sameVersion) {
      // 用户已经做完，只补齐保存，不要求为网络错误重新做一次。
      if (session.activity.progress.state === 'offered') {
        enqueue(session, { action: 'start' });
        session.activity.progress.state = 'joined';
      }
      moveProgress(session, Math.max(0, session.activity.stages.length - 1));
      session.phase = 'result';
      enqueue(session, { action: 'complete' });
    } else {
      session.finished = false;
      session.phase = 'intro';
      if (!sameVersion) session.answers = [];
    }
    render();
  } catch (error) {
    if (active(session)) toast(messageOf(error, '暂时无法同步，请稍后再试。'));
  }
}

function header(session) {
  return el('div', { class: 'act-head' }, [
    el('button', { class: 'act-back', text: '‹', attrs: { type: 'button', 'aria-label': '关闭' }, on: { click: close } }),
    el('div', {}, [
      el('p', { class: 'act-title', text: session.activity.title }),
    ]),
  ]);
}

function intro(session) {
  const activity = session.activity;
  return [
    activityFacts(activity),
    activity.coreMethod ? el('p', { class: 'act-method', text: `练习方法：${activity.coreMethod}` }) : null,
    el('p', { class: 'act-desc', text: activity.description }),
    activity.kind === 'offline' ? el('div', { class: 'act-info' }, [
      el('p', { text: `时间：${activity.schedule || '待定'}` }),
      el('p', { text: `地点：${activity.location || '待定'}` }),
    ]) : null,
    el('button', {
      class: 'primary act-cta', text: activity.kind === 'offline' ? '我要报名' : activity.progress.state === 'joined' ? '继续体验' : '开始',
      attrs: { type: 'button' }, on: { click: () => begin(session) },
    }),
  ];
}

function experience(session) {
  const plan = activityPlan(session.activity.stages);
  const item = plan[session.position];
  if (!item) return [el('p', { text: '活动内容暂时不可用，请关闭后再试。' })];
  const { stage } = item;
  const cleanups = [];
  let live = true;
  disposeEngine = () => { live = false; for (const cleanup of cleanups) cleanup(); };
  const complete = answer => {
    if (!live || !active(session) || session.error) return;
    live = false; // 同一次选择/ended/计时回调只允许推进一次。
    if (answer) session.answers[session.position] = answer;
    if (session.position === plan.length - 1) { finish(session); return; }
    session.position++;
    moveProgress(session, plan[session.position].index);
    render();
  };
  // 独立组件按活动 id 强制生效：忽略快照里的旧 stage，直接跑专属体验。
  // 结束时走同一套 finish（按快照 stage 数补齐进度再 complete），旧快照也能正常结算。
  const bespoke = bespokeFor(session.activity.id);
  const presentation = bespoke?.presentation || ACTIVITY_PRESENTATION[stage.type];
  const instructions = [...item.instructions, stage.hint].filter(Boolean);
  const nodes = [el('div', { class: 'act-experience-heading' }, [
    el('p', { class: 'act-step-title', attrs: { tabindex: '-1' }, text: stage.title }),
    plan.length > 1 ? el('span', { class: 'act-step-count', text: `${session.position + 1} / ${plan.length}` }) : null,
  ])];
  if (presentation?.cue) nodes.push(el('p', { class: 'act-cue', text: presentation.cue }));
  // 播放型体验先给核心渲染，完整说明收在下方，旧快照里长段准备文字也不占首屏。
  if (!presentation?.immersive && stage.hint) nodes.push(el('p', { class: 'act-step-hint', text: stage.hint }));
  const engine = bespoke?.render
    || (Object.hasOwn(ACTIVITY_ENGINES, stage.type) ? ACTIVITY_ENGINES[stage.type] : null);
  if (engine) nodes.push(el('div', { class: 'act-engine', attrs: { 'data-engine': stage.type } },
    engine(stage, { complete, cleanup: fn => cleanups.push(fn), isLast: session.position === plan.length - 1 })));
  else if (stage.fallbackHint) {
    nodes.push(el('p', { class: 'act-note', text: stage.fallbackHint }),
      el('button', { class: 'primary act-cta', text: '完成阅读', attrs: { type: 'button' }, on: { click: () => complete() } }));
  } else nodes.push(el('p', { class: 'act-note', text: '当前版本暂不支持此内容，请更新后再试。' }));
  const details = presentation?.immersive ? instructions : item.instructions;
  if (details.length) nodes.push(el('details', { class: 'act-instructions' }, [
    el('summary', { text: '练习说明' }), ...details.map(text => el('p', { text })),
  ]));
  return nodes;
}

function result(session) {
  const activity = session.activity;
  const picker = el('div', { class: 'act-help' });
  for (const option of activity.helpfulnessOptions || []) {
    picker.append(el('button', {
      class: `act-help-opt${session.rating === option ? ' on' : ''}`, text: option,
      attrs: { type: 'button', 'aria-pressed': session.rating === option },
      on: { click: () => { session.rating = session.rating === option ? null : option; render(); } },
    }));
  }
  const closeButton = el('button', {
    class: 'primary act-cta', text: session.rating ? '保存评价并关闭' : '关闭',
    attrs: { type: 'button' },
    on: { click: async () => {
      if (!session.rating) { close(); return; }
      closeButton.disabled = true;
      closeButton.textContent = '正在保存';
      try {
        await session.tail;
        if (!active(session)) return;
        await api.activityProgress({ eventId: session.eventId, action: 'rate', helpfulness: session.rating });
        if (active(session)) close();
      } catch (error) {
        if (active(session)) { closeButton.disabled = false; closeButton.textContent = '保存评价并关闭'; toast(messageOf(error, '评价保存失败，完成记录不受影响。')); }
      }
    } },
  });
  const conclusion = ACTIVITY_PRESENTATION[activity.stages[0]?.type]?.conclusion || '这次练习到这里就完成了，接下来按自己的节奏继续。';
  return [
    el('section', { class: 'act-conclusion', attrs: { 'aria-label': '活动结果' } }, [
    // 线下场次统一用这张示意插画收尾；它是插画不是现场照片，也不涉及任何参加者的影像。
    activity.kind === 'offline'
      ? el('img', { class: 'act-photo', attrs: { src: '/media/offline-workshop.svg', alt: '线下工作坊示意插画', loading: 'lazy' } })
      : null,
    el('h2', { class: 'act-step-title', text: activity.kind === 'offline' ? '已完成 · 线下参与' : '体验结束' }),
    el('p', { class: 'act-save-status', attrs: { role: 'status' }, text: session.saved ? '已记录完成' : '正在保存完成记录' }),
    !session.answers.filter(Boolean).length ? el('p', { class: 'act-closing-copy', text: conclusion }) : null,
    ...session.answers.filter(Boolean).map(answer => el('div', { class: 'act-outcome' }, [
      el('p', { class: 'act-note', text: answer.question }), el('b', { text: answer.label }),
      answer.reflection ? el('p', { text: answer.reflection }) : null,
    ])),
    ]),
    el('section', { class: 'act-feedback', attrs: { 'aria-label': '可选体验反馈' } }, [
    el('div', { class: 'act-feedback-heading' }, [el('h2', { text: '体验反馈' }), el('span', { text: '选填' })]),
    activity.progress.helpfulness
      ? el('p', { class: 'act-note', text: `你的评价：${activity.progress.helpfulness}` })
      : el('div', {}, [
        el('p', { class: 'act-q', text: '这次练习对你有舒缓作用吗？' }), picker,
        el('p', { class: 'act-note', text: '不评价也会记录完成。' }),
      ]),
    ]),
    closeButton,
  ];
}

function booked(session) {
  return [
    el('p', { class: 'act-step-title', text: '已报名' }),
    el('p', { text: `时间：${session.activity.schedule || '待安排'}` }),
    el('p', { text: `地点：${session.activity.location || '待安排'}` }),
    el('p', { class: 'act-note', text: '实际参加后再确认完成。' }),
    el('button', { class: 'primary', text: '我已参加', attrs: { type: 'button' }, on: { click: () => attend(session) } }),
  ];
}

function render() {
  disposeEngine();
  disposeEngine = () => {};
  const session = current;
  if (!session) return;
  if (!overlay) {
    overlay = el('div', { class: 'act-overlay', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': '活动体验' } });
    document.body.append(overlay);
  }
  const nodes = session.error ? [
    el('p', { class: 'act-step-title', text: '进度保存尚未确认' }),
    el('p', { class: 'act-note', text: '可重新同步，确认后继续。' }),
    el('button', { class: 'primary', text: '重新同步', attrs: { type: 'button' }, on: { click: () => void recover(session) } }),
  ] : session.phase === 'result' ? result(session)
    : session.phase === 'experience' ? experience(session)
      : session.phase === 'booked' ? booked(session) : intro(session);
  const phase = session.error ? 'error' : session.phase;
  overlay.setAttribute('data-phase', phase);
  clear(overlay).append(el('div', { class: `act-sheet act-sheet--${phase}` }, [header(session), el('div', { class: 'act-body' }, nodes)]));
  overlay.hidden = false;
  if (session.phase === 'experience') overlay.querySelector('.act-step-title')?.focus({ preventScroll: true });
}

export function close() {
  const session = current;
  current = null;
  disposeEngine();
  disposeEngine = () => {};
  if (overlay) { overlay.hidden = true; clear(overlay); }
  if (session) {
    session.onClose();
    // 自然结束后即使用户直接关闭，也继续保存；确认后刷新列表，不依赖评价按钮。
    void session.tail.then(() => session.onClose(), () => {});
  }
}

export async function openActivity(eventId, afterClose) {
  disposeEngine();
  disposeEngine = () => {};
  const session = {
    eventId, tail: Promise.resolve(), onClose: typeof afterClose === 'function' ? afterClose : () => {},
    activity: null, phase: 'intro', position: 0, answers: [], rating: null, finished: false, saved: false, error: null,
  };
  current = session;
  if (overlay) overlay.hidden = true;
  try {
    const response = await api.activity(eventId);
    if (!active(session)) return;
    session.activity = response.activity;
    session.saved = response.activity.progress.state === 'completed';
    session.phase = session.saved ? 'result' : response.activity.kind === 'offline' && response.activity.progress.state === 'joined' ? 'booked' : 'intro';
    render();
  } catch (error) {
    if (active(session)) toast(messageOf(error, '活动内容暂时无法打开，请稍后再试。'));
  }
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && overlay && !overlay.hidden) close();
});
