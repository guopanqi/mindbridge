# MindBridge 管理后台（console）

> 组织、入口与地址的唯一说明在 `docs/组织-入口-地址.md`，这里不重复。本端只讲角色、边界、部署与验证。

工作人员实名入口。与员工端（Pages 项目 `mindbridge-beta`，对外地址 `https://mindbridge-beta.pages.dev/`）**分处两个 Cloudflare Pages 项目、两个 origin**，
两端的会话 Cookie 互不可见。

| 入口 | 到哪 | 身份 |
| --- | --- | --- |
| 钉钉工作台点 MindBridge | 员工端树洞 | 匿名 `anon_id` |
| oa.dingtalk.com → 应用管理 | 本项目（企业组织） | 实名 `staff_id`，会话绑定企业组织 |
| 公开组织管理链接 `/?orgKey=...` | 本项目（公开组织） | 实名 `staff_id`，会话绑定该公开组织 |
| 内部测试入口 `/?debugKey=...` | 本项目（指定内测组织） | 独立 `internal_tester` 会话，只看指定组织 |

同一个人从两个入口进来是两个独立主体。业务系统里没有任何代码路径把它们关联起来
（identity relay 与 staff 库分处两个数据库、两把密钥，且没有任何接口做这种连接）。

## 角色

| 角色 | 看得到 | 授予方式 |
| --- | --- | --- |
| `admin` | 企业端审计记录；管理本组织活动与推荐配置 | 钉钉管理后台免登或公开组织管理链接 |
| `hr_viewer` | 员工关怀看板（仅聚合） | 随对应组织管理员权限授予 |
| `internal_tester` | 指定内测组织的单人样本真实报表 | 系统侧 `INTERNAL_TEST_KEY`，与组织管理链接分开 |
| `healer` | 跨组织匿名个案台 | 系统侧预置唯一登录名，在 `/healer/` 输入登录名 |

公开组织管理链接进入后会话绑定该组织：管理者可查看本组织报表并调整本组织活动配置；不开放企业审计台、钉钉考勤或审批数据。

内部测试入口由 `INTERNAL_TEST_ORG_ID` 固定组织、`INTERNAL_TEST_KEY` 作为 Pages Secret 签发；登录后会话只有 `hr_viewer,internal_tester`，没有配置权限。内部测试员看本组织真实报表时最小样本为 1，页面标明测试视图并记录独立审计动作；普通组织管理入口仍按 10 人门槛。入口原码只保存在本地忽略的 `.dev.vars` 和 Pages Secret，不写入仓库。

疗愈师通常不在客户的钉钉组织内。内测时由系统侧运行
`node scripts/provision-healer.mjs "登录名" "资质说明" --remote` 创建全局账号；疗愈师在
`https://mindbridge-console.pages.dev/healer/` 输入登录名即可进入，无邀请码、密码或专属链接。
账号仍落在 staff 库，共用 `staff_id` 与审计。登录名必须唯一；现有「李佳」账号已预置。
评审聚合页使用 `?login=李佳` 自动进入；这个参数只是公开登录名，不是专用密钥。
内测期新提交的红色支持个案默认分配给李佳，其他疗愈师账号不能受理。

## 不可破坏的边界

- **console 不绑定 `CARE_DB`**（`test/boundaries.test.js` 守卫这一条）。取数只能通过
  `CARE_API_ORIGIN` 上的内部接口，该接口固定输出经过阈值抑制的聚合结果，不接受任意筛选、
  没有个案查询能力。
- **普通管理入口最小样本阈值固定为 10**，企业和公开组织管理员无法调整。指定内测组织的内部测试员会话由系统侧单独授权为 1。
- 风险人数一律以区间输出（`1-5` / `6-15` / …），不给精确人数。
- 疗愈师默认只看到匿名个案编号、风险级别和员工主动填写的说明。**查看对话原文必须由员工本人
  在员工端同意**，服务端硬拒绝未授权的读取，且每次查看（含被拒绝的尝试）都写审计。
- 审计条目只记录报表名或匿名个案编号，不含员工原文，也不含 `anon_id`。
- 公开/临时（beta）组织与企业报表完全隔离：其聊天、广场、活动和研究事件不得进入企业 HR 报表；疗愈师个案需核对来源组织。详见 `docs/组织-入口-地址.md`。
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

`INTERNAL_SERVICE_TOKEN` 必须与员工端一侧完全一致。
`/api/health` 会同时确认 `careBindingAbsent: true`。

**注意**：Pages Secret 写入后不会作用于已存在的部署，必须再 `npm run deploy` 一次才生效。
写完 Secret 直接看 `/api/health` 仍会显示缺失，这是预期行为，不是配置失败。

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
