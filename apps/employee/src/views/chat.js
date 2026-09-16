import { api, ApiError } from '../api.js';
import { $, clear, el, toast } from '../dom.js';
import { openActivity } from './activity.js';

let stream;
let input;
let sendBtn;
let supportPending = false;
let cardRefreshVersion = 0;

async function refreshCards() {
  const version = ++cardRefreshVersion;
  const target = stream;
  const body = await api.chatHistory();
  if (target !== stream || version !== cardRefreshVersion || supportPending) return;
  const messages = new Map(body.messages.map(message => [message.id, message]));
  for (const node of target.querySelectorAll('[data-message-id]')) {
    const message = messages.get(node.dataset.messageId);
    if (message) node.replaceWith(bubble(message));
  }
}

async function refreshCardsSafely() {
  try { await refreshCards(); } catch { toast('卡片状态暂时无法确认，请重新进入后查看。'); }
}

// 发送只有两个业务状态：空闲、发送中。之前这件事分散在 sending 标志、
// 按钮的 disabled、输入框是否已清空、以及流里那个乐观气泡上，
// 四处各记一半，出错时对不齐——文本被清掉了但消息其实没发出去。
let sendState = 'idle';

// 同一次点击在部分 WebView 里会同时派发 touchend 和 click。
// 这个去重只用于识别「同一次物理点击」，不承担防止重复发送的职责——
// 那是 sendState 的事。
let lastTapAt = 0;

function bubble(message) {
  if (message.role === 'resource' || message.role === 'consent') {
    const node = message.role === 'resource' ? resourceCard(message.card) : consentCard(message.card, message.id);
    if (node && message.id) node.dataset.messageId = message.id;
    return node;
  }
  if (message.role === 'crisis') return crisisCard(message.card);
  const mine = message.role === 'user';
  return el('div', { class: `bubble ${mine ? 'mine' : 'bot'}` }, [
    el('p', { class: 'bubble-text', text: message.text }),
  ]);
}

function resourceCard(card) {
  if (!card) return null;
  const state = card.progress?.state || 'offered';
  const stateText = ({ joined: '进行中', completed: '已完成', declined: '已跳过', unavailable: '活动记录不可用' })[state];
  const actionable = !['declined', 'unavailable'].includes(state);
  return el('div', { class: 'card resource' }, [
    el('div', { class: 'card-icon', text: card.icon || '🌿' }),
    el('div', { class: 'card-main' }, [
      el('p', { class: 'card-title', text: card.name }),
      el('p', { class: 'card-desc', text: card.description }),
      el('p', { class: 'card-tag', text: stateText || (card.level === 'L2' ? '专业支持' : '自助练习') }),
      card.eventId && actionable ? el('button', {
        class: `${state === 'completed' ? 'secondary' : 'primary'} small card-cta`,
        text: ({ joined: '继续活动', completed: '查看结果' })[state] || (card.level === 'L2' ? '查看详情' : '开始'),
        attrs: { type: 'button' },
        on: { click: () => void openActivity(card.eventId, refreshCardsSafely) },
      }) : null,
    ]),
  ]);
}

async function requestAppointment(button, messageId) {
  if (supportPending) return;
  supportPending = true;
  cardRefreshVersion++;
  for (const node of stream.querySelectorAll('.consent button')) node.disabled = true;
  try {
    const result = await api.requestAppointment({ riskLevel: 'red', shareContext: true, messageId });
    button.textContent = `已提交 · 个案编号 ${result.caseCode}`;
    toast('已提交。疗愈师会看到个案编号和风险级别，看不到你是谁。你随时可以在「我的」里取消。');
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '暂时无法确认提交结果，正在重新核对，请勿重复提交。');
  } finally {
    supportPending = false;
    await refreshCardsSafely();
  }
}

function consentCard(card, messageId) {
  if (!card) return null;
  const status = card.support?.status;
  const submitted = ['requested', 'claimed', 'active', 'closed', 'done', 'cancelled', 'unavailable'].includes(status);
  const statusLabel = ({ requested: '已提交 · 等待接单', claimed: '疗愈师已接单', active: '正在跟进', closed: '本次服务已结束', done: '本次服务已结束', cancelled: '本次预约已取消', unavailable: '预约记录不可用' })[status];
  if (submitted) return el('div', { class: 'card consent' }, [
    el('p', { class: 'card-title', text: '专业支持预约' }),
    el('div', { class: 'support-summary', attrs: { role: 'status' } }, [
      el('p', { class: 'support-summary-label', text: status === 'requested' ? '等待接单' : statusLabel }),
      card.support.caseCode ? el('p', { class: 'support-summary-code', text: `个案编号 ${card.support.caseCode}` }) : null,
    ]),
    el('p', { class: 'card-desc', text: '可在「我的」查看预约详情。' }),
  ]);
  return el('div', { class: 'card consent' }, [
    el('p', { class: 'card-title', text: card.title }),
    el('p', { class: 'card-desc', text: card.body }),
    status === 'dismissed' ? el('p', { class: 'card-tag', text: '已选择暂时不用，之后仍可预约。' }) : null,
    el('div', { class: 'card-actions' }, (card.actions || []).filter(item => !(status === 'dismissed' && item.action === 'dismiss')).map((item, index) => {
      const label = typeof item === 'string' ? item : item.label;
      const action = typeof item === 'string' ? null : item.action;
      const button = el('button', {
        class: index === 0 ? 'primary small' : 'secondary small',
        text: action === 'dismiss' && status === 'dismissed' ? '已选择暂时不用' : label,
        attrs: { type: 'button' },
      });
      button.disabled = supportPending || submitted || (action === 'dismiss' && status === 'dismissed');
      button.addEventListener('click', () => {
        if (action === 'request_appointment') return void requestAppointment(button, messageId);
        if (action === 'dismiss') {
          button.disabled = true;
          void api.dismissChatCard(messageId).then(() => {
            toast('好，我们继续说。你随时可以改主意。');
          }, () => toast('暂时无法确认选择，正在重新核对。')).finally(refreshCardsSafely);
        }
      });
      return button;
    })),
  ]);
}

