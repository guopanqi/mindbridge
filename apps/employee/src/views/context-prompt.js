// 首次进入时主动询问处境标签。
//
// 文案取自原型。这个选择只关联匿名身份，且只影响回应措辞与推荐排序，
// 不参与风险判定——这一点必须在界面上说清楚。
import { api } from '../api.js';
import { clear, el } from '../dom.js';

const OPTIONS = [
  ['highIntensity', '⚡', '高强度岗位员工', '研发、客服、产线、医护等持续高负荷岗位'],
  ['manager', '🧩', '中基层管理者', '承担目标、决策与上下协同压力'],
  ['newcomer', '🌱', '新入职员工', '正在适应新团队、新角色与试用期节奏'],
  ['returner', '↻', '女性返岗员工', '经历返岗、家庭照护与工作角色重新切换'],
  ['techTransition', '⌁', '面临技术焦虑 / 转型员工', '面对技能迭代、被替代焦虑或职业方向变化'],
  ['crossCulture', '🌍', '跨文化 / 国际员工', '面临语言、文化适应、远程协作或社交隔离'],
];

export function askContext(onDone) {
  const overlay = el('div', { class: 'ctx-overlay', attrs: { role: 'dialog', 'aria-modal': 'true' } });
  const finish = async (tag) => {
    overlay.remove();
    if (tag) {
      try {
        await api.setContext(tag);
      } catch {
        // 设置失败不该挡住员工进入，通用推荐仍然可用。
      }
    }
    onDone?.();
  };

  overlay.append(el('div', { class: 'ctx-sheet' }, [
    el('h2', { text: '哪种状态更接近你？' }),
    el('p', { class: 'ctx-sub', text: '告诉我们你当前的角色，助手能提供更贴切的回应；随时可以更改或清空。它不参与风险判定，企业端仅展示 10 人以上的宏观统计，绝无法反推到个人。' }),
    el('div', { class: 'ctx-options' }, OPTIONS.map(([tag, icon, title, desc]) => el('button', {
      class: 'ctx-option', attrs: { type: 'button' }, on: { click: () => void finish(tag) },
    }, [
      el('span', { class: 'ctx-ico', text: icon }),
      el('span', { class: 'ctx-text' }, [
        el('b', { text: title }),
        el('span', { text: desc }),
      ]),
      el('span', { class: 'ctx-chev', text: '›' }),
    ]))),
    el('button', {
      class: 'ctx-skip', attrs: { type: 'button' }, on: { click: () => void finish(null) },
    }, [
      el('b', { text: '暂不选择' }),
      el('span', { text: ' · 继续使用通用推荐' }),
    ]),
  ]));
  document.body.append(overlay);
  return overlay;
}

export { clear };
