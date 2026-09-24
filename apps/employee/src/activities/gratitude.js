import { el } from '../dom.js';

// 每日三件好事（Seligman Three Good Things）：每晚写下三件进行得不错的事，
// 以及每件为什么会发生。核心是「发生了什么 + 为什么发生」，好事不必是成就。
// 连续 7 天后加一屏本地回顾。用户写的原文只存本地；complete 只带件数，
// 7 天进度记在设备本地（localStorage），不上服务器，不做正能量评分。
const STORE_KEY = 'mb-gratitude-days';

const EXAMPLES = [
  { what: '比如：午饭比想象中好吃', why: '为什么会发生？比如：换了一家店' },
  { what: '比如：一个同事主动帮了我', why: '是因为什么？比如：上周我也帮过他' },
  { what: '比如：按时做完了一件小事', why: '是因为什么？比如：上午没刷手机' },
];

const dayString = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const pastDays = () => {
  try {
    const days = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(days) ? days.filter(d => typeof d === 'string') : [];
  } catch {
    return [];
  }
};

const recordToday = () => {
  try {
    const days = new Set(pastDays());
    days.add(dayString());
    localStorage.setItem(STORE_KEY, JSON.stringify([...days].sort().slice(-30)));
  } catch { /* 本地记不上就不记，不影响练习本身 */ }
};

export const GRATITUDE = {
  presentation: {
    immersive: false,
    cue: '发生了什么 + 为什么发生',
    conclusion: '三件小事都收好了。明天晚上见。',
  },

  render(stage, { complete, cleanup }) {
    const isSeventhDay = pastDays().filter(d => d !== dayString()).length >= 6;
    const cards = EXAMPLES.map(() => ({ what: '', why: '' }));
    let weekly = '';
    let step = 0;
    let ended = false;
    cleanup(() => { ended = true; });

    const root = el('div', { class: 'grec-root' });
    const stepCount = isSeventhDay ? 5 : 4;
    const dots = el('div', { class: 'bspace-dots' }, Array.from({ length: stepCount }, () => el('i')));
    const paintDots = () => {
      dots.childNodes.forEach((dot, i) => {
        dot.className = i < step ? 'done' : i === step ? 'on' : '';
      });
    };

    /**
     * @param {string} hint
     * @param {unknown} controls
     * @param {{ back?: boolean, nextLabel?: string, canNext?: () => boolean }} [options]
     */
    const area = (hint, controls, options = {}) => {
      const { back = step > 0, nextLabel = '下一步', canNext = () => true } = options;
      root.textContent = '';
      const next = el('button', {
        class: 'primary act-cta', text: nextLabel, attrs: { type: 'button' },
        on: { click: () => { if (!ended && canNext()) go(step + 1); } },
      });
      const refresh = () => { next.disabled = !canNext(); };
      root.append(
        el('p', { class: 'act-step-hint', text: hint }),
        ...[].concat(controls),
        next,
        // 原生 append 会把 null 转成字面量，必须用条件展开，不能直接传 null。
        ...(back ? [el('button', {
          class: 'link', text: '‹ 上一步', attrs: { type: 'button' },
          on: { click: () => { if (!ended) go(step - 1); } },
        })] : []),
      );
      refresh();
      root.querySelectorAll('textarea').forEach(t => t.addEventListener('input', refresh));
    };

    const cardStep = index => {
      const card = cards[index];
      const titles = ['第一件不错的事', '第二件', '第三件，最后一件'];
      const what = el('textarea', {
        class: 'act-input', attrs: { rows: 2, placeholder: EXAMPLES[index].what },
        on: { input: () => { card.what = what.value.trim(); } },
      });
      what.value = card.what;
      const why = el('textarea', {
        class: 'act-input', attrs: { rows: 2, placeholder: EXAMPLES[index].why },
        on: { input: () => { card.why = why.value.trim(); } },
      });
      why.value = card.why;
      area('不用是大事。好吃的饭、帮过你的人、按时做完的小事、下班时的天气，都算。越具体越好。', [
        el('p', { class: 'wrec-sub', text: titles[index] + '：今天有什么事情进行得不错？' }),
        what,
        el('p', { class: 'wrec-sub', text: '它为什么会发生？' }),
        why,
        el('p', { class: 'act-note', text: '猜也行。是运气，是别人，还是你自己做对了什么？写一句就行，也可以空着。' }),
      ], { canNext: () => card.what.trim().length > 0 });
    };

    const weeklyStep = () => {
      const box = el('textarea', {
        class: 'act-input', attrs: { rows: 3, placeholder: '比如：好像每天都有人帮我一把……' },
        on: { input: () => { weekly = box.value.trim(); } },
      });
      box.value = weekly;
      area('连着写了七天，很不容易。先别管为什么，只看看重复出现了什么。', [
        el('p', { class: 'wrec-sub', text: '过去一周，你重复遇到了哪些让生活稍微好一点的事情？' }),
        box,
      ], { nextLabel: '收好了 ›' });
    };

    const closingStep = () => {
      const kept = cards.filter(c => c.what.trim().length > 0);
      const echo = el('ul', { class: 'grec-echo' }, kept.map(c =>
        el('li', {}, [
          el('b', { text: c.what.trim().slice(0, 24) }),
          c.why.trim() ? el('span', { text: ` — ${c.why.trim().slice(0, 30)}` }) : null,
        ])));
      area(isSeventhDay ? '七天，三件不少。这张单子只属于你。' : '三件都收好了。这张单子只属于你。', [
        echo,
        el('p', { class: 'act-note', text: '写下来的东西只留在这页，不上传、不保存。' }),
      ], { back: false, nextLabel: '收好了', canNext: () => true });
    };

    const steps = isSeventhDay
      ? [() => cardStep(0), () => cardStep(1), () => cardStep(2), weeklyStep, closingStep]
      : [() => cardStep(0), () => cardStep(1), () => cardStep(2), closingStep];

    function go(next) {
      if (next >= steps.length) {
        ended = true;
        recordToday();
        const kept = cards.filter(c => c.what.trim().length > 0).length;
        complete({
          question: '每日三件好事',
          label: isSeventhDay ? `记下了 ${kept} 件小事 · 满 7 天` : `记下了 ${kept} 件小事`,
          reflection: isSeventhDay
            ? '七天攒下来，再回头看：好日子不是等来的，是记出来的。'
            : '不用都是大事。能写下来，就说明今天不全是坏消息。',
        });
        return;
      }
      step = next;
      paintDots();
      steps[step]();
    }

    // dots 在 root 之外固定顶部：area() 每次都会清空 root 重渲染步骤。
    go(0);
    return [dots, root];
  },
};
