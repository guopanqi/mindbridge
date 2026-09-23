// 红灯篇 · 危机识别：深夜求助 → 先给疗愈师、员工推拒后才给热线 → 授权转接 → 疗愈师台（同样在手机上）接单。
// 三段各自录制（员工 → 疗愈师台 → 员工），合成后 concat：
//   node 路演/视频/assemble.mjs red1 phone-941 --dark-from 0
//   node 路演/视频/assemble.mjs red2 phone-941
//   node 路演/视频/assemble.mjs red3 phone-941 --dark-from 0
//   node 路演/视频/concat.mjs red red1 red2 red3
// 前置：黄灯篇刚录完（沿用同一个演示账号），model-stub / employee-demo / console 三个服务在跑。
import { CONSOLE, EMPLOYEE, d1, dismissKeyboard, interlude, launch, resetDemoEmployee, setEmployeeCookie, sleep, tap, typeSlow, waitReply } from './lib.mjs';

const part = process.argv[2] || 'all';

// 红灯篇是第三个人的故事，自己从干净状态开始；同时把疗愈师台里 seed 的其它在办个案收尾，
// 让画面里只剩这一次真正建起来的个案。
if (part === 'all' || part === '1') {
  resetDemoEmployee();
  d1("UPDATE appointments SET status='done' WHERE status IN ('requested','claimed','active')");
}
// 单独重录疗愈师段时，把本次个案恢复到「待响应」，避免上一次中断后停在处理中。
if (part === '2') {
  d1("DELETE FROM case_notes WHERE appointment_id IN (SELECT id FROM appointments WHERE anon_id='anon_devtest_01' AND status IN ('requested','claimed','active')); UPDATE appointments SET status='requested', claimed_by=NULL, claimed_at=NULL, log_json=NULL WHERE anon_id='anon_devtest_01' AND status IN ('requested','claimed','active')");
}
// 回到员工端时，全局授权仍应保持默认关闭；转接同意只创建匿名个案，
// 不等于疗愈师已经获准读取对话上下文。
if (part === '3') {
  d1("UPDATE consent_grants SET revoked_at=strftime('%s','now')*1000 WHERE anon_id='anon_devtest_01' AND revoked_at IS NULL");
}

async function phoneEmployee() {
  const { context, page, mark, finish } = await launch('phone', 'red1');
  await setEmployeeCookie(context);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  await interlude(page, '深夜 23:41', 2400, { fadeOut: true });
  await sleep(1200);
  mark('R1 chat');

  // R2 红色信号 → AI 确认安全 + 红边「安排疗愈师」卡（这一轮没有热线卡）
  await typeSlow(page, '.composer textarea', '撑不住了，感觉少我一个也没差');
  await tap(page, '.composer .send');
  mark('R2 sent');
  await waitReply(page);
  await page.locator('.card.consent').waitFor({ timeout: 15000 });
  await sleep(600);
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    document.documentElement.classList.remove('demo-kb');
  });
  await sleep(450);
  await page.evaluate(() => { const s = document.querySelector('.stream'); s.scrollTop = s.scrollHeight; });
  await sleep(5200);
  mark('R3/R4 reply + consent card');

  // R5 员工推开这张卡 → 这一轮才补上 12356，整段只补这一次
  await typeSlow(page, '.composer textarea', '不用了，说了也没用');
  await tap(page, '.composer .send');
  mark('R5 sent');
  await waitReply(page);
  await page.locator('.card.crisis').waitFor({ timeout: 15000 });
  await sleep(900);
  await dismissKeyboard(page);
  await page.evaluate(() => { const s = document.querySelector('.stream'); s.scrollTop = s.scrollHeight; });
  await sleep(5200);
  mark('R6 hotline card');

  // R7 再说一句：AI 不再发任何卡片，只陪着
  await typeSlow(page, '.composer textarea', '我就是不想再这样下去了');
  await tap(page, '.composer .send');
  mark('R7 sent');
  await waitReply(page);
  await sleep(1200);
  await dismissKeyboard(page);
  await sleep(4000);
  mark('R8 reply');

  // R9 员工自己滚回去点「我愿意」
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(1600);
  await tap(page, consent.locator('button').first());
  await page.locator('.card.consent', { hasText: '等待接单' }).waitFor({ timeout: 15000 });
  await sleep(3800);
  mark('R10 submitted');
  await finish();
}

async function phoneHealer() {
  // 疗愈师台也在手机上：值班的人不一定守着电脑。
  const { page, mark, finish } = await launch('phone', 'red2');
  await page.goto(`${CONSOLE}/healer/`);
  await page.locator('#signin-go').waitFor({ timeout: 20000 });
  await sleep(1600);
  mark('R11 gate');
  await tap(page, '#signin-go');
  await page.getByRole('button', { name: '开始联系' }).first().waitFor({ timeout: 20000 });
  await sleep(4500);
  mark('R12 list');

  await tap(page, page.getByRole('button', { name: '开始联系' }).first());
  await page.getByRole('button', { name: '标记已闭环' }).first().waitFor({ timeout: 20000 });
  await sleep(3000);
  mark('R13 claimed');

  const note = page.getByPlaceholder('追加跟进笔记...').first();
  await typeSlow(page, note, '已通过匿名通道联系，员工目前身处安全环境，完成初步安抚，约定明早 10:00 继续跟进。', { delay: 42 });
  await page.evaluate(() => {
    document.activeElement?.blur?.();
    document.documentElement.classList.remove('demo-kb');
  });
  await sleep(450);
  await sleep(500);
  // 手机窄屏下坐标式 tap 偶尔会落在按钮边缘；这里直接点击已解析的按钮节点。
  await page.getByRole('button', { name: /^记录 \(/ }).first().click();
  await page.getByRole('button', { name: '记录 (1)' }).first().waitFor({ timeout: 20000 });
  await sleep(3000);
  mark('R14 note');

  // 只把手指停在「申请查看上下文」上，不点：想看原文必须员工再次同意。
  const ctx = page.getByRole('button', { name: '申请查看上下文' }).first();
  await ctx.scrollIntoViewIfNeeded();
  const box = await ctx.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 24 });
  await sleep(3500);
  mark('R15 hover');
  await finish();
}

async function phoneBack() {
  const { context, page, mark, finish } = await launch('phone', 'red3');
  await setEmployeeCookie(context);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(4000);
  mark('R16 status synced');
  await tap(page, '.tab[data-view="me"]');
  await page.locator('.apt-list').waitFor({ timeout: 15000 });
  await sleep(4500);
  mark('R16 me');
  await finish();
}

if (part === 'all' || part === '1') await phoneEmployee();
if (part === 'all' || part === '2') await phoneHealer();
if (part === 'all' || part === '3') await phoneBack();
