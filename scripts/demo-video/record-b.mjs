// 视频 B · 危机线：三段各自录制（手机 → 疗愈师台 → 手机），由 assemble 合成后 concat。
// 前置：A 段刚录完（沿用同一段对话），model-stub / employee-demo / console 三个服务在跑。
import { CONSOLE, EMPLOYEE, dismissKeyboard, interlude, launch, setEmployeeCookie, sleep, tap, typeSlow, waitReply } from './lib.mjs';

const part = process.argv[2] || 'all';

async function phone1() {
  const { context, page, mark, finish } = await launch('phone', 'B1');
  await setEmployeeCookie(context);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  await interlude(page, '两周后 · 深夜', 2400, { fadeOut: true });
  await sleep(1200);
  mark('B1 chat');

  await typeSlow(page, '.composer textarea', '好累，好想死');
  await tap(page, '.composer .send');
  mark('B2 sent');
  await waitReply(page);
  await page.locator('.card.crisis').waitFor({ timeout: 15000 });
  await sleep(600);
  await dismissKeyboard(page);
  await page.evaluate(() => { const s = document.querySelector('.stream'); s.scrollTop = s.scrollHeight; });
  await sleep(5000);
  mark('B3/B4 crisis reply + cards');

  await typeSlow(page, '.composer textarea', '就是觉得撑不下去了，不知道跟谁说');
  await tap(page, '.composer .send');
  mark('B5 sent');
  await waitReply(page);
  await sleep(1200);
  await dismissKeyboard(page);
  await sleep(3000);
  mark('B6 reply');

  // 同意卡在上面：慢慢滚回去让它进入视野，再点「我愿意」。
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(1400);
  await tap(page, consent.locator('button').first());
  await page.locator('.card.consent', { hasText: '等待接单' }).waitFor({ timeout: 15000 });
  await sleep(3800);
  mark('B7 submitted');
  await finish();
}

async function desktop() {
  const { page, mark, finish } = await launch('desktop', 'B2');
  await page.goto(`${CONSOLE}/healer/`);
  await page.locator('#signin-go').waitFor({ timeout: 20000 });
  await sleep(1500);
  mark('B9 gate');
  await tap(page, '#signin-go');
  await page.locator('.case-card, #view-cases article, #view-cases .case').first().waitFor({ timeout: 20000 }).catch(() => {});
  await page.getByRole('button', { name: '开始联系' }).first().waitFor({ timeout: 20000 });
  await sleep(4500);
  mark('B9 list');

  await tap(page, page.getByRole('button', { name: '开始联系' }).first());
  await page.getByRole('button', { name: '标记已闭环' }).first().waitFor({ timeout: 20000 });
  await sleep(3000);
  mark('B10 claimed');

  const note = page.getByPlaceholder('追加跟进笔记...').first();
  await typeSlow(page, note, '已通过匿名通道联系，员工当前安全，已完成首次对话，明早 10:00 继续。', { delay: 45 });
  await sleep(500);
  await tap(page, page.getByRole('button', { name: /^记录 \(/ }).first());
  await page.getByRole('button', { name: '记录 (1)' }).first().waitFor({ timeout: 20000 });
  await sleep(3000);
  mark('B11 note');

  // 只悬停「申请查看上下文」，不点：想看原文必须员工再次同意。
  const ctx = page.getByRole('button', { name: '申请查看上下文' }).first();
  const box = await ctx.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 24 });
  await sleep(3500);
  mark('B12 hover');
  await finish();
}

async function phone3() {
  const { context, page, mark, finish } = await launch('phone', 'B3');
  await setEmployeeCookie(context);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(4000);
  mark('B14 status synced');
  await tap(page, '.tab[data-view="me"]');
  await page.locator('.apt-list').waitFor({ timeout: 15000 });
  await sleep(4500);
  mark('B14 me');
  await finish();
}

if (part === 'all' || part === '1') await phone1();
if (part === 'all' || part === '2') await desktop();
if (part === 'all' || part === '3') await phone3();
