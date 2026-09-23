import { api, ApiError } from '../api.js';
import { clear, el, toast } from '../dom.js';

let root;
let allCases = [];
let activeFilter = 'pending';
let slaInterval = null;
// 登录者本人的身份，由工作台在进入时注入；拿不到时退回演示用的预置疗愈师。
let identity = { displayName: '李佳', credential: 'UNIHEAL 国际疗愈师 · UH-2024-0871' };

export function setHealerIdentity(next) {
  identity = {
    displayName: next?.displayName || identity.displayName,
    credential: next?.credential || identity.credential,
  };
}

const RISK_LABEL = { red: '红色 · 危机信号', yellow: '黄色 · 需关注', green: '绿色' };

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function handleAction(payload, onSuccess) {
  try {
    const result = await api.caseAction(payload);
    onSuccess?.(result);
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '操作没有成功。');
  }
}

function tickSLA() {
  const elements = document.querySelectorAll('[data-sla]');
  const now = Date.now();
  elements.forEach((/** @type {HTMLElement} */ el) => {
    const deadline = Number(el.dataset.sla);
    if (!deadline || el.classList.contains('gr')) return;
    const diff = Math.floor((deadline - now) / 1000);
    if (diff <= 0) {
      el.textContent = '已超时';
      el.classList.add('warn');
      return;
    }
    if (diff < 1800) {
      el.classList.add('warn');
    } else {
      el.classList.remove('warn');
    }
    const h = pad(Math.floor(diff / 3600));
    const m = pad(Math.floor((diff % 3600) / 60));
    const s = pad(diff % 60);
    el.textContent = `${h}:${m}:${s}`;
  });
}

