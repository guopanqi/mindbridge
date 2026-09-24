import { el } from '../dom.js';
import { guideFigure } from './guide-figure.js';

// 坐姿工间舒展：先活动，再轻微拉伸。所有方向成对出现，时间轴与图示同步。
// 参考香港康乐及文化事务署「工作间活络伸展操」的慢速、无弹震原则；
// 插画是本站原创示意，不复制外部视频或图像。
export const STRETCH_PHASES = [
  { id: 'prepare', title: '坐稳 · 留出空间', seconds: 15, pose: 'neutral', instruction: '坐在稳定的椅子上，双脚落地。确认旁边有足够空间，保持自然呼吸。' },
  { id: 'shoulders', title: '缓慢绕肩', seconds: 30, pose: 'shoulders', repeat: 6, instruction: '肩膀缓缓向上、向后、向下绕一圈。按舒服速度做，不要猛甩。' },
  { id: 'neck-left', title: '颈部 · 向左', seconds: 20, pose: 'neck-left', instruction: '头轻轻向左侧倾，到轻微拉伸感就停。肩膀保持自然，不用手压头。' },
  { id: 'neck-right', title: '颈部 · 向右', seconds: 20, pose: 'neck-right', instruction: '慢慢回到中间，再轻轻向右侧倾。不需要追求左右一样的幅度。' },
  { id: 'chest', title: '打开胸口', seconds: 30, pose: 'chest', instruction: '坐直，双臂向两侧轻轻打开。感受胸前有一点伸展，避免向后用力仰头。' },
  { id: 'wrist-left', title: '手腕 · 左侧', seconds: 15, pose: 'wrist-left', instruction: '左臂向前，手腕轻轻伸展。保持手指放松，不拉到疼痛。' },
  { id: 'wrist-right', title: '手腕 · 右侧', seconds: 15, pose: 'wrist-right', instruction: '换右侧。留意手腕和前臂的轻微拉伸，照常呼吸。' },
  { id: 'side-left', title: '腰侧 · 向左', seconds: 20, pose: 'side-left', instruction: '右臂向上，身体轻轻向左侧延伸。臀部仍留在椅面上，不要弹动。' },
  { id: 'side-right', title: '腰侧 · 向右', seconds: 20, pose: 'side-right', instruction: '慢慢回正，换左臂向上，身体轻轻向右侧延伸。' },
  { id: 'return', title: '回到坐姿', seconds: 25, pose: 'neutral', instruction: '双手回到腿上，感受双脚与地面的接触。按自己的节奏回到工作。' },
];

const STARTS = STRETCH_PHASES.map((_, index) =>
  STRETCH_PHASES.slice(0, index).reduce((sum, phase) => sum + phase.seconds, 0));
