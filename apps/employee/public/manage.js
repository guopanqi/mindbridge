const $ = (selector) => document.querySelector(selector);
// 旧入口已并入 console；若缓存仍加载本脚本，同样跳转。
const consoleOrigin = 'https://mindbridge-console.pages.dev';
const key = new URLSearchParams(location.hash.slice(1)).get('key')
  || new URLSearchParams(location.search).get('orgKey')
  || new URLSearchParams(location.search).get('key');
const target = new URL('/', consoleOrigin);
if (key) target.searchParams.set('orgKey', key);
location.replace(target.href);
if ($('#status')) $('#status').textContent = '正在打开管理后台…';
