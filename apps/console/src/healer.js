// 疗愈师工作台：与企业管理后台分开的独立入口。
//
// 为什么不继续用 console 的角色开关：疗愈师是外部持证人员，不在企业钉钉组织内。
// 和 HR / 管理员共用一个前端包，等于把关怀看板与审计页的代码下发到外部人员浏览器里，
// 靠 hidden 藏起来只是视觉隔离；入口文案也永远在自相矛盾地要求「从钉钉管理后台进入」。
// 这里只装个案台一个视图，登录也只认疗愈师自己的凭证。
import { api, ApiError } from './api.js';
import { BUILD_ID } from './build-id.js';
import { $, toast } from './dom.js';
import { loadCases, renderCases, setHealerIdentity } from './views/cases.js';

function showGate(title, detail, code) {
  $('#gate-title').textContent = title;
  $('#gate-detail').textContent = detail;
  const codeNode = $('#gate-code');
  if (code) {
    codeNode.textContent = `诊断码：${code} · ${BUILD_ID}`;
    codeNode.hidden = false;
  } else {
    codeNode.hidden = true;
  }
  $('#gate').hidden = false;
  $('#workspace').hidden = true;
}

async function enterWorkspace(session) {
  // 入口链接可能属于任何工作人员账号，没有 healer 角色的不能进这里。
  if (!session.roles.includes('healer')) {
    await api.signOut().catch(() => {});
    showGate('这个账号不是疗愈师', '请使用企业管理员发给你的疗愈师入口链接。', 'NOT_HEALER');
    return;
  }
  setHealerIdentity({ displayName: session.displayName, credential: session.credential });
  $('#staff-name').textContent = session.displayName;
  $('#gate').hidden = true;
  $('#workspace').hidden = false;
  renderCases($('#view-cases'));
  try {
    await loadCases();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'STAFF_SESSION_REQUIRED') {
      showGate('登录已过期', '请重新打开企业管理员发给你的入口链接。', 'STAFF_SESSION_REQUIRED');
    }
  }
}

async function boot() {
  const url = new URL(window.location.href);
  const key = url.searchParams.get('k');
  if (key) {
    // 密钥等同于登录凭证：不论成败都先从地址栏抹掉，避免留在截图、录屏和浏览器历史里。
    url.searchParams.delete('k');
    window.history.replaceState({}, '', url.toString());
    try {
      await api.signInAsHealer({ accessKey: key });
    } catch (error) {
      showGate('入口链接无法打开',
        error instanceof ApiError && error.userMessage ? error.userMessage : '入口链接已失效，请联系企业管理员。',
        error instanceof ApiError ? error.code : null);
      return;
    }
  }
  try {
    const session = await api.session();
    if (session.authenticated) return void enterWorkspace(session);
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 'HTTP_401') {
      showGate('工作台打不开', '网络连接没有完成，请稍后重试。',
        error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR');
      return;
    }
  }
  showGate('疗愈师工作台', '请使用企业管理员提供的入口链接打开本页面。链接等同于登录凭证，请不要转发。', null);
}

// 邀请码是新疗愈师首次入职用的，日常与演示都走入口链接。
$('#healer-login').addEventListener('click', async () => {
  const input = $('#healer-code');
  const code = input.value.trim();
  if (!code) return toast('请填写邀请码。');
  try {
    await api.signInAsHealer({ accessCode: code });
    input.value = '';
    await enterWorkspace(await api.session());
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '邀请码无效。');
  }
});

$('#sign-out').addEventListener('click', async () => {
  await api.signOut().catch(() => {});
  showGate('已退出', '需要时可以重新打开入口链接。', null);
});

void boot();
