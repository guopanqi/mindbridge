# 路演视频录制流水线

目标：把 `docs/路演视频剧本.md` 里的四段视频（绿灯篇 / 黄灯篇 / 红灯篇 / HR 看板篇）录成可嵌进 PPT 的 MP4。
原则：**跑的是真实前后端**（本地 wrangler + 本地 D1），只把模型回复换成剧本桩，所以每次重录逐句一致，UI 永远是当前代码的样子。

## 一次性准备

```bash
npm i                      # 根目录已含 playwright
npx playwright install chromium
node scripts/demo-video/frames.mjs      # 生成 iPhone / MacBook 样机外框 PNG → out/assets/

# 活动内容导入本地库（黄灯篇需要线下的「午间正念工作坊」，绿灯篇的呼吸也多了一道收尾提问）
cd apps/employee && node scripts/import-activities.mjs --local --apply && cd ../..
```

本地库里要有演示会话（一次即可，之后一直有效）：

```bash
cd apps/employee
D=$(node -e "console.log(require('crypto').createHash('sha256').update('devtoken123').digest('base64url'))")
npx wrangler d1 execute mindbridge-care --local --command "INSERT OR REPLACE INTO sessions (session_digest, anon_id, expires_at, created_at, last_seen_at) VALUES ('$D','anon_devtest_01',$(( $(date +%s)*1000 + 86400000*30 )),$(( $(date +%s)*1000 )),$(( $(date +%s)*1000 )))"
```

## 每次录制

1. 在 Claude 的 Browser 面板（或任意方式）启动 `.claude/launch.json` 里的两个服务：
   - `model-stub`（8799）：`scripts/demo-video/model-stub.mjs`，剧本桩。
   - `employee-demo`（8788）：员工端，`MODEL_API_ORIGIN` 指向桩。**不要同时开 `employee`**，端口一样。
   - 红灯篇与 HR 看板篇还要 `console`（8789）。
2. 录制，按顺序（绿 → 黄 → 红 共用一个演示账号，绿灯篇开头会 `resetDemoEmployee()` 清库）：
   - `node scripts/demo-video/record-green.mjs`（约 4 分钟，呼吸 3 分钟真实跑完）
   - `node scripts/demo-video/record-yellow.mjs`（黄灯篇会把 `intervention_matrix` 里「低落」的 L2 指到 `mindfulness-workshop`）
   - `node scripts/demo-video/record-red.mjs`（不带参数录三段；也可 `record-red.mjs 1|2|3` 单独重录某一段）
   - `node scripts/demo-video/record-hr.mjs`
3. 合成：
   ```bash
   # 绿灯篇：呼吸第一轮（10 秒）保留实时，其余 17 轮 25 倍速。两个秒数取自录制日志里的
   # 「G9 breathing round1 done」和「G9 breathing end」，--dark-from 取「G2 boot」。
   node scripts/demo-video/assemble.mjs green phone-2140 --speed 41.5:215.0:25 --dark-from 2.8
   node scripts/demo-video/assemble.mjs yellow phone-1218 --dark-from 0
   node scripts/demo-video/assemble.mjs red1 phone-2341 --dark-from 0
   node scripts/demo-video/assemble.mjs red2 phone-2341            # 疗愈师台是浅色底，不加 --dark-from
   node scripts/demo-video/assemble.mjs red3 phone-2341 --dark-from 0
   node scripts/demo-video/concat.mjs red red1 red2 red3
   node scripts/demo-video/assemble.mjs HR laptop
   ```
   产物：`out/green.mp4`、`out/yellow.mp4`、`out/red.mp4`（均 1290×2652）、`out/HR.mp4`。

## 改剧本 / 改文案改哪里

| 想改 | 文件 |
| --- | --- |
| AI 每轮说什么、什么时候推活动、什么时候进红色 | `model-stub.mjs` 的 `SCRIPT`（按用户消息子串匹配，三篇合在一个表里） |
| 员工输入什么、点什么、每步停多久 | `record-green.mjs` / `record-yellow.mjs` / `record-red.mjs` |
| 点击涟漪样式、打字速度、状态栏时间 | `lib.mjs`（`INIT_SCRIPT`、`tap`、`typeSlow`）、`frames.mjs` |
| 钉钉工作台那一屏 | `pages/workbench.html`（MindBridge 图标用 `pages/icon.png`） |
| 活动卡推荐哪个活动 | 由 `intervention_matrix` 决定：绿色走 L1（`紧张`→`breathing`），黄色走 L2（`低落`→`mindfulness-workshop`） |
| 线下工作坊的时间地点、合照插画 | `apps/employee/content/activities/mindfulness-workshop.json`、`apps/employee/public/media/offline-workshop.svg` |

## 已知的坑

- Playwright 自带录像只按 CSS 像素取帧，放大会糊；这里用连续截图（约 17 fps），帧时长按真实时间戳写进 concat 列表。
- 第一张截图在 `about:blank` 上会挂住，所以 `screenshot` 带 `timeout: 1500`，开头损失 1.5 秒无所谓。
- 录制中途用 `wrangler d1 execute` 改库会和正在跑的 wrangler 抢 sqlite 锁，偶尔把 dev 服务弄挂；所以所有改库操作都合成一条命令执行，挂了就重启 `employee-demo`。
- 边带 `scale` 会把像素宽高比带歪，`assemble.mjs` 结尾必须 `setsar=1`，否则 QuickTime 里是一条扁带。
- 手机视口是 390×751（不是 844）：状态栏 59 和底部指示条 34 在合成时用内容边缘色补回来，外框 PNG 再盖上时间和图标。

## 交付

四段合成完后跑 `node scripts/demo-video/deliver.mjs`，把剧本 + 绿/黄/红/HR 复制到 `docs/路演视频成品/`（面向人的目录，进 git）。`out/` 只放过程产物。
