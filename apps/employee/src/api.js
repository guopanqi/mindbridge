const TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  constructor(code, message) {
    super(code);
    this.code = code;
    this.userMessage = message || '';
  }
}

async function request(path, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(path, { credentials: 'same-origin', signal: controller.signal, ...init });
    let body;
    try {
      body = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new ApiError('INVALID_SERVER_RESPONSE');
    }
    if (!response.ok) throw new ApiError(body.reasonCode || `HTTP_${response.status}`, body.message);
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error?.name === 'AbortError' ? 'SERVER_TIMEOUT' : 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }
}

const post = (path, payload) => request(path, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload || {}),
});

export const api = {
  config: () => request('/api/config'),
  session: () => request('/api/session'),
  authenticate: (code) => post('/api/auth', { code }),
  authenticateInvite: (token) => post('/api/auth/invite', { token }),
  signOut: () => request('/api/session', { method: 'DELETE' }),
  me: () => request('/api/me'),
  bootstrap: () => request('/api/bootstrap'),
  setContext: (contextTag) => post('/api/me', { contextTag }),
  chatHistory: () => request('/api/chat'),
  sendChat: (text) => post('/api/chat', { text }),
  dismissChatCard: (messageId) => post('/api/chat/card', { messageId, action: 'dismiss' }),
  wall: () => request('/api/wall'),
  createPost: (text) => post('/api/wall', { text }),
  deletePost: (id) => request(`/api/wall?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  hug: (postId) => post('/api/wall/react', { postId }),
  reply: (postId, text) => post('/api/wall/reply', { postId, text }),
  history: () => request('/api/history'),
  resources: () => request('/api/resources'),
  startResource: (activityId) => post('/api/resources', { activityId }),
  followups: () => request('/api/followups'),
  answerFollowup: (id, answer) => post('/api/followups', { id, answer }),
  activity: (eventId) => request(`/api/activities?eventId=${encodeURIComponent(eventId)}`),
  activityProgress: (payload) => post('/api/activities', payload),
  appointments: () => request('/api/appointments'),
  requestAppointment: (payload) => post('/api/appointments', payload),
  cancelAppointment: (id) => request(`/api/appointments?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  consents: () => request('/api/consents'),
  authorizations: () => request('/api/authorizations'),
  decideAuthorization: (id, approve) => post('/api/authorizations', { id, approve }),
  setConsent: (scope, granted) => post('/api/consents', { scope, granted }),
  submitSuggestion: (text) => post('/api/suggestions', { text }),
};

export async function getSession() {
  try {
    return await api.session();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'HTTP_401') return { authenticated: false };
    throw error;
  }
}

export async function hasSession() {
  return (await getSession()).authenticated === true;
}
