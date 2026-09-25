// 疗愈师工作台：与企业管理后台分开的独立入口。
//
// 为什么不继续用 console 的角色开关：疗愈师是外部持证人员，不在企业钉钉组织内。
// 和 HR / 管理员共用一个前端包，等于把关怀看板与审计页的代码下发到外部人员浏览器里，
// 靠 hidden 藏起来只是视觉隔离；入口文案也永远在自相矛盾地要求「从钉钉管理后台进入」。
// 这里只装个案台一个视图，疗愈师用系统侧预置的登录名进入。
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
  $('#signin').hidden = false;
}

async function enterWorkspace(session) {
  // 管理员会话不能直接进入疗愈师个案台。
  if (!session.roles.includes('healer')) {
    await api.signOut().catch(() => {});
    showGate('该账号不是疗愈师账号', '请输入系统预置的疗愈师登录名。', 'NOT_HEALER');
    return;
  }
  setHealerIdentity({ displayName: session.displayName, credential: session.credential });
  $('#staff-name').textContent = session.displayName;
  $('#gate').hidden = true;
  $('#signin').hidden = true;
  $('#workspace').hidden = false;
  renderCases($('#view-cases'));
  try {
    await loadCases();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'STAFF_SESSION_REQUIRED') {
      showGate('登录已过期', '请重新输入疗愈师登录名。', 'STAFF_SESSION_REQUIRED');
    }
  }
}

async function boot() {
  const url = new URL(window.location.href);
  // 聚合页可传登录名作为快捷入口；它只是公开账号名，不是密钥。
  const quickLogin = url.searchParams.get('login')?.trim();
  if (url.searchParams.has('k') || quickLogin) {
    url.searchParams.delete('k');
    url.searchParams.delete('login');
    window.history.replaceState({}, '', url.toString());
  }
  if (quickLogin) {
    $('#signin-name').value = quickLogin;
    try {
      await api.signInAsHealer({ username: quickLogin });
    } catch (error) {
      showGate('账号无法进入',
        error instanceof ApiError && error.userMessage ? error.userMessage : '请检查疗愈师登录名。',
        error instanceof ApiError ? error.code : null);
      return;
    }
  }
  try {
    const session = await api.session();
    if (session.authenticated) return void enterWorkspace(session);
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 'HTTP_401') {
      showGate('工作台暂时无法打开', '网络连接未完成，请稍后再试。',
        error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR');
      return;
    }
  }
  showGate('疗愈师工作台', '输入系统预置的疗愈师登录名即可进入。', null);
}

async function signIn() {
  const input = $('#signin-name');
  const username = input.value.trim();
  if (!username) return toast('请输入疗愈师登录名。');
  try {
    await api.signInAsHealer({ username });
    await enterWorkspace(await api.session());
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '登录失败，请稍后再试。');
  }
}

$('#signin-go').addEventListener('click', () => void signIn());
$('#signin-name').addEventListener('keydown', (event) => { if (event.key === 'Enter') void signIn(); });

$('#sign-out').addEventListener('click', async () => {
  await api.signOut().catch(() => {});
  showGate('已退出', '输入疗愈师登录名可重新进入。', null);
});

void boot();
