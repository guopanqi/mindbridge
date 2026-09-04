# 活动、Stream 与支持链路交付记录

日期：2026-09-04。此记录区分代码测试、远端部署与真实用户验收，不用本地模拟代替真机通过。

## 已实现

- 活动最终内容 JSON + Schema 校验、内容版本/哈希、幂等导入报告。首批 6 个文字活动；不做 CMS。参与开始时冻结内容快照，之后改标题、内容、停用均不破坏已开始的活动。
- 目录、推荐、HR 配置以 activityId 关联，不以活动标题关联。HR 可启停活动及按情绪配置 L1/L2 活动，推荐读时再次检查可用性与等级。
- H5 与 Stream 共享匿名身份派生和 conversation service；实际 channel 进入 Harness。每个匿名主体有数据库互斥与写入栅栏；机器人 msgId 缓存与消息/state 一次原子落库，清空后留下无正文 tombstone。
- Stream 使用官方 Node SDK，私聊限定、企业/机器人校验、加密持久 inbox、ACK 后处理、重试与过期终止。只发 H5 链接，预约/授权仍在 H5 由用户按钮确认。它需要常驻 Node，不是 Pages 后台定时任务。
- 预约 requested/claimed/active/done 均能撤销；取消后疗愈师列表不再显示，后续动作不能复活。上下文必须由指定疗愈师申请、员工二次批准、在有效期内读取；撤销含历史 stale grant 也拒绝。列表不预载对话正文，员工侧显示 active/done。
- HR 默认 live，demo_seed 可切换，禁止混样凑 k=10；低样本人数也不泄漏。不能验证独立参与者的真实事件/情绪/风险计数保守隐藏，UI 显示不予展示而非 0。真实活动参与、完成率各自按子群人数检查，不只检查推荐人数。

## 测试

员工端 70/70、控制台 8/8、Stream 6/6。Luna xhigh 独立执行支持/HR 验收，专项 8/8；包含隔离 Wrangler D1 + HTTP console→care，1/4/5/9/10 人阈值，混合来源，MB 生命周期、取消与上下文撤销。详见 [验收记录](support-hr-acceptance.md)。模型在单元测试中模拟，不能据此声称真实模型/Stream 成功。

## 已执行的远端变更

- CARE 迁移 0017、0018、0019 成功。
- `node scripts/import-activities.mjs --remote --apply`：6 个新增活动；读取确认 6 个 enabled + content_available。
- `BOT_RELAY_TOKEN` 已通过 stdin 上传为生产 Secret；robotCode 使用用户确认的应用编号。无密钥进入源码。
- 员工端部署 `72dc574b.mindbridge-app-8j6.pages.dev`，控制台部署 `61ac1356.mindbridge-console.pages.dev`；canonical 地址不变。
- 部署包含当前工作区既有 Harness/UI 调整，没有回退其他协作者的改动；尚未创建 Git 提交。

## 未通过 / 待用户输入

Stream 首次连接返回 `401 authFailed`；用户更新本地凭据后，2026-09-04 09:37（Asia/Singapore）重启已得到 SDK `connect success` 与 `stream_connected`。连接问题已解除，仍需真实用户私聊验证收回、打开 H5 验证同一历史。电脑需保持联网、不休眠，或迁到常驻服务器。

本地 INTERNAL_SERVICE_TOKEN 请求生产内部指标接口返回 401，不据此判断线上 console 的服务令牌失效；尚未替换生产内部令牌，也未伪造线上 HR 会话。需真实 HR 登录验证线上代理与展示。当前远端 mood_checkins 无记录，不能声称已用真实打卡账号验证 1 人遮蔽。

真实疗愈师浏览器端与员工端共同完成预约、闭环、撤销仍需真机复验。已经看过或已经发到钉钉的内容无法通过撤销访问权远程收回。

## 后续内容维护

编辑 `apps/employee/content/activities/<id>.json` 并增加 contentVersion → `node scripts/import-activities.mjs --check` → `--remote` 查看计划 → `--remote --apply` 执行。HR enabled 不被导入覆盖；资源配置位于 `content/resource-activities.json`。新增 stage 必须提供可理解的 fallbackHint，不能静默跳过未知交互。

长期记忆压缩、Episode/Open Loops 生命周期、自动主动关怀不属于本次交付。不要宣称已完成。
