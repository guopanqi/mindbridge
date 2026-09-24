import { el } from '../dom.js';

// MBCT 三步呼吸空间：准备 15s → 觉察 45s → 聚焦呼吸 60s → 扩展 50s → 收尾 10s，共 180 秒。
// 时间轴与三段视觉（宽 → 窄 → 宽）是这套练习的本体，所以独立成组件，
// 不再用通用 breath/choice 拼。计时沿用通用引擎同一套模式：
// setInterval + performance.now 累积，后台与手动暂停都要冻结 elapsed。
const PHASES = [
  {
    id: 'prepare', title: '安顿', seconds: 15, visual: 'halo',
    lines: ['坐着或站着，都可以', '双脚踩稳地面，让身体有个着点', '不用闭眼，视线轻轻垂下来就好'],
  },
  {
    id: 'awareness', title: '觉察', seconds: 45, visual: 'wide',
    keywords: ['想法', '情绪', '身体'],
    lines: ['此刻，你的脑子里正在上演什么？', '心里是什么天气？', '身体哪里最有感觉？', '不用改什么，知道就行'],
  },
  {
    id: 'gathering', title: '呼吸', seconds: 60, visual: 'breath',
    lines: ['把注意轻轻收回来，放到呼吸上', '小腹，或者鼻尖，选一个能感到呼吸的地方', '不用管深浅，只要感到它在动', '走神了？很好，发现了，就回来'],
  },
  {
    id: 'expanding', title: '漫开', seconds: 50, visual: 'body',
    regions: ['双脚', '双腿', '躯干', '肩颈', '脸部'],
    lines: ['让注意像潮水一样漫开，漫到全身', '坐姿，脚和地面的接触', '肩膀，脸', '整个身体，此刻都在这里'],
  },
  {
    id: 'closing', title: '收尾', seconds: 10, visual: 'quiet',
    lines: ['最后一个问题：接下来，你准备先做什么？'],
  },
];
const STARTS = [];
PHASES.reduce((sum, phase) => { STARTS.push(sum); return sum + phase.seconds; }, 0);
const TOTAL = STARTS[STARTS.length - 1] + PHASES[PHASES.length - 1].seconds;

const CLOSING_OPTIONS = [
  { label: '气息慢下来了', reflection: '慢下来的不只是气，心也会跟上。' },
  { label: '肩膀落下来一点', reflection: '身体先松，脑子才有空。' },
  { label: '脑子安静了一点', reflection: '三分钟什么都不处理，就是给脑子腾地方。' },
  { label: '好像没什么变化', reflection: '没变化也正常。觉察本身，就是这三分钟练的东西。' },
];

const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

const BREATH_INHALE = 4;
const BREATH_EXHALE = 6;
const BREATH_ROUNDS = 6;

function buildVisual(phase) {
  // 全片一种语言：淡金双涟漪圆环 + 中央一颗小烛光（CSS 缓亮脉冲）。前三段共用这一套，
  // 只在下方信息行区分：安顿无、觉察是关键词、呼吸是计数与轮次点。
  const core = breath => el('div', { class: `bspace-core${breath ? ' breath' : ''}` });
  if (phase.visual === 'halo') {
    // 已统一为第二段（wide）样式：同款淡金色双涟漪 + 小烛光，只是不带关键词行。
    return el('div', { class: 'bspace-visual halo', attrs: { 'aria-hidden': 'true' } }, [
      el('div', { class: 'bspace-rings faint' }, [el('i'), el('i'), core(false)]),
    ]);
  }
  if (phase.visual === 'wide') {
    return el('div', { class: 'bspace-visual wide', attrs: { 'aria-hidden': 'true' } }, [
      el('div', { class: 'bspace-rings faint' }, [el('i'), el('i'), core(false)]),
      el('div', { class: 'bspace-words' }, phase.keywords.map(word => el('span', { class: 'bspace-word', text: word }))),
    ]);
  }
  if (phase.visual === 'breath') {
    const dots = el('div', { class: 'bspace-rounds' }, Array.from({ length: BREATH_ROUNDS }, () => el('i')));
    const count = el('div', { class: 'bspace-count', text: '' });
    // 与第二段同款：淡金双涟漪 + 小烛光走 CSS 缓亮；吸呼节拍只走文字（count）和轮次点，不再缩放烛光。
    return el('div', { class: 'bspace-visual breath', attrs: { 'aria-hidden': 'true' } }, [
      el('div', { class: 'bspace-rings faint' }, [el('i'), el('i'), core(false)]),
      count, dots,
    ]);
  }
  if (phase.visual === 'body') {
    return el('div', { class: 'bspace-visual body', attrs: { 'aria-hidden': 'true' } }, [
      core(false),
      el('div', { class: 'bspace-regions' }, phase.regions.map(name =>
        el('span', { class: 'bspace-region', text: name }))),
    ]);
  }
  return el('div', { class: 'bspace-visual quiet', attrs: { 'aria-hidden': 'true' } }, [
    el('div', { class: 'bspace-still' }, [core(false)]),
  ]);
}

