// 视频 3「看得见组织，看不见个人」：HR 看板 25 秒版。
// 只证明一件事——组织侧全是汇总，个人查不到。从已登录态起拍，不拍登录；
// 行业洞察 tab 打开即停，不滚到 8 行业 Benchmark 表（那不是本片重点）。
// 合成：node scripts/demo-video/assemble.mjs HR3 laptop
import { CONSOLE, launch, sleep, tap } from './lib.mjs';

const { page, mark, finish } = await launch('desktop', 'HR3');

// 平滑滚动：一格一格滚，像人在看；这版比旧版快一档。
async function scrollBy(px, step = 100) {
  const steps = Math.max(1, Math.round(Math.abs(px) / step));
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, Math.sign(px) * step);
    await sleep(14);
  }
}
async function scrollToText(text, offset = -140) {
  const node = page.getByText(text, { exact: false }).first();
  await node.waitFor({ timeout: 15000 });
  const box = await node.boundingBox();
  await scrollBy(box.y + offset);
  await sleep(200);
}

// 进后台 + 切模拟基线：这两步在录之前做完，不进成片。
await page.goto(`${CONSOLE}/`);
await page.locator('#signin-go, button:has-text("进入后台")').first().waitFor({ timeout: 20000 });
await tap(page, page.getByRole('button', { name: '进入后台' }), { settle: 120 });
const origin = page.locator('select').first();
await origin.waitFor({ timeout: 20000 });
await origin.selectOption('demo_seed');
await page.getByText('组织议题热度').waitFor({ timeout: 20000 });

// H1 首屏：总览四格 + 组织议题热度 + 情绪分布（4 次红色信号 → 3 例同意建案）
const box = await origin.boundingBox();
await page.mouse.move(box.x + 420, box.y + 260, { steps: 16 });
await sleep(3200);
mark('H1 overview');

// H2 部门概览：样本不足的部门连 HR 也看不到
await scrollToText('部门概览');
const suppressed = page.getByText('有效样本少于', { exact: false }).first();
const sb = await suppressed.boundingBox();
await page.mouse.move(sb.x + 120, sb.y + sb.height / 2, { steps: 18 });
await sleep(2900);
mark('H2 departments');

// H3 团队节奏：只有行为元数据，不碰消息内容
await scrollToText('团队节奏');
await sleep(2600);
mark('H3 rhythm');

// H4 情绪温度趋势
await scrollToText('情绪温度趋势');
await sleep(2400);
mark('H4 trend');

// H5 活动效果：每一次练习汇成组织级数据
await scrollBy(-4000, 160);
await sleep(400);
await tap(page, page.getByRole('tab', { name: '活动效果' }), { settle: 150 });
await page.getByText('单项活动表现').waitFor({ timeout: 20000 });
await scrollToText('单项活动表现');
await sleep(2800);
mark('H5 activities');

// H6 行业洞察：本企业 vs 行业基准一屏，打开即停
await scrollBy(-4000, 160);
await sleep(300);
await tap(page, page.getByRole('tab', { name: '行业洞察' }), { settle: 150 });
await page.getByText('本企业 vs', { exact: false }).waitFor({ timeout: 20000 });
await sleep(2200);
mark('H6 industry');

await finish();
