# MindBridge：企业内匿名员工支持系统

同源 Cloudflare Pages 项目。当前已实现：

发布范围为 H5 树洞：钉钉机器人 Channel Adapter、长期记忆摘要和 idle-gap microcompact 尚未实现，不能据此宣称双通道已打通。

对话调用（含契约重试和工具后生成）共享 8 秒预算，前端请求上限为 12 秒，为读写数据库与网络留余量；这不是整条网络链路的硬 SLA。用户消息与回复保留一次 D1 batch 原子写入。前端连接中断后同步历史，但不自动重发，也不把未知结果宣称为发送失败。

- **阶段 1**：钉钉 H5 免登、HMAC 稳定匿名身份、加密身份中继、HttpOnly 匿名会话。
- **阶段 2A**：启动即自动免登，新会话播放一次隐私连接动画，随后进入员工端三个一级入口（倾诉树洞 / 匿名广场 / 我的）。
- **阶段 2B**：care D1 业务数据模型（profile、conversation、message、post、resource_event、risk_event、aggregate_event），全部只以 `anon_id` 为主体。
- **阶段 2C 基线**：原确定性规则分诊已经退出运行时，由 Stage 5 Conversation Harness 接管对话状态、回复和只读活动检索；高风险副作用仍由确定性代码与用户确认控制。
- **阶段 2D**：每日情绪打卡、匿名预约（随机个案编号、可取消）、授权与随时撤销、我的历史、清空自己的记录、数据透明说明。

- **阶段 3**：HR 聚合看板与演示数据。care 侧新增 `/api/internal/metrics`（服务令牌鉴权、固定输出阈值抑制结果）、`tenant_profile`、可重复生成与重置的演示 seed 数据。
- **阶段 4**：疗愈师个案调度。care 侧新增 `/api/internal/cases`（接单、干预记录、二次授权后才返回对话上下文）与员工侧 `/api/authorizations`（员工本人同意或拒绝）。

管理端在独立项目 `../console` 中，见该目录的 README。

Stage 5 进行中：Conversation Harness 与 Responses API Gateway 已接入，生产模型 Secret 与数据库迁移已配置；真实钉钉闭环仍需验收。钉钉机器人尚未接入。2026-09-04 真实模型回归 32 次对话出现 4 项断言失败，不能宣称全部通过，见 `docs/stage5-production-verification.md`。

## 演示数据

```bash
npm run seed:generate      # 确定性生成，可反复彩排
npm run seed:apply         # 灌入远端 care 库，全部带 data_origin='demo_seed'
npm run seed:reset         # 只清除演示数据，不影响 data_origin='live'
./lab --help               # 对话 Harness 实验台（真实模型，见 docs/stage5-conversation-harness.md）
```

演示数据包含 200 人规模、90 天趋势、广场帖子与活动效果，**不含任何真实姓名、工号、联系方式或可识别案例**，也不伪造钉钉考勤、病假或聊天接口返回。看板顶部持续标注"模拟基线 + 当前演示事件"。

## 阶段 2 验收清单

- 从钉钉进入无登录按钮；新会话一次短动画，老会话直达；刷新与重开行为一致。
- 倾诉 → 情绪识别 → 绿色自助资源；累积信号升级为黄色。
- 危机表达 → 红色 → 停止普通推荐 → 知情同意卡片 + 紧急热线 → 同意后生成个案编号。
- 广场发帖、抱抱、回复；攻击性表达与手机号/邮箱/证件号被服务端拦截。
- 情绪打卡每天只保留最后一次；预约可取消；授权可撤销；倾诉记录可清空。
- care D1 中 `messages` / `posts` / `post_replies` 的正文字段必须是密文。

## 代码结构

```text
src/                 员工端前端模块，经 esbuild 打包为 public/app.js
functions/api/       Pages Functions；_lib 为服务层，wall/ chat/ 为业务 API
functions/api/_lib/harness/     对话上下文、指令、模型网关、工具与安全降级
migrations/identity/ 身份中继库（加密映射、alias）
migrations/care/     业务库（会话与员工业务数据）
```

## 安全边界

- `DINGTALK_CLIENT_ID` 是公开的 AppKey / client_id，可由 `/api/config` 返回。
- `DINGTALK_APP_SECRET`、四个匿名化/加密密钥只通过 Pages Secrets 配置，绝不提交。
- `MODEL_API_KEY` 只通过 Pages Secret 配置；`MODEL_API_ORIGIN` 与 `MODEL_NAME` 是非敏感部署变量。
- `CARE_DB` 与 `IDENTITY_DB` 是两个独立 D1 数据库。
- API 不返回 `userId`、`anonId`、access token 或身份中继数据；前端展示名由 `anon_id` 单向派生。
- 员工倾诉原文、广场帖子与回复在 care D1 中只以 AES-GCM 密文保存，AAD 绑定所属会话/帖子，密钥版本随行。
- 风险规则命中说明只写入 `risk_events`（供审计与聚合），不返回给员工前端。
- 钉钉 H5 bridge 由官方 `dingtalk-jsapi` npm 包构建并固定在 `public/vendor/`，避免现场依赖外部 CDN；跨端调用统一使用 `dd.requestAuthCode`。
- H5 免登 code 按企业内部应用链路交换：应用 access token → `topapi/v2/user/getuserinfo`，不再误用 OAuth 用户授权接口。

## 初始化

```bash
cd apps/employee
npx wrangler d1 migrations apply mindbridge-care --remote
npx wrangler d1 migrations apply mindbridge-identity --remote
```

在创建 Pages 项目并部署后写入下列 Secret：

```text
DINGTALK_APP_SECRET
ANON_HMAC_KEY_V1
SUBJECT_LOOKUP_KEY_V1
IDENTITY_ENCRYPTION_KEY_V1
CARE_CONTENT_KEY_V1
MODEL_API_KEY
```

`IDENTITY_ENCRYPTION_KEY_V1` 与 `CARE_CONTENT_KEY_V1` 都必须是 32 字节随机值的 base64url 编码，且必须是彼此独立的两把密钥。HMAC 密钥应至少为 32 个随机字符。当前会话采用高熵随机 token，care 库仅保存其 SHA-256 摘要。

`DINGTALK_CORP_ID` 是非敏感部署变量，固定为测试企业 CorpId。前端只使用服务端配置的 CorpId，不接受 URL 或请求体传入的组织 ID，避免客户端伪造参数造成匿名身份分裂。

## 本地验证

```bash
npm run check                                   # 构建前端与 SDK bundle + 单元测试
npx wrangler d1 migrations apply mindbridge-care --local
npx wrangler pages dev public
```

本地无法调用钉钉免登，可直接向 care 本地库写入一条 `sessions` 记录，再在浏览器中设置同名 Cookie 来验证员工端。

每次更新 SDK 后先运行 `npm run check`，重新生成 vendored SDK 并执行测试。

## 验收

只在钉钉工作台（配置 `?corpid=$CORPID$`）中测试：成功取得一次性 code、后端换到 userId、写入加密中继映射、建立同源 HttpOnly Cookie。用两个真实成员分别测试，并清除会话后二次进入确认匿名身份稳定。
