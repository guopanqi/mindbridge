# MindBridge 员工端（employee）

> 组织、入口与地址的唯一说明在 `docs/组织-入口-地址.md`，这里不重复。本端只讲部署、配置与验证。

对外地址用 `https://mindbridge-beta.pages.dev/`（旧 `mindbridge-app-8j6` 只保留过渡）。本端支持钉钉免登（企业组织）与邀请链接（公开/临时组织）双入口。

## 对话卡片状态

历史消息只保存卡片内容、用户选择及业务记录关联；读取对话时按匿名主体合并 `resource_events` 和 `appointments` 的最新状态，不把生成时的按钮当作当前状态。
转接提交携带消息 ID，预约、授权与加密卡片关联在同一批事务内写入；同卡重试返回原预约，结案或取消后的旧卡不会重新提交。新预约从「我的」发起。
旧转接卡没有精确关联时只显示当前已有预约，不猜测历史归属；“暂时不用”通过卡片动作接口保存，仍允许用户之后改主意。
活动完成/关闭、重新进入对话和 WebView 回前台都会重新核对卡片。读取失败不擅自恢复提交按钮。此次修复不需要数据库迁移。

同源 Cloudflare Pages 项目。当前已实现：

发布范围为 H5 树洞：钉钉机器人 Channel Adapter、长期记忆摘要和 idle-gap microcompact 尚未实现，不能据此宣称双通道已打通。

对话调用（含契约重试和工具后生成）共享 8 秒预算，前端请求上限为 12 秒，为读写数据库与网络留余量；这不是整条网络链路的硬 SLA。用户消息与回复保留一次 D1 batch 原子写入。前端连接中断后同步历史，但不自动重发，也不把未知结果宣称为发送失败。

- **阶段 1**：钉钉 H5 免登、HMAC 稳定匿名身份、加密身份中继、HttpOnly 匿名会话。
- **阶段 2A**：双入口（钉钉免登 / 邀请链接），新会话播放一次隐私连接动画，随后进入员工端三个一级入口（倾诉树洞 / 匿名广场 / 我的）。
- **阶段 2B**：care D1 业务数据模型（profile、conversation、message、post、resource_event、risk_event、aggregate_event），全部只以 `anon_id` 为主体。
- **阶段 2C 基线**：原确定性规则分诊已经退出运行时，由 Stage 5 Conversation Harness 接管对话状态、回复和只读活动检索；高风险副作用仍由确定性代码与用户确认控制。
- **阶段 2D**：每日情绪打卡、匿名预约（随机个案编号、可取消）、授权与随时撤销、我的历史、清空自己的记录、数据透明说明。

- **阶段 3**：按组织隔离的聚合看板。care 侧 `/api/internal/metrics` 使用固定样本阈值；评审组织可以单独展示本组织的演示数据。
- **阶段 4**：疗愈师个案调度。care 侧新增 `/api/internal/cases`（受理、干预记录、二次授权后才返回对话上下文）与员工侧 `/api/authorizations`（员工本人同意或拒绝）。

管理端在独立项目 `../console` 中，见该目录的 README。

Stage 5 进行中：Conversation Harness 与 Responses API Gateway 已接入，生产模型 Secret 与数据库迁移已配置；真实钉钉闭环仍需验收。钉钉机器人尚未接入。2026-09-04 真实模型回归 32 次对话出现 4 项断言失败，不能宣称全部通过，见 `docs/stage5-production-verification.md`。

## 评审演示数据

评审数据必须归属于明确的公开组织并标记 `data_origin='demo_seed'`。旧的
`seed:generate` / `seed:apply` 产生无组织归属的全局模拟基线，保留作历史工具，
不得用于当前统一业务库。评审组织的生成脚本位于 `scripts/seed-review-*.mjs`。
对话 Harness 实验台可运行 `./lab --help`。

报表默认展示本组织真实使用；有演示数据的公开组织才能切换到本组织演示口径。

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
npx wrangler d1 migrations apply mindbridge-beta-care --remote
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

`DINGTALK_CORP_ID` 是非敏感部署变量。企业组织 ID 由 `DINGTALK_ORG_ID` 决定（默认 `org_enterprise_primary`），钉钉免登首次进入时自动建 enterprise 组织；公开/临时组织走邀请链接，与 CorpId 无关。前端不接受 URL 或请求体传入的组织 ID，避免客户端伪造参数造成匿名身份分裂。

## 本地验证

```bash
npm run check                                   # 构建前端与 SDK bundle + 单元测试
npx wrangler d1 migrations apply mindbridge-beta-care --local
npx wrangler pages dev public
```

本地无法调用钉钉免登，可直接向 care 本地库写入一条 `sessions` 记录，再在浏览器中设置同名 Cookie 来验证员工端。

每次更新 SDK 后先运行 `npm run check`，重新生成 vendored SDK 并执行测试。

## 验收

- 钉钉工作台（配置 `?corpid=$CORPID$`）：成功取得一次性 code、后端换到 userId、写入加密中继映射、建立同源 HttpOnly Cookie。用两个真实成员分别测试，并清除会话后二次进入确认匿名身份稳定。
- 邀请链接（公开/临时组织）：无钉钉授权直接进入，页头显示组织名，URL 中邀请码被移除；跨组织隔离与切换语义按 `docs/组织-入口-地址.md` 与内测手册验收。
