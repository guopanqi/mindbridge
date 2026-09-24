import { el } from '../dom.js';

// 以 WHO「注意并命名」和「着陆」为内容依据。用户决定每一幕停留多久；
// 不要求平静下来，也不把情绪、念头或下一步行动上传给活动记录。
const FEELINGS = ['焦虑', '烦躁', '生气', '委屈', '紧张', '疲惫'];
const SENSES = [
  { key: '看', prompt: '看看周围：有什么颜色或形状进入视线？' },
  { key: '听', prompt: '听听周围：最近的一个声音是什么？' },
  { key: '触', prompt: '感觉接触：脚、手或身体正碰到什么？' },
];
const STEPS = ['命名', '拉开距离', '找到支撑', '回到现场'];

export const PAUSE_CARD = {
  presentation: {
    immersive: true,
    cue: '一分钟，把注意带回此刻',
    conclusion: '情绪可以还在。你已经停下来，重新看了一眼此刻。',
  },

  render(_stage, { complete, cleanup }) {
    const state = { feeling: '', custom: '', thought: '', sense: '', action: '' };
    let step = 0;
    let finished = false;
    let disposed = false;
    const root = el('div', { class: 'ground-root' });
    cleanup(() => { disposed = true; });

    const next = target => {
      if (disposed) return;
      step = target;
      render();
      root.querySelector('.ground-heading')?.focus({ preventScroll: true });
    };
    const progress = () => el('div', { class: 'ground-progress', attrs: { 'aria-label': `第 ${step + 1} 步，共 4 步` } },
      STEPS.map((name, index) => el('span', { class: index === step ? 'current' : index < step ? 'done' : '', text: name })));
    const heading = (eyebrow, title, description) => [
      el('p', { class: 'ground-eyebrow', text: eyebrow }),
      el('h3', { class: 'ground-heading', text: title, attrs: { tabindex: '-1' } }),
      el('p', { class: 'ground-description', text: description }),
    ];
    const back = () => step ? el('button', { class: 'ground-back', text: '‹ 上一步', attrs: { type: 'button' }, on: { click: () => next(step - 1) } }) : null;

    const nameScreen = () => {
      const chips = el('div', { class: 'ground-feelings' });
      const custom = el('input', { class: 'ground-custom', attrs: { type: 'text', maxlength: '24', placeholder: '也可以用自己的词', 'aria-label': '用自己的词描述情绪' } });
      custom.value = state.custom;
      const preview = el('p', { class: 'ground-preview' });
      const button = el('button', { class: 'primary ground-next', text: '带着这个名字，往下走', attrs: { type: 'button' }, on: { click: () => next(1) } });
      const update = () => {
        const word = state.custom.trim() || state.feeling;
        preview.textContent = word ? `我注意到，现在有一些${word}。` : '先找一个接近的词，不必十分准确。';
        button.disabled = !word;
        for (const chip of chips.children) chip.setAttribute('aria-pressed', String(chip.textContent === state.feeling && !state.custom.trim()));
      };
      for (const feeling of FEELINGS) chips.append(el('button', {
        class: 'ground-feeling', text: feeling,
        attrs: { type: 'button', 'aria-pressed': 'false' },
        on: { click: () => { state.feeling = feeling; state.custom = ''; custom.value = ''; update(); } },
      }));
      custom.addEventListener('input', () => { state.custom = custom.value; update(); });
      update();
      return [
        ...heading('01 / 注意', '先给它一个名字', '此刻最明显的感受是什么？选一个接近的词，或自己写。'),
        chips, custom, preview, button,
      ];
    };

    const distanceScreen = () => {
      const word = state.custom.trim() || state.feeling;
      const thought = el('textarea', { class: 'ground-thought', attrs: { rows: 2, maxlength: 180, placeholder: '如果脑中有一句反复出现的话，可以写在这里（选填）', 'aria-label': '脑中出现的想法，选填' } });
      thought.value = state.thought;
      const thoughtLine = el('p', { class: 'ground-thought-line' });
      const update = () => {
        state.thought = thought.value;
        thoughtLine.textContent = state.thought.trim()
          ? `我注意到，脑中出现了“${state.thought.trim()}”这个想法。`
          : '想法可以先不写。留意到它正在出现，就已经是一步。';
      };
      thought.addEventListener('input', update);
      update();
      return [
        ...heading('02 / 拉开距离', '把它放在眼前', '试着在心里念一遍。不必说服自己，也不必马上解决。'),
        el('div', { class: 'ground-quote' }, [
          el('span', { class: 'ground-quote-mark', text: '“' }),
          el('p', { text: `我注意到，现在有一些${word}。` }),
        ]),
        thought, thoughtLine,
        el('p', { class: 'ground-private', text: '输入只留在当前页面；离开后不会保存或上传。' }),
        el('button', { class: 'primary ground-next', text: '把注意带回身体', attrs: { type: 'button' }, on: { click: () => next(2) } }),
        back(),
      ];
    };

    const bodyScreen = () => [
      ...heading('03 / 着陆', '感受脚下的支撑', '双脚轻轻踩在地面上，感受鞋底、地板或椅子托住身体。'),
      el('div', { class: 'ground-floor', attrs: { 'aria-hidden': 'true' } }, [
        el('div', { class: 'ground-floor-halo' }),
        el('div', { class: 'ground-foot left' }),
        el('div', { class: 'ground-foot right' }),
        el('div', { class: 'ground-floor-line' }),
      ]),
      el('p', { class: 'ground-breath-note', text: '让呼吸自然来去。无需刻意深呼吸、数拍或改变节奏。' }),
      el('button', { class: 'primary ground-next', text: '准备好了，看看周围', attrs: { type: 'button' }, on: { click: () => next(3) } }),
      back(),
    ];

    const hereScreen = () => {
      const senses = el('div', { class: 'ground-senses' });
      const prompt = el('p', { class: 'ground-sense-prompt' });
      for (const sense of SENSES) senses.append(el('button', {
        class: 'ground-sense', text: sense.key,
        attrs: { type: 'button', 'aria-pressed': String(state.sense === sense.key) },
        on: { click: () => {
          state.sense = sense.key;
          prompt.textContent = sense.prompt;
          for (const button of senses.children) button.setAttribute('aria-pressed', String(button.textContent === sense.key));
        } },
      }));
      prompt.textContent = SENSES.find(item => item.key === state.sense)?.prompt || '点一个感官，把注意放到周围。';
      const action = el('input', { class: 'ground-custom', attrs: { type: 'text', maxlength: '100', placeholder: '例如：喝口水、先回一条消息（选填）', 'aria-label': '接下来的一件小事，选填' } });
      action.value = state.action;
      action.addEventListener('input', () => { state.action = action.value; });
      return [
        ...heading('04 / 回到此刻', '重新看看周围', '你现在能看见、听见或触到什么？从一个感官开始就好。'),
        senses, prompt,
        el('p', { class: 'ground-small-label', text: '接下来，如果愿意，先做哪一件小事？' }),
        action,
        el('button', { class: 'primary ground-next', text: '结束这次暂停', attrs: { type: 'button' }, on: { click: () => {
          if (finished || disposed) return;
          finished = true;
          complete();
        } } }),
        el('p', { class: 'ground-private', text: '不用等情绪消失。到这里，就可以继续自己的事情。' }),
        back(),
      ];
    };

    const screens = [nameScreen, distanceScreen, bodyScreen, hereScreen];
    const render = () => {
      if (disposed) return;
      root.replaceChildren(progress(), el('div', { class: 'ground-scene' }, screens[step]().filter(Boolean)));
    };
    render();
    return [root];
  },
};
