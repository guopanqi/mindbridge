# 活动内容维护

此目录每个 JSON 是最终活动内容，不使用 prototype engine。文件名必须等于稳定活动 ID。
`../activity.schema.json` 定义文档结构；新 stage 必须提供可执行的 `fallbackHint`。

从 employee 目录执行：

```sh
node scripts/import-activities.mjs --check
node scripts/import-activities.mjs --local
node scripts/import-activities.mjs --local --apply
```

生产必须显式改用 `--remote`；不加 `--apply` 只比较并报告，不写库。
先执行迁移 0017。新建文件即增加活动；修改任何内容须递增 `contentVersion`。
删除文件不会删除线上记录，停用内容应改 `available: false` 并升版本。

`available` 属于内容维护；数据库 `enabled` 属于 HR，导入不会覆盖。
资源目录映射在 `../resource-activities.json`：`name` 是现有 HR 目录主键，
`activityId` 显式指向内容 ID。修改活动标题不必修改资源目录名；不可按标题自动推断。

开始参与时冻结内容快照，后续内容更新或目录停用不破坏已经开始的体验。
新开始/新推荐要求内容可用、活动启用及关联资源目录启用同时成立。
当前音视频是本地静音模拟片段；配置真实素材时使用下述 media.src。没有真实线下场次。

## 统一的体验协议

所有线上活动采用「开始 → 连续体验 → 结果与可选评价」。开始按钮只有一次。
呼吸计时结束、媒体 ended、选择题选定答案，均自动推进；最后一段完成后立即写入完成记录。
评价通过独立的 rate 接口选填，关闭结算页也不影响已完成记录；不评分不是零分。
书写保留一个“写好了/完成书写”按钮，这是提交该次输入，不是额外确认页。
选择题的结果展示所选答案及配置的 reflection；没有计分规则时不会生成分数或诊断。
答案与书写不上传，刷新/退出后不保留；服务端只存进度、完成状态、可选帮助度。

stages 是连续体验的内容序列，不是必须点击“下一步”的分页清单：

- breath：cycle + rounds 驱动单段自动动画。三分钟默认 4 秒吸气、6 秒呼气、18 轮。
- choice：一项即一道单选题；选定自动进入下一题，最后一题进入结算。需要几题就配置几项。
- media：presentation 为 audio/video；有 src 时用真实播放器，无 src 时必须提供 segments 作为模拟字幕和时长。
- input/entries：书写输入；只在用户确认写好时继续。
- 旧版 scan/timer 继续使用自动播放器；prompt/note 合并为说明，不再独占确认页。

真实视频示例（路径对应部署在 public/media 下的素材）：

```json
{"type":"media","presentation":"video","title":"观看引导","src":"/media/guide.mp4"}
```

可使用 HTTPS 素材地址，但还须在部署环境的 CSP media-src 中明确允许对应域名。
播放器尝试自动播放；浏览器阻止时显示“点击播放”，加载失败时提供重试，不把失败当完成。
模拟播放器支持暂停、拖动、重播；呼吸和模拟播放器切后台自动暂停，回前台恢复，手动暂停不会被自动恢复。关闭或换活动会释放计时器和媒体资源。

扩展新类型在 src/views/activity-engines.js 注册函数，并同步校验器：
函数接收 (stage, { complete, cleanup, isLast })，返回 DOM 节点；自然结束调用 complete(result?)，
所有计时器、播放器及事件监听的释放函数交给 cleanup(fn)。引擎不自行写 API。
外层统一做一次性结束保护、顺序保存、错误恢复与结算；新类型仍须为旧客户端提供 fallbackHint。
ACTIVITY_PRESENTATION 配置沉浸式布局、简短提示和收尾文案；核心渲染优先，长说明在下方折叠，活动结果与选填反馈分别显示。
内容更新不改写已开始的快照：已有体验仍使用其原内容序列，新开始的体验使用新版本。

浏览器回归（安装 Playwright 后执行，或用 PLAYWRIGHT_MODULE 指向现有安装）：

```sh
node scripts/qa-activity-flow.mjs
```

覆盖三分钟计时、两种动态偏好下吸气放大与呼气缩小、前后台恢复与手动暂停、小屏首屏控制、自动播放、选择自动推进、评价选填、按序保存与失败重试、退出清理。

导入是运维操作，禁止并发导入。全部文件先校验、版本预检，写入后再次比对哈希；
不承诺整个 CLI SQL 文件的全有或全无发布。中断后可以重跑，同版本同内容不改写。
不要添加 BEGIN/COMMIT：D1 官方导入文档要求移除显式事务语句。
https://developers.cloudflare.com/d1/best-practices/import-export-data/
