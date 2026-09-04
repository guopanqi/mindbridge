import { emptyUserState } from './model-contract.js';

// 10 条（5 轮）会把第一轮交代的背景挤出视线。20 条覆盖十轮，配合 ongoingTopics 里
// 长期沉淀的背景事实，跨天重入时不至于失忆。
const MAX_RECENT_MESSAGES = 20;

function cleanMessage(message) {
  if (!message || !['user', 'assistant'].includes(message.role) || typeof message.text !== 'string') return null;
  return { role: message.role, text: message.text.slice(0, 2000), at: message.at || null };
}

export function buildModelVisibleContext({ userState, recentMessages, currentMessage, channel = 'h5', profileContext = 'none' }) {
  const recent = (recentMessages || []).map(cleanMessage).filter(Boolean).slice(-MAX_RECENT_MESSAGES);
  return {
    channel,
    profileContext,
    userState: { ...emptyUserState(), ...(userState || {}) },
    recentMessages: recent,
    currentMessage: String(currentMessage || '').slice(0, 2000),
  };
}
