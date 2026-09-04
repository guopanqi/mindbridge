import { api, ApiError } from '../api.js';
import { $, clear, el, toast } from '../dom.js';
import { openActivity } from './activity.js';

const PRESETS = ['最近一直睡不好', '感觉自己撑不住了', '在这里说话安全吗？', '就是想有个人听听'];

let stream;
let input;
let sending = false;

function bubble(message) {
  if (message.role === 'resource') return resourceCard(message.card);
  if (message.role === 'consent') return consentCard(message.card);
  if (message.role === 'crisis') return crisisCard(message.card);
  const mine = message.role === 'user';
  return el('div', { class: `bubble ${mine ? 'mine' : 'bot'}` }, [
    el('p', { class: 'bubble-text', text: message.text }),
  ]);
}

function resourceCard(card) {
  if (!card) return null;
  return el('div', { class: 'card resource' }, [
    el('div', { class: 'card-icon', text: card.icon || '🌿' }),
    el('div', { class: 'card-main' }, [
      el('p', { class: 'card-title', text: card.name }),
      el('p', { class: 'card-desc', text: card.description }),
      el('p', { class: 'card-tag', text: card.level === 'L2' ? '进一步支持 · 需要你主动选择是否参加' : '可立即使用的自助资源' }),
      card.eventId ? el('button', {
        class: 'primary small card-cta',
        text: card.level === 'L2' ? '看看详情' : '现在试试',
        attrs: { type: 'button' },
        on: { click: () => void openActivity(card.eventId) },
      }) : null,
    ]),
  ]);
}

async function requestAppointment(button) {
  button.disabled = true;
  try {
    const result = await api.requestAppointment({ riskLevel: 'red', shareContext: true });
    button.textContent = `已提交 · 个案编号 ${result.caseCode}`;
    toast('已提交。疗愈师会看到个案编号和风险级别，看不到你是谁。你随时可以在「我的」里取消。');
  } catch (error) {
    button.disabled = false;
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交没有成功，请稍后再试。');
  }
}

function consentCard(card) {
  if (!card) return null;
  return el('div', { class: 'card consent' }, [
    el('p', { class: 'card-title', text: card.title }),
    el('p', { class: 'card-desc', text: card.body }),
    el('div', { class: 'card-actions' }, (card.actions || []).map((item, index) => {
      const label = typeof item === 'string' ? item : item.label;
      const action = typeof item === 'string' ? null : item.action;
      const button = el('button', {
        class: index === 0 ? 'primary small' : 'secondary small',
        text: label,
        attrs: { type: 'button' },
      });
      button.addEventListener('click', () => {
        if (action === 'request_appointment') return void requestAppointment(button);
        toast('好，我们继续说。你随时可以改主意。');
      });
      return button;
    })),
  ]);
}

// 紧急资源：只给可拨打的号码，明确说明系统不会代替员工联系任何人。
function crisisCard(card) {
  if (!card) return null;
  return el('div', { class: 'card crisis' }, [
    el('p', { class: 'card-title', text: '如果现在很危险，可以直接打这个电话' }),
    el('ul', { class: 'crisis-list' }, (card.resources || []).map((item) => el('li', {}, [
      el('a', { class: 'crisis-tel', text: item.contact, attrs: { href: `tel:${item.contact}` } }),
      el('span', { class: 'crisis-name', text: item.name }),
      el('span', { class: 'crisis-note', text: item.note }),
    ]))),
    el('p', { class: 'card-desc', text: card.disclaimer || '' }),
  ]);
}

function append(messages) {
  for (const message of messages) {
    const node = bubble(message);
    if (node) stream.append(node);
  }
  stream.scrollTop = stream.scrollHeight;
}

