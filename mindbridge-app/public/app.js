const button = document.querySelector('#auth-button');
const logoutButton = document.querySelector('#logout-button');
const dot = document.querySelector('#status-dot');
const title = document.querySelector('#status-title');
const detail = document.querySelector('#status-detail');

const REQUEST_TIMEOUT_MS = 12_000;
let authInFlight = false;

class ClientError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function setStatus(kind, headline, description) {
  dot.className = `status-dot ${kind}`;
  title.textContent = headline;
  detail.textContent = description;
}

function withTimeout(promise, code) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new ClientError(code)), REQUEST_TIMEOUT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function fetchJson(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    let body;
    try {
      body = await response.json();
    } catch {
      throw new ClientError('INVALID_SERVER_RESPONSE');
    }
    return { response, body };
  } catch (error) {
    if (error?.name === 'AbortError') throw new ClientError('SERVER_TIMEOUT');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function requestAuthCode(clientId, corpId) {
  if (typeof window.requestDingTalkAuthCode !== 'function') {
    throw new ClientError('DINGTALK_JSAPI_UNAVAILABLE');
  }
  const result = await withTimeout(
    window.requestDingTalkAuthCode({ clientId, corpId }),
    'DINGTALK_AUTH_TIMEOUT'
  );
  if (typeof result?.code !== 'string' || result.code.length === 0) {
    throw new ClientError('DINGTALK_AUTH_CODE_EMPTY');
  }
  return result.code;
}

async function checkSession() {
  const { response, body } = await fetchJson('/api/session', { credentials: 'same-origin' });
  if (response.status === 401) return false;
  if (!response.ok) throw new ClientError(body.reasonCode || 'SESSION_CHECK_FAILED');
  return body.authenticated === true;
}

function failureDescription(code) {
  if (code === 'DINGTALK_AUTH_TIMEOUT') return '钉钉客户端未返回免登授权码，请重新打开应用。';
  if (code === 'DINGTALK_JSAPI_UNAVAILABLE') return '当前钉钉客户端不支持免登接口，请升级钉钉后重试。';
  if (code === 'SERVER_TIMEOUT') return 'MindBridge 服务连接超时，请检查网络后重试。';
  if (code === 'APP_CONFIGURATION_MISSING') return '应用部署配置不完整，请联系管理员。';
  return `匿名登录失败，请联系管理员并提供错误码：${code || 'UNKNOWN'}`;
}

async function establishSession() {
  if (authInFlight) return;
  authInFlight = true;
  button.disabled = true;
  setStatus('working', '正在向钉钉确认身份', '正在请求一次性授权码；身份不会显示在此页面。');

  try {
    const configResult = await fetchJson('/api/config', { credentials: 'same-origin' });
    if (!configResult.response.ok || !configResult.body.clientId || !configResult.body.corpId) {
      throw new ClientError(configResult.body.reasonCode || 'APP_CONFIGURATION_MISSING');
    }
    const code = await requestAuthCode(configResult.body.clientId, configResult.body.corpId);
    setStatus('working', '正在建立匿名会话', '授权码正在由服务端交换，页面不会接收你的钉钉用户标识。');
    const authResult = await fetchJson('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!authResult.response.ok || authResult.body.authenticated !== true) {
      throw new ClientError(authResult.body.reasonCode || 'AUTHENTICATION_FAILED');
    }
    if (!(await checkSession())) throw new ClientError('SESSION_VERIFICATION_FAILED');

    setStatus('success', '匿名会话已建立', '你已通过钉钉完成身份验证。接下来将以匿名身份使用 MindBridge。');
    button.hidden = true;
    logoutButton.hidden = false;
  } catch (error) {
    const code = error instanceof ClientError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
    console.error(JSON.stringify({ event: 'anonymous_login_failed', code }));
    setStatus('error', '身份验证未完成', failureDescription(code));
  } finally {
    authInFlight = false;
    button.disabled = false;
  }
}

button.addEventListener('click', () => void establishSession());
logoutButton.addEventListener('click', async () => {
  try {
    const { response } = await fetchJson('/api/session', {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (!response.ok) throw new ClientError('LOGOUT_FAILED');
    logoutButton.hidden = true;
    button.hidden = false;
    setStatus('pending', '匿名会话已结束', '下次使用时会重新通过钉钉建立会话。');
  } catch (error) {
    const code = error instanceof ClientError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
    setStatus('error', '会话未能结束', failureDescription(code));
  }
});

async function bootstrap() {
  try {
    if (await checkSession()) {
      setStatus('success', '匿名会话仍然有效', '你正在以匿名身份使用 MindBridge。');
      button.hidden = true;
      logoutButton.hidden = false;
      return;
    }
    if (typeof window.requestDingTalkAuthCode !== 'function') {
      setStatus('error', '未检测到钉钉客户端', '此地址必须从钉钉工作台中打开，不能作为普通网页直链登录。');
      return;
    }
    await establishSession();
  } catch (error) {
    const code = error instanceof ClientError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
    setStatus('error', 'MindBridge 暂时不可用', failureDescription(code));
  }
}

void bootstrap();
