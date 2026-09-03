import { api, ApiError } from '../api.js';
import { clear, el, timeAgo, toast } from '../dom.js';

const RISK_LABEL = { red: '红色 · 危机信号', yellow: '黄色 · 需关注', green: '绿色' };
const CONTEXT_LABEL = {
  none: '未申请查看对话上下文',
  pending: '已申请，等待员工同意',
  approved: '员工已同意，可查看',
  denied: '员工拒绝了这次申请',
  expired: '申请已过期',
};

let root;

async function act(payload, done) {
  try {
    const result = await api.caseAction(payload);
    done?.(result);
  } catch (error) {
    toast(error instanceof ApiError && error.userMessage ? error.userMessage : '操作没有成功。');
  }
}

function contextBox(item, reload) {
  if (item.contextStatus === 'approved') {
    return el('button', {
      class: 'secondary small', text: '查看已授权的对话上下文', attrs: { type: 'button' },
      on: {
        click: () => act({ action: 'read_context', caseCode: item.caseCode }, (result) => {
          const box = el('div', { class: 'context-box' }, (result.messages || []).map((m) => el('p', {
            class: m.role === 'user' ? 'ctx-user' : 'ctx-bot',
            text: `${m.role === 'user' ? '员工' : 'MindBridge'}：${m.text}`,
          })));
          if (!result.messages?.length) box.append(el('p', { class: 'empty', text: '这个个案没有可展示的对话。' }));
          box.append(el('p', { class: 'ctx-note', text: '本次查看已记入审计。' }));
          const host = document.querySelector(`[data-ctx="${item.caseCode}"]`);
          if (host) clear(host).append(box);
        }),
      },
    });
  }
  if (item.contextStatus === 'pending') {
    return el('p', { class: 'ctx-note', text: CONTEXT_LABEL.pending });
  }
  const input = el('input', {
    attrs: { type: 'text', maxlength: 200, placeholder: '说明为什么需要查看，员工会看到这句话' },
  });
  return el('div', { class: 'ctx-request' }, [
    input,
    el('button', {
      class: 'secondary small', text: '申请查看上下文', attrs: { type: 'button' },
      on: {
        click: () => {
          const reason = input.value.trim();
          if (!reason) return toast('请先填写申请理由。');
          return act({ action: 'request_context', caseCode: item.caseCode, reason }, () => {
            toast('已发出申请。员工同意后你才能看到内容。');
            reload();
          });
        },
      },
    }),
  ]);
}

function caseCard(item, reload) {
  const noteInput = el('input', { attrs: { type: 'text', maxlength: 500, placeholder: '写一条干预记录' } });
  return el('article', { class: `case-card risk-${item.riskLevel}` }, [
    el('header', {}, [
      el('span', { class: 'case-code', text: item.caseCode }),
      el('span', { class: `risk-chip ${item.riskLevel}`, text: RISK_LABEL[item.riskLevel] || item.riskLevel }),
      el('span', { class: 'case-time', text: timeAgo(item.at) }),
    ]),
    el('p', { class: 'case-note', text: item.noteFromEmployee || '员工没有附加说明。' }),
    el('p', { class: 'ctx-note', text: CONTEXT_LABEL[item.contextStatus] || '' }),
    el('div', { class: 'case-actions' }, [
      item.claimed
        ? el('span', { class: 'claimed', text: '已接单' })
        : el('button', {
          class: 'primary small', text: '接单', attrs: { type: 'button' },
          on: { click: () => act({ action: 'claim', caseCode: item.caseCode }, () => { toast('已接单。'); reload(); }) },
        }),
      contextBox(item, reload),
    ]),
    el('div', { class: 'note-row' }, [
      noteInput,
      el('button', {
        class: 'secondary small', text: `记录（${item.noteCount}）`, attrs: { type: 'button' },
        on: {
          click: () => {
            const text = noteInput.value.trim();
            if (!text) return toast('请先写点内容。');
            return act({ action: 'note', caseCode: item.caseCode, text }, () => {
              noteInput.value = '';
              toast('已记录。');
              reload();
            });
          },
        },
      }),
    ]),
    el('div', { class: 'ctx-host', attrs: { 'data-ctx': item.caseCode } }),
  ]);
}

export function renderCases(container) {
  root = container;
}

export async function loadCases() {
  const reload = () => void loadCases();
  let body;
  try {
    body = await api.cases();
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '个案列表暂时取不到。' }));
    return;
  }
  clear(root).append(
    el('section', { class: 'panel' }, [
      el('h2', { text: '匿名个案' }),
      el('p', { class: 'panel-sub', text: '你看到的只有个案编号和风险级别。这里没有姓名、部门或钉钉账号可以搜索；查看对话原文必须由员工本人当场同意，且每次查看都会记入审计。' }),
      body.cases.length
        ? el('div', { class: 'case-list' }, body.cases.map((item) => caseCard(item, reload)))
        : el('p', { class: 'empty', text: '当前没有待处理个案。' }),
    ]),
  );
}