async function send(text) {
  if (sending || !text.trim()) return;
  sending = true;
  input.value = '';
  append([{ role: 'user', text: text.trim() }]);
  const typing = el('div', { class: 'bubble bot typing' }, [el('span', { text: '正在听…' })]);
  stream.append(typing);
  stream.scrollTop = stream.scrollHeight;
  try {
    const body = await api.sendChat(text.trim());
    typing.remove();
    append(body.messages.filter((m) => m.role !== 'user'));
  } catch (error) {
    typing.remove();
    if (error instanceof ApiError && ['SERVER_TIMEOUT', 'NETWORK_ERROR'].includes(error.code)) {
      // 超时不是写入失败的证明；仅同步服务端事实，不自动重发或按相同文本猜测成功。
      try {
        const body = await api.chatHistory();
        clear(stream);
        append(body.messages);
        toast('连接中断，已同步最新记录。若这条消息尚未出现，请稍后刷新确认，避免重复发送。');
      } catch {
        toast('连接中断，暂时无法确认是否已保存。请稍后刷新记录确认，避免重复发送。');
      }
      return;
    }
    const message = error instanceof ApiError && error.userMessage ? error.userMessage : '消息没有发送成功，请稍后重试。';
    toast(message);
  } finally {
    sending = false;
  }
}

export function renderChat(root) {
  clear(root);
  stream = el('div', { class: 'stream' });
  input = el('textarea', { attrs: { rows: 1, placeholder: '说点心里话…', 'aria-label': '倾诉内容' } });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send(input.value);
    }
  });

  root.append(
    el('div', { class: 'privacy-note' }, [
      el('span', { text: '这里只有一个匿名编号。原文加密保存，HR 只能看到部门层面的整体趋势。' }),
    ]),
    stream,
    el('div', { class: 'presets' }, PRESETS.map((text) => el('button', {
      class: 'preset', text, attrs: { type: 'button' }, on: { click: () => void send(text) },
    }))),
    el('div', { class: 'composer' }, [
      input,
      el('button', { class: 'primary send', text: '发送', attrs: { type: 'button' }, on: { click: () => void send(input.value) } }),
    ]),
  );
}

// 回访：到期后员工下次打开树洞时出现在对话流里。
// 没有推送通道，所以这是唯一如实的送达方式。
async function renderFollowup() {
  let due;
  try {
    ({ due } = await api.followups());
  } catch {
    return;
  }
  if (!due) return;
  const card = el('div', { class: 'card followup' }, [
    el('p', { class: 'card-title', text: '回访一下' }),
    el('p', { class: 'card-desc', text: due.question }),
  ]);
  const actions = el('div', { class: 'card-actions' }, [
    ...due.answers.map((answer) => el('button', {
      class: 'secondary small', text: answer, attrs: { type: 'button' },
      on: {
        click: async () => {
          try {
            await api.answerFollowup(due.id, answer);
            actions.remove();
            card.append(el('p', { class: 'card-tag', text: '谢谢你告诉我。' }));
          } catch { toast('没能提交，请稍后再试。'); }
        },
      },
    })),
    el('button', {
      class: 'link', text: '跳过', attrs: { type: 'button' },
      on: {
        click: async () => {
          try {
            await api.answerFollowup(due.id, null);
            card.remove();
          } catch { toast('没能跳过，请稍后再试。'); }
        },
      },
    }),
  ]);
  card.append(actions);
  stream.append(card);
  stream.scrollTop = stream.scrollHeight;
}

export async function loadChat() {
  try {
    const body = await api.chatHistory();
    clear(stream);
    if (!body.messages.length) {
      append([{ role: 'assistant', text: '我是 MindBridge，一个匿名的心理支持助手。\n有什么想说的，随时发给我。' }]);
      await renderFollowup();
      return;
    }
    append(body.messages);
    await renderFollowup();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    toast('历史记录暂时读不出来，你仍然可以继续说。');
  }
}

export async function clearChat() {
  await api.clearChat();
  clear(stream);
  append([{ role: 'assistant', text: '记录已清空。想从头说起也可以，我在。' }]);
}

export function focusComposer() {
  if (input && !window.matchMedia('(max-width: 480px)').matches) input.focus();
}

export const chatStreamReady = () => Boolean(stream);
export const chatRoot = () => $('#view-chat');