const TOTAL = STRETCH_PHASES.reduce((sum, phase) => sum + phase.seconds, 0);
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export const STRETCH_GUIDE = {
  presentation: {
    immersive: true,
    cue: '动作缓慢 · 轻微拉伸即可 · 疼痛时停下',
    conclusion: '舒展到这里结束。按自己的节奏回到工作。',
  },

  render(_stage, { complete, cleanup }) {
    let elapsed = 0;
    let last = performance.now();
    let playing = !document.hidden;
    let resumeOnVisible = document.hidden;
    let disposed = false;
    let finished = false;
    let phaseIndex = -1;

    const art = guideFigure();
    const title = el('h3', { class: 'stretch-title' });
    const subtitle = el('p', { class: 'stretch-subtitle' });
    const instruction = el('p', { class: 'stretch-instruction', attrs: { 'aria-live': 'polite' } });
    const actionCount = el('p', { class: 'stretch-action-count' });
    const stepBar = el('div', { class: 'stretch-step-bar', attrs: { 'aria-hidden': 'true' } }, STRETCH_PHASES.map(() => el('i')));
    const progress = el('div', { class: 'stretch-progress', attrs: { role: 'progressbar', 'aria-label': '舒展操进度', 'aria-valuemin': '0', 'aria-valuemax': String(TOTAL) } }, [el('i')]);
    const toggle = el('button', { class: 'secondary stretch-toggle', text: '暂停', attrs: { type: 'button' } });
    const skip = el('button', { class: 'link stretch-skip', text: '略过这个动作', attrs: { type: 'button' } });
    const clock = el('span', { class: 'stretch-clock' });
    // 语音是可选层：stage.src 配了音频才出现开关；加载失败就地隐藏，全程静默可用。
    const voiceBtn = el('button', { class: 'link stretch-voice', text: '语音：开', attrs: { type: 'button', hidden: true } });
    let voice = null;
    let voiceOn = true;
    const syncVoice = () => {
      if (!voice || !voiceOn) return;
      if (playing && !finished && !disposed) voice.play().catch(() => {});
      else voice.pause();
    };
    if (_stage.src) {
      voice = el('audio', { attrs: { src: _stage.src, preload: 'auto' } });
      voice.addEventListener('error', () => { voice = null; voiceBtn.hidden = true; }, { once: true });
      voice.addEventListener('canplay', () => { voiceBtn.hidden = false; syncVoice(); }, { once: true });
      voiceBtn.addEventListener('click', () => {
        voiceOn = !voiceOn;
        voiceBtn.textContent = voiceOn ? '语音：开' : '语音：关';
        if (!voice) return;
        if (voiceOn && playing && !finished && !disposed) voice.play().catch(() => {});
        else voice.pause();
      });
    }
    const root = el('div', { class: 'stretch-root' }, [
      el('p', { class: 'stretch-kicker', text: '坐姿跟练 · 3 分 30 秒' }),
      el('div', { class: 'stretch-visual' }, [art.root]),
      title, subtitle, instruction, actionCount, stepBar, progress,
      el('div', { class: 'stretch-controls' }, [toggle, skip, voiceBtn, clock]),
      el('p', { class: 'stretch-footnote', text: '别憋气、别弹震。疼痛、头晕或其他不适时暂停，必要时结束练习。' }),
      ...(voice ? [voice] : []),
    ]);

    const phaseAt = value => {
      for (let i = STARTS.length - 1; i >= 0; i--) if (value >= STARTS[i]) return i;
      return 0;
    };
    const paint = () => {
      const index = phaseAt(Math.min(elapsed, TOTAL - .001));
      const phase = STRETCH_PHASES[index];
      const within = elapsed - STARTS[index];
      if (index !== phaseIndex) {
        phaseIndex = index;
        title.textContent = phase.title;
        instruction.textContent = phase.instruction;
        art.pose(phase.pose);
        for (const [i, node] of [...stepBar.children].entries()) node.className = i < index ? 'done' : i === index ? 'current' : '';
      }
      subtitle.textContent = `动作 ${index + 1} / ${STRETCH_PHASES.length} · 本段还剩 ${Math.ceil(phase.seconds - within)} 秒`;
      actionCount.textContent = phase.repeat
        ? `缓慢绕肩 · 第 ${Math.min(phase.repeat, Math.floor(within / phase.seconds * phase.repeat) + 1)} / ${phase.repeat} 次`
        : index > 1 && index < STRETCH_PHASES.length - 1 ? '只到轻微拉伸感，保持自然呼吸' : '';
      progress.firstChild.style.width = `${elapsed / TOTAL * 100}%`;
      progress.setAttribute('aria-valuenow', String(Math.floor(elapsed)));
      clock.textContent = `${time(elapsed)} / ${time(TOTAL)}`;
      toggle.textContent = playing ? '暂停' : '继续';
      root.classList.toggle('is-paused', !playing);
      art.root.setAttribute('aria-label', `${phase.title}动作示意`);
      skip.hidden = index === STRETCH_PHASES.length - 1;
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      if (voice) voice.pause();
      complete();
    };
    const tick = () => {
      if (finished || disposed) return;
      const now = performance.now();
      if (playing) elapsed = Math.min(TOTAL, elapsed + (now - last) / 1000);
      last = now;
      if (elapsed >= TOTAL) { finish(); return; }
      paint();
    };
    toggle.addEventListener('click', () => { tick(); resumeOnVisible = false; playing = !playing; last = performance.now(); paint(); syncVoice(); });
    skip.addEventListener('click', () => {
      tick();
      if (finished) return;
      elapsed = Math.min(TOTAL, STARTS[phaseAt(elapsed) + 1] ?? TOTAL);
      // 跳段后语音跟着跳，保持图文声同步。
      if (voice) { try { voice.currentTime = elapsed; } catch { /* 元数据未到就先不管 */ } }
      if (elapsed >= TOTAL) finish();
      else paint();
    });
    // 自动播放策略：没有用户手势时 play() 会被拦下，首次触碰补一次。
    const gesture = () => { syncVoice(); };
    window.addEventListener('pointerdown', gesture);
    window.addEventListener('keydown', gesture);
    const visibility = () => {
      if (finished || disposed) return;
      if (document.hidden) {
        if (playing) { tick(); resumeOnVisible = true; playing = false; }
        if (voice) voice.pause();
      } else if (resumeOnVisible) {
        playing = true;
        resumeOnVisible = false;
        last = performance.now();
        syncVoice();
      }
      paint();
    };
    document.addEventListener('visibilitychange', visibility);
    const timer = setInterval(tick, 100);
    cleanup(() => { disposed = true; clearInterval(timer); if (voice) { voice.pause(); voice.removeAttribute('src'); voice.load(); } window.removeEventListener('pointerdown', gesture); window.removeEventListener('keydown', gesture); document.removeEventListener('visibilitychange', visibility); });
    paint();
    return [root];
  },
};
