// 路演视频录制公共件：起浏览器、录像、点击涟漪、逐字输入、时间标记。
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

export const OUT = path.resolve('scripts/demo-video/out');
export const EMPLOYEE = 'http://localhost:8788';
export const CONSOLE = 'http://localhost:8789';
export const SESSION_TOKEN = 'devtoken123';
export const ANON_ID = 'anon_devtest_01';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 手机：390×844 逻辑像素，3 倍录制；桌面：1440×900，1.5 倍。
// Playwright 自带录像只按 CSS 像素取帧，放到投影上会糊。这里改成连续截图：
// 截图遵守 deviceScaleFactor，手机段 1170×2532、桌面段 2160×1350，帧间隔按实际时间戳写进视频。
const PROFILES = {
  // 手机视口 390×844。无头浏览器没有安全区，状态栏 59 / 指示条 34 的留白由注入的 CSS 模拟。
  phone: { viewport: { width: 390, height: 844 }, scale: 3, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, scale: 1.5, isMobile: false, hasTouch: false },
};

// 页面里注入的效果：点击涟漪（手机）/ 点击圆环（桌面）、隐藏滚动条、钉钉免登桩。
// 手机段模拟 iOS 的两块安全区和软键盘：
// - 安全区：覆盖页面里 env(safe-area-inset-*) 的几处，用页面自己的底色把状态栏/指示条位置留出来；
// - 键盘：文本框聚焦时在底部叠一块 291px 高的 QWERTY 键盘，并把 .app 压短，与真机 visualViewport 的行为一致。
const KEYBOARD_HEIGHT = 291;
const PHONE_CSS = `
  body.demo-phone-top { padding-top: 59px !important; }
  .app:not([data-view="me"]) main { padding-top: 59px !important; }
  .topbar { padding-top: 59px !important; }
  .boot { padding-top: 91px !important; }
  .tabbar { padding-bottom: 34px !important; }
  .composer { padding-bottom: 8px !important; }
  .act-sheet--experience .act-head { padding-top: 69px !important; }
  .sheet-box, .ctx-sheet, .act-body { padding-bottom: 46px !important; }
  html.demo-kb .app { height: calc(100dvh - ${KEYBOARD_HEIGHT}px) !important; }
  html.demo-kb .tabbar { display: none !important; }
  .demo-keyboard { position: fixed; left: 0; right: 0; bottom: 0; height: ${KEYBOARD_HEIGHT}px; z-index: 99990;
    background: #d1d4da; font-family: -apple-system, 'SF Pro Text', 'PingFang SC', sans-serif; user-select: none;
    transform: translateY(100%); transition: transform .22s cubic-bezier(.2,.8,.2,1); }
  html.demo-kb .demo-keyboard { transform: translateY(0); }
  .demo-kb-cands { height: 42px; display: flex; align-items: center; gap: 22px; padding: 0 14px; font-size: 16px; color: #1c1c1e; background: #d1d4da; border-bottom: 1px solid #c3c6cc; }
  .demo-kb-cands span { color: #8a8f98; }
  .demo-kb-row { display: flex; justify-content: center; gap: 6px; padding: 0 3px; margin-top: 10px; }
  .demo-kb-key { flex: 0 0 33px; height: 42px; border-radius: 6px; background: #fff; box-shadow: 0 1px 0 #8b8f96; display: grid; place-items: center; font-size: 21px; color: #1c1c1e; }
  .demo-kb-key.dim { background: #adb3bd; }
  .demo-kb-key.wide { flex-basis: 42px; font-size: 15px; }
  .demo-kb-key.space { flex-basis: 178px; font-size: 15px; }
  .demo-kb-key.go { flex-basis: 88px; background: #147b6f; color: #fff; font-size: 16px; }
  .demo-kb-key.n123 { flex-basis: 42px; font-size: 15px; }
  .demo-kb-key.on { background: #147b6f; color: #fff; }
  .demo-kb-home { position: absolute; left: 50%; bottom: 8px; width: 134px; height: 5px; margin-left: -67px; border-radius: 3px; background: #1c1c1e; opacity: .85; }
`;
const KEYBOARD_HTML = `
  <div class="demo-kb-cands"><span>拼音</span></div>
  <div class="demo-kb-row">${'QWERTYUIOP'.split('').map((k) => `<div class="demo-kb-key" data-k="${k}">${k}</div>`).join('')}</div>
  <div class="demo-kb-row" style="padding:0 22px">${'ASDFGHJKL'.split('').map((k) => `<div class="demo-kb-key" data-k="${k}">${k}</div>`).join('')}</div>
  <div class="demo-kb-row"><div class="demo-kb-key dim wide">⇧</div>${'ZXCVBNM'.split('').map((k) => `<div class="demo-kb-key" data-k="${k}">${k}</div>`).join('')}<div class="demo-kb-key dim wide">⌫</div></div>
  <div class="demo-kb-row"><div class="demo-kb-key dim n123">123</div><div class="demo-kb-key dim wide">🌐</div><div class="demo-kb-key space">空格</div><div class="demo-kb-key go">发送</div></div>
  <div class="demo-kb-home"></div>
`;

