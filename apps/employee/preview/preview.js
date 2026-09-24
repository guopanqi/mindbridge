// 组件预览台：把独立组件从壳（会话/进度/结算）里摘出来，配假 ctx 单独跑。
// 用法：npm run preview -- breathing，然后改完 src 刷新浏览器即看，不走构建和部署。
import { bespokeFor, BESPOKE_IDS } from '../src/views/activity-engines.js';

const query = new URLSearchParams(location.search);
const stage = document.querySelector('#pv-stage');
const screen = document.querySelector('#pv-screen');
const logBox = document.querySelector('#pv-log');
const title = document.querySelector('#pv-title');
const deviceLabel = document.querySelector('#pv-device-label');
const componentSelect = document.querySelector('#pv-component');
const deviceSelect = document.querySelector('#pv-device');
const speedSelect = document.querySelector('#pv-speed');
const zoomSelect = document.querySelector('#pv-zoom');
const rmBox = document.querySelector('#pv-rm');
const restartBtn = document.querySelector('#pv-restart');
const phone = document.querySelector('.pv-phone');
const toolbar = document.querySelector('.pv-tool');

// 机型：真实 CSS 像素尺寸，手机框按此渲染，内部滚动。
const DEVICES = {
  iphone16: { label: 'iPhone 16', w: 393, h: 852 },
  promax: { label: 'iPhone 16 Pro Max', w: 440, h: 956 },
  se: { label: 'iPhone SE', w: 375, h: 667 },
  pixel: { label: 'Pixel 8', w: 412, h: 915 },
  small: { label: '小屏旧机', w: 360, h: 640 },
};

// 变速：组件只用 performance.now + setInterval 计时，两处同比例缩放就是等比快进。
const speed = Math.max(1, Number(query.get('speed')) || 1);
const originNow = performance.now.bind(performance);
const origin = originNow();
performance.now = () => origin + (originNow() - origin) * speed;
const rawInterval = window.setInterval.bind(window);
window.setInterval = (fn, ms, ...rest) => rawInterval(fn, Math.max(1, ms / speed), ...rest);

// 动态偏好：用查询参数驱动，组件里只读一次 matches，切换即重挂载。
let forceReducedMotion = query.get('rm') === '1';
const rawMatchMedia = window.matchMedia.bind(window);
window.matchMedia = (media, ...rest) => {
  if (String(media).includes('prefers-reduced-motion') && forceReducedMotion) {
    return { matches: true, media, addEventListener() {}, removeEventListener() {} };
  }
  return rawMatchMedia(media, ...rest);
};

const log = (text, data) => {
  const pre = document.createElement('pre');
  pre.textContent = data === undefined ? text : `${text}\n${JSON.stringify(data, null, 2)}`;
  logBox.prepend(pre);
};

let cleanups = [];
const dispose = () => {
  for (const fn of cleanups.splice(0)) {
    try { fn(); } catch { /* 预览重挂载，清理失败不阻断 */ }
  }
};

async function mount(id) {
  dispose();
  stage.textContent = '';
  logBox.textContent = '';
  const entry = bespokeFor(id);
  if (!entry) {
    stage.textContent = `没有这个组件：${id}`;
    return;
  }
  // 默认跟内容库走：JSON 里 component 段配了 src，预览就跟真机一样出声；
  // ?src= 只在试还没入库的音频时覆盖。
  let doc = null;
  try {
    doc = await (await fetch(`/content/activities/${id}.json`)).json();
    title.textContent = `事件日志 · ${doc.title}`;
  } catch {
    title.textContent = `事件日志 · ${id}`;
  }
  const contentSrc = doc?.stages?.find(s => s.type === 'component')?.src;
  log(`mounted ${id} @ ${speed}×${contentSrc && !query.get('src') ? ' · 用内容库音频' : ''}`);
  const nodes = entry.render(
    { title: id, hint: '', src: query.get('src') || contentSrc },
    {
      complete: answer => log('complete()', answer || '(无回执)'),
      cleanup: fn => cleanups.push(fn),
      isLast: true,
    },
  );
  stage.append(...[].concat(nodes));
}

for (const id of BESPOKE_IDS) {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = id;
  componentSelect.append(option);
}
for (const [key, device] of Object.entries(DEVICES)) {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = `${device.label} ${device.w}×${device.h}`;
  deviceSelect.append(option);
}
const current = query.get('component') || BESPOKE_IDS[0];
const deviceKey = DEVICES[query.get('device')] ? query.get('device') : 'iphone16';
const device = DEVICES[deviceKey];
screen.style.width = `${device.w}px`;
screen.style.height = `${device.h}px`;
deviceLabel.textContent = `${device.label} · ${device.w}×${device.h} CSS px`;
// 整机适配：手机框按真实像素渲染，视口不够高时整体缩小，保证在一屏内看全。
// zoom 参与布局，不会留下缩放后的空白。
const fitPhone = () => {
  const want = zoomSelect.value === 'auto'
    ? Math.min(1, (window.innerHeight - toolbar.offsetHeight - 90) / phone.offsetHeight)
    : Number(zoomSelect.value);
  phone.style.zoom = Math.max(.3, want);
  deviceLabel.textContent = `${device.label} · ${device.w}×${device.h} CSS px · 显示 ${Math.round(Math.max(.3, want) * 100)}%`;
};
window.addEventListener('resize', fitPhone);
componentSelect.value = current;
deviceSelect.value = deviceKey;
speedSelect.value = String(speed);
zoomSelect.value = ['auto', '1', '0.75', '0.5'].includes(query.get('zoom')) ? query.get('zoom') : 'auto';
rmBox.checked = forceReducedMotion;
fitPhone();

const reload = () => {
  const next = new URLSearchParams({
    component: componentSelect.value,
    device: deviceSelect.value,
    speed: speedSelect.value,
    zoom: zoomSelect.value,
    rm: rmBox.checked ? '1' : '0',
  });
  const src = query.get('src');
  if (src) next.set('src', src);
  location.search = next.toString();
};
componentSelect.addEventListener('change', reload);
deviceSelect.addEventListener('change', reload);
speedSelect.addEventListener('change', reload);
rmBox.addEventListener('change', () => { forceReducedMotion = rmBox.checked; reload(); });
restartBtn.addEventListener('click', () => void mount(componentSelect.value));

await mount(current);
