# MindBridge 钉钉 Stream 接收器

常驻 Node **22.16+** 进程（使用 node:sqlite），不是 Pages Function。仅接收本企业机器人私聊文本；不处理群聊，不提供公网回调，不实现第二套身份派生或 Harness。钉钉后台须启用企业应用机器人 Stream 模式并发布。

## 运行

在此目录 `npm ci`，将 `.env.example` 复制为本地 `.env` 后通过安全渠道填入凭据，再 `npm start`。`BOT_RELAY_TOKEN` 与 Cloudflare 相同；`BOT_INBOX_KEY` 必须是独立随机 32 字节 base64 密钥。勿复制身份库加密密钥。保持电脑联网、不休眠，或使用常驻服务器的进程守护。只运行一个进程实例；数据目录必须在持久磁盘上，不可多实例共享。

`npm test` 仅使用临时加密 SQLite 和模拟 HTTP，不连接钉钉。

## 契约

`POST CARE_API_ORIGIN/api/internal/bot`，Bearer relay token，正文 `{msgId,staffId,corpId,robotCode,text}`。服务端验证配置并使用与 H5 一致的身份派生、消息幂等与会话互斥。返回 `{ok:true,messages:[{role,text|card}]}`，不得返回 anonId/userid。机器人只提供 H5 链接；授权、预约确认与活动执行仍需 H5 正常登录和归属校验。eventId 不是凭证。需要 H5 支持登录后恢复 eventId。

## 接收可靠性与隐私

先同步持久化加密 inbox，再调用 SDK ACK；后台逐条调用业务服务。收到、处理中、已生成、已发送分开存储。回复发送失败复用加密生成结果，重启恢复处理中任务。核心请求超时后重试相同 msgId，因此服务端幂等是必需条件。指数退避最多 10 次；失败/过期记录保留待检查，所有记录最多保留 24 小时。超过此窗口无法本地去重，应依赖服务端去重。sessionWebhook 过期后停止，不尝试改成主动推送。

本地输入、staffId、回复和 sessionWebhook 均 AES-256-GCM 加密，文件权限 0600/目录0700；索引仅保存消息摘要、状态、时间与固定错误码。不要打开 SDK debug，也不要记录原始回调、fetch/axios 错误对象或环境变量。磁盘删除不保证物理介质擦除，主机磁盘也应加密；丢失密钥将无法恢复任务。

回推仅允许 `https://oapi.dingtalk.com/robot/sendBySession`，禁止重定向。崩溃发生在钉钉成功接收回复与本地标记 sent 之间，仍可能重复回复；**不承诺 exactly-once**。失败状态当前通过受控本机 SQLite 元数据检查，没有运维面板。真实 Stream/双入口验收尚须真实凭据与工作台配合。

延迟发送已生成回复前，再请求同 msgId 的服务端缓存，收到清空 tombstone（410）立即终止。清空与实际发送仍存在不可原子化的时间窗口；清空 H5 **不等于撤回已经发送的钉钉聊天消息**。超过 800 字或非文字私聊只保存固定说明，不保存过长正文/附件，不调用 Harness。失败、过期、清空终态写元数据日志（摘要 id、state），可据此发现未发送任务。

## SDK 来源

固定 `dingtalk-stream@2.1.6-beta.1`（当前 npm 发布版本，beta 需真实验收），核对官方 [示例](https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs/blob/main/example/index.ts) 和 [客户端源码](https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs/blob/main/src/client.ts)：`DWClient`、`TOPIC_ROBOT`、`registerCallbackListener`、`socketCallBackResponse`。没有实现 HTTP webhook 的 timestamp/sign 校验，因为当前入口由 SDK 使用应用凭据建立 Stream 连接。
