# MindBridge：企业内匿名员工支持系统

同源 Cloudflare Pages 项目。当前已实现：

- **阶段 1**：钉钉 H5 免登、HMAC 稳定匿名身份、加密身份中继、HttpOnly 匿名会话。
- **阶段 2A**：启动即自动免登，新会话播放一次隐私连接动画，随后进入员工端三个一级入口（倾诉树洞 / 匿名广场 / 我的）。
- **阶段 2B**：care D1 业务数据模型（profile、conversation、message、post、resource_event、risk_event、aggregate_event），全部只以 `anon_id` 为主体。
- **阶段 2C 基线**：服务端确定性规则分诊引擎（`functions/api/_lib/triage.js`），green/yellow/red 三级，红色走知情同意流程并展示可拨打的紧急热线，不做医学诊断，不谎称已代为联系任何人。外部大模型延后到阶段 3/4，接入点固定在 `responder.js`。
- **阶段 2D**：每日情绪打卡、匿名预约（随机个案编号、可取消）、授权与随时撤销、我的历史、清空自己的记录、数据透明说明。

尚未实现：钉钉机器人（3）、疗愈师接单与 HR 看板（4）、演示 seed 数据（`data_origin='demo_seed'` 字段已就位，数据未灌入）。

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
functions/api/_lib/triage-data.js   词典与话术片段，逐行取自原型 Demo
migrations/identity/ 身份中继库（加密映射、alias）
migrations/care/     业务库（会话与员工业务数据）
```

## 安全边界

- `DINGTALK_CLIENT_ID` 是公开的 AppKey / client_id，可由 `/api/config` 返回。
- `DINGTALK_APP_SECRET`、四个匿名化/加密密钥只通过 Pages Secrets 配置，绝不提交。
- `CARE_DB` 与 `IDENTITY_DB` 是两个独立 D1 数据库。
- API 不返回 `userId`、`anonId`、access token 或身份中继数据；前端展示名由 `anon_id` 单向派生。
- 员工倾诉原文、广场帖子与回复在 care D1 中只以 AES-GCM 密文保存，AAD 绑定所属会话/帖子，密钥版本随行。
- 风险规则命中说明只写入 `risk_events`（供审计与聚合），不返回给员工前端。
- 钉钉 H5 bridge 由官方 `dingtalk-jsapi` npm 包构建并固定在 `public/vendor/`，避免现场依赖外部 CDN；跨端调用统一使用 `dd.requestAuthCode`。
- H5 免登 code 按企业内部应用链路交换：应用 access token → `topapi/v2/user/getuserinfo`，不再误用 OAuth 用户授权接口。

## 初始化

```bash
cd mindbridge-app
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