// 紧急资源：只给可拨打的号码，明确说明系统不会代替员工联系任何人。
function crisisCard(card) {
  if (!card) return null;
  return el('div', { class: 'card crisis' }, [
    el('p', { class: 'card-title', text: '如果当下感到难以承受，请随时拨打援助热线' }),
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

// 状态只有一个来源，界面是它的呈现。按钮的可用性不再是另一处独立的事实。
function setSendState(next) {
  sendState = next;
  if (sendBtn) sendBtn.disabled = next === 'sending';
}

async function send(text) {
  if (sendState !== 'idle') {
    toast('上一条还在回复中，请稍等一下…');
    return;
  }
  const trimmed = (text || '').trim();
  if (!trimmed) return;

  setSendState('sending');
  // 输入框先清空是为了手感，但这份文本必须留着：
  // 一旦确认没有发出去，要原样放回去，而不是让人重打一遍。
  input.value = '';
  input.style.height = '';
  const pending = bubble({ role: 'user', text: trimmed });
  pending.classList.add('pending');
  stream.append(pending);
  // 双轮调用可能要 4 秒。静态文字在手机上会被当成卡死，给一个呼吸态。
  const typing = el('div', { class: 'bubble bot typing' }, [
    el('span', { text: '正在听' }), el('i'), el('i'), el('i'),
  ]);
  stream.append(typing);
  stream.scrollTop = stream.scrollHeight;

  // 确认没有写入服务端：把气泡撤掉、文本放回输入框。
  // 留着一个服务端并不存在的气泡，等于让界面替服务端撒谎。
  const rollback = () => {
    pending.remove();
    if (!input.value) input.value = trimmed;
  };

  try {
    const body = await api.sendChat(trimmed);
    typing.remove();
    pending.classList.remove('pending');
    append(body.messages.filter((m) => m.role !== 'user'));
    await refreshCardsSafely();
  } catch (error) {
    typing.remove();
    const code = error instanceof ApiError ? error.code : '';
    if (code === 'SERVER_TIMEOUT' || code === 'NETWORK_ERROR') {
      // 结果未知：超时不是写入失败的证明。不重发、不猜，回服务端取事实，
      // 用「这条消息在不在记录里」把未知收敛成确定的成功或失败。
      try {
        const body = await api.chatHistory();
        const saved = body.messages.some((m) => m.role === 'user' && m.text === trimmed);
        clear(stream);
        append(body.messages);
        if (saved) {
          toast('连接中断，但这条消息已经发出去了。');
        } else {
          input.value = input.value || trimmed;
          toast('连接中断，这条没有发出去，内容已经放回输入框。');
        }
      } catch {
        // 连记录都读不到，才是真正的未知。此时不动界面，也不谎称失败。
        toast('连接中断，暂时无法确认这条是否已保存。请稍后刷新记录确认，避免重复发送。');
      }
      return;
    }
    rollback();
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '消息没有发送成功，请稍后重试。');
  } finally {
    setSendState('idle');
  }
}

export function renderChat(root) {
  clear(root);
  stream = el('div', { class: 'stream' });
  input = el('textarea', { attrs: { rows: 1, placeholder: '说点心里话…', 'aria-label': '倾诉内容' } });

  const triggerSend = (event) => {
    if (event) event.preventDefault();
    const now = Date.now();
    if (now - lastTapAt < 300) return;
    lastTapAt = now;
    void send(input.value);
  };

  // 输入框随内容长高（最多约四行），否则第二行会被 rows=1 的高度切掉。
  const autosize = () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 96)}px`;
  };
  input.addEventListener('input', autosize);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (event.isComposing) return;
      event.preventDefault();
      triggerSend(event);
    }
  });

  sendBtn = el('button', {
    class: 'primary send',
    text: '发送',
    attrs: { type: 'button' },
  });

  // 关键：阻止 pointerdown / mousedown 导致输入框失焦 (blur) 和虚拟键盘收起。
  // 在移动端/钉钉 WebView 中，若输入框失焦收起键盘，页面高度剧烈重排会导致触控坐标偏移，
  // 浏览器的 click 事件被取消，造成“必须点第二次才能发送”的问题。
  sendBtn.addEventListener('pointerdown', (event) => {
    event.preventDefault();
  });
  sendBtn.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });
  sendBtn.addEventListener('touchend', (event) => {
    triggerSend(event);
  });
  sendBtn.addEventListener('click', (event) => {
    triggerSend(event);
  });

  // 触摸/滑动历史消息区域时自动失焦收起键盘，恢复底部 TAB 栏
  stream.addEventListener('pointerdown', () => {
    if (document.activeElement === input) {
      input.blur();
    }
  });

  root.append(
    stream,
    el('div', { class: 'composer' }, [
      input,
      sendBtn,
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
    el('p', { class: 'card-title', text: '轻触感受' }),
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
      append([{ role: 'assistant', text: '你好，我是你的倾诉伙伴 MindBridge。\n这里是一处完全属于你的私密树洞，有什么压力或想法，随时跟我聊聊。' }]);
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

// WebView 回前台时业务状态可能已被疗愈师或另一个页面更新。
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && stream?.isConnected && sendState === 'idle' && !supportPending) void refreshCardsSafely();
});
window.addEventListener('pageshow', event => {
  if (event.persisted && stream?.isConnected && !supportPending) void refreshCardsSafely();
});
