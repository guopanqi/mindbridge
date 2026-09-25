import { api } from '../api.js';
import { clear, el } from '../dom.js';

let root;
let selected = '';

const LABELS = {
  beta_joined: '加入内测组织', session_started: '开始会话', chat_message_sent: '发送聊天消息',
  chat_reply_delivered: '收到聊天回复', activity_recommended: '收到活动推荐',
  activity_self_selected: '自行选择活动', activity_opened: '打开活动',
  activity_started: '开始活动', activity_completed: '完成活动',
  activity_feedback_submitted: '提交活动评价', wall_post_created: '发布广场帖子',
  wall_reply_created: '回复广场帖子', wall_reaction_added: '广场互动',
  appointment_requested: '请求疗愈师支持', appointment_cancelled: '取消支持请求',
};

export function renderTestTimeline(container) { root = container; }

export async function loadTestTimeline(anonId = selected) {
  try {
    const data = await api.testTimeline(anonId);
    const people = data.participants || [];
    selected = anonId && people.some((person) => person.anonId === anonId)
      ? anonId : (people.find((person) => person.messageCount > 0 || person.activityCount > 0) || people[0])?.anonId || '';
    if (!anonId && selected) return loadTestTimeline(selected);
    const picker = el('select', { attrs: { 'aria-label': '选择匿名用户' } }, people.map((person) => {
      const option = el('option', { text: `${person.displayName || '匿名用户'} · ${person.anonId} · 聊天 ${person.messageCount} · 活动 ${person.activityCount}`, attrs: { value: person.anonId } });
      option.selected = person.anonId === selected;
      return option;
    }));
    picker.addEventListener('change', () => { selected = picker.value; void loadTestTimeline(selected); });
    const refresh = el('button', { class: 'ghost', text: '刷新时间线', attrs: { type: 'button' } });
    refresh.addEventListener('click', () => { void loadTestTimeline(selected); });
    clear(root).append(el('section', { class: 'panel' }, [
      el('h2', { text: '匿名用户事件时间线' }),
      el('p', { class: 'panel-sub', text: '仅内部测试可见：展示本组织匿名 ID 的聊天与活动行为，不含聊天原文。操作后点击刷新，核对统计事件是否已写入。' }),
      people.length ? el('div', { class: 'timeline-controls' }, [picker, refresh]) : el('p', { class: 'empty', text: '该组织暂无匿名参与者。' }),
      selected ? el('p', { class: 'panel-sub', text: `当前匿名 User ID：${selected}` }) : null,
      selected && data.events.length ? el('table', { class: 'grid-table' }, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: '时间' }), el('th', { text: '行为' }), el('th', { text: '关联活动 / 对象' }), el('th', { text: '统计写入' }),
        ])]),
        el('tbody', {}, data.events.map((event) => el('tr', {}, [
          el('td', { text: new Date(event.at).toLocaleString('zh-CN') }),
          el('td', { text: LABELS[event.name] || event.name }),
          el('td', { class: 'mono', text: event.activityName || event.objectId || '—' }),
          el('td', { text: event.statistic ? `${event.statistic} · ${event.statisticRecorded ? '已写入' : '未查到'}` : '不写入组织统计' }),
        ]))),
      ]) : selected ? el('p', { class: 'empty', text: '该匿名用户暂无可显示的事件。' }) : null,
      selected ? el('p', { class: 'panel-sub', text: data.statisticNote || '' }) : null,
    ]));
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '测试时间线暂时无法加载。' }));
  }
}