function renderCaseCard(item, onReload) {
  const isDone = item.status === 'done';
  const riskClass = isDone ? 'done' : (item.riskLevel === 'red' ? 'r' : 'y');
  const wp = item.workProfile || {};
  const workProfileParts = [wp.job, wp.deptType, wp.level, wp.workType].filter(Boolean);

  const card = el('div', { class: `case ${riskClass}` });

  // 头部：匿名代号 + 状态 + 触发时间。原始部门不下发给疗愈师（最小必要），只保留下方脱敏工作背景。
  card.append(
    el('div', { class: 'cid' }, [
      el('span', { text: item.caseCode }),
      el('span', { class: `lvl ${isDone ? 'g' : riskClass}`, text: isDone ? '已闭环' : (RISK_LABEL[item.riskLevel] || item.riskLevel) }),
    ]),
    el('div', { class: 'meta', text: `触发 ${formatTime(item.at)} · ${isDone ? '已完成处置' : '员工已授权转接'}` }),
  );

  // 情绪标签
  if (item.tags && item.tags.length) {
    card.append(el('div', { class: 'tagrow' }, item.tags.map((t) => el('span', { class: 'tg', text: t }))));
  }

  // 脱敏工作背景
  if (workProfileParts.length) {
    card.append(el('div', { class: 'work-bg', text: `脱敏工作背景：${workProfileParts.join(' · ')}` }));
  }

  // 员工预约留言
  if (item.noteFromEmployee) {
    card.append(el('div', { class: 'meta', style: 'margin-top:7px; color:var(--ink);', text: `员工诉求说明：${item.noteFromEmployee}` }));
  }

  // SLA 倒计时 / 响应用时
  const slaBox = el('div', { class: 'sla' }, [
    el('div', { class: 'lb', text: isDone ? '响应用时' : 'SLA 剩余' }),
    isDone
      ? el('div', { class: 'tm gr', text: item.resp == null ? '暂无记录' : `${item.resp} 分钟` })
      : el('div', { class: 'tm', attrs: { 'data-sla': String(item.sla) }, text: '--:--:--' }),
  ]);
  card.append(slaBox);

  // 对话上下文区域
  if (!isDone) {
    if (item.contextStatus === 'approved') {
      // 员工原文一律用 textContent 渲染，绝不拼进 innerHTML。
      const grantedBox = el('div', { class: 'locked granted' }, [
        el('span', { text: '🛡️ 员工已单独批准本次上下文申请；每次读取仍校验有效期与撤销状态' }),
        ...(item.textSnippets || []).map((snippet) => el('p', { class: 'snippet', text: `「${snippet}」` })),
      ]);

      const viewBtn = el('button', {
        class: 'bt small', text: '查看完整解密对话', style: 'margin-top:8px;', attrs: { type: 'button' },
        on: {
          click: () => {
            const previous = card.querySelector(`[data-ctx-host="${item.caseCode}"]`);
            if (previous) clear(previous);
            handleAction({ action: 'read_context', caseCode: item.caseCode }, (res) => {
              const msgs = res.messages || [];
              const box = el('div', { class: 'context-box', style: 'margin-top:10px; padding:10px; background:#f9fbfb; border:1px dashed var(--line); border-radius:6px;' }, [
                ...msgs.map((m) => el('p', {
                  class: m.role === 'user' ? 'ctx-user' : 'ctx-bot',
                  style: `margin:4px 0; font-size:12px; color:${m.role === 'user' ? 'var(--brand)' : 'var(--ink)'};`,
                  text: `${m.role === 'user' ? '员工' : 'MindBridge'}：${m.text}`,
                })),
                el('p', { class: 'ctx-note', style: 'font-size:11px; color:var(--mut2); margin-top:6px;', text: '本次查看已记入独立审计日志。' }),
              ]);
              if (!msgs.length) box.prepend(el('p', { class: 'empty', text: '暂无更多历史对话。' }));
              const host = card.querySelector(`[data-ctx-host="${item.caseCode}"]`);
              if (host) clear(host).append(box);
            });
          },
        },
      });

      grantedBox.append(viewBtn, el('div', { attrs: { 'data-ctx-host': item.caseCode } }));
      card.append(grantedBox);
    } else if (item.contextStatus === 'pending') {
      card.append(el('div', { class: 'locked granted', style: 'background:#fefbf4; border-color:#f1e3c3; color:#8a6018;', text: '已向员工发起对话查看申请，等待员工在手机端确认...' }));
    } else {
      // 理由会原样出现在员工手机上，所以 placeholder 写短、完整说明放 title：窄屏下一行放不下整句。
      const reasonInput = el('input', { attrs: { type: 'text', placeholder: '填写查看理由，员工端会看到', title: '例如：评估危机并制定支持计划' } });
      const reqBox = el('div', { class: 'ctx-req' }, [
        reasonInput,
        el('button', {
          class: 'bt small', text: '申请查看上下文', attrs: { type: 'button' },
          on: {
            click: () => {
              const reason = reasonInput.value.trim();
              if (!reason) return toast('请先填写申请理由。');
              handleAction({ action: 'request_context', caseCode: item.caseCode, reason }, () => {
                toast('已向员工发出授权申请');
                onReload();
              });
            },
          },
        }),
      ]);
      card.append(reqBox);
    }
  }

  // 处置日志
  if (item.log && item.log.length) {
    card.append(el('div', { class: 'meta', style: 'margin-top:10px; line-height:1.7; background:#fafbfc; padding:6px 10px; border-radius:6px;' }, item.log.map((l) => el('div', { text: `· ${l}` }))));
  }

  // 处置动作栏
  if (!isDone) {
    const actRow = el('div', { class: 'acts' });
    if (item.status === 'pending') {
      actRow.append(el('button', {
        class: 'bt pri', text: '开始联系', attrs: { type: 'button' },
        on: {
          click: () => handleAction({ action: 'start', caseCode: item.caseCode }, () => {
            toast('已开始联系 · 处置记录已写入审计日志');
            activeFilter = 'active';
            onReload();
          }),
        },
      }));
    } else if (item.status === 'active') {
      actRow.append(el('button', {
        class: 'bt pri', text: '标记已闭环', attrs: { type: 'button' },
        on: {
          click: () => handleAction({ action: 'close', caseCode: item.caseCode }, () => {
            toast('个案已闭环');
            activeFilter = 'done';
            onReload();
          }),
        },
      }));
    }

    actRow.append(el('button', {
      class: 'bt', text: '记录专业转介评估', attrs: { type: 'button' },
      on: {
        click: () => handleAction({ action: 'refer', caseCode: item.caseCode }, () => {
          toast('已记录专业转介评估 · 具体机构由专业团队线下流程决定');
          onReload();
        }),
      },
    }));

    const noteInp = el('input', { attrs: { type: 'text', placeholder: '追加跟进笔记...' }, style: 'width:180px; font-size:12px; padding:6px 8px;' });
    actRow.append(noteInp, el('button', {
      class: 'bt small', text: `记录 (${item.noteCount})`, attrs: { type: 'button' },
      on: {
        click: () => {
          const val = noteInp.value.trim();
          if (!val) return toast('请先输入备忘内容。');
          handleAction({ action: 'note', caseCode: item.caseCode, text: val }, () => {
            noteInp.value = '';
            toast('已记录处置备忘');
            onReload();
          });
        },
      },
    }));

    actRow.append(el('span', { class: 'logtxt', text: '处置记录将写入审计日志' }));
    card.append(actRow);
  }

  return card;
}

