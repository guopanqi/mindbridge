// 视频 1「进来说一句话，没人知道是你」：钉钉 → 匿名连接三步 → 树洞广场（抱抱 / 回复）→ 树洞三轮陪伴式对话。
// 只讲「好用、敢用」，不讲风险分级、不展示清空记录与授权开关（那是 P12 的事）。
// 前置：model-stub / employee-demo 在跑。
// 合成：node 路演/视频/assemble.mjs intro phone-2140 --dark-from <I2 boot>
import path from 'node:path';
import { d1, dismissKeyboard, launch, resetDemoEmployee, routeEmployeeAuth, sleep, tap, typeSlow, waitReply, ANON_ID } from './lib.mjs';

// 清对话 + 清掉演示账号此前在广场留下的点赞与回复，保证每次录出来一样。
resetDemoEmployee();
d1([
  `DELETE FROM post_replies WHERE anon_id='${ANON_ID}'`,
  `DELETE FROM post_reactions WHERE anon_id='${ANON_ID}'`,
  `DELETE FROM posts WHERE anon_id='${ANON_ID}'`,
].join('; '));

const { context, page, mark, finish } = await launch('phone', 'intro');
await routeEmployeeAuth(context);

// I1 手机桌面 → 钉钉
await page.goto(`file://${path.resolve('路演/视频/pages/home.html')}`);
await sleep(1100);
mark('I1 home');
await tap(page, '#dingtalk');
await page.waitForURL('**/workbench.html');

// I2 钉钉工作台 → MindBridge
await page.locator('#mindbridge').waitFor({ timeout: 10000 });
await sleep(1200);
mark('I2 workbench');
await tap(page, '#mindbridge');
await page.waitForURL('**/localhost:8788/**');

// I2 匿名连接三步（真实启动流程）
mark('I3 boot');
await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
await sleep(700);
mark('I4 app ready');

// I4 树洞广场：先看见别人，再决定要不要说自己的
await tap(page, '.tab[data-view="wall"]');
await page.locator('.post').first().waitFor({ timeout: 15000 });
await sleep(1000);
mark('I4 wall');

// 给第一条点「抱抱」
await tap(page, page.locator('.post').first().locator('.hug'));
await sleep(1000);
mark('I5 hug');

// 给第二条回一句
await tap(page, page.locator('.post').nth(1).locator('.post-actions .link.mut'));
await page.locator('.reply-box input').first().waitFor({ timeout: 10000 });
await sleep(500);
await typeSlow(page, page.locator('.reply-box input').first(), '我也是，抱抱你', { delay: 55 });
await page.locator('.reply-box .link').first().click();
await page.evaluate(() => { document.activeElement?.blur?.(); document.documentElement.classList.remove('demo-kb'); });
// 等自己那条回复真的落到卡片里，再停一拍让它被看见。
await page.locator('.post').nth(1).locator('.reply-text', { hasText: '我也是，抱抱你' }).first()
  .waitFor({ timeout: 10000 }).catch(() => {});
await page.locator('.post').nth(1).scrollIntoViewIfNeeded();
await sleep(2000);
mark('I6 replied');

// I7 回到树洞，三轮陪伴式对话
await tap(page, '.tab[data-view="chat"]');
await page.locator('.composer:not(.wall) textarea').waitFor({ timeout: 10000 });
await sleep(600);
mark('I7 chat');

await typeSlow(page, '.composer:not(.wall) textarea', '方案改到第三版了，领导其实也没说什么，但我脑子一直停不下来', { delay: 40 });
await tap(page, '.composer:not(.wall) .send');
mark('I8 sent 1');
await waitReply(page);
await sleep(1700);
mark('I9 reply 1');

await typeSlow(page, '.composer:not(.wall) textarea', '也不是什么大事，就是有点说不出来的闷', { delay: 40 });
await tap(page, '.composer:not(.wall) .send');
mark('I10 sent 2');
await waitReply(page);
await sleep(1800);
mark('I11 reply 2');

await typeSlow(page, '.composer:not(.wall) textarea', '有人这么说一句，好像确实松一点', { delay: 40 });
await tap(page, '.composer:not(.wall) .send');
mark('I12 sent 3');
await waitReply(page);
await sleep(900);
await dismissKeyboard(page);
await sleep(1600);
mark('I13 end');

await finish();
