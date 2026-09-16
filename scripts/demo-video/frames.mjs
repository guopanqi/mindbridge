// 生成样机外框 PNG（透明背景）：iPhone 边框 + 灵动岛 + 状态栏；MacBook 边框。
// 用 Playwright 截图 HTML 得到，尺寸与录制像素严格对齐。
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('scripts/demo-video/out/assets');
mkdirSync(OUT, { recursive: true });

// 手机：屏幕 1170×2532，边框 60px，外圆角 190，内圆角 150。画布 1290×2652。
export const PHONE = { screen: { w: 1170, h: 2532 }, bezel: 60, canvas: { w: 1290, h: 2652 }, statusBand: 177, homeBand: 102 };
// 电脑：屏幕 2160×1350，顶部边 54，两侧 54，底部 54，再加 90 的底座。画布 2268×1548。
export const LAPTOP = { screen: { w: 2160, h: 1350 }, side: 54, top: 54, bottom: 54, base: 90, canvas: { w: 2268, h: 1548 } };

const phoneHtml = (time, dark) => `<!doctype html><html><body style="margin:0;width:${PHONE.canvas.w}px;height:${PHONE.canvas.h}px;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="${PHONE.canvas.w}" height="${PHONE.canvas.h}" viewBox="0 0 ${PHONE.canvas.w} ${PHONE.canvas.h}">
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a3f"/><stop offset=".5" stop-color="#101012"/><stop offset="1" stop-color="#2a2a2e"/></linearGradient>
  </defs>
  <!-- 机身：外圆角矩形减去屏幕圆角矩形 -->
  <path fill-rule="evenodd" fill="url(#edge)" d="
    M190 0 H${PHONE.canvas.w - 190} A190 190 0 0 1 ${PHONE.canvas.w} 190 V${PHONE.canvas.h - 190} A190 190 0 0 1 ${PHONE.canvas.w - 190} ${PHONE.canvas.h} H190 A190 190 0 0 1 0 ${PHONE.canvas.h - 190} V190 A190 190 0 0 1 190 0 Z
    M${60 + 150} 60 H${PHONE.canvas.w - 60 - 150} A150 150 0 0 1 ${PHONE.canvas.w - 60} ${60 + 150} V${PHONE.canvas.h - 60 - 150} A150 150 0 0 1 ${PHONE.canvas.w - 60 - 150} ${PHONE.canvas.h - 60} H${60 + 150} A150 150 0 0 1 60 ${PHONE.canvas.h - 60 - 150} V${60 + 150} A150 150 0 0 1 ${60 + 150} 60 Z"/>
  <!-- 内侧黑边，让屏幕像嵌进去的 -->
  <path fill-rule="evenodd" fill="#050506" d="
    M${48 + 162} 48 H${PHONE.canvas.w - 48 - 162} A162 162 0 0 1 ${PHONE.canvas.w - 48} ${48 + 162} V${PHONE.canvas.h - 48 - 162} A162 162 0 0 1 ${PHONE.canvas.w - 48 - 162} ${PHONE.canvas.h - 48} H${48 + 162} A162 162 0 0 1 48 ${PHONE.canvas.h - 48 - 162} V${48 + 162} A162 162 0 0 1 ${48 + 162} 48 Z
    M${60 + 150} 60 H${PHONE.canvas.w - 60 - 150} A150 150 0 0 1 ${PHONE.canvas.w - 60} ${60 + 150} V${PHONE.canvas.h - 60 - 150} A150 150 0 0 1 ${PHONE.canvas.w - 60 - 150} ${PHONE.canvas.h - 60} H${60 + 150} A150 150 0 0 1 60 ${PHONE.canvas.h - 60 - 150} V${60 + 150} A150 150 0 0 1 ${60 + 150} 60 Z"/>
  <!-- 侧键 -->
  <rect x="-6" y="640" width="10" height="120" rx="4" fill="#1a1a1c"/>
  <rect x="-6" y="820" width="10" height="210" rx="4" fill="#1a1a1c"/>
  <rect x="-6" y="1060" width="10" height="210" rx="4" fill="#1a1a1c"/>
  <rect x="${PHONE.canvas.w - 4}" y="900" width="10" height="320" rx="4" fill="#1a1a1c"/>
  <!-- 灵动岛 -->
  <rect x="${PHONE.canvas.w / 2 - 188}" y="${60 + 33}" width="376" height="111" rx="55" fill="#000"/>
  <!-- 状态栏 -->
  <g font-family="-apple-system, 'SF Pro Text', 'PingFang SC', sans-serif" font-weight="600" fill="${dark ? '#f2f2f2' : '#16332f'}">
    <text x="${60 + 128}" y="${60 + 112}" font-size="52" text-anchor="middle">${time}</text>
    <g transform="translate(${PHONE.canvas.w - 60 - 292}, ${60 + 68})">
      <rect x="0" y="30" width="10" height="16" rx="2"/><rect x="16" y="22" width="10" height="24" rx="2"/><rect x="32" y="14" width="10" height="32" rx="2"/><rect x="48" y="6" width="10" height="40" rx="2"/>
      <path transform="translate(78, 0)" d="M26 44 a4 4 0 1 1 0.1 0 M26 36 c-6 0-11 2-15 6 M26 26 c-9 0-17 3-23 9 M26 16 c-12 0-23 4-31 12" fill="none" stroke="${dark ? '#f2f2f2' : '#16332f'}" stroke-width="7" stroke-linecap="round"/>
      <rect x="140" y="10" width="72" height="34" rx="9" fill="none" stroke="${dark ? '#f2f2f2' : '#16332f'}" stroke-width="5" opacity=".5"/>
      <rect x="147" y="17" width="58" height="20" rx="4"/>
      <rect x="216" y="21" width="6" height="12" rx="3" opacity=".5"/>
    </g>
  </g>
  <!-- 底部指示条 -->
  <rect x="${PHONE.canvas.w / 2 - 210}" y="${PHONE.canvas.h - 60 - 34}" width="420" height="14" rx="7" fill="${dark ? '#f2f2f2' : '#16332f'}" opacity=".85"/>
</svg></body></html>`;