function renderWorkspace() {
  clear(root);

  const pendingList = allCases.filter((c) => c.status === 'pending');
  const activeList = allCases.filter((c) => c.status === 'active');
  const doneList = allCases.filter((c) => c.status === 'done');

  // 疗愈师信息头
  const header = el('div', { class: 'healer-header' }, [
    el('div', { class: 'healer-avatar', text: '🌿' }),
    el('div', {}, [
      el('div', { class: 'healer-name', text: identity.displayName }),
      el('div', { class: 'healer-cert', text: `${identity.credential} · 在岗值班` }),
    ]),
    el('div', { class: 'healer-badge' }, [
      el('div', { class: 'cnt', text: String(pendingList.length) }),
      el('div', { class: 'lbl', text: '待响应个案' }),
    ]),
  ]);

  // 三态状态 Tab 栏
  const qbar = el('div', { class: 'qbar', attrs: { role: 'tablist' } }, [
    el('button', {
      class: activeFilter === 'pending' ? 'on' : '', attrs: { 'data-f': 'pending' },
      html: `待响应 <b id="h-p">${pendingList.length}</b>`,
    }),
    el('button', {
      class: activeFilter === 'active' ? 'on' : '', attrs: { 'data-f': 'active' },
      html: `处理中 <b id="h-a">${activeList.length}</b>`,
    }),
    el('button', {
      class: activeFilter === 'done' ? 'on' : '', attrs: { 'data-f': 'done' },
      html: `已闭环 <b id="h-d">${doneList.length}</b>`,
    }),
  ]);

  qbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-f]');
    if (!btn) return;
    activeFilter = btn.dataset.f;
    renderWorkspace();
  });

  // 个案列表
  const currentList = activeFilter === 'pending' ? pendingList
    : activeFilter === 'active' ? activeList : doneList;

  const caseBox = el('div', { class: 'cases' });
  if (!currentList.length) {
    caseBox.append(el('div', { class: 'empty', html: '此分类下暂无个案。<br><span style="font-size:12px; color:var(--mut2)">个案由员工<b>主动授权</b>后生成 —— 系统不会未经同意建单。</span>' }));
  } else {
    currentList.forEach((item) => {
      caseBox.append(renderCaseCard(item, () => loadCases()));
    });
  }

  root.append(header, qbar, caseBox);
  tickSLA();
}

export function renderCases(container) {
  root = container;
  if (!slaInterval) {
    slaInterval = setInterval(tickSLA, 1000);
  }
}

export async function loadCases() {
  try {
    const res = await api.cases();
    allCases = res.cases || [];
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '个案列表暂时取不到。' }));
    return;
  }
  renderWorkspace();
}
