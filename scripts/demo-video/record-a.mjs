// 视频 A · 日常线：钉钉进入 → 匿名连接 → 倾诉 → 呼吸着陆法 → 三天后回访 → 我的活动。
// 前置：launch.json 里的 model-stub 与 employee-demo 已启动。
import path from 'node:path';
import { ANON_ID, d1, launch, resetDemoEmployee, routeEmployeeAuth, sleep, tap, titleCard, typeSlow, waitReply } from './lib.mjs';

resetDemoEmployee();

const { context, page, mark, finish } = await launch('phone', 'A');
await routeEmployeeAuth(context);

// A1 钉钉工作台
await page.goto(`file://${path.resolve('scripts/demo-video/pages/workbench.html')}`);
await sleep(1500);
mark('A1 workbench');
await tap(page, '#mindbridge');
await page.waitForURL('**/localhost:8788/**');

// A2 匿名连接三步（真实启动流程，/api/auth 被接管）
mark('A2 boot');
await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
await sleep(1600);
mark('A3 chat ready');

// A4–A5 第一轮
await typeSlow(page, '.composer textarea', '今天和一个客户扯皮，一直说过两天过两天，烦死了');
await tap(page, '.composer .send');
mark('A4 sent 1');
await waitReply(page);
await sleep(2600);
mark('A5 reply 1');

// A6–A7 第二轮 → 活动卡
await typeSlow(page, '.composer textarea', '最近一直这样，一个男的，每天都说过两天过两天');
await tap(page, '.composer .send');
mark('A6 sent 2');
await waitReply(page);
await page.locator('.card.resource button').waitFor();
await sleep(3200);
mark('A7 card');

// A8 打开活动 → 开始
await tap(page, '.card.resource button');
await page.locator('.act-sheet .primary').waitFor();
await sleep(1800);
await tap(page, '.act-sheet .primary');
mark('A9 breathing start');

// A9 呼吸圆：真实跑完（约 71 秒），后期加速。等第二步出现。
await page.locator('.act-choice').first().waitFor({ timeout: 120000 });
mark('A9 breathing end');
await sleep(1800);

// A10 留意一个变化 → 肩膀松了一点 → 有帮助 → 保存
await tap(page, page.locator('.act-choice').nth(1));
await page.locator('.act-help-opt').first().waitFor();
await sleep(1800);
await tap(page, page.locator('.act-help-opt').first());
await sleep(900);
await tap(page, '.act-sheet .primary.act-cta');
await page.locator('.act-overlay').waitFor({ state: 'hidden' });
mark('A10 done');
await sleep(1200);

// A11 好多了 谢谢你
await typeSlow(page, '.composer textarea', '好多了 谢谢你');
await tap(page, '.composer .send');
await waitReply(page);
await sleep(2200);
mark('A11 thanks');

// A12 三天后：把回访拉到当下，黑场，再打开应用
d1(`UPDATE follow_ups SET due_at=${Date.now() - 1000} WHERE anon_id='${ANON_ID}' AND state='scheduled'`);
await titleCard(page, '三 天 后');
mark('A12 card');
await page.goto('http://localhost:8788/');
await page.locator('.card.followup').waitFor({ timeout: 20000 });
await sleep(2200);
mark('A13 followup');
await tap(page, page.locator('.card.followup .card-actions button').first());
await sleep(2200);

// A14 我的活动
await tap(page, '.tab[data-view="activities"]');
await sleep(3200);
mark('A14 activities');
await sleep(2500);
mark('A15 end');

await finish();
