import { api, ApiError, getSession } from './api.js';
import { BUILD_ID } from './build-id.js';
import { $, closeSheet, reducedMotion } from './dom.js';
import { clearChat, focusComposer, loadChat, renderChat } from './views/chat.js';
import { loadWall, renderWall } from './views/wall.js';
import { loadActivities, renderActivities } from './views/activities.js';
import { loadMe, renderMe, privacySheet, setPrivacyEntryChannel } from './views/me.js';
import { askContext } from './views/context-prompt.js';
import { openActivity } from './views/activity.js';
import { clearCache, refresh } from './store.js';

const MIN_BOOT_MS = 1200;
const AUTH_TIMEOUT_MS = 12_000;

const FAILURE_TEXT = {
  DINGTALK_JSAPI_UNAVAILABLE: '请从钉钉工作台里打开 MindBridge，直接访问网址无法建立匿名身份。',
  DINGTALK_AUTH_FAILED: '钉钉没有完成免登。请确认是从钉钉工作台进入，再重试一次。',
  DINGTALK_AUTH_TIMEOUT: '钉钉没有返回免登信息，请退出后重新从工作台进入。',
  DINGTALK_AUTH_CODE_EMPTY: '钉钉没有返回免登信息，请退出后重新从工作台进入。',
  SERVER_TIMEOUT: '网络连接超时，请检查网络后重试。',
  NETWORK_ERROR: '网络连接失败，请检查网络后重试。',
  APP_CONFIGURATION_MISSING: '应用配置不完整，请联系管理员。',
  INVITE_INVALID: '邀请链接无效或已失效，请联系邀请人。',
  INVITE_FULL: '本次邀请名额已满，请联系邀请人。',
};

let booting = false;
let currentView = null;
let pendingInvite = null;
const loaded = new Set();

function withTimeout(promise, code) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new ApiError(code)), AUTH_TIMEOUT_MS); }),
  ]).finally(() => clearTimeout(timer));
}

function markStep(name) {
  const node = $(`#boot-steps [data-step="${name}"]`);
  if (node) node.classList.add('done');
}

async function establishSession() {
  markStep('verify');
  const config = await api.config();
  if (!config.clientId || !config.corpId) throw new ApiError('APP_CONFIGURATION_MISSING');
  if (typeof window.requestDingTalkAuthCode !== 'function') throw new ApiError('DINGTALK_JSAPI_UNAVAILABLE');
  // 钉钉 SDK 的 reject 值不是标准 Error，统一收敛成可展示的诊断码。
  const result = await withTimeout(
    Promise.resolve()
      .then(() => window.requestDingTalkAuthCode({ clientId: config.clientId, corpId: config.corpId }))
      .catch(() => { throw new ApiError('DINGTALK_AUTH_FAILED'); }),
    'DINGTALK_AUTH_TIMEOUT'
  );
  if (typeof result?.code !== 'string' || !result.code) throw new ApiError('DINGTALK_AUTH_CODE_EMPTY');
  markStep('strip');
  const auth = await api.authenticate(result.code);
  if (auth.authenticated !== true) throw new ApiError('AUTHENTICATION_FAILED');
  markStep('anon');
}

function showFailure(code) {
  $('#boot-title').textContent = '暂时没能进入 MindBridge';
  $('#boot-detail').textContent = '你的身份信息没有被记录，可以放心重试。';
  $('#boot-fail-text').textContent = FAILURE_TEXT[code] || '连接没有完成，请重试一次。';
  $('#boot-code').textContent = `${code || 'UNKNOWN'} · ${BUILD_ID}`;
  $('#boot-fail').hidden = false;
  $('#boot').classList.add('failed');
}

async function enterApp(session) {
  setPrivacyEntryChannel(session?.entryChannel);
  const me = await api.me();
  $('#display-name').textContent = me.displayName;
  $('#organization-label').textContent = session?.entryChannel === 'beta_web'
    ? `${session.organizationName || '公开测试组织'} · 匿名参与`
    : '匿名身份 · HR 与疗愈师都看不到你是谁';
  $('#app').dataset.entryChannel = session?.entryChannel === 'beta_web' ? 'beta_web' : 'dingtalk';
  $('#boot').hidden = true;
  $('#app').hidden = false;
  await showView('chat');
  // 进来就把「我的 / 我的活动」的数据预热好，等用户点过去时已经在内存里，直接出内容。
  void refresh().catch(() => {});
  // 机器人只提供定位链接，必须先完成正常免登；API仍检查参与记录归属。
  const link = new URL(window.location.href);
  const eventId = link.searchParams.get('eventId');
  if (eventId && /^res_[A-Za-z0-9_-]{1,80}$/.test(eventId)) {
    link.searchParams.delete('eventId');
    window.history.replaceState(null, '', link);
    await openActivity(eventId);
  }
  // 还没做过选择的人，进来先问一次处境标签；选过或跳过就不再打扰。
  if (!me.contextDecided) askContext();
}

async function showView(view) {
  if (currentView === view) return;
  currentView = view;
  $('#app').dataset.view = view;
  for (const tab of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.tab'))) {
    const on = tab.dataset.view === view;
    tab.classList.toggle('on', on);
    tab.setAttribute('aria-selected', String(on));
  }
  for (const name of ['chat', 'wall', 'activities', 'me']) $(`#view-${name}`).hidden = name !== view;
  try {
    if (!loaded.has(view)) {
      loaded.add(view);
      if (view === 'chat') { renderChat($('#view-chat')); await loadChat(); focusComposer(); return; }
      if (view === 'wall') { renderWall($('#view-wall')); await loadWall(); return; }
      if (view === 'activities') { renderActivities($('#view-activities')); await loadActivities(); return; }
      renderMe($('#view-me'), { onClearChat: clearChat });
      await loadMe();
      return;
    }
    if (view === 'wall') await loadWall();
    if (view === 'activities') await loadActivities();
    if (view === 'me') await loadMe();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') {
      loaded.clear();
      clearCache();
      currentView = null;
      await boot({ reason: 'expired' });
    }
  }
}

