import { el } from '../dom.js';
import { guideFigure } from './guide-figure.js';

// 每组两轮：轻轻收紧 5 秒，松开后观察 15 秒。时间只在页面可见且播放时前进。
export const PMR_GROUPS = [
  { name: '双手', region: 'arms', tense: '轻轻握拳，感觉手掌和手指收紧。不要攥到疼。', release: '摊开双手，放回腿上。留意手心与手指的变化。' },
  { name: '肩膀', region: 'arms', tense: '双肩轻轻向上提一点，保持自然呼吸。', release: '放下肩膀，让手臂的重量落回椅子。' },
  { name: '面部', region: 'head', tense: '轻轻皱眉、闭眼。下颌保持松软，不咬紧牙。', release: '舒展眉间，放松眼周与下颌。' },
  { name: '腹部', region: 'torso', tense: '腹部轻轻收紧一点，呼吸仍然自然。', release: '松开腹部，感受呼吸时自然的起伏。' },
  { name: '大腿', region: 'legs', tense: '双脚留在地面，大腿肌肉轻轻绷紧。', release: '把腿的重量交给椅面，观察松开的感觉。' },
  { name: '小腿', region: 'legs', tense: '脚跟留在地上，脚尖轻轻朝自己抬起。', release: '脚尖放回地面，让小腿慢慢松下来。' },
  { name: '双脚', region: 'feet', tense: '脚趾在鞋里轻轻蜷起，不用用力抓地。', release: '松开脚趾，感觉双脚与地面的接触。' },
];

/**
 * @typedef {{ kind: string, group?: number, round?: number, seconds: number }} PmrSegment
 * @type {Array<PmrSegment>}
 */
