// 视频 2「同一个人的三盏灯」：绿（呼吸只到开始）→ 三天后 → 黄（线下工作坊）→ 又过两天 → 红（转接疗愈师）。
// 直接从对话开始，不重复登录与匿名三步（那是视频 1 的内容）。
// 三段分开录，中间靠幕布切场；合成：
//   node 路演/视频/assemble.mjs story1 phone-2140 --dark-from 0
//   node 路演/视频/assemble.mjs story2 phone-2341           # 疗愈师台浅色底
//   node 路演/视频/assemble.mjs story3 phone-2341 --dark-from 0
//   node 路演/视频/concat.mjs story story1 story2 story3
import { ANON_ID, CONSOLE, EMPLOYEE, curtainArm, curtainDown, curtainInitScript, curtainUp, d1, dismissKeyboard, launch, resetDemoEmployee, setEmployeeCookie, sleep, tap, typeSlow, waitReply } from './lib.mjs';

const part = process.argv[2] || 'all';
// 幕布后面补几轮「这几天里发生过的其它对话」：走真实接口，不做画面操作。
// 目的是别让三段看起来像一口气说完的同一段话。
async function fillerChat(page, lines) {
  for (const text of lines) {
    await page.evaluate(async (body) => {
      await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: body }) });
    }, text);
    await sleep(150);
  }
}

const CHAT = '.composer:not(.wall) textarea';
const SEND = '.composer:not(.wall) .send';

if (part === 'all' || part === '1') {
  resetDemoEmployee();
  // 黄色走干预矩阵：情绪「低落」+ yellow → L2 线下工作坊。
  d1(`UPDATE intervention_matrix SET enabled=1, l2_activity_id='mindfulness-workshop' WHERE emotion='低落'`);
  // 疗愈师台里 seed 的其它在办个案收尾，画面里只留这一次真正建起来的个案。
  d1("UPDATE appointments SET status='done' WHERE status IN ('requested','claimed','active')");
}
if (part === '2') {
  d1("DELETE FROM case_notes WHERE appointment_id IN (SELECT id FROM appointments WHERE anon_id='" + ANON_ID + "' AND status IN ('requested','claimed','active')); UPDATE appointments SET status='requested', claimed_by=NULL, claimed_at=NULL, log_json=NULL WHERE anon_id='" + ANON_ID + "' AND status IN ('requested','claimed','active')");
}

