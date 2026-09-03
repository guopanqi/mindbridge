import { api, ApiError } from '../api.js';
import { $, clear, el, toast } from '../dom.js';

const PRESETS = ['最近一直睡不好', '感觉自己撑不住了', '在这里说话安全吗？', '就是想有个人听听'];

let stream;
let input;
let sending = false;

function bubble(message) {
  if (message.role === 'resource') return resourceCard(message.card);
  if (message.role === 'consent') return consentCard(message.card);
  const mine = message.role === 'user';
  return el('div', { class: `bubble ${mine ? 'mine' : 'bot'}` }, [
    el('p', { class: 'bubble-text', text: message.text }),
  ]);
}

function resourceCard(card) {
  if (!card) return null;
  return el('div', { class: 'card resource' }, [
    el('div', { class: 'card-icon', text: card.icon || '🌿' }),
    el('div', {}, [
      el('p', { class: 'card-title', text: card.name }),
      el('p', { class: 'card-desc', text: card.description }),
      el('p', { class: 'card-tag', text: card.level === 'L2' ? '进一步支持 · 需要你主动选择是否参加' : '可立即使用的自助资源' }),
    ]),
  ]);
}

function consentCard(card) {
  if (!card) return null;
  return el('div', { class: 'card consent' }, [
    el('p', { class: 'card-title', text: card.title }),
    el('p', { class: 'card-desc', text: card.body }),
    el('div', { class: 'card-actions' }, (card.actions || []).map((label, index) => el('button', {
      class: index === 0 ? 'primary small' : 'secondary small',
      text: label,
      attrs: { type: 'button' },
      on: {
        click: () => toast(index === 0
          ? '已记录你的意愿。疗愈师预约将在下一步开放，我们不会在你不知情时联系任何人。'
          : '好，我们继续说。你随时可以改主意。'),
      },
    }))),
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

export async function loadChat() {
  try {
    const body = await api.chatHistory();
    clear(stream);
    if (!body.messages.length) {
      append([{ role: 'assistant', text: '我是 MindBridge，一个匿名的心理支持助手。\n有什么想说的，随时发给我。' }]);
      return;
    }
    append(body.messages);
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
