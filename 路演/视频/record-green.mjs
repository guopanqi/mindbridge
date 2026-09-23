// 绿灯篇 · 日常倾诉：钉钉进入 → 匿名连接 → 三轮对话 → 三分钟呼吸着陆法 → 一句收尾。
// 前置：launch.json 里的 model-stub 与 employee-demo 已启动。
// 合成：node 路演/视频/assemble.mjs green phone-941 --speed <呼吸第1轮结束>:<呼吸结束>:25 --dark-from <G2 boot>
import path from 'node:path';
import { dismissKeyboard, launch, resetDemoEmployee, routeEmployeeAuth, sleep, tap, typeSlow, waitReply } from './lib.mjs';

resetDemoEmployee();

const { context, page, mark, finish } = await launch('phone', 'green');
await routeEmployeeAuth(context);

// G1 钉钉工作台
await page.goto(`file://${path.resolve('路演/视频/pages/workbench.html')}`);
await sleep(1500);
mark('G1 workbench');
await tap(page, '#mindbridge');
await page.waitForURL('**/localhost:8788/**');

// G2 匿名连接三步（真实启动流程，/api/auth 被接管）
mark('G2 boot');
await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
await sleep(1600);
mark('G3 chat ready');

// G4 第一轮
await typeSlow(page, '.composer textarea', '方案改到第三版了，领导其实也没说什么，但我脑子一直停不下来');
await tap(page, '.composer .send');
mark('G4 sent 1');
await waitReply(page);
await sleep(2600);
mark('G5 reply 1');

// G6 第二轮 → 活动卡
await typeSlow(page, '.composer textarea', '还在，等下还要等一版反馈');
await tap(page, '.composer .send');
mark('G6 sent 2');
await waitReply(page);
await page.locator('.card.resource button').waitFor();
await sleep(3000);
mark('G7 card');

// G8 收起键盘 → 打开活动 → 开始
await dismissKeyboard(page);
await sleep(800);
await tap(page, '.card.resource button');
await page.locator('.act-sheet .primary').waitFor();
await sleep(1800);
await tap(page, '.act-sheet .primary');
mark('G9 breathing start');

// 第一轮呼吸（吸 4 + 呼 6）实时保留，从这一刻之后的 17 轮在合成时压 25 倍速。
await sleep(10000);
mark('G9 breathing round1 done');

// 余下 17 轮真实跑完，等收尾提问出现。
await page.locator('.act-choice').first().waitFor({ timeout: 200000 });
mark('G9 breathing end');
await sleep(1800);

// G10 留意一个变化 → 肩膀松了一点 → 有帮助 → 关闭
await tap(page, page.locator('.act-choice').nth(1));
await page.locator('.act-help-opt').first().waitFor();
await sleep(1800);
await tap(page, page.locator('.act-help-opt').first());
await sleep(900);
await tap(page, '.act-sheet .primary.act-cta');
await page.locator('.act-overlay').waitFor({ state: 'hidden' });
mark('G10 done');
await sleep(1200);

// G11 第三轮：收工
await typeSlow(page, '.composer textarea', '好像可以收工了');
await tap(page, '.composer .send');
await waitReply(page);
await sleep(1500);
await dismissKeyboard(page);
await sleep(2600);
mark('G11 end');

await finish();
