// 可选浏览器回归：PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-activity-flow.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const screenshots = await mkdtemp(join(tmpdir(), 'mindbridge-flow-'));
const wav = Buffer.alloc(44 + 1600);
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write('data', 36); wav.writeUInt32LE(1600, 40);
const server = createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      return res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/public/styles.css"><div id="toast" class="toast"></div>');
    }
    if (req.url === '/test.wav') { res.setHeader('Content-Type', 'audio/wav'); return res.end(wav); }
    if (!/^\/(src|public)\/[a-zA-Z0-9/.-]+$/.test(req.url) || req.url.includes('..')) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', req.url.endsWith('.css') ? 'text/css' : 'text/javascript');
    res.end(await readFile(join(root, req.url)));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const errors = [];

async function setup(id, override = {}) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', error => errors.push(error.message));
  const content = JSON.parse(await readFile(join(root, 'content/activities', `${id}.json`), 'utf8'));
  const state = {
    activity: { ...content, ...override, helpfulnessOptions: ['有帮助', '说不好', '没什么用'], progress: { eventId: id, state: 'offered', stageIndex: 0 } },
    calls: [], fail: null, delay: 0,
  };
  await page.route('**/api/activities**', async route => {
    const request = route.request();
    const body = request.method() === 'POST' ? request.postDataJSON() : null;
    if (body) {
      state.calls.push(body);
      await new Promise(resolve => setTimeout(resolve, state.delay));
      if (state.fail === body.action) { state.fail = null; return route.fulfill({ status: 503, json: { reasonCode: 'TEST_INTERRUPTION' } }); }
      const progress = state.activity.progress;
      if (body.action === 'start') progress.state = 'joined';
      if (body.action === 'stage') {
        assert.ok(body.stageIndex <= progress.stageIndex + 1, '步骤必须顺序写入');
        progress.stageIndex = body.stageIndex;
      }
      if (body.action === 'complete') {
        assert.equal(progress.stageIndex, state.activity.stages.length - 1);
        assert.equal(progress.state, 'joined');
        progress.state = 'completed';
      }
      if (body.action === 'rate') { assert.equal(progress.state, 'completed'); progress.helpfulness = body.helpfulness; }
      assert.equal('answers' in body || 'note' in body, false, '选择和书写不上传');
    }
    await route.fulfill({ json: { ok: true, activity: state.activity } });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.clock.install();
  await page.evaluate(async id => { window.flow = await import('/src/views/activity.js'); await window.flow.openActivity(id); }, id);
  const start = async () => {
    const response = page.waitForResponse(response => response.url().includes('/api/activities') && response.request().method() === 'POST');
    await page.getByRole('button', { name: '开始', exact: true }).click();
    await response;
    await page.waitForTimeout(50);
  };
  const settled = () => page.getByText('已记录完成', { exact: true }).waitFor();
  return { page, state, start, settled };
}

try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const { page, start } = await setup('breathing');
    await page.setViewportSize({ width: 320, height: 480 });
    await page.emulateMedia({ reducedMotion });
    await start();
    const scale = () => page.locator('.breath-orb').evaluate(node => new window.DOMMatrix(window.getComputedStyle(node).transform).a);
    const initial = await scale();
    await page.clock.fastForward(2000);
    const inhaled = await scale();
    assert.ok(inhaled > initial, `${reducedMotion}: 吸气必须放大`);
    await page.clock.fastForward(2000);
    const peak = await scale();
    await page.clock.fastForward(3000);
    assert.ok(await scale() < peak, `${reducedMotion}: 呼气必须缩小`);
    const pause = page.getByRole('button', { name: '暂停', exact: true });
    const bounds = await pause.boundingBox();
    assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 480, '小屏首屏可见暂停按钮');
    const visibility = hidden => page.evaluate(value => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);
    await visibility(true);
    const hiddenScale = await scale();
    await page.clock.fastForward(20000);
    assert.equal(await scale(), hiddenScale, '后台暂停');
    await visibility(false);
    await page.clock.fastForward(1000);
    assert.notEqual(await scale(), hiddenScale, '回前台恢复缩放');
    await pause.click();
    const paused = await scale();
    await visibility(true);
    await visibility(false);
    await page.clock.fastForward(1000);
    assert.equal(await scale(), paused, '手动暂停不自动恢复');
    await page.screenshot({ path: join(screenshots, `breathing-small-${reducedMotion}.png`) });
    await page.close();
  }
  {
    const { page, state, start, settled } = await setup('breathing');
    await start();
    assert.equal(await page.locator('.breath-orb').count(), 1);
    assert.equal(await page.getByRole('button', { name: /下一步|做完了|开始播放/ }).count(), 0);
    await page.screenshot({ path: join(screenshots, 'breathing.png'), fullPage: true });
    await page.clock.fastForward(179000);
    assert.equal(state.calls.filter(call => call.action === 'complete').length, 0);
    await page.clock.fastForward(2000);
    await settled();
    const conclusion = await page.getByRole('region', { name: '活动结果', exact: true }).boundingBox();
    const feedback = await page.getByRole('region', { name: '可选体验反馈', exact: true }).boundingBox();
    assert.ok(feedback.y >= conclusion.y + conclusion.height + 18, '反馈与活动收尾显著分隔');
    await page.screenshot({ path: join(screenshots, 'breathing-result.png'), fullPage: true });
    await page.locator('.act-body').getByRole('button', { name: '关闭', exact: true }).click();
    assert.deepEqual(state.calls.map(call => call.action), ['start', 'complete']);
    await page.close();
  }
  for (const id of ['stretch-guide', 'pmr']) {
    const { page, state, start, settled } = await setup(id);
    await page.setViewportSize({ width: 320, height: 480 });
    await start();
    assert.equal(await page.locator('.demo-player.playing').count(), 1, '一次开始即自动播放');
    const controls = await page.getByRole('button', { name: '暂停', exact: true }).boundingBox();
    assert.ok(controls.y >= 0 && controls.y + controls.height <= 480, `${id}: 小屏首屏可见播放控制`);
    await page.screenshot({ path: join(screenshots, `${id}-small.png`), fullPage: true });
    await page.getByRole('button', { name: '暂停', exact: true }).click();
    const clock = await page.locator('.demo-player-clock').textContent();
    await page.clock.fastForward(10000);
    assert.equal(await page.locator('.demo-player-clock').textContent(), clock);
    await page.getByRole('button', { name: '继续播放', exact: true }).click();
    const max = await page.getByRole('slider').getAttribute('max');
    await page.getByRole('slider').fill(max);
    await settled();
    assert.equal(state.calls.filter(call => call.action === 'complete').length, 1);
    await page.getByRole('button', { name: '有帮助', exact: true }).click();
    await page.getByRole('button', { name: '保存评价并关闭', exact: true }).click();
    await page.waitForTimeout(100);
    assert.equal(state.activity.progress.helpfulness, '有帮助');
    await page.close();
  }
  {
    const { page, state, start, settled } = await setup('value-anchor');
    state.delay = 100;
    await start();
    assert.equal(await page.getByRole('button', { name: /下一步|做完了/ }).count(), 0);
    await page.locator('.act-choice').first().click();
    await page.locator('.act-choice').first().click();
    await settled();
    assert.equal(await page.locator('.act-outcome').count(), 2);
    assert.deepEqual(state.calls.map(call => call.action), ['start', 'stage', 'complete']);
    await page.screenshot({ path: join(screenshots, 'quiz-result.png'), fullPage: true });
    await page.close();
  }
  {
    const { page, state, start, settled } = await setup('value-anchor');
    await start();
    state.fail = 'complete';
    await page.locator('.act-choice').first().click();
    await page.locator('.act-choice').first().click();
    await page.getByText('进度保存尚未确认').waitFor();
    await page.getByRole('button', { name: '重试同步' }).click();
    await settled();
    assert.equal(state.calls.filter(call => call.action === 'complete').length, 2);
    assert.equal(state.activity.progress.state, 'completed');
    await page.close();
  }
  {
    const { page, state, start } = await setup('breathing');
    await start();
    await page.getByRole('button', { name: '关闭', exact: true }).click();
    await page.clock.fastForward(200000);
    assert.equal(state.calls.some(call => call.action === 'complete'), false, '提前退出不算完成');
    assert.equal(await page.locator('.breath-orb').count(), 0);
    await page.close();
  }
  {
    const { page, state, start, settled } = await setup('value-anchor');
    await start();
    state.delay = 150;
    state.fail = 'stage';
    await page.locator('.act-choice').first().click();
    await page.locator('.act-choice').first().click();
    await page.getByText('进度保存尚未确认').waitFor();
    assert.equal(state.calls.some(call => call.action === 'complete'), false, '完成不能越过失败的步骤');
    await page.getByRole('button', { name: '重试同步' }).click();
    await settled();
    assert.equal(state.activity.progress.state, 'completed');
    assert.equal(await page.locator('.act-outcome').count(), 2, '重试保存不要求重新答题');
    await page.close();
  }
  {
    const { page, state, start } = await setup('value-anchor');
    await start();
    state.delay = 150;
    await page.locator('.act-choice').first().click();
    await page.locator('.act-choice').first().click();
    await page.locator('.act-body').getByRole('button', { name: '关闭', exact: true }).click();
    await new Promise(resolve => setTimeout(resolve, 450));
    assert.equal(state.activity.progress.state, 'completed', '关闭结果页也应继续保存完成');
    assert.equal(state.calls.some(call => call.action === 'rate'), false);
    await page.close();
  }
  {
    const { page, state, start, settled } = await setup('pmr', { stages: [{ type: 'media', title: '真实音频测试', presentation: 'audio', src: '/test.wav' }] });
    await start();
    await settled();
    assert.deepEqual(state.calls.map(call => call.action), ['start', 'complete']);
    await page.close();
  }
  {
    const { page, state, start } = await setup('pmr', { stages: [{ type: 'media', title: '自动播放受限测试', presentation: 'video', src: '/missing.mp4' }] });
    await page.evaluate(() => { window.HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError')); });
    await start();
    await page.getByRole('button', { name: '点击播放', exact: true }).waitFor();
    assert.equal(state.calls.some(call => call.action === 'complete'), false, '播放失败不算完成');
    await page.close();
  }
  for (const loseResponse of [false, true]) {
    const { page } = await setup('breathing');
    await page.evaluate(() => window.flow.close());
    let submitted = false;
    let posts = 0;
    let supportStatus = 'requested';
    let activityState = 'joined';
    await page.route('**/api/chat', route => route.fulfill({ json: { ok: true, messages: [
      { id: 'support-card', role: 'consent', card: { title: '专业支持', actions: [{ label: '安排疗愈师', action: 'request_appointment' }, { label: '暂时不用', action: 'dismiss' }], support: submitted ? { status: supportStatus, caseCode: 'MB-TEST', linked: true } : { status: 'offered' } } },
      { id: 'resource-card', role: 'resource', card: { eventId: 'breathing', name: '呼吸', progress: { state: activityState } } },
    ] } }));
    await page.route('**/api/followups', route => route.fulfill({ json: { ok: true, due: null } }));
    await page.route('**/api/appointments', route => {
      assert.equal(route.request().postDataJSON().messageId, 'support-card');
      submitted = true; posts++;
      if (loseResponse) return route.abort('failed');
      return route.fulfill({ json: { ok: true, caseCode: 'MB-TEST' } });
    });
    const enter = () => page.evaluate(async () => {
      const chat = await import('/src/views/chat.js');
      let root = document.querySelector('#view-chat');
      if (!root) { root = document.createElement('div'); root.id = 'view-chat'; document.body.append(root); }
      chat.renderChat(root); await chat.loadChat();
    });
    await enter();
    assert.equal(await page.getByRole('button', { name: '继续活动', exact: true }).count(), 1);
    await page.getByRole('button', { name: '安排疗愈师', exact: true }).click();
    await page.getByRole('button', { name: /已提交 · 等待接单/ }).waitFor();
    await page.reload();
    await enter();
    assert.equal(await page.getByRole('button', { name: /已提交 · 等待接单/ }).isDisabled(), true, '页面重进保持已提交');
    for (const status of ['claimed', 'active', 'done', 'cancelled']) {
      supportStatus = status;
      await enter();
      assert.equal(await page.locator('.consent button').first().isDisabled(), true, `${status} 不能重复提交旧卡`);
    }
    activityState = 'completed';
    await enter();
    assert.equal(await page.getByRole('button', { name: '已完成 · 查看结果', exact: true }).count(), 1);
    activityState = 'declined';
    await enter();
    assert.equal(await page.getByRole('button', { name: '已跳过', exact: true }).isDisabled(), true);
    assert.equal(posts, 1);
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: 活动播放与结算、失败重试、退出清理；对话卡片提交/响应丢失后确认、刷新恢复、接单/结案/取消与活动状态。截图：${screenshots}`);
} finally { await browser.close(); server.close(); }
