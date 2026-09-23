// 黄灯篇 · 风险预警：持续失眠 → 线下午间正念工作坊报名 → 三天后参加（合照）→ 两天后回访闭环。
// 前置：model-stub 与 employee-demo 已启动；活动内容已导入本地库（见 README 的黄灯篇准备）。
// 合成：node scripts/demo-video/assemble.mjs yellow phone-941 --dark-from 0
import { ANON_ID, EMPLOYEE, d1, dismissKeyboard, interlude, launch, resetDemoEmployee, setEmployeeCookie, sleep, tap, typeSlow, waitReply } from './lib.mjs';

resetDemoEmployee();
// 黄色走干预矩阵：情绪「低落」+ yellow → L2 活动，指向线下工作坊。
d1(`UPDATE intervention_matrix SET enabled=1, l2_activity_id='mindfulness-workshop' WHERE emotion='低落'`);

const { context, page, mark, finish } = await launch('phone', 'yellow');
await setEmployeeCookie(context);
await page.goto(`${EMPLOYEE}/`);
await page.locator('#app:not([hidden])').waitFor({ timeout: 20000 });
await sleep(1400);
mark('Y1 chat');

// Y2 第一轮
await typeSlow(page, '.composer textarea', '连着两周没睡好了，早上醒来完全不想去公司，整个人很空');
await tap(page, '.composer .send');
mark('Y2 sent 1');
await waitReply(page);
await sleep(2600);

// Y3 第二轮
await typeSlow(page, '.composer textarea', '活能干，但不知道在干嘛，有时候想干脆换个地方算了');
await tap(page, '.composer .send');
mark('Y3 sent 2');
await waitReply(page);
await sleep(2600);

// Y4 员工自己问隐私 → AI 回答 + 线下工作坊活动卡
await typeSlow(page, '.composer textarea', '这个……公司那边看得到吗');
await tap(page, '.composer .send');
mark('Y4 sent privacy');
await waitReply(page);
await page.locator('.card.resource button').waitFor({ timeout: 20000 });
await sleep(3400);
mark('Y5 workshop card');

// Y6 报名（线下活动按钮是「我要报名」）
await dismissKeyboard(page);
await sleep(700);
await tap(page, '.card.resource button');
await page.locator('.act-sheet .act-cta').waitFor();
await sleep(2400);
mark('Y6 activity sheet');
await tap(page, '.act-sheet .act-cta');
await page.getByText('已报名').first().waitFor({ timeout: 15000 });
await sleep(3000);
mark('Y7 booked');
await tap(page, '.act-head button, .act-sheet .act-close');
await page.locator('.act-overlay').waitFor({ state: 'hidden' }).catch(() => {});
await sleep(800);

// Y8 回对话说一句，AI 收尾
await typeSlow(page, '.composer textarea', '我已经报名了，周五中午过去');
await tap(page, '.composer .send');
await waitReply(page);
await sleep(1500);
await dismissKeyboard(page);
await sleep(1500);
mark('Y8 confirmed');

// Y9 三天后：直接进入真实发生的线下场景，不把“我已参加”这种录制辅助操作拍进视频。
await interlude(page, '三天后 · 周五');
await page.goto(`file://${new URL('./pages/workshop-friday.html', import.meta.url).pathname}`);
await page.locator('.scene img').waitFor({ timeout: 15000 });
await sleep(6500);
mark('Y9 workshop scene');

// 画面之外把已报名活动推进为已完成，并建立两天后的回访；这些是录制夹具，不是用户操作。
const completedAt = Date.now();
d1(`UPDATE resource_events SET state='completed', helpfulness='helpful', feedback_at=${completedAt}, updated_at=${completedAt} WHERE anon_id='${ANON_ID}' AND activity_id='mindfulness-workshop' AND state='joined'; INSERT OR REPLACE INTO follow_ups (id, anon_id, resource_event_id, activity_id, activity_title, question, due_at, state, created_at, data_origin) SELECT 'fup_demo_video_yellow', '${ANON_ID}', id, 'mindfulness-workshop', '午间正念工作坊', '上周五那场正念工作坊之后，这两天晚上睡得怎么样？', ${completedAt - 1000}, 'scheduled', ${completedAt}, 'live' FROM resource_events WHERE anon_id='${ANON_ID}' AND activity_id='mindfulness-workshop' ORDER BY created_at DESC LIMIT 1`);

// Y10 又过两天：回到 APP 才出现回访卡。
await interlude(page, '又 过 两 天');
await page.goto(`${EMPLOYEE}/`);
await page.locator('.card.followup').waitFor({ timeout: 20000 });
await sleep(2600);
mark('Y13 followup');
await tap(page, page.locator('.card.followup .card-actions button').first());
await sleep(2200);

// Y14 最后一轮：AI 问下一场要不要提醒
await typeSlow(page, '.composer textarea', '这两天睡得比之前好一点了');
await tap(page, '.composer .send');
await waitReply(page);
await sleep(1500);
await dismissKeyboard(page);
await sleep(2600);
mark('Y14 end');

await finish();
