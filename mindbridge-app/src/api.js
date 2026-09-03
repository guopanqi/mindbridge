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
  let response;
  try {
    response = await fetch(path, { credentials: 'same-origin', signal: controller.signal, ...init });
  } catch (error) {
    throw new ApiError(error?.name === 'AbortError' ? 'SERVER_TIMEOUT' : 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('INVALID_SERVER_RESPONSE');
  }
  if (!response.ok) throw new ApiError(body.reasonCode || `HTTP_${response.status}`, body.message);
  return body;
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
  me: () => request('/api/me'),
  setContext: (contextTag) => post('/api/me', { contextTag }),
  chatHistory: () => request('/api/chat'),
  sendChat: (text) => post('/api/chat', { text }),
  clearChat: () => request('/api/chat', { method: 'DELETE' }),
  wall: () => request('/api/wall'),
  createPost: (text) => post('/api/wall', { text }),
  deletePost: (id) => request(`/api/wall?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  hug: (postId) => post('/api/wall/react', { postId }),
  reply: (postId, text) => post('/api/wall/reply', { postId, text }),
  history: () => request('/api/history'),
};

export async function hasSession() {
  try {
    const body = await api.session();
    return body.authenticated === true;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'HTTP_401') return false;
    throw error;
  }
}
