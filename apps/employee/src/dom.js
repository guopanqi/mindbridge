export const $ = (selector, root = document) => root.querySelector(selector);

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = options.text;
  // html 只允许传入代码里写死的静态片段。任何来自员工、疗愈师或接口的文本
  // 一律走 text 或子节点，绝不能拼进 HTML。
  if (options.html !== undefined) node.innerHTML = options.html;
  if (options.style) node.setAttribute('style', options.style);
  for (const [key, value] of Object.entries(options.attrs || {})) {
    if (value === null || value === false) continue;
    node.setAttribute(key, value === true ? '' : String(value));
  }
  if (options.on) for (const [event, handler] of Object.entries(options.on)) node.addEventListener(event, handler);
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.firstChild.remove();
  return node;
}

let toastTimer = null;
export function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('on'), 2600);
}

export function openSheet(title, nodes) {
  const sheet = $('#sheet');
  $('#sheet-title').textContent = title;
  clear($('#sheet-body')).append(...[].concat(nodes));
  sheet.hidden = false;
  $('#sheet-close').focus();
}

let pendingConfirm = null;
export function closeSheet() {
  $('#sheet').hidden = true;
  $('#sheet-close').hidden = false;
  // 点遮罩 / 按 Esc 关掉确认浮层，等于「再想想」。
  if (pendingConfirm) { const resolve = pendingConfirm; pendingConfirm = null; resolve(false); }
}

// 页内确认。window.confirm 在部分 WebView / 内嵌浏览器里会被静默吞掉（直接返回 false），
// 表现为「按钮点了没反应」；这里用自家浮层，行为在所有壳里一致。
export function confirmSheet(title, text, { confirmLabel = '确定', cancelLabel = '再想想' } = {}) {
  return new Promise((resolve) => {
    const closeBtn = $('#sheet-close');
    const finish = (value) => { pendingConfirm = null; closeSheet(); resolve(value); };
    pendingConfirm = resolve;
    const actions = el('div', { class: 'card-actions' }, [
      el('button', { class: 'primary small', text: confirmLabel, attrs: { type: 'button' }, on: { click: () => finish(true) } }),
      el('button', { class: 'secondary small', text: cancelLabel, attrs: { type: 'button' }, on: { click: () => finish(false) } }),
    ]);
    openSheet(title, [el('p', { text }), actions]);
    closeBtn.hidden = true; // 确认场景只留「确定 / 再想想」两个按钮
    actions.querySelector('.primary').focus();
  });
}

export const timeAgo = (ts) => {
  const minutes = (Date.now() - ts) / 60000;
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${Math.floor(minutes)} 分钟前`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} 小时前`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '昨天' : `${days} 天前`;
};

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
