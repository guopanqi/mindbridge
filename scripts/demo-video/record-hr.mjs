// HR 看板篇：桌面段，模拟基线数据。前置：console 在跑，本地库已 seed:apply:local。
// 合成：node scripts/demo-video/assemble.mjs HR laptop
import { CONSOLE, launch, sleep, tap } from './lib.mjs';

const { page, mark, finish } = await launch('desktop', 'HR');

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
mark('HR0 gate');
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
mark('HR1/C2 overview + topics');

await scrollToText('部门概览');
await sleep(1500);
const suppressed = page.getByText('有效样本少于', { exact: false }).first();
const sb = await suppressed.boundingBox();
await page.mouse.move(sb.x + 120, sb.y + sb.height / 2, { steps: 24 });
await sleep(4500);
mark('HR4 departments');

await scrollToText('团队节奏');
await sleep(4500);
mark('HR3 rhythm');

await scrollToText('情绪温度趋势');
await sleep(5000);
mark('HR3 trend');

await scrollBy(-4000, 120);
await sleep(600);
await tap(page, page.getByRole('tab', { name: '活动效果' }));
await page.getByText('单项活动表现').waitFor({ timeout: 20000 });
await sleep(3500);
await scrollToText('单项活动表现');
await sleep(5000);
mark('HR5 activities');

// C7 行业洞察：跨企业匿名聚合的行业基准，先看本企业 vs 行业，再切一个行业看议题与活动效果。
await scrollBy(-4000, 120);
await sleep(500);
await tap(page, page.getByRole('tab', { name: '行业洞察' }));
await page.getByText('本企业 vs', { exact: false }).waitFor({ timeout: 20000 });
await sleep(4500);
mark('HR7 industry benchmark');
await scrollToText('按行业浏览', -120);
await sleep(1500);
const industry = page.locator('select').nth(1);
const ib = await industry.boundingBox();
await page.mouse.move(ib.x + ib.width / 2, ib.y + ib.height / 2, { steps: 20 });
await sleep(500);
await industry.selectOption('制造业');
await page.getByText('制造业 · 行业议题分布').waitFor({ timeout: 20000 });
await page.mouse.move(ib.x + 420, ib.y + 220, { steps: 20 });
await sleep(3500);
await scrollToText('行业议题分布', -120);
await sleep(4000);
mark('HR7 industry explore');
// 八行业总览表：一屏看完所有行业。
await scrollToText('Benchmark 总览', -100);
await sleep(5500);
mark('HR7 industry overview');
await finish();
