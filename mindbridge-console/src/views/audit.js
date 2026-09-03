import { api, ApiError } from '../api.js';
import { clear, el, timeAgo, toast } from '../dom.js';

const ACTION_LABEL = {
  sign_in: '登录管理后台',
  view_dashboard: '查看关怀看板',
  view_cases: '查看个案列表',
  claim_case: '接单个案',
  access_denied: '权限不足被拒绝',
};

let root;

export function renderAudit(container) {
  root = container;
}

export async function loadAudit() {
  let body;
  try {
    body = await api.audit();
  } catch (error) {
    clear(root).append(el('p', { class: 'empty', text: error.userMessage || '审计记录暂时取不到。' }));
    return;
  }
  const nameInput = el('input', { attrs: { type: 'text', maxlength: 40, placeholder: '疗愈师姓名' } });
  const codeOut = el('p', { class: 'invite-out', text: '' });
  clear(root).append(
    el('section', { class: 'panel' }, [
      el('h2', { text: '疗愈师账号' }),
      el('p', { class: 'panel-sub', text: '疗愈师通常不在企业的钉钉组织内，通过一次性邀请码进入个案台。邀请码只显示一次，24 小时有效。' }),
      el('div', { class: 'invite-row' }, [
        nameInput,
        el('button', {
          class: 'primary small', text: '生成邀请码', attrs: { type: 'button' },
          on: {
            click: async () => {
              try {
                const result = await api.createHealerInvite(nameInput.value.trim());
                codeOut.textContent = `${result.displayName} 的邀请码：${result.code}（${result.expiresInHours} 小时内有效，只显示这一次）`;
                nameInput.value = '';
                // 刻意不刷新整页：邀请码只显示这一次，重渲染会把它冲掉。
              } catch (error) {
                toast(error instanceof ApiError && error.userMessage ? error.userMessage : '生成失败。');
              }
            },
          },
        }),
      ]),
      codeOut,
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '工作人员操作审计' }),
      el('p', { class: 'panel-sub', text: '记录谁在什么时候做了什么。对象只记录报表名或匿名个案编号，不含任何员工原文。' }),
      body.entries.length
        ? el('table', { class: 'grid-table' }, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: '时间' }), el('th', { text: '操作人' }),
            el('th', { text: '动作' }), el('th', { text: '对象' }), el('th', { text: '结果' }),
          ])]),
          el('tbody', {}, body.entries.map((entry) => el('tr', {}, [
            el('td', { text: timeAgo(entry.at) }),
            el('td', { text: entry.actor }),
            el('td', { text: ACTION_LABEL[entry.action] || entry.action }),
            el('td', { class: 'mono', text: entry.object || '-' }),
            el('td', { text: entry.result === 'ok' ? '成功' : entry.result }),
          ]))),
        ])
        : el('p', { class: 'empty', text: '还没有操作记录。' }),
    ]),
  );
}
