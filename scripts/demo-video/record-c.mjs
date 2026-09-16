// 视频 C · HR 看板：桌面段，模拟基线数据。前置：console 在跑，本地库已 seed:apply:local。
import { CONSOLE, launch, sleep, tap } from './lib.mjs';

const { page, mark, finish } = await launch('desktop', 'C');

// 平滑滚动：一格一格滚，像人在看。
async function scrollBy(px, step = 60) {
  const steps = Math.max(1, Math.round(Math.abs(px) / step));
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, Math.sign(px) * step);
    await sleep(28);
  }
}
async function scrollToText(text, offset = -140) {
  const node = page.getByText(text, { exact: false }).first();
  await node.waitFor({ timeout: 15000 });
  const box = await node.boundingBox();
  await scrollBy(box.y + offset);
  await sleep(300);
}

await page.goto(`${CONSOLE}/`);
await page.locator('#signin-go, button:has-text("进入后台")').first().waitFor({ timeout: 20000 });
await page.mouse.move(700, 300);
await sleep(1200);
mark('C0 gate');
await tap(page, page.getByRole('button', { name: '进入后台' }));
const origin = page.locator('select').first();
await origin.waitFor({ timeout: 20000 });
await sleep(1500);
// 切到模拟基线：先把指针移过去，再选。
const box = await origin.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 20 });
await sleep(400);
await origin.selectOption('demo_seed');
await page.getByText('组织议题热度').waitFor({ timeout: 20000 });
await page.mouse.move(box.x + 420, box.y + 260, { steps: 20 });
await sleep(6000);
mark('C1/C2 overview + topics');

await scrollToText('部门概览');
await sleep(1500);
const suppressed = page.getByText('有效样本少于', { exact: false }).first();
const sb = await suppressed.boundingBox();
await page.mouse.move(sb.x + 120, sb.y + sb.height / 2, { steps: 24 });
await sleep(4500);
mark('C4 departments');

await scrollToText('团队节奏');
await sleep(4500);
mark('C3 rhythm');

await scrollToText('情绪温度趋势');
await sleep(5000);
mark('C3 trend');

await scrollBy(-4000, 120);
await sleep(600);
await tap(page, page.getByRole('tab', { name: '活动效果' }));
await page.getByText('单项活动表现').waitFor({ timeout: 20000 });
await sleep(3500);
await scrollToText('单项活动表现');
await sleep(5000);
mark('C5 activities');
await finish();