const INIT_SCRIPT = (kind) => `
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = \`
      ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
      * { scrollbar-width: none !important; }
      .demo-ripple { position: fixed; z-index: 99999; pointer-events: none; border-radius: 50%;
        width: 22px; height: 22px; margin: -11px 0 0 -11px; background: rgba(20,123,111,.28);
        border: 2px solid rgba(20,123,111,.55); animation: demo-ripple .42s ease-out forwards; }
      .demo-ripple.desktop { width: 28px; height: 28px; margin: -14px 0 0 -14px; background: rgba(20,123,111,.18); }
      @keyframes demo-ripple { from { transform: scale(.4); opacity: 1; } to { transform: scale(${kind === 'phone' ? 3.2 : 2.4}); opacity: 0; } }
      .demo-cursor { position: fixed; z-index: 99998; pointer-events: none; width: 18px; height: 26px; margin: -2px 0 0 -2px;
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='26' viewBox='0 0 18 26'><path d='M1 1 L1 20 L6 15.5 L9.5 24 L13 22.5 L9.5 14 L16 14 Z' fill='white' stroke='black' stroke-width='1.4' stroke-linejoin='round'/></svg>") no-repeat; }
      .demo-interlude { position: fixed; inset: 0; z-index: 99995; background: #f4faf8; display: grid; place-items: center;
        font-family: -apple-system, 'PingFang SC', sans-serif; opacity: 0; transition: opacity .5s ease; }
      .demo-interlude.on { opacity: 1; }
      .demo-interlude p { margin: 0; color: #147b6f; font-size: 26px; letter-spacing: .4em; font-weight: 600; }
      ${kind === 'phone' ? PHONE_CSS.replace(/`/g, '') : ''}
    \`;
    document.head.appendChild(style);
    if (${kind === 'desktop'}) {
      const cursor = document.createElement('div');
      cursor.className = 'demo-cursor';
      document.body.appendChild(cursor);
      document.addEventListener('mousemove', (event) => { cursor.style.left = event.clientX + 'px'; cursor.style.top = event.clientY + 'px'; }, true);
    }
    if (${kind === 'phone'}) {
      if (!document.querySelector('.app') && !document.querySelector('.boot')) document.body.classList.add('demo-phone-top');
      const keyboard = document.createElement('div');
      keyboard.className = 'demo-keyboard';
      keyboard.innerHTML = ${JSON.stringify(KEYBOARD_HTML)};
      document.body.appendChild(keyboard);
      const isText = (node) => node && (node.tagName === 'TEXTAREA' || (node.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit'].includes(node.type)));
      const pin = () => { const stream = document.querySelector('.stream'); if (stream) stream.scrollTop = stream.scrollHeight; };
      document.addEventListener('focusin', (event) => { if (isText(event.target)) { document.documentElement.classList.add('demo-kb'); setTimeout(pin, 30); setTimeout(pin, 260); } });
      document.addEventListener('focusout', (event) => { if (isText(event.target)) setTimeout(() => { if (!isText(document.activeElement)) document.documentElement.classList.remove('demo-kb'); }, 60); });
      // 键盘上闪一下对应的字母键：中文用拼音首字母近似，只求有动静。
      document.addEventListener('keydown', (event) => {
        const key = (event.key || '').toUpperCase();
        const node = keyboard.querySelector('[data-k="' + key + '"]') || (key.length === 1 ? keyboard.querySelector('.space') : null);
        if (!node) return;
        node.classList.add('on');
        setTimeout(() => node.classList.remove('on'), 90);
      }, true);
    }
    document.addEventListener('pointerdown', (event) => {
      const dot = document.createElement('div');
      dot.className = 'demo-ripple' + (${kind === 'desktop'} ? ' desktop' : '');
      dot.style.left = event.clientX + 'px';
      dot.style.top = event.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 450);
    }, true);
  });
`;

