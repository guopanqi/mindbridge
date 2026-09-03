# MindBridge 管理后台（console）

工作人员实名入口。与员工端 `mindbridge-app` **分处两个 Cloudflare Pages 项目、两个 origin**，
两端的会话 Cookie 互不可见。

| 入口 | 到哪 | 身份 |
| --- | --- | --- |
| 钉钉工作台点 MindBridge | 员工端树洞 | 匿名 `anon_id` |
| oa.dingtalk.com → 应用管理 | 本项目 | 实名 `staff_id`，带角色与审计 |

同一个人从两个入口进来是两个独立主体。业务系统里没有任何代码路径把它们关联起来
（identity relay 与 staff 库分处两个数据库、两把密钥，且没有任何接口做这种连接）。

## 角色

| 角色 | 看得到 | 授予方式 |
| --- | --- | --- |
| `admin` | 审计记录、生成疗愈师邀请码 | 钉钉管理后台免登后自动获得 |
| `hr_viewer` | 员工关怀看板（仅聚合） | 路演阶段随 admin 一并授予 |
| `healer` | 匿名个案台 | 管理员生成一次性邀请码 |

疗愈师通常不在客户的钉钉组织内，因此走邀请码登录；存储仍落在 staff 库，共用 `staff_id` 与审计，
不额外维护第二套身份体系。

## 不可破坏的边界

- **console 不绑定 `CARE_DB`**（`test/boundaries.test.js` 守卫这一条）。取数只能通过
  `CARE_API_ORIGIN` 上的内部接口，该接口固定输出经过阈值抑制的聚合结果，不接受任意筛选、
  没有个案查询能力。
- **最小样本阈值写死为 10**，企业管理员无法调整。可配置的阈值等于给保护开后门。
- 风险人数一律以区间输出（`1-5` / `6-15` / …），不给精确人数。
- 疗愈师默认只看到匿名个案编号、风险级别和员工主动填写的说明。**查看对话原文必须由员工本人
  在员工端同意**，服务端硬拒绝未授权的读取，且每次查看（含被拒绝的尝试）都写审计。
- 审计条目只记录报表名或匿名个案编号，不含员工原文，也不含 `anon_id`。
- `SSOSecret` 敏感级别等同 AppSecret，泄漏即可伪造管理员身份；只走 Pages Secret。
- SSO `code` 一次性，服务端记录已用 code 的摘要防重放；换取会话后前端立即从地址栏抹掉。

## 部署

```bash
npx wrangler d1 migrations apply mindbridge-staff --remote
npx wrangler pages secret put DINGTALK_SSO_SECRET   --project-name mindbridge-console
npx wrangler pages secret put STAFF_LOOKUP_KEY_V1   --project-name mindbridge-console
npx wrangler pages secret put STAFF_SUBJECT_KEY_V1  --project-name mindbridge-console
npx wrangler pages secret put INTERNAL_SERVICE_TOKEN --project-name mindbridge-console
npm run deploy
curl -s https://mindbridge-console.pages.dev/api/health
```

`INTERNAL_SERVICE_TOKEN` 必须与 `mindbridge-app` 侧完全一致。
`/api/health` 会同时确认 `careBindingAbsent: true`。

钉钉开发者后台「管理后台地址」填：

```text
https://mindbridge-console.pages.dev/
```

钉钉会把一次性 `code` 拼在这个地址后面。

## 本地验证

```bash
npm run check
npx wrangler d1 migrations apply mindbridge-staff --local
npx wrangler pages dev public --port 8790
```

本地无法走真实钉钉免登，可直接向本地 staff 库写入一条 `staff` 与 `staff_sessions` 记录，
再在浏览器里设置 `__Host-mb_staff` Cookie。care 侧需同时在 8788 运行，并把 `.dev.vars` 里的
`CARE_API_ORIGIN` 指向 `http://localhost:8788`。