// 绿 + 黄 + 红（员工端）
async function partOne() {
  const { context, page, mark, finish } = await launch('phone', 'story1');
  await setEmployeeCookie(context);
  await context.addInitScript(curtainInitScript);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  await sleep(500);
  mark('S1 chat');

  // ---------- 绿灯段 ----------
  // 接视频 1 的同一夜：这一句触发三分钟呼吸着陆法的活动卡。
  await typeSlow(page, CHAT, '还在等一版反馈，脑子一直停不下来', { delay: 32 });
  await tap(page, SEND);
  mark('S2 green sent');
  await waitReply(page);
  await page.locator('.card.resource button').waitFor({ timeout: 20000 });
  await sleep(400);
  await dismissKeyboard(page);
  await sleep(700);
  mark('S3 breathing card');

  // 打开活动 → 开始 → 只跟练第一轮（吸 4 + 呼 6 露头），之后直接切走
  await tap(page, '.card.resource button');
  await page.locator('.act-sheet .primary').waitFor();
  await sleep(600);
  await tap(page, '.act-sheet .primary');
  mark('S4 breathing start');
  await sleep(4000);
  // 呼吸页正盖着对话，趁这会儿把「这三天里的其它对话」从接口补进去：
  // 画面上看不见，也就不会出现幕布拉开后聊天记录才慢半拍冒出来的穿帮。
  await fillerChat(page, ['今天会开到八点，回家路上听了会歌', '明天要交初稿，还是有点慌']);
  mark('S5 breathing round1');

  // ---------- 三天后 ----------
  // 幕布要盖住刷新本身：curtainUp 写下标志位，刷新后的新页面一加载就自己把幕布画上，
  // 等对话就绪、滚到底之后才 curtainDown，避免闪一下启动页或旧记录。
  await curtainUp(page, '三 天 后');
  d1(`UPDATE resource_events SET state='completed', helpfulness='helpful', feedback_at=${Date.now()}, updated_at=${Date.now()} WHERE anon_id='${ANON_ID}' AND state IN ('joined','offered')`);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  await page.evaluate(() => { const s = document.querySelector('.stream'); if (s) s.scrollTop = s.scrollHeight; });
  await sleep(250);
  await curtainDown(page);
  mark('S6 yellow start');

  // ---------- 黄灯段 ----------
  await typeSlow(page, CHAT, '连着两周没睡好了，早上醒来完全不想去公司，有时候想干脆换个地方算了', { delay: 30 });
  await tap(page, SEND);
  mark('S7 yellow sent');
  await waitReply(page);
  await page.locator('.card.resource button').last().waitFor({ timeout: 20000 });
  await sleep(400);
  await dismissKeyboard(page);
  await sleep(800);
  mark('S8 workshop card');

  await tap(page, page.locator('.card.resource button').last());
  await page.locator('.act-sheet .act-cta').waitFor();
  await sleep(800);
  mark('S9 workshop sheet');
  await tap(page, '.act-sheet .act-cta');
  await page.getByText('已报名').first().waitFor({ timeout: 15000 });
  await sleep(900);
  // 活动页正盖着对话，同样趁这会儿把「工作坊之后那两天」的对话补掉。
  await fillerChat(page, ['工作坊那天之后睡得还行，这两天又开始醒得早', '这周又接了个新活，感觉要再来一遍']);
  mark('S10 booked');

  // 周五：直接进真实发生的线下场景（不拍「我已参加」这种录制辅助操作）。
  // 线下场景是 file:// 页，拿不到应用域的幕布，所以这里先把「又过两天」的标志位写好，
  // 等从场景切回应用时，新页面一加载就自带幕布，刷新过程始终被盖住。
  await curtainUp(page, '周 五 中 午', 800);
  await curtainArm(page, '又 过 两 天');
  await page.goto(`file://${new URL('./pages/workshop-friday.html', import.meta.url).pathname}`);
  await page.locator('.scene img').waitFor({ timeout: 15000 });
  await sleep(2000);
  mark('S11 workshop scene');

  // ---------- 又过两天 · 红灯段 ----------
  d1(`UPDATE resource_events SET state='completed', helpfulness='helpful', feedback_at=${Date.now()}, updated_at=${Date.now()} WHERE anon_id='${ANON_ID}' AND state IN ('joined','offered')`);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  await page.evaluate(() => { const s = document.querySelector('.stream'); if (s) s.scrollTop = s.scrollHeight; });
  await sleep(900);
  await curtainDown(page);
  mark('S12 red start');

  await typeSlow(page, CHAT, '撑不住了，感觉少我一个也没差', { delay: 32 });
  await tap(page, SEND);
  mark('S13 red sent');
  await waitReply(page);
  await page.locator('.card.consent').waitFor({ timeout: 15000 });
  await sleep(500);
  await page.evaluate(() => { document.activeElement?.blur?.(); document.documentElement.classList.remove('demo-kb'); });
  await sleep(400);
  await page.evaluate(() => { const s = document.querySelector('.stream'); s.scrollTop = s.scrollHeight; });
  await sleep(1700);
  mark('S14 consent card');

  // 直接同意（旧版「推开 → 补热线 → 再劝」三轮全部砍掉）
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(500);
  await tap(page, consent.locator('button').first());
  await page.locator('.card.consent', { hasText: '等待接单' }).waitFor({ timeout: 15000 });
  await sleep(1000);
  mark('S15 submitted');
  await finish();
}

// 疗愈师工作台：开场用一层幕布点明「这是另一个人、另一台设备」
async function partHealer() {
  const { context, page, mark, finish } = await launch('phone', 'story2');
  // 幕布从第一帧就在，等页面就绪后再淡出。
  await context.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const cover = document.createElement('div');
      cover.className = 'demo-interlude on';
      cover.id = 'demo-handoff';
      cover.innerHTML = '<p>另一端 · 值班疗愈师</p>';
      document.body.appendChild(cover);
    });
  });
  await page.goto(`${CONSOLE}/healer/`);
  await page.locator('#signin-go').waitFor({ timeout: 20000 });
  await sleep(1200);
  mark('S16 curtain');
  await page.evaluate(() => {
    const cover = document.querySelector('#demo-handoff');
    if (cover) { cover.classList.remove('on'); setTimeout(() => cover.remove(), 600); }
  });
  await sleep(500);
  await tap(page, '#signin-go');
  await page.getByRole('button', { name: '开始联系' }).first().waitFor({ timeout: 20000 });
  await sleep(1600);
  mark('S17 case list');

  await tap(page, page.getByRole('button', { name: '开始联系' }).first());
  await page.getByRole('button', { name: '标记已闭环' }).first().waitFor({ timeout: 20000 });
  await sleep(1400);
  mark('S18 claimed');
  await finish();
}

// 回到员工端：状态同步 + 我的预约
async function partBack() {
  const { context, page, mark, finish } = await launch('phone', 'story3');
  await setEmployeeCookie(context);
  await page.goto(`${EMPLOYEE}/`);
  await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
  const consent = page.locator('.card.consent').first();
  await consent.scrollIntoViewIfNeeded();
  await sleep(1200);
  mark('S19 synced');
  await tap(page, '.tab[data-view="me"]');
  await page.locator('.apt-list').waitFor({ timeout: 15000 });
  await sleep(1600);
  mark('S20 me');
  await finish();
}

if (part === 'all' || part === '1') await partOne();
if (part === 'all' || part === '2') await partHealer();
if (part === 'all' || part === '3') await partBack();