export async function launch(kind, name) {
  const profile = PROFILES[kind];
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.scale,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    locale: 'zh-CN',
    reducedMotion: 'no-preference',
  });
  await context.addInitScript(INIT_SCRIPT(kind));
  // 钉钉 SDK 桩：真实脚本会覆盖 window 上的同名函数，所以在网络层替换整个文件。
  await context.route('**/vendor/dingtalk-auth*.js', (route) => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: "window.requestDingTalkAuthCode = () => new Promise((resolve) => setTimeout(() => resolve({ code: 'demo-code' }), 1300));",
  }));
  const page = await context.newPage();
  const frameDir = path.join(OUT, 'frames', name);
  rmSync(frameDir, { recursive: true, force: true });
  mkdirSync(frameDir, { recursive: true });
  const marks = [];
  const frames = [];
  const startedAt = Date.now();
  let running = true;
  // 截图循环：能截多快就截多快（约 8–12 fps），每帧记录真实时间戳，后期按时间戳定帧长。
  const loop = (async () => {
    let index = 0;
    while (running) {
      try {
        const buffer = await page.screenshot({ type: 'jpeg', quality: 92, animations: 'allow', caret: 'initial', timeout: 1500 });
        const file = path.join(frameDir, `${String(index++).padStart(6, '0')}.jpg`);
        writeFileSync(file, buffer);
        frames.push({ file, at: (Date.now() - startedAt) / 1000 });
      } catch (error) { console.log('frame skipped:', String(error.message).split('\n')[0]); await sleep(50); }
    }
  })();
  const mark = (label) => { marks.push({ label, at: (Date.now() - startedAt) / 1000 }); console.log(`[${((Date.now() - startedAt) / 1000).toFixed(1)}s] ${label}`); };
  const finish = async () => {
    running = false;
    await loop;
    await context.close();
    await browser.close();
    writeFileSync(path.join(OUT, `${name}.take.json`), JSON.stringify({ frameDir, frames, marks }, null, 2));
    console.log(`${frames.length} frames → ${frameDir}`);
    return { frames, marks };
  };
  return { browser, context, page, mark, finish };
}

// 让员工端走完整的匿名连接三步：/api/auth 由我们接管，直接给会话 Cookie。
export async function routeEmployeeAuth(context) {
  // 第三步「生成专属随机代号」点亮后紧接着就进应用，肉眼看不到；把首个 /api/me 拖住 1 秒让它停一下。
  let firstMe = true;
  await context.route('**/api/me', async (route) => {
    if (firstMe) { firstMe = false; await sleep(1000); }
    await route.continue();
  });
  await context.route('**/api/auth', async (route) => {
    await sleep(1100);
    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': `__Host-mb_session=${SESSION_TOKEN}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`,
      },
      body: JSON.stringify({ authenticated: true, message: '匿名会话已建立' }),
    });
  });
}

export async function setEmployeeCookie(context) {
  await context.addCookies([{ name: '__Host-mb_session', value: SESSION_TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
}

// 点击：先把鼠标移过去（桌面段能看到指针飞过去），停一拍再按下。
export async function tap(page, locator, { settle = 350 } = {}) {
  const target = typeof locator === 'string' ? page.locator(locator).first() : locator;
  await target.waitFor({ state: 'visible' });
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y, { steps: 18 });
  await sleep(settle);
  await page.mouse.down();
  await sleep(90);
  await page.mouse.up();
}

export async function typeSlow(page, locator, text, { delay = 70 } = {}) {
  await tap(page, locator);
  await sleep(200);
  await page.keyboard.type(text, { delay });
  await sleep(400);
}

// 等「正在听」出现又消失，即一轮回复落地。
export async function waitReply(page) {
  await page.locator('.bubble.typing').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await page.locator('.bubble.typing').waitFor({ state: 'hidden', timeout: 20000 });
  await sleep(600);
}

// 收起键盘：像真人一样点一下对话区空白处（应用里 stream 的 pointerdown 会让输入框失焦）。
export async function dismissKeyboard(page) {
  const stream = page.locator('.stream').first();
  const box = await stream.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + 40, { steps: 10 });
  await sleep(200);
  await page.mouse.down(); await sleep(60); await page.mouse.up();
  await sleep(450);
}

// 时间过渡卡：在当前页面上淡入一层与应用同色的幕布，只有一行字，停一会儿。
export async function interlude(page, text, ms = 2200) {
  await page.evaluate((label) => {
    const cover = document.createElement('div');
    cover.className = 'demo-interlude';
    cover.innerHTML = `<p>${label}</p>`;
    document.body.appendChild(cover);
    requestAnimationFrame(() => cover.classList.add('on'));
  }, text);
  await sleep(ms);
}

// 本地 D1 直接改数据：录制专用，只碰演示账号。
export function d1(sql) {
  execSync(`npx wrangler d1 execute mindbridge-care --local --command ${JSON.stringify(sql)}`, { cwd: path.resolve('apps/employee'), stdio: 'ignore' });
}

export function resetDemoEmployee() {
  // 一次执行完，减少与正在运行的 wrangler 抢本地 sqlite 锁的次数。
  const byAnon = ['messages', 'follow_ups', 'resource_events', 'risk_events', 'appointments', 'conversation_locks', 'context_requests'];
  d1([
    `DELETE FROM case_notes WHERE appointment_id IN (SELECT id FROM appointments WHERE anon_id='${ANON_ID}')`,
    `DELETE FROM conversation_state WHERE conversation_id IN (SELECT id FROM conversations WHERE anon_id='${ANON_ID}')`,
    ...byAnon.map((table) => `DELETE FROM ${table} WHERE anon_id='${ANON_ID}'`),
    `DELETE FROM conversations WHERE anon_id='${ANON_ID}'`,
  ].join('; '));
}
