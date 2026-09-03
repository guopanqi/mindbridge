# MindBridge 阶段 1：真实钉钉匿名登录

这是一个独立于 `mindbridge-demo` 的同源 Cloudflare Pages 项目。它只实现阶段 1：钉钉 H5 免登、HMAC 稳定匿名身份、加密身份中继与 HttpOnly 匿名会话。

## 安全边界

- `DINGTALK_CLIENT_ID` 是公开的 AppKey / client_id，可由 `/api/config` 返回。
- `DINGTALK_APP_SECRET`、四个匿名化/加密密钥只通过 Pages Secrets 配置，绝不提交。
- `CARE_DB` 与 `IDENTITY_DB` 是两个独立 D1 数据库。
- API 不返回 `userId`、`anonId`、access token 或身份中继数据。
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
```

`IDENTITY_ENCRYPTION_KEY_V1` 必须是 32 字节随机值的 base64url 编码。HMAC 密钥应至少为 32 个随机字符。当前会话采用高熵随机 token，care 库仅保存其 SHA-256 摘要。

`DINGTALK_CORP_ID` 是非敏感部署变量，固定为测试企业 CorpId。前端只使用服务端配置的 CorpId，不接受 URL 或请求体传入的组织 ID，避免客户端伪造参数造成匿名身份分裂。

每次更新 SDK 后先运行 `npm run check`，重新生成 vendored SDK 并执行测试。

## 验收

只在钉钉工作台（配置 `?corpid=$CORPID$`）中测试：成功取得一次性 code、后端换到 userId、写入加密中继映射、建立同源 HttpOnly Cookie。用两个真实成员分别测试，并清除会话后二次进入确认匿名身份稳定。
