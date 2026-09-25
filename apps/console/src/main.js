import { api, ApiError } from './api.js';
import { BUILD_ID } from './build-id.js';
import { $, el, toast } from './dom.js';
import { loadDashboard, renderDashboard, setOrganizationKind, setViewerRoles } from './views/dashboard.js';
import { loadAudit, renderAudit } from './views/audit.js';
import { loadTestTimeline, renderTestTimeline } from './views/test-timeline.js';

const GATE_TEXT = {
  NO_CODE: '请从钉钉管理后台（oa.dingtalk.com → 应用管理 → MindBridge）进入，或使用组织管理链接打开。',
  NOT_ADMIN: '只有企业管理员可以进入 MindBridge 管理后台。',
  SSO_CODE_REPLAYED: '这个免登链接已经用过了，请回到钉钉管理后台重新点击进入。',
  ADMIN_LINK_INVALID: '管理链接无效或已失效，请联系组织创建者获取新链接。',
  INTERNAL_TEST_LOGIN_INVALID: '内部测试入口无效，请使用最新下发的测试入口。',
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
  if (data.internalTest) {
    nodes.push(el('span', { class: 'sim-chip', text: '内部测试视图 · 最小样本 1 人 · 真实数据' }));
  }
  if (tenant.kind === 'beta') {
    nodes.push(
      el('span', { class: 'live-chip', text: '公开组织' }),
       el('span', { text: '本页仅显示此组织的聚合数据，与其他组织和企业报表互不可见' }),
    );
  }
  if (typeof data.liveEventCount === 'number' && tenant.kind !== 'beta') {
    nodes.push(
      el('span', { class: 'live-chip', text: '真实事件' }),
       el('span', { text: `内测期间已接入 ${data.liveEventCount} 条真实钉钉员工事件` }),
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
  for (const name of ['dashboard', 'audit', 'test-timeline']) $(`#view-${name}`).hidden = name !== view;
  try {
    if (!loaded.has(view)) {
      loaded.add(view);
      if (view === 'dashboard') renderDashboard($('#view-dashboard'));
      if (view === 'audit') renderAudit($('#view-audit'));
      if (view === 'test-timeline') renderTestTimeline($('#view-test-timeline'));
    }
    if (view === 'dashboard') renderBanner(await loadDashboard());
    if (view === 'audit') await loadAudit();
    if (view === 'test-timeline') await loadTestTimeline();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'STAFF_SESSION_REQUIRED') {
      showGate('会话已过期', '请重新通过管理入口进入。', 'STAFF_SESSION_REQUIRED');
      return;
    }
    toast('该页面暂时无法打开。');
  }
}

async function enterConsole(session) {
  const orgKind = session.organization?.kind || 'enterprise';
  setOrganizationKind(orgKind);
  setViewerRoles(session.roles);
  const roleLabel = session.roles.includes('internal_tester')
    ? '内部测试员'
    : orgKind === 'beta'
    ? '组织管理员'
    : (session.roles.includes('admin') ? '企业管理员' : 'HR');
  $('#staff-name').textContent = `${session.displayName} · ${roleLabel}`;
  $('#gate').hidden = true;
  $('#console').hidden = false;
  // 没有 admin 角色的账号看不到审计入口。公开组织管理员也不看企业审计台。
  // 个案台不在这个应用里：疗愈师走独立的 /healer 工作台。
  const visibility = { dashboard: 'hr_viewer', audit: 'admin', 'test-timeline': 'internal_tester' };
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

  const debugKey = url.searchParams.get('debugKey');
  if (debugKey) {
    url.searchParams.delete('debugKey');
    window.history.replaceState({}, '', url.toString());
    try {
      await api.signInAsInternalTester(debugKey);
    } catch (error) {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入内部测试视图', GATE_TEXT[reason] || error.userMessage || '测试入口校验未完成。', reason);
      return;
    }
  }

  const orgKey = takeOrgKey(url);
  if (orgKey) {
    try {
      await api.signInWithOrgKey(orgKey);
    } catch (error) {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入管理后台', GATE_TEXT[reason] || error.userMessage || '管理链接校验未完成。', reason);
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
      showGate('无法进入管理后台', GATE_TEXT[reason] || error.userMessage || '身份校验未完成。', reason);
      return;
    }
  }
  try {
    const session = await api.session();
    if (session.authenticated) return void enterConsole(session);
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 'HTTP_401') {
      const reason = error instanceof ApiError ? error.code : 'UNEXPECTED_CLIENT_ERROR';
      showGate('无法进入管理后台', GATE_TEXT[reason] || '身份校验未完成。', reason);
      return;
    }
  }
  showGate('需要管理入口', GATE_TEXT.NO_CODE, null);
}

document.addEventListener('click', (event) => {
  const tab = /** @type {HTMLElement | null} */ (/** @type {Element} */ (event.target).closest('.tab'));
  if (tab) void showView(tab.dataset.view);
});
$('#sign-out').addEventListener('click', async () => {
  await api.signOut().catch(() => {});
  showGate('已退出', '可随时通过管理入口重新进入。', null);
});

void boot();
