import { emptyUserState } from './model-contract.js';

const MAX_RECENT_MESSAGES = 10;

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