export const BREATHING_SPACE = {
  presentation: {
    immersive: true,
    cue: '宽 → 窄 → 宽 · 跟着画面走就行',
    conclusion: '回到自然呼吸。带走最后那个问题：接下来，先做什么？',
  },

  render(stage, { complete, cleanup }) {
    let elapsed = 0;
    let playing = !document.hidden;
    let resumeOnVisible = document.hidden;
    let ended = false;
    let last = performance.now();
    let phaseIndex = -1;
    let lineIndex = -1;

    const title = el('p', { class: 'bspace-phase' });
    const caption = el('p', { class: 'bspace-caption', attrs: { 'aria-live': 'polite' } });
    const visual = el('div', { class: 'bspace-stage' });
    const bar = el('i');
    const dots = el('div', { class: 'bspace-dots' }, PHASES.map(() => el('i')));
    const clock = el('span', { class: 'bspace-clock' });
    const toggle = el('button', { class: 'secondary small', text: '暂停', attrs: { type: 'button' } });
    const skip = el('button', { class: 'link', text: '进入收尾 ›', attrs: { type: 'button', hidden: true } });
    // 语音是可选层：stage.src 配了音频才出现开关；加载失败就地隐藏，全程静默可用。
    const voiceBtn = el('button', { class: 'link', text: '语音：开', attrs: { type: 'button', hidden: true } });
    let voice = null;
    let voiceOn = true;
    const syncVoice = () => {
      if (!voice || !voiceOn) return;
      if (playing && !ended) voice.play().catch(() => {});
      else voice.pause();
    };
    if (stage.src) {
      voice = el('audio', { attrs: { src: stage.src, preload: 'auto' } });
      voice.addEventListener('error', () => { voice = null; voiceBtn.hidden = true; }, { once: true });
      voice.addEventListener('canplay', () => { voiceBtn.hidden = false; syncVoice(); }, { once: true });
      voiceBtn.addEventListener('click', () => {
        voiceOn = !voiceOn;
        voiceBtn.textContent = voiceOn ? '语音：开' : '语音：关';
        if (!voice) return;
        if (voiceOn && playing && !ended) voice.play().catch(() => {});
        else voice.pause();
      });
    }
    const root = el('div', { class: 'bspace-root' }, [
      visual, title, caption,
      el('div', { class: 'bspace-progress', attrs: { role: 'progressbar', 'aria-label': '练习进度' } }, [bar]),
      el('div', { class: 'bspace-controls' }, [toggle, skip, voiceBtn, clock]),
      dots,
      el('p', { class: 'act-note', text: '随时可以暂停。头晕就停下来。' }),
      // 原生 append 会把 null 转成字面量，用条件展开。
      ...(voice ? [voice] : []),
    ]);

    const phaseAt = value => {
      for (let i = PHASES.length - 1; i >= 0; i--) if (value >= STARTS[i]) return i;
      return 0;
    };

    const paint = () => {
      const index = phaseAt(Math.min(elapsed, TOTAL - .001));
      const phase = PHASES[index];
      const inPhase = elapsed - STARTS[index];
      if (index !== phaseIndex) {
        phaseIndex = index;
        lineIndex = -1;
        visual.textContent = '';
        visual.append(buildVisual(phase));
        dots.childNodes.forEach((dot, i) => {
          dot.className = i < index ? 'done' : i === index ? 'on' : '';
        });
        skip.hidden = phase.id !== 'closing';
      }
      const nextLine = Math.min(phase.lines.length - 1, Math.floor(inPhase / (phase.seconds / phase.lines.length)));
      if (nextLine !== lineIndex) {
        lineIndex = nextLine;
        caption.textContent = phase.lines[lineIndex];
      }
      title.textContent = `${phase.title} · 还剩 ${Math.ceil(phase.seconds - inPhase)} 秒`;
      bar.style.width = `${Math.min(100, elapsed / TOTAL * 100)}%`;
      clock.textContent = `${time(elapsed)} / ${time(TOTAL)}`;
      toggle.textContent = playing ? '暂停' : '继续';

      // 呼吸段专属：下方计数与轮次点（该视觉只在呼吸段构建）。烛光本身与前两段一样走 CSS 缓亮。
      const counter = visual.querySelector('.bspace-count');
      if (counter) {
        const cycle = inPhase % (BREATH_INHALE + BREATH_EXHALE);
        const round = Math.min(BREATH_ROUNDS, Math.floor(inPhase / (BREATH_INHALE + BREATH_EXHALE)) + 1);
        let label;
        let left;
        if (cycle < BREATH_INHALE) {
          label = '吸气';
          left = BREATH_INHALE - cycle;
        } else {
          label = '呼气';
          left = BREATH_INHALE + BREATH_EXHALE - cycle;
        }
        // 烛光与前两段一样只走 CSS 缓亮脉冲，不做 JS 缩放；节拍信息由下面这行文字和轮次点承载。
        counter.textContent =
          `${playing ? label : '已暂停'} · ${Math.ceil(left)} 秒 · 第 ${round} / ${BREATH_ROUNDS} 轮`;
        visual.querySelectorAll('.bspace-rounds i').forEach((dot, i) => {
          dot.className = i < round ? 'on' : '';
        });
      }
      const regions = visual.querySelectorAll('.bspace-region');
      if (regions.length) {
        const lit = Math.min(regions.length, Math.floor(inPhase / (phase.seconds / regions.length)) + 1);
        regions.forEach((node, i) => node.classList.toggle('on', i < lit));
      }
      const words = visual.querySelectorAll('.bspace-word');
      if (words.length) {
        // 字幕问到哪个词，哪个词亮；问完了（最后一句作结），都不亮。
        words.forEach((node, i) => node.classList.toggle('on', i === lineIndex));
      }
    };

    const showClosing = () => {
      ended = true;
      clearInterval(timer);
      if (voice) voice.pause();
      document.removeEventListener('visibilitychange', visibility);
      root.textContent = '';
      let answered = false;
      const options = el('div', { class: 'act-choices' });
      for (const option of CLOSING_OPTIONS) {
        options.append(el('button', {
          class: 'act-choice', attrs: { type: 'button' },
          on: { click: event => {
            if (answered) return;
            answered = true;
            event.currentTarget.classList.add('on');
            for (const button of options.children) button.disabled = true;
            complete({ question: '留意一个变化', label: option.label, reflection: option.reflection });
          } },
        }, [el('span', { class: 'act-choice-body' }, [el('b', { text: option.label })])]));
      }
      root.append(
        el('p', { class: 'bspace-phase', text: '留意一个变化' }),
        el('p', { class: 'act-step-hint', text: '不必要求自己已经平静下来，只看看哪里比刚才松了一点。' }),
        options,
      );
    };

    const tick = () => {
      if (ended) return;
      const now = performance.now();
      if (playing) elapsed = Math.min(TOTAL, elapsed + (now - last) / 1000);
      last = now;
      if (elapsed >= TOTAL) { showClosing(); return; }
      paint();
    };

    toggle.addEventListener('click', () => { tick(); resumeOnVisible = false; playing = !playing; paint(); syncVoice(); });
    skip.addEventListener('click', () => { elapsed = TOTAL; tick(); });
    // 自动播放策略：没有用户手势时 play() 会被拦下。首次触碰即补一次，
    // 之后靠暂停/语音开关（本身就是手势）驱动。正式版 WebView 同理。
    const gesture = () => { syncVoice(); };
    window.addEventListener('pointerdown', gesture);
    window.addEventListener('keydown', gesture);
    const visibility = () => {
      if (ended) return;
      if (document.hidden) {
        if (playing) { tick(); resumeOnVisible = true; playing = false; }
        if (voice) voice.pause();
      } else if (resumeOnVisible) {
        last = performance.now(); playing = true; resumeOnVisible = false;
        syncVoice();
      }
      paint();
    };
    document.addEventListener('visibilitychange', visibility);
    const timer = setInterval(tick, 100);
    cleanup(() => {
      ended = true;
      clearInterval(timer);
      if (voice) { voice.pause(); voice.removeAttribute('src'); voice.load(); }
      document.removeEventListener('visibilitychange', visibility);
    });
    paint();
    return [root];
  },
};
