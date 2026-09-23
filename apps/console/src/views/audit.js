import { api } from '../api.js';
import { clear, el, timeAgo } from '../dom.js';

const ACTION_LABEL = {
  sign_in: '登录管理后台',
  view_dashboard: '查看关怀看板',
  view_cases: '查看个案列表',
  claim_case: '受理个案',
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
  clear(root).append(
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