const segments = [
  { kind: 'intro', seconds: 20 },
  ...PMR_GROUPS.flatMap((_, group) => [0, 1].flatMap(round => [
    { kind: 'tense', group, round, seconds: 5 },
    { kind: 'release', group, round, seconds: 15 },
  ])),
  { kind: 'outro', seconds: 20 },
];
const starts = segments.map((_, index) => segments.slice(0, index).reduce((sum, segment) => sum + segment.seconds, 0));
const total = segments.reduce((sum, segment) => sum + segment.seconds, 0);
const stamp = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export const PMR = {
  presentation: {
    immersive: true,
    cue: '轻轻收紧 5 秒 · 松开感受 15 秒 · 不适可跳过',
    conclusion: '练习结束。活动一下手指和双脚，按自己的节奏回到当下。',
  },
  render(_stage, { complete, cleanup }) {
    let elapsed = 0;
    let last = performance.now();
    let playing = !document.hidden;
    let resumeOnVisible = document.hidden;
    let disposed = false;
    let finished = false;
    let current = -1;
    const art = guideFigure();
    const groupLabel = el('p', { class: 'pmr-group' });
    const phaseLabel = el('h3', { class: 'pmr-phase' });
    const instruction = el('p', { class: 'pmr-instruction', attrs: { 'aria-live': 'polite' } });
    const roundLabel = el('p', { class: 'pmr-round' });
    const counter = el('span', { class: 'pmr-counter', attrs: { 'aria-label': '本段剩余秒数' } });
    const meter = el('div', { class: 'pmr-meter', attrs: { 'aria-hidden': 'true' } }, [el('i')]);
    const groups = el('div', { class: 'pmr-groups', attrs: { 'aria-hidden': 'true' } }, PMR_GROUPS.map(() => el('i')));
    const progress = el('div', { class: 'pmr-progress', attrs: { role: 'progressbar', 'aria-label': '渐进式肌肉放松进度', 'aria-valuemin': '0', 'aria-valuemax': String(total) } }, [el('i')]);
    const toggle = el('button', { class: 'secondary pmr-toggle', text: '暂停', attrs: { type: 'button' } });
    const skip = el('button', { class: 'link pmr-skip', text: '跳过这个部位', attrs: { type: 'button' } });
    const clock = el('span', { class: 'pmr-clock' });
    // 语音是可选层：stage.src 配了音频才出现开关；加载失败就地隐藏，全程静默可用。
    const voiceBtn = el('button', { class: 'link pmr-voice', text: '语音：开', attrs: { type: 'button', hidden: true } });
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
    const root = el('div', { class: 'pmr-root' }, [
      el('p', { class: 'pmr-kicker', text: '坐姿跟练 · 5 分 20 秒' }),
      el('div', { class: 'pmr-visual' }, [art.root, counter]),
      groupLabel, phaseLabel, instruction, roundLabel, meter, groups, progress,
      el('div', { class: 'pmr-controls' }, [toggle, skip, voiceBtn, clock]),
      el('p', { class: 'pmr-footnote', text: '只要感觉到一点收紧即可；不要屏息。疼痛、受伤或术后部位直接跳过；若出现不适，请停止练习。' }),
      ...(voice ? [voice] : []),
    ]);
    const at = value => {
      for (let index = starts.length - 1; index >= 0; index--) if (value >= starts[index]) return index;
      return 0;
    };
    const paint = () => {
      const index = at(Math.min(elapsed, total - .001));
      const segment = segments[index];
      const within = elapsed - starts[index];
      if (index !== current) {
        current = index;
        // intro/outro 段没有 group/round（运行时就是 undefined，后面全用 kind 守着）；
        // 这里的 cast 只过类型检查，不改变运行时行为。
        const group = PMR_GROUPS[/** @type {number} */ (segment.group)];
        const label = segment.kind === 'intro' ? '准备' : segment.kind === 'outro' ? '全身' : group.name;
        groupLabel.textContent = segment.kind === 'intro' ? '先安顿下来' : segment.kind === 'outro' ? '留意此刻' : `部位 ${/** @type {number} */ (segment.group) + 1} / ${PMR_GROUPS.length} · ${label}`;
        phaseLabel.textContent = segment.kind === 'tense' ? '轻轻收紧' : segment.kind === 'release' ? '松开，感受差别' : segment.kind === 'intro' ? '坐稳，开始觉察' : '让身体回到自然';
        instruction.textContent = segment.kind === 'tense' ? group.tense : segment.kind === 'release' ? group.release : segment.kind === 'intro' ? '坐在稳定的椅子上，双脚落地。自然呼吸，不必刻意放松。接下来每个部位做两轮。' : '感受身体与椅子、地面的接触。慢慢活动手指和脚趾，再准备结束。';
        roundLabel.textContent = group ? `第 ${/** @type {number} */ (segment.round) + 1} / 2 轮 · ${segment.kind === 'tense' ? '收紧' : '放松'}` : '按照自己的舒服幅度进行';
        art.pose('neutral');
        art.focus(group?.region || '');
        art.root.setAttribute('aria-label', group ? `${group.name}${segment.kind === 'tense' ? '轻轻收紧' : '放松'}示意图` : '坐姿示意图');
        for (const [i, node] of [...groups.children].entries()) node.className = group && i === /** @type {number} */ (segment.group) ? 'current' : group && i < /** @type {number} */ (segment.group) || segment.kind === 'outro' ? 'done' : '';
      }
      root.dataset.phase = segment.kind;
      counter.textContent = String(Math.ceil(segment.seconds - within));
      meter.firstChild.style.width = `${within / segment.seconds * 100}%`;
      progress.firstChild.style.width = `${elapsed / total * 100}%`;
      progress.setAttribute('aria-valuenow', String(Math.floor(elapsed)));
      clock.textContent = `${stamp(elapsed)} / ${stamp(total)}`;
      toggle.textContent = playing ? '暂停' : '继续';
      root.classList.toggle('is-paused', !playing);
      skip.hidden = segment.kind === 'intro' || segment.kind === 'outro';
    };
    const finish = () => { if (!finished && !disposed) { finished = true; if (voice) voice.pause(); complete(); } };
    const tick = () => {
      if (finished || disposed) return;
      const now = performance.now();
      if (playing) elapsed = Math.min(total, elapsed + (now - last) / 1000);
      last = now;
      if (elapsed >= total) { finish(); return; }
      paint();
    };
    toggle.addEventListener('click', () => { tick(); resumeOnVisible = false; playing = !playing; last = performance.now(); paint(); syncVoice(); });
    skip.addEventListener('click', () => {
      tick();
      if (finished) return;
      const segment = segments[at(elapsed)];
      const next = segments.findIndex((item, index) => index > at(elapsed) && (item.kind === 'outro' || /** @type {number} */ (item.group) !== /** @type {number} */ (segment.group)));
      if (next >= 0) {
        elapsed = starts[next];
        // 跳段后语音跟着跳，保持图文声同步。
        if (voice) { try { voice.currentTime = elapsed; } catch { /* 元数据未到就先不管 */ } }
        paint();
      }
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
        playing = true; resumeOnVisible = false; last = performance.now();
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
