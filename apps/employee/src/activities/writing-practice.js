import { el } from '../dom.js';

// CBT 情绪与想法记录：事实 → 情绪+强度 → 第一想法+相信程度 → 支持 → 不支持 →
// 更完整的看法 → 再评情绪。共七步，答案只存本地；complete 只带情绪标签和
// 前后数字（用于结果页展示），用户写的原文一个字都不上传。
const EMOTIONS = ['焦虑', '沮丧', '生气', '委屈', '紧张', '低落', '烦躁', '害怕'];

const sliderRow = (value, onInput) => {
  const readout = el('b', { class: 'wrec-number', text: String(value) });
  const input = el('input', {
    class: 'wrec-range',
    attrs: { type: 'range', min: 0, max: 100, step: 1, value: String(value), 'aria-label': '强度' },
    on: { input: () => { readout.textContent = input.value; onInput(Number(input.value)); } },
  });
  return el('div', { class: 'wrec-slider' }, [
    el('span', { text: '0' }), input, el('span', { text: '100' }), readout,
  ]);
};

export const WRITING_PRACTICE = {
  presentation: {
    immersive: false,
    cue: '把发生的事、感受和想法分开来看',
    conclusion: '写下来的东西只留在这一页。带走那个更完整的看法就行。',
  },

  render(stage, { complete, cleanup }) {
    const data = {
      fact: '', emotions: [], intensity: 50, thought: '', belief: 60,
      support: '', against: '', balanced: '', retest: 50,
    };
    let step = 0;
    let ended = false;
    cleanup(() => { ended = true; });

    const root = el('div', { class: 'wrec-root' });
    const dots = el('div', { class: 'bspace-dots' }, Array.from({ length: 7 }, () => el('i')));

    /**
     * @param {string} title
     * @param {string} hint
     * @param {unknown} controls
     * @param {{ back?: boolean, nextLabel?: string, canNext?: () => boolean }} [options]
     */
    const area = (title, hint, controls, options = {}) => {
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
      // 文本框输入时实时更新下一步可用状态。
      root.querySelectorAll('textarea').forEach(t => t.addEventListener('input', refresh));
      dots.childNodes.forEach((dot, i) => {
        dot.className = i < step ? 'done' : i === step ? 'on' : '';
      });
    };

    const textStep = (title, hint, key, placeholder, nextLabel) => {
      const box = el('textarea', {
        class: 'act-input', attrs: { rows: 4, placeholder },
        on: { input: () => { data[key] = box.value.trim(); } },
      });
      box.value = data[key];
      area(title, hint, [
        box,
        el('p', { class: 'act-note', text: '写在这里就好，不上传、不保存，关掉就没有了。' }),
      ], { nextLabel: nextLabel || '下一步', canNext: () => data[key].trim().length > 0 });
    };

    const steps = [
      () => textStep(
        '发生了什么？',
        '只写事实，像摄像头一样。先别评价，比如“主管说方案要重做”，而不是“他觉得我不行”。',
        'fact', '事情本身是……',
      ),
      () => {
        const chips = el('div', { class: 'act-choices' });
        const sync = () => {
          chips.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('on', data.emotions.includes(btn.dataset.emotion));
          });
        };
        for (const name of EMOTIONS) {
          chips.append(el('button', {
            class: 'act-choice', attrs: { type: 'button', 'data-emotion': name },
            on: { click: () => {
              const i = data.emotions.indexOf(name);
              if (i >= 0) data.emotions.splice(i, 1);
              else if (data.emotions.length < 3) data.emotions.push(name);
              sync(); refreshState();
            } },
          }, [el('span', { class: 'act-choice-body' }, [el('b', { text: name })])]));
        }
        const slider = sliderRow(data.intensity, v => { data.intensity = v; });
        area('此刻有什么感觉？', '最多选三个，再给其中最强烈的那种打个分（0–100）。', [
          chips,
          el('p', { class: 'wrec-sub', text: '最强烈的感觉，强度是多少？' }),
          slider,
        ], { canNext: () => data.emotions.length > 0 });
        const refreshState = () => {
          const next = root.querySelector('.act-cta');
          if (next) next.disabled = data.emotions.length === 0;
        };
        sync();
      },
      () => {
        const box = el('textarea', {
          class: 'act-input', attrs: { rows: 3, placeholder: '当时脑子里冒出来的第一句话……' },
          on: { input: () => { data.thought = box.value.trim(); } },
        });
        box.value = data.thought;
        area('当时冒出来的第一句话是什么？', '不用修饰，就是它。比如“他觉得我能力不行”。', [
          box,
          el('p', { class: 'wrec-sub', text: '你有多相信这句话？（0–100%）' }),
          sliderRow(data.belief, v => { data.belief = v; }),
        ], { canNext: () => data.thought.trim().length > 0 });
      },
      () => textStep(
        '有什么事实支持它？',
        '只列证据，不加推论。“他说方案没抓住重点”算，“他看不上我”不算。',
        'support', '支持这个想法的事实……',
      ),
      () => textStep(
        '有什么事实不太支持它？',
        '想想例外：他有没有给过具体修改意见？上次的评价怎么样？他原话里有没有说你这个人？',
        'against', '不太支持的事实……',
      ),
      () => textStep(
        '换个更完整、更现实的说法？',
        '不是逼自己乐观，是把两边的事实都装进来。“这次方案确实有问题，但不等于他否定我这个人。”',
        'balanced', '更完整的看法是……', '看看情绪变化 ›',
      ),
      () => {
        data.retest = Math.min(100, data.intensity);
        area('现在，同样的感觉还有多少？', `刚才${data.emotions.join('、')}是 ${data.intensity}，现在再打一次分。`, [
          sliderRow(data.retest, v => { data.retest = v; }),
        ], { nextLabel: '完成书写' });
      },
    ];

    function go(next) {
      if (next >= steps.length) {
        ended = true;
        const delta = data.intensity - data.retest;
        complete({
          question: '情绪书写',
          label: `${data.emotions.join('、')} ${data.intensity} → ${data.retest}`,
          reflection: delta > 0
            ? `降了 ${delta} 分。想法没变，是看它的角度变了。`
            : '分数没动也正常，有些情绪需要多来几遍。写下来的部分已经起作用了。',
        });
        return;
      }
      step = next;
      steps[step]();
    }

    // dots 在 root 之外固定顶部：area() 每次都会清空 root 重渲染步骤。
    go(0);
    return [dots, root];
  },
};