const laptopHtml = () => `<!doctype html><html><body style="margin:0;width:${LAPTOP.canvas.w}px;height:${LAPTOP.canvas.h}px;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="${LAPTOP.canvas.w}" height="${LAPTOP.canvas.h}" viewBox="0 0 ${LAPTOP.canvas.w} ${LAPTOP.canvas.h}">
  <defs>
    <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2b2e"/><stop offset="1" stop-color="#151517"/></linearGradient>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6d7d9"/><stop offset=".35" stop-color="#b9babd"/><stop offset="1" stop-color="#8f9093"/></linearGradient>
  </defs>
  <path fill-rule="evenodd" fill="url(#lid)" d="
    M60 0 H${LAPTOP.canvas.w - 60} A60 60 0 0 1 ${LAPTOP.canvas.w} 60 V${LAPTOP.canvas.h - LAPTOP.base} H0 V60 A60 60 0 0 1 60 0 Z
    M${LAPTOP.side + 22} ${LAPTOP.top} H${LAPTOP.canvas.w - LAPTOP.side - 22} A22 22 0 0 1 ${LAPTOP.canvas.w - LAPTOP.side} ${LAPTOP.top + 22} V${LAPTOP.top + LAPTOP.screen.h - 22} A22 22 0 0 1 ${LAPTOP.canvas.w - LAPTOP.side - 22} ${LAPTOP.top + LAPTOP.screen.h} H${LAPTOP.side + 22} A22 22 0 0 1 ${LAPTOP.side} ${LAPTOP.top + LAPTOP.screen.h - 22} V${LAPTOP.top + 22} A22 22 0 0 1 ${LAPTOP.side + 22} ${LAPTOP.top} Z"/>
  <circle cx="${LAPTOP.canvas.w / 2}" cy="${LAPTOP.top / 2}" r="9" fill="#0a0a0b"/>
  <circle cx="${LAPTOP.canvas.w / 2}" cy="${LAPTOP.top / 2}" r="4" fill="#1f2a30"/>
  <rect x="0" y="${LAPTOP.canvas.h - LAPTOP.base}" width="${LAPTOP.canvas.w}" height="${LAPTOP.base - 30}" fill="url(#base)"/>
  <path d="M0 ${LAPTOP.canvas.h - 30} H${LAPTOP.canvas.w} A30 30 0 0 1 ${LAPTOP.canvas.w - 30} ${LAPTOP.canvas.h} H30 A30 30 0 0 1 0 ${LAPTOP.canvas.h - 30} Z" fill="#6f7073"/>
  <rect x="${LAPTOP.canvas.w / 2 - 190}" y="${LAPTOP.canvas.h - LAPTOP.base}" width="380" height="18" rx="9" fill="#9a9b9e"/>
</svg></body></html>`;

const browser = await chromium.launch();
async function shot(html, size, file) {
  const page = await browser.newPage({ viewport: { width: size.w, height: size.h }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.screenshot({ path: path.join(OUT, file), omitBackground: true, type: 'png' });
  await page.close();
  console.log(`wrote ${file}`);
}
await shot(phoneHtml('9:41', false), PHONE.canvas, 'phone-941.png');
await shot(phoneHtml('23:41', false), PHONE.canvas, 'phone-2341.png');
await shot(laptopHtml(), LAPTOP.canvas, 'laptop.png');
await browser.close();