/** @param {{ reason?: string }} [options] */
export async function boot({ reason } = {}) {
  if (booting) return;
  booting = true;
  const startedAt = Date.now();
  $('#boot').hidden = false;
  $('#boot').classList.remove('failed');
  $('#boot-fail').hidden = true;
  $('#app').hidden = true;
  for (const node of document.querySelectorAll('#boot-steps li')) node.classList.remove('done');
  if (reason === 'expired') {
    $('#boot-title').textContent = '正在重新建立匿名连接';
  }

  try {
    const url = new URL(window.location.href);
    const inviteToken = url.searchParams.get('invite') || pendingInvite;
    const reviewRequested = url.searchParams.get('demo') === 'review';
    if (inviteToken) {
      pendingInvite = inviteToken;
      url.searchParams.delete('invite');
      window.history.replaceState(null, '', url.toString());
      $('#boot-detail').textContent = '正在加入公开测试组织。产品团队会按匿名代号分析使用记录；进入后可查看完整隐私说明。';
      document.querySelector('#boot-steps [data-step="verify"]').lastChild.textContent = '确认测试组织邀请';
      document.querySelector('#boot-steps [data-step="strip"]').lastChild.textContent = '不收集姓名或微信身份';
      await api.authenticateInvite(inviteToken);
      pendingInvite = null;
    } else if (reviewRequested) {
      url.searchParams.delete('demo');
      window.history.replaceState(null, '', url.toString());
      await api.authenticateReview();
    }

    let session = await getSession();
    // 正常入口不能沿用此前的评审身份；清掉后继续执行原有钉钉免登。
    if (!reviewRequested && !inviteToken && session.authenticated && session.review) {
      await api.signOut();
      session = { authenticated: false, review: false };
    }
    const alive = session.authenticated;
    if (!alive) {
      await establishSession();
      session = await getSession();
      const elapsed = Date.now() - startedAt;
      const wait = reducedMotion() ? 0 : Math.max(0, MIN_BOOT_MS - elapsed);
      if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    } else {
      for (const node of document.querySelectorAll('#boot-steps li')) node.classList.add('done');
    }
    await enterApp(session);
  } catch (error) {
    const code = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
    // 不打印原始错误：可能带有授权码或身份关联信息。
    console.error(JSON.stringify({ event: 'boot_failed', code }));
    showFailure(code);
  } finally {
    booting = false;
  }
}

document.addEventListener('click', (event) => {
  const tab = /** @type {HTMLElement | null} */ (/** @type {Element} */ (event.target).closest('.tab'));
  if (tab) void showView(tab.dataset.view);
});
$('#boot-retry').addEventListener('click', () => void boot({ reason: 'retry' }));
$('#privacy-btn').addEventListener('click', () => privacySheet());
$('#sheet-close').addEventListener('click', closeSheet);
$('#sheet').addEventListener('click', (event) => { if (event.target.id === 'sheet') closeSheet(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSheet(); });

// 输入法弹出时收起 tab 栏，让输入框与发送按钮直接紧贴在键盘上方。
// 结合焦点事件（点按瞬间零延时隐藏）与 visualViewport（动态跟随视口高度压缩）：
const isTextInput = (target) => target && (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit'].includes(target.type)));

const setKeyboardOpen = (open) => {
  $('#app')?.classList.toggle('keyboard-open', Boolean(open));
};

document.addEventListener('focusin', (event) => {
  if (isTextInput(event.target)) setKeyboardOpen(true);
});

document.addEventListener('focusout', (event) => {
  if (isTextInput(event.target)) {
    setTimeout(() => {
      if (!isTextInput(document.activeElement)) setKeyboardOpen(false);
    }, 80);
  }
});

// iOS WebView 弹出键盘时，布局视口不会缩小，页面只是被顶上去；
// 键盘收起后经常停在偏移的位置，对话流下面就凭空少了两行。
// 这里让 .app 始终与可视视口等高等位，键盘开合都把窗口滚回原点，
// 并把对话流重新贴到底部。
const viewport = window.visualViewport;
const pinStreamBottom = () => {
  const stream = document.querySelector('#view-chat:not([hidden]) .stream');
  if (stream) stream.scrollTop = stream.scrollHeight;
};
if (viewport) {
  let lastHeight = viewport.height;
  const syncKeyboard = () => {
    const app = $('#app');
    const shrunk = window.innerHeight - viewport.height > window.innerHeight * 0.15;
    const hasFocus = isTextInput(document.activeElement);
    setKeyboardOpen(shrunk || hasFocus);
    if (app) {
      app.style.height = shrunk ? `${Math.round(viewport.height)}px` : '';
      app.style.transform = shrunk && viewport.offsetTop ? `translateY(${Math.round(viewport.offsetTop)}px)` : '';
    }
    if (window.scrollY || window.scrollX) window.scrollTo(0, 0);
    if (Math.abs(viewport.height - lastHeight) > 1) {
      lastHeight = viewport.height;
      pinStreamBottom();
      requestAnimationFrame(pinStreamBottom);
    }
  };
  viewport.addEventListener('resize', syncKeyboard);
  viewport.addEventListener('scroll', syncKeyboard);
  document.addEventListener('focusout', () => setTimeout(syncKeyboard, 120));
}

void boot();
