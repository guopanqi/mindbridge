const TIMEOUT_MS = 15_000;

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

export const api = {
  session: () => request('/api/session'),
  signInWithOmp: (code) => request('/api/auth/omp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code }),
  }),
  signOut: () => request('/api/session', { method: 'DELETE' }),
  metrics: (days) => request(`/api/metrics?days=${encodeURIComponent(days)}`),
  audit: () => request('/api/audit'),
  cases: () => request('/api/cases'),
  caseAction: (payload) => request('/api/cases', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }),
  signInAsHealer: (accessCode) => request('/api/auth/healer', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ accessCode }),
  }),
  createHealerInvite: (displayName) => request('/api/healer/invite', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ displayName }),
  }),
};
