import { el } from '../dom.js';
import { guideFigure } from './guide-figure.js';

// 工间短版身体扫描：只观察身体感觉，不要求控制呼吸或放松肌肉。
// 每段文字与视觉共用同一条五分钟时间轴；不把私人的身体感受传给壳。
export const BODY_SCAN_PHASES = [
  { id: 'arrive', title: '找到支撑', seconds: 30, region: 'whole', lines: [
    '坐着或站着都可以。留意身体与椅子、地面的接触。',
    '让注意停在接触的地方。现在是什么感觉？',
  ] },
  { id: 'breath', title: '留意呼吸', seconds: 30, region: 'torso', lines: [
    '感觉腹部或胸口随着呼吸发生的细微变化。',
    '不必调整呼吸；即使感觉不明显，也没有关系。',
  ] },
  { id: 'feet', title: '双脚与小腿', seconds: 40, region: 'feet', lines: [
    '把注意带到双脚。鞋袜、地面、温度或压力，能感觉到什么？',
    '再留意小腿。紧、松、麻，或者没有特别感觉，都可以。',
  ] },
  { id: 'legs', title: '大腿、臀部与腰背', seconds: 40, region: 'legs', lines: [
    '留意大腿与座位接触的位置，以及臀部和腰背。',
    '这里也许有重量、温度或紧绷。只需要知道它正在那里。',
  ] },
  { id: 'torso', title: '腹部与胸部', seconds: 40, region: 'torso', lines: [
    '留意腹部和胸口。随着自然呼吸，这里有没有细小的起伏？',
    '如果有不舒服的感觉，不必停留；可以回到双脚与地面的接触。',
  ] },
  { id: 'arms', title: '双手、手臂与肩膀', seconds: 40, region: 'arms', lines: [
    '留意指尖、手掌和手臂。可能有温度、触感，也可能很安静。',
    '再留意肩膀。若感觉紧，就知道它是紧的；不用让它松开。',
  ] },
  { id: 'head', title: '颈部、下颌与面部', seconds: 40, region: 'head', lines: [
    '把注意带到颈部、下颌、眼周和额头。',
    '不必改变表情或姿势。察觉这里此刻的感觉即可。',
  ] },
  { id: 'return', title: '回到周围', seconds: 40, region: 'whole', lines: [
    '现在感受整个身体，从双脚到头部，作为一个整体。',
    '再留意周围的声音与光线。准备好时，回到眼前的事情。',
  ] },
];

const STARTS = BODY_SCAN_PHASES.map((_, index) =>
  BODY_SCAN_PHASES.slice(0, index).reduce((sum, phase) => sum + phase.seconds, 0));
const TOTAL = BODY_SCAN_PHASES.reduce((sum, phase) => sum + phase.seconds, 0);
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export const BODY_SCAN = {
  presentation: {
    immersive: true,
    cue: '观察身体此刻的感觉 · 不需要把它改变',
    conclusion: '扫描结束。可以按自己的节奏，把注意带回周围。',
  },

  render(_stage, { complete, cleanup }) {
    let elapsed = 0;
    let last = performance.now();
    let playing = !document.hidden;
    let resumeOnVisible = document.hidden;
    let disposed = false;
    let finished = false;
    let phaseIndex = -1;
    let lineIndex = -1;

    const art = guideFigure();
    const artFrame = el('div', { class: 'scan-art' }, [art.root]);
    const eyebrow = el('p', { class: 'scan-eyebrow', text: '五分钟 · 工间身体扫描' });
    const title = el('h3', { class: 'scan-title' });
    const caption = el('p', { class: 'scan-caption', attrs: { 'aria-live': 'polite' } });
    const phaseBar = el('div', { class: 'scan-phase-bar', attrs: { 'aria-hidden': 'true' } },
      BODY_SCAN_PHASES.map(() => el('i')));
    const progress = el('div', { class: 'scan-progress', attrs: { role: 'progressbar', 'aria-label': '身体扫描进度', 'aria-valuemin': '0', 'aria-valuemax': String(TOTAL) } }, [el('i')]);
    const clock = el('span', { class: 'scan-clock' });
    const toggle = el('button', { class: 'secondary scan-toggle', text: '暂停', attrs: { type: 'button' } });
    const skip = el('button', { class: 'link scan-skip', text: '略过这个部位', attrs: { type: 'button' } });
    // 语音是可选层：stage.src 配了音频才出现开关；加载失败就地隐藏，全程静默可用。
    const voiceBtn = el('button', { class: 'link scan-voice', text: '语音：开', attrs: { type: 'button', hidden: true } });
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
    const root = el('div', { class: 'scan-root' }, [
      eyebrow, artFrame, title, caption, phaseBar, progress,
      el('div', { class: 'scan-controls' }, [toggle, skip, voiceBtn, clock]),
      el('p', { class: 'scan-footnote', text: '闭眼或看屏幕都可以。感到不适时可暂停，或略过当前部位。' }),
      ...(voice ? [voice] : []),
    ]);

    const phaseAt = value => {
      for (let i = STARTS.length - 1; i >= 0; i--) if (value >= STARTS[i]) return i;
      return 0;
    };

    const paint = () => {
      const index = phaseAt(Math.min(elapsed, TOTAL - .001));
      const phase = BODY_SCAN_PHASES[index];
      const within = elapsed - STARTS[index];
      if (index !== phaseIndex) {
        phaseIndex = index;
        lineIndex = -1;
        title.textContent = phase.title;
        art.focus(phase.region);
        art.root.setAttribute('aria-label', `${phase.title}身体部位示意`);
        for (const [i, node] of [...phaseBar.children].entries()) node.className = i < index ? 'done' : i === index ? 'current' : '';
      }
      const nextLine = Math.min(phase.lines.length - 1, Math.floor(within / (phase.seconds / phase.lines.length)));
      if (nextLine !== lineIndex) {
        lineIndex = nextLine;
        caption.textContent = phase.lines[nextLine];
      }
      progress.firstChild.style.width = `${elapsed / TOTAL * 100}%`;
      progress.setAttribute('aria-valuenow', String(Math.floor(elapsed)));
      clock.textContent = `${time(elapsed)} / ${time(TOTAL)}`;
      toggle.textContent = playing ? '暂停' : '继续';
      skip.hidden = index === BODY_SCAN_PHASES.length - 1;
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
    toggle.addEventListener('click', () => {
      tick();
      resumeOnVisible = false;
      playing = !playing;
      last = performance.now();
      paint();
      syncVoice();
    });
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
    cleanup(() => {
      disposed = true;
      clearInterval(timer);
      if (voice) { voice.pause(); voice.removeAttribute('src'); voice.load(); }
      window.removeEventListener('pointerdown', gesture);
      window.removeEventListener('keydown', gesture);
      document.removeEventListener('visibilitychange', visibility);
    });
    paint();
    return [root];
  },
};
