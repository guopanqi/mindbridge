import { api, ApiError } from './api.js';
import { BUILD_ID } from './build-id.js';
import { $, el, toast } from './dom.js';
import { loadDashboard, renderDashboard, setOrganizationKind } from './views/dashboard.js';
import { loadAudit, renderAudit } from './views/audit.js';

const GATE_TEXT = {
  NO_CODE: '请从钉钉管理后台（oa.dingtalk.com → 应用管理 → MindBridge）进入，或使用组织管理链接打开。',
  NOT_ADMIN: '只有企业管理员可以进入 MindBridge 管理后台。',
  SSO_CODE_REPLAYED: '这个免登链接已经用过了，请回到钉钉管理后台重新点击进入。',
  ADMIN_LINK_INVALID: '管理链接无效或已失效，请向创建组织的人索取新链接。',
  APP_CONFIGURATION_MISSING: '管理后台配置不完整，请联系系统管理员。',
  SERVER_TIMEOUT: '网络连接超时，请稍后重试。',
  NETWORK_ERROR: '网络连接失败，请稍后重试。',
};

let currentView = null;
const loaded = new Set();

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
  $('#console').hidden = true;
  $('#signin').hidden = false;
}

function renderBanner(data) {
  const banner = $('#origin-banner');
  banner.textContent = '';
  if (!data) return;
  const tenant = data.tenant || {};
  const nodes = [];
  if (data.origin === 'demo_seed') {
    nodes.push(el('span', { class: 'sim-chip', text: '本组织演示数据 · 非真实使用' }));
  }
  if (tenant.kind === 'beta') {
    nodes.push(
      el('span', { class: 'live-chip', text: '公开组织' }),
      el('span', { text: '本页只显示此组织的聚合数据，与其他组织和企业报表互不可见' }),
    );
  }
  if (typeof data.liveEventCount === 'number' && tenant.kind !== 'beta') {
    nodes.push(
      el('span', { class: 'live-chip', text: '真实事件' }),
      el('span', { text: `内测期间已并入 ${data.liveEventCount} 条真实钉钉员工事件` }),
    );
  } else if (typeof data.liveEventCount === 'number' && tenant.kind === 'beta' && data.liveEventCount > 0) {
    nodes.push(
      el('span', { class: 'live-chip', text: '真实事件' }),
      el('span', { text: `本组织已产生 ${data.liveEventCount} 条真实使用事件` }),
    );
  }
  banner.append(...nodes);
  banner.hidden = nodes.length === 0;
  $('#tenant-line').textContent = [tenant.name, tenant.industry, `近 ${data.window.days} 天`]
    .filter(Boolean).join(' · ');
}

async function showView(view) {
  if (currentView === view) return;
  currentView = view;
  for (const tab of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.tab'))) {
    const on = tab.dataset.view === view;
    tab.classList.toggle('on', on);
    tab.setAttribute('aria-selected', String(on));
  }
  for (const name of ['dashboard', 'audit']) $(`#view-${name}`).hidden = name !== view;
  try {
    if (!loaded.has(view)) {
      loaded.add(view);
      if (view === 'dashboard') renderDashboard($('#view-dashboard'));
      if (view === 'audit') renderAudit($('#view-audit'));
    }
    if (view === 'dashboard') renderBanner(await loadDashboard());
    if (view === 'audit') await loadAudit();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'STAFF_SESSION_REQUIRED') {
      showGate('会话已过期', '请重新打开管理入口。', 'STAFF_SESSION_REQUIRED');
      return;
    }
    toast('这一页暂时打不开。');
  }
}

async function enterConsole(session) {
  const orgKind = session.organization?.kind || 'enterprise';
  setOrganizationKind(orgKind);
  const roleLabel = orgKind === 'beta'
    ? '组织管理员'
    : (session.roles.includes('admin') ? '企业管理员' : 'HR');
  $('#staff-name').textContent = `${session.displayName} · ${roleLabel}`;
  $('#gate').hidden = true;
  $('#console').hidden = false;
  // 没有 admin 角色的账号看不到审计入口。公开组织管理员也不看企业审计台。
  // 个案台不在这个应用里：疗愈师走独立的 /healer 工作台。
  const visibility = { dashboard: 'hr_viewer', audit: 'admin' };
  let first = null;
  for (const tab of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.tab'))) {
    const allowed = session.roles.includes(visibility[tab.dataset.view])
      && !(tab.dataset.view === 'audit' && orgKind === 'beta');
    tab.hidden = !allowed;
    if (allowed && !first) first = tab.dataset.view;
  }
  $('#origin-banner').hidden = !session.roles.includes('hr_viewer');
  currentView = null;
  loaded.clear();
  await showView(first || 'dashboard');
}

function takeOrgKey(url) {
  const fromQuery = url.searchParams.get('orgKey');
  if (fromQuery) {
    url.searchParams.delete('orgKey');
    window.history.replaceState({}, '', url.toString());
    return fromQuery;
  }
  const fromHash = new URLSearchParams(url.hash.slice(1)).get('key');
  if (fromHash) {
    url.hash = '';
    window.history.replaceState({}, '', url.toString());
    return fromHash;
  }
  return null;
}

async function boot() {
  const url = new URL(window.location.href);

  const orgKey = takeOrgKey(url);
  if (orgKey) {
    try {
      await api.signInWithOrgKey(orgKey);
    } catch (error) {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入管理后台', GATE_TEXT[reason] || error.userMessage || '管理链接校验没有完成。', reason);
      return;
    }
  }

  const code = url.searchParams.get('code');
  if (code) {
    // 免登码不应该留在地址栏里，换取会话后立刻从 URL 中抹掉。
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
    try {
      await api.signInWithOmp(code);
    } catch (error) {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入管理后台', GATE_TEXT[reason] || error.userMessage || '身份校验没有完成。', reason);
      return;
    }
  } else if (url.searchParams.get('demo') === 'review') {
    url.searchParams.delete('demo');
    window.history.replaceState({}, '', url.toString());
    try {
      await api.signInAsDemo('admin', '');
    } catch (error) {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('入口已停用', error.userMessage || '体验通道已关闭，请使用组织邀请链接进入。', reason);
      return;
    }
  }
  try {
    const session = await api.session();
    if (session.authenticated) return void enterConsole(session);
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 'HTTP_401') {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入管理后台', GATE_TEXT[reason] || '身份校验没有完成。', reason);
      return;
    }
  }
  showGate('需要管理入口', GATE_TEXT.NO_CODE, null);
}

document.addEventListener('click', (event) => {
  const tab = /** @type {HTMLElement | null} */ (/** @type {Element} */ (event.target).closest('.tab'));
  if (tab) void showView(tab.dataset.view);
});
// 内测体验登录：预置账号「admin」，密码不校验。真实上线时用 DEMO_LOGIN=off 关掉。
async function signInWithName() {
  const name = $('#signin-name').value.trim();
  if (!name) return toast('请填写姓名。');
  try {
    await api.signInAsDemo(name, $('#signin-pass').value);
    await enterConsole(await api.session());
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '这个账号进不去。');
  }
}

$('#signin-go').addEventListener('click', () => void signInWithName());
$('#signin-pass').addEventListener('keydown', (event) => { if (event.key === 'Enter') void signInWithName(); });

$('#sign-out').addEventListener('click', async () => {
  await api.signOut().catch(() => {});
  showGate('已退出', '需要时可重新打开管理入口。', null);
});

void boot();
