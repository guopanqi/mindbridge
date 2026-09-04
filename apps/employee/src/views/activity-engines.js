import { el } from '../dom.js';
import { renderGuidedPlayer, renderMediaPlayer } from './guided-player.js';

const time = value => `${Math.floor(Math.ceil(value) / 60)}:${String(Math.ceil(value) % 60).padStart(2, '0')}`;

function breath(stage, { complete, cleanup }) {
  const cycle = stage.cycle;
  const phases = [
    { label: '吸气', seconds: cycle.inhale, from: .62, to: 1 },
    ...(cycle.hold ? [{ label: '停留', seconds: cycle.hold, from: 1, to: 1 }] : []),
    { label: '呼气', seconds: cycle.exhale, from: 1, to: .62 },
  ];
  const length = phases.reduce((sum, item) => sum + item.seconds, 0);
  const total = length * stage.rounds;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const label = el('b', { class: 'breath-label' });
  const orb = el('div', { class: 'breath-orb', style: 'transition-duration:0s' }, [label]);
  const count = el('span', { class: 'breath-count' });
  const remaining = el('p', { class: 'act-note' });
  const toggle = el('button', { class: 'secondary small', text: '暂停', attrs: { type: 'button' } });
  let elapsed = 0;
  let last = performance.now();
  let playing = !document.hidden;
  let resumeOnVisible = document.hidden;
  let ended = false;
  const paint = () => {
    let offset = elapsed % length;
    const phase = phases.find(item => {
      if (offset < item.seconds) return true;
      offset -= item.seconds;
      return false;
    }) || phases[0];
    label.textContent = playing ? phase.label : '已暂停';
    count.textContent = String(Math.ceil(phase.seconds - offset));
    remaining.textContent = `${time(Math.max(0, total - elapsed))} · 第 ${Math.min(stage.rounds, Math.floor(elapsed / length) + 1)} / ${stage.rounds} 轮`;
    const scale = phase.from + (phase.to - phase.from) * offset / phase.seconds;
    // 呼吸缩放承载节拍信息，不是装饰；减少动态效果时缩小幅度，但不冻结节拍。
    orb.style.transform = `scale(${reducedMotion ? .78 + (scale - .62) * .32 : scale})`;
    toggle.textContent = playing ? '暂停' : '继续';
  };
  const tick = () => {
    if (ended) return;
    const now = performance.now();
    if (playing) elapsed = Math.min(total, elapsed + (now - last) / 1000);
    last = now;
    if (elapsed >= total) { ended = true; complete(); return; }
    paint();
  };
  toggle.addEventListener('click', () => { tick(); resumeOnVisible = false; playing = !playing; paint(); });
  const visibility = () => {
    if (ended) return;
    if (document.hidden) {
      if (playing) { tick(); resumeOnVisible = true; playing = false; }
    } else if (resumeOnVisible) {
      last = performance.now(); playing = true; resumeOnVisible = false;
    }
    paint();
  };
  document.addEventListener('visibilitychange', visibility);
  const timer = setInterval(tick, 50);
  cleanup(() => { ended = true; clearInterval(timer); document.removeEventListener('visibilitychange', visibility); });
  paint();
  return [el('div', { class: 'breath-wrap' }, [orb, el('div', { class: 'breath-status' }, [count, remaining]), toggle]),
    el('p', { class: 'act-note', text: '按舒服的幅度呼吸，跟不上可以暂停。感到头晕时请停下。' })];
}

function choice(stage, { complete }) {
  let answered = false;
  const options = el('div', { class: 'act-choices' });
  for (const option of stage.options || []) options.append(el('button', {
    class: 'act-choice', attrs: { type: 'button' },
    on: { click: event => {
      if (answered) return;
      answered = true;
      event.currentTarget.classList.add('on');
      for (const button of options.children) button.disabled = true;
      complete({ question: stage.title, label: option.label, reflection: option.reflection || '' });
    } },
  }, [
    option.icon ? el('span', { class: 'act-choice-icon', text: option.icon }) : null,
    el('span', { class: 'act-choice-body' }, [el('b', { text: option.label }), option.desc ? el('span', { text: option.desc }) : null]),
  ]));
  return [options];
}

function writing(stage, { complete, isLast }) {
  const placeholders = stage.type === 'entries' ? stage.placeholders : [stage.hint || '写点什么…'];
  return [
    ...placeholders.map(placeholder => el('textarea', { class: 'act-input', attrs: { rows: stage.type === 'entries' ? 2 : 5, placeholder } })),
    el('p', { class: 'act-note', text: '内容只留在当前页面，不上传、不保存。' }),
    el('button', { class: 'primary act-cta', text: isLast ? '完成书写' : '写好了', attrs: { type: 'button' }, on: { click: () => complete() } }),
  ];
}

// 每个引擎只接收内容和生命周期；不能自行写 API 或改变全局活动状态。
// complete(result?) 表示本段自然结束；cleanup(fn) 必须释放计时器、媒体和事件监听。
export const ACTIVITY_ENGINES = {
  breath,
  choice,
  input: writing,
  entries: writing,
  scan: (stage, context) => renderGuidedPlayer(stage, context),
  timer: (stage, context) => renderGuidedPlayer(stage, context),
  media: (stage, context) => stage.src ? renderMediaPlayer(stage, context) : renderGuidedPlayer(stage, context),
};

// 渲染与版式都按内容类型注册，不因统一流程而丢掉圆形呼吸、波形或视频等专属界面。
export const ACTIVITY_PRESENTATION = {
  breath: { immersive: true, cue: '圆大吸气 · 圆小呼气', conclusion: '让呼吸回到自然节奏，放松肩膀，慢慢结束这次练习。' },
  media: { immersive: true, conclusion: '播放已结束。可以停留一会儿，再回到接下来的事情。' },
  scan: { immersive: true, conclusion: '把注意力慢慢带回周围，按舒服的节奏结束练习。' },
  timer: { immersive: true, conclusion: '跟练已结束，稍作休息再继续。' },
};

// 说明文字合并进后面的体验页面，不占一页。保留原始索引，与既有服务端进度兼容。
export function activityPlan(stages) {
  const plan = [];
  let instructions = [];
  stages.forEach((stage, index) => {
    if (stage.type === 'note' || stage.type === 'prompt') instructions.push(stage.hint || stage.title);
    else { plan.push({ stage, index, instructions }); instructions = []; }
  });
  if (instructions.length && plan.length) plan[plan.length - 1].instructions.push(...instructions);
  if (!plan.length && stages.length) plan.push({ stage: { type: 'reading', title: '阅读引导', fallbackHint: instructions.join('\n') }, index: stages.length - 1, instructions: [] });
  return plan;
}
