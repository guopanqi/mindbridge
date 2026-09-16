# 路演视频录制流水线

目标：把 `docs/路演视频剧本.md` 里的三段视频录成可嵌进 PPT 的 MP4。
原则：**跑的是真实前后端**（本地 wrangler + 本地 D1），只把模型回复换成剧本桩，所以每次重录逐句一致，UI 永远是当前代码的样子。

## 一次性准备

```bash
npm i                      # 根目录已含 playwright
npx playwright install chromium
node scripts/demo-video/frames.mjs      # 生成 iPhone / MacBook 样机外框 PNG → out/assets/
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
   - 视频 B/C 还要 `console`（8789）。
2. 录制：`node scripts/demo-video/record-a.mjs`（约 2 分 15 秒，呼吸圆真实跑完）。
   录制脚本开头会 `resetDemoEmployee()` 清掉演示账号的所有记录。
3. 合成：`node scripts/demo-video/assemble.mjs A phone-941 --speed 32.5:101.5:6`
   `--speed from:to:factor` 用录制日志里打印的 mark 秒数，把呼吸圆那段压缩。
   产物：`scripts/demo-video/out/A.mp4`（1290×2652，H.264，30 fps）。

## 改剧本 / 改文案改哪里

| 想改 | 文件 |
| --- | --- |
| AI 每轮说什么、什么时候推活动、什么时候进红色 | `model-stub.mjs` 的 `SCRIPT`（按用户消息子串匹配） |
| 员工输入什么、点什么、每步停多久 | `record-a.mjs` |
| 点击涟漪样式、打字速度、状态栏时间 | `lib.mjs`（`INIT_SCRIPT`、`tap`、`typeSlow`）、`frames.mjs` |
| 钉钉工作台那一屏 | `pages/workbench.html` |
| 活动卡推荐哪个活动 | 由 `intervention_matrix` 决定：桩里 `setEmotion:'焦虑'` → `breathing` |

## 已知的坑

- Playwright 自带录像只按 CSS 像素取帧，放大会糊；这里用连续截图（约 17 fps），帧时长按真实时间戳写进 concat 列表。
- 第一张截图在 `about:blank` 上会挂住，所以 `screenshot` 带 `timeout: 1500`，开头损失 1.5 秒无所谓。
- 录制中途用 `wrangler d1 execute` 改库会和正在跑的 wrangler 抢 sqlite 锁，偶尔把 dev 服务弄挂；所以所有改库操作都合成一条命令执行，挂了就重启 `employee-demo`。
- 边带 `scale` 会把像素宽高比带歪，`assemble.mjs` 结尾必须 `setsar=1`，否则 QuickTime 里是一条扁带。
- 手机视口是 390×751（不是 844）：状态栏 59 和底部指示条 34 在合成时用内容边缘色补回来，外框 PNG 再盖上时间和图标。
