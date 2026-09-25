import { el } from '../dom.js';
import { privatePlan, shareablePlan } from './return-rhythm-plan.js';

const STEPS = ['承受范围', '工作调整', '两周节奏', '预警信号', '复盘时间'];
const DIFFICULTIES = ['专注', '会议', '人际沟通', '工作量', '时间压力', '通勤', '轮班', '其他'];
const ADJUSTMENTS = ['暂时减少工作时间', '逐渐恢复工作时长', '减少并行任务', '暂时调整高压力任务', '灵活安排工作地点或时间', '定期与主管沟通', '需要专业支持'];
const blankWeek = () => ({ schedule: '', priority: '', defer: '' });
const localDate = offset => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const RETURN_RHYTHM = {
  presentation: {
    immersive: true,
    cue: '先写给自己 · 可分享内容由你决定',
    conclusion: '计划可以协商，也可以修改；返岗节奏不需要一次定死。',
  },
  render(_stage, { complete, cleanup }) {
    const state = {
      capacity: '', difficulties: [], adjustments: [], otherAdjustment: '',
      weeks: [blankWeek(), blankWeek()], signs: '', response: '', reviewDate: '',
    };
    let page = 0;
    let tab = 'private';
    let disposed = false;
    let finished = false;
    const root = el('div', { class: 'rr-root' });
    cleanup(() => { disposed = true; });
    const go = target => {
      if (disposed || finished) return;
      page = target;
      render();
      root.querySelector('.rr-title')?.focus({ preventScroll: true });
    };
    const heading = (eyebrow, title, detail) => [
      el('p', { class: 'rr-eyebrow', text: eyebrow }),
      el('h3', { class: 'rr-title', text: title, attrs: { tabindex: '-1' } }),
      el('p', { class: 'rr-detail', text: detail }),
    ];
    const navigation = (next = '继续') => el('div', { class: 'rr-navigation' }, [
      page > 0 ? el('button', { class: 'secondary', text: '上一步', attrs: { type: 'button' }, on: { click: () => go(page - 1) } }) : null,
      el('button', { class: 'primary', text: next, attrs: { type: 'button' }, on: { click: () => go(page + 1) } }),
    ]);
    const field = (label, object, key, placeholder, multiline = false) => {
      const input = el(multiline ? 'textarea' : 'input', { class: 'rr-input', attrs: {
        ...(multiline ? { rows: 2 } : { type: 'text' }), maxlength: multiline ? '240' : '120', placeholder, 'aria-label': label,
      } });
      input.value = object[key];
      input.addEventListener('input', () => { object[key] = input.value; });
      return el('label', { class: 'rr-field' }, [el('span', { text: label }), input]);
    };
    const chips = (options, selected, changed) => el('div', { class: 'rr-chips' }, options.map(option => el('button', {
      class: 'rr-chip', text: option, attrs: { type: 'button', 'aria-pressed': String(selected.includes(option)) },
      on: { click: event => {
        const index = selected.indexOf(option);
        if (index < 0) selected.push(option); else selected.splice(index, 1);
        event.currentTarget.setAttribute('aria-pressed', String(index < 0));
        changed?.();
      } },
    })));
    const capacityScreen = () => [
      ...heading('01 / 05 · 私人梳理', '现在能承受多少？', '这是为自己估量工作节奏，不是医学诊断，也不会进入可分享计划。'),
      el('p', { class: 'rr-label', text: '目前感觉可承受的工作量' }),
      el('div', { class: 'rr-capacities' }, ['较低', '中等', '接近正常', '还不确定'].map(item => el('button', {
        class: 'rr-capacity', text: item, attrs: { type: 'button', 'aria-pressed': String(state.capacity === item) },
        on: { click: () => { state.capacity = item; render(); } },
      }))),
      el('p', { class: 'rr-label', text: '哪些方面尤其困难？可多选' }),
      chips(DIFFICULTIES, state.difficulties), navigation(),
    ];
    const adjustmentScreen = () => [
      ...heading('02 / 05 · 工作需要', '哪些调整可能有帮助？', '先选择你愿意考虑的方案。可分享版本只带走你在这里选中的工作安排。'),
      chips(ADJUSTMENTS, state.adjustments),
      field('其他想商议的工作调整（选填）', state, 'otherAdjustment', '例如：固定一个不排会议的时段', true),
      el('p', { class: 'rr-privacy', text: '“需要专业支持”只保留在私人预览，不会写进可分享版本。' }),
      navigation(),
    ];
    const weekCard = (index) => {
      const item = state.weeks[index];
      return el('section', { class: 'rr-week' }, [
        el('h4', { text: `第 ${index + 1} 周` }),
        field('工作日与工作时段', item, 'schedule', '例如：周一至周四，上午 9:00–12:00'),
        field('优先任务', item, 'priority', '例如：先完成交接与一项核心任务', true),
        field('暂缓或调整的任务', item, 'defer', '例如：暂缓临时跨组项目', true),
      ]);
    };
    const weeksScreen = () => [
      ...heading('03 / 05 · 两周草案', '让节奏落到日程里', '由你填写可行的工作日、时段与任务；这里不预设统一比例。留空的项目会标为“待商议”。'),
      weekCard(0), weekCard(1), navigation(),
    ];
    const signsScreen = () => [
      ...heading('04 / 05 · 仅供自己', '什么时候需要放慢？', '写下你能辨认的信号，以及出现时准备采取的行动。此页不会出现在可分享版本。'),
      field('我的预警信号（选填）', state, 'signs', '例如：连续几天睡不好、下班后很难恢复', true),
      field('出现时我会怎么做（选填）', state, 'response', '例如：调整任务量，联系支持我的人', true),
      el('p', { class: 'rr-privacy', text: '如果目前的节奏已经明显影响健康，可考虑联系专业人员；这份计划不能替代专业支持。' }),
      navigation(),
    ];
    const reviewScreen = () => {
      const date = el('input', { class: 'rr-input', attrs: { type: 'date', min: localDate(0), 'aria-label': '自选复盘日期' } });
      date.value = state.reviewDate;
      date.addEventListener('input', () => { state.reviewDate = date.value; for (const button of options.children) button.setAttribute('aria-pressed', String(button.dataset.date === date.value)); });
      const options = el('div', { class: 'rr-review-options' }, [3, 7].map(days => el('button', {
        class: 'rr-chip', text: `${days} 天后`, attrs: { type: 'button', 'data-date': localDate(days), 'aria-pressed': String(state.reviewDate === localDate(days)) },
        on: { click: event => { state.reviewDate = event.currentTarget.dataset.date; date.value = state.reviewDate; for (const button of options.children) button.setAttribute('aria-pressed', String(button === event.currentTarget)); } },
      })));
      return [
        ...heading('05 / 05 · 留出复盘', '什么时候重新看看计划？', '工作调整应当定期回顾。这个日期会写进计划，但当前不会发送提醒。'),
        options, el('label', { class: 'rr-field' }, [el('span', { text: '或自己选择日期' }), date]),
        el('div', { class: 'rr-review-prompts' }, [
          el('b', { text: '复盘时问自己' }),
          el('p', { text: '哪些调整有效？哪些地方仍然困难？下一阶段要保持、增加还是减少？' }),
        ]),
        navigation('生成我的计划'),
      ];
    };
    const copy = async button => {
      const text = tab === 'private' ? privatePlan(state) : shareablePlan(state);
      try {
        await navigator.clipboard.writeText(text);
        if (disposed) return;
        button.textContent = '已复制';
      } catch {
        if (disposed) return;
        button.textContent = '复制不可用，请长按下方文字选择';
      }
    };
    const previewScreen = () => {
      const output = el('textarea', { class: 'rr-output', attrs: { readonly: true, rows: 15, 'aria-label': tab === 'private' ? '私人完整计划' : '可分享的工作安排' } });
      output.value = tab === 'private' ? privatePlan(state) : shareablePlan(state);
      const copyButton = el('button', { class: 'secondary', text: '复制文本', attrs: { type: 'button' } });
      copyButton.addEventListener('click', () => copy(copyButton));
      return [
        ...heading('计划预览', '一份可以继续修改的草案', '先检查内容。只有你主动复制文本时，它才会离开这个页面。'),
        el('div', { class: 'rr-tabs', attrs: { role: 'tablist', 'aria-label': '计划版本' } }, [
          ['private', '仅自己看 · 完整计划'], ['share', '可分享 · 工作安排'],
        ].map(([key, label]) => el('button', { class: 'rr-tab', text: label,
          attrs: { type: 'button', role: 'tab', 'aria-selected': String(tab === key) },
          on: { click: () => { tab = key; render(); } },
        }))),
        el('p', { class: 'rr-privacy', text: tab === 'private'
          ? '包含承受范围与预警信号，仅供本人查看。不要直接转发这一版。'
          : '不含承受范围、困难项目、预警信号和个人应对措施。复制前仍请检查自填的工作安排文字。' }),
        output,
        el('div', { class: 'rr-navigation' }, [copyButton,
          el('button', { class: 'secondary', text: '返回修改', attrs: { type: 'button' }, on: { click: () => go(4) } }),
        ]),
        el('button', { class: 'primary rr-finish', text: '完成练习', attrs: { type: 'button' }, on: { click: () => {
          if (disposed || finished) return;
          finished = true;
          complete();
        } } }),
        el('p', { class: 'rr-privacy', text: '内容只留在当前页面；完成或关闭后不保存，活动记录只保存完成状态。请先复制需要留存的版本。' }),
      ];
    };
    const screens = [capacityScreen, adjustmentScreen, weeksScreen, signsScreen, reviewScreen, previewScreen];
    const render = () => {
      if (disposed || finished) return;
      root.replaceChildren(...[
        page < 5 ? el('div', { class: 'rr-progress', attrs: { 'aria-label': `第 ${page + 1} 步，共 5 步` } }, STEPS.map((label, index) => el('span', { class: index === page ? 'current' : index < page ? 'done' : '', text: label }))) : null,
        el('div', { class: 'rr-scene' }, screens[page]()),
      ].filter(Boolean));
    };
    render();
    return [root];
  },
};
