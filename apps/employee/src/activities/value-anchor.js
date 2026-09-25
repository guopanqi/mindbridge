import { el } from '../dom.js';
import { VALUE_DOMAINS, VALUE_QUALITIES, valueSentence, valueCard } from './value-anchor-content.js';

const STEP_NAMES = ['领域', '品质', '一句话', '一个行动'];

export const VALUE_ANCHOR = {
  presentation: {
    immersive: true,
    cue: '从你个人重视的方向出发',
    conclusion: '今天朝自己重视的方向走一步。',
  },
  render(_stage, { complete, cleanup }) {
    const state = { domain: '', qualities: [], customQuality: '', statement: '', action: '', when: '' };
    let step = 0;
    let disposed = false;
    let finished = false;
    const root = el('div', { class: 'va-root' });
    cleanup(() => { disposed = true; });
    const chosen = () => [...state.qualities, state.customQuality.trim()].filter(Boolean);
    const sentence = () => state.statement.trim() || valueSentence(state.domain, chosen());
    const go = next => {
      if (disposed || finished) return;
      step = next;
      render();
      root.querySelector('.va-title')?.focus({ preventScroll: true });
    };
    const title = (eyebrow, heading, description) => [
      el('p', { class: 'va-eyebrow', text: eyebrow }),
      el('h3', { class: 'va-title', text: heading, attrs: { tabindex: '-1' } }),
      el('p', { class: 'va-description', text: description }),
    ];
    const back = () => step > 0 ? el('button', { class: 'secondary va-back', text: '上一步', attrs: { type: 'button' }, on: { click: () => go(step - 1) } }) : null;
    const advance = (label, disabled = false) => el('div', { class: 'va-navigation' }, [
      back(), el('button', { class: 'primary va-next', text: label, attrs: { type: 'button', ...(disabled ? { disabled: true } : {}) }, on: { click: () => go(step + 1) } }),
    ]);
    const domainScreen = () => {
      const next = advance('继续', !state.domain);
      return [
        ...title('01 / 04 · 由你决定', '现在，哪个领域对你重要？', '可以从工作出发，也可以从工作以外的生活出发。这里没有企业给出的“正确价值观”。'),
        el('div', { class: 'va-domains' }, VALUE_DOMAINS.map(item => el('button', {
          class: 'va-domain', text: item.label, attrs: { type: 'button', 'aria-pressed': String(state.domain === item.label) },
          on: { click: () => { state.domain = item.label; state.statement = ''; render(); } },
        }))),
        next,
      ];
    };
    const qualityScreen = () => {
      const count = el('p', { class: 'va-count' });
      const next = advance('写成一句话', !chosen().length);
      const update = () => {
        count.textContent = `已选 ${chosen().length} / 3 个词。它们只是方向，不是必须达到的标准。`;
        next.querySelector('.va-next').disabled = chosen().length === 0;
      };
      const custom = el('input', { class: 'va-input', attrs: { type: 'text', maxlength: '20', placeholder: '也可以写自己的词', 'aria-label': '自己写一个品质' } });
      custom.value = state.customQuality;
      custom.addEventListener('input', () => {
        const trimmed = custom.value.trim();
        if (trimmed && state.qualities.length >= 3) {
          custom.value = state.customQuality;
          return;
        }
        state.customQuality = custom.value;
        state.statement = '';
        update();
      });
      const choices = el('div', { class: 'va-qualities' }, VALUE_QUALITIES.map(word => el('button', {
        class: 'va-quality', text: word, attrs: { type: 'button', 'aria-pressed': String(state.qualities.includes(word)) },
        on: { click: event => {
          const index = state.qualities.indexOf(word);
          if (index < 0 && chosen().length >= 3) return;
          if (index < 0) state.qualities.push(word); else state.qualities.splice(index, 1);
          state.statement = '';
          event.currentTarget.setAttribute('aria-pressed', String(index < 0));
          update();
        } },
      })));
      update();
      return [
        ...title('02 / 04 · 我希望怎样行动', `在${VALUE_DOMAINS.find(item => item.label === state.domain)?.phrase || '这个领域'}，我希望自己是怎样的人？`, '下面只是灵感。最多选三个，也可以写自己的词。'),
        choices, custom, count, next,
      ];
    };
    const statementScreen = () => {
      const draft = valueSentence(state.domain, chosen());
      const editor = el('textarea', { class: 'va-statement-input', attrs: { rows: 3, maxlength: '160', 'aria-label': '我的价值表达' } });
      editor.value = sentence();
      editor.addEventListener('input', () => { state.statement = editor.value; });
      return [
        ...title('03 / 04 · 一句话', '把方向说成自己的话', '说的是你希望怎样行动或待人，不是必须取得的结果。可以直接使用，也可以修改。'),
        el('div', { class: 'va-statement-card' }, [
          el('span', { class: 'va-quote', text: '“', attrs: { 'aria-hidden': 'true' } }),
          el('p', { text: draft }),
        ]),
        el('label', { class: 'va-label' }, [el('span', { text: '我的表达' }), editor]),
        el('p', { class: 'va-note', text: '例如“升职”是一个目标；“可靠、愿意学习”是可以在今天践行的方向。' }),
        advance('选一个小行动'),
      ];
    };
    const actionScreen = () => {
      const action = el('textarea', { class: 'va-action-input', attrs: { rows: 3, maxlength: '180', placeholder: '例如：今天下午用 15 分钟弄清楚遇到的一个问题', 'aria-label': '未来 24 小时的一件小行动' } });
      action.value = state.action;
      const next = advance('看看我的价值锚点', !state.action.trim());
      action.addEventListener('input', () => { state.action = action.value; next.querySelector('.va-next').disabled = !state.action.trim(); });
      const when = el('input', { class: 'va-input', attrs: { type: 'text', maxlength: '60', placeholder: '例如：今天下班前（选填）', 'aria-label': '准备什么时候开始' } });
      when.value = state.when;
      when.addEventListener('input', () => { state.when = when.value; });
      return [
        ...title('04 / 04 · 朝这个方向走一步', '未来 24 小时，一件小事', '不用完成一项宏大的目标。写一件你确实可以开始、由自己决定的行动。'),
        el('div', { class: 'va-current' }, [el('span', { text: '我重视的方向' }), el('p', { text: sentence() })]),
        el('p', { class: 'va-note', text: '灵感：整理好答应同事的数据；花 15 分钟弄清一个问题；问候一位朋友。也可以完全不同。' }),
        el('label', { class: 'va-label' }, [el('span', { text: '我要做的小行动' }), action]),
        el('label', { class: 'va-label' }, [el('span', { text: '我准备什么时候开始（选填）' }), when]),
        next,
      ];
    };
    const summaryScreen = () => {
      const output = el('textarea', { class: 'va-output', attrs: { readonly: true, rows: 7, 'aria-label': '我的价值锚点文字' } });
      output.value = valueCard({ ...state, statement: sentence(), qualities: chosen() });
      const copy = el('button', { class: 'secondary', text: '复制这段文字', attrs: { type: 'button' } });
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(output.value); if (!disposed) copy.textContent = '已复制'; }
        catch { if (!disposed) copy.textContent = '复制不可用，可长按文字选择'; }
      });
      return [
        ...title('我的价值锚点', '今天朝自己重视的方向走一步', '价值是可以反复回到的方向。这一步即使很小，也是在向它靠近。'),
        el('div', { class: 'va-summary-card' }, [el('span', { class: 'va-summary-mark', text: '✦', attrs: { 'aria-hidden': 'true' } }), output]),
        el('div', { class: 'va-navigation' }, [copy, el('button', { class: 'secondary', text: '返回修改', attrs: { type: 'button' }, on: { click: () => go(3) } })]),
        el('button', { class: 'primary va-finish', text: '完成练习', attrs: { type: 'button' }, on: { click: () => {
          if (disposed || finished) return;
          finished = true;
          complete();
        } } }),
        el('p', { class: 'va-privacy', text: '文字只留在当前页面；完成或关闭后不保存，也不会上传。想留住这句话，请先复制。' }),
      ];
    };
    const screens = [domainScreen, qualityScreen, statementScreen, actionScreen, summaryScreen];
    const render = () => {
      if (disposed || finished) return;
      root.replaceChildren(...[
        step < 4 ? el('div', { class: 'va-progress', attrs: { 'aria-label': `第 ${step + 1} 步，共 4 步` } }, STEP_NAMES.map((name, index) => el('span', { class: index === step ? 'current' : index < step ? 'done' : '', text: name }))) : null,
        el('div', { class: 'va-scene' }, screens[step]()),
      ].filter(Boolean));
    };
    render();
    return [root];
  },
};
