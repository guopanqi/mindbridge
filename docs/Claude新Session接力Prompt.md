
你正在继续开发 `/Users/usr/Downloads/mindbridge` 中的 MindBridge。请把自己当作负责架构、实现、测试、部署和真实钉钉验收的主工程师，不要只给建议；在安全边界内持续实施，直到当前 stage 的验收条件真正满足。

## 1. 产品目标

`mindbridge-app` 不是“带钉钉外壳的心理健康网页”，也不是把 `/Users/usr/Downloads/mindbridge/prototype/mindbridge-demo.html` 原封不动上线。目标是把原 Demo 的核心体验迁移成真正运行在企业钉钉组织内的匿名员工支持系统，同时保留适合路演的完整故事和可控演示数据。

真实与模拟必须严格分开：钉钉身份链路、登录、授权码、匿名映射、会话和由测试人员产生的业务事件必须是真实的；200 人企业基线、历史趋势和丰富案例允许使用预置模拟数据，但必须显著标记为模拟，不能伪造“真实钉钉考勤、病假、聊天接口数据”。

## 2. 不可破坏的架构边界

```text
钉钉工作台 H5 / 钉钉机器人
          │ userid 只允许在认证/身份中继边界内短暂出现
          ▼
Identity Relay（mindbridge-identity，独立 D1）
  - HMAC 派生稳定匿名身份
  - 加密保存钉钉身份映射
  - 支持 key version 与 alias 轮换
  - 以后负责定向通知
          │ 只输出 canonical anonymous id 或代为通知
          ▼
Care Domain（mindbridge-care，独立 D1）
  - 会话、情绪、帖子、对话、资源、预约、干预与匿名指标
  - 永远不保存 userid、姓名、手机号或可逆组织身份
          ├── 员工 H5
          ├── 疗愈师端
          └── HR 聚合看板
```

两套 D1 必须物理分离。任何为了开发方便而把 `userid` 放入 care DB、浏览器 localStorage、URL、前端响应、普通日志、分析埋点或错误信息的做法都不允许。

匿名 ID 使用独立 HMAC 密钥并支持版本轮换，不允许简单 SHA-256。身份映射使用独立加密密钥。会话 Cookie 必须同源、HttpOnly、Secure、SameSite，并且 care DB 只保存随机 session token 的摘要。

员工匿名，但 HR、疗愈师、运营管理员必须实名、按角色授权、写审计日志。“需要保护的人匿名，负有责任的人实名”。

## 3. 当前代码与资料

- 真实应用：`/Users/usr/Downloads/mindbridge/mindbridge-app`
- 原型 Demo：`/Users/usr/Downloads/mindbridge/prototype/mindbridge-demo.html`
- 当前应用说明：`apps/employee/README.md`
- 临时处理与技术债台账：`docs/mindbridge-app-临时处理与技术债.md`
- 旧待办：`docs/TODO.md`


## 4. 已完成：Stage 1 真实钉钉身份链路

生产地址：`https://mindbridge-app-8j6.pages.dev/`

钉钉后台当前移动端和 PC 端入口：

```text
https://mindbridge-app-8j6.pages.dev/?corpid=$CORPID$&build=11
```

当前钉钉企业内部应用：MindBridge，已发布版本 `1.0.2`。Cloudflare Pages 项目名为 `mindbridge-app`。

已完成并真实验证：

1. 从 Mac 钉钉工作台打开后自动请求免登，不需要员工点击登录。
2. 钉钉真实返回一次性授权码。
3. 服务端使用应用 access token，再调用 `topapi/v2/user/getuserinfo` 换取身份；没有误用 OAuth 用户授权接口。
4. `mindbridge-identity` 写入加密映射和匿名 alias；`mindbridge-care` 只写匿名会话。
5. 前端/API 不返回 `userid` 或 anonymous id。
6. 关闭 H5 后从工作台重新打开，页面显示“匿名会话仍然有效”。
7. 验收后远端计数为：identity mapping 1、identity alias 1、care session 1；重开后计数不增加。
8. 官方 SDK 固定为 `dingtalk-jsapi@3.2.9`，不依赖外部 CDN。

当前关键文件：

- `apps/employee/public/app.js`
- `apps/employee/functions/api/auth.js`
- `apps/employee/functions/api/session.js`
- `apps/employee/functions/api/config.js`
- `apps/employee/functions/api/health.js`
- `apps/employee/functions/api/_lib/crypto.js`
- `apps/employee/scripts/dingtalk-entry.js`
- `apps/employee/migrations/identity/0001_identity_relay.sql`
- `apps/employee/migrations/care/0001_sessions.sql`
- `apps/employee/test/auth.test.js`
- `apps/employee/wrangler.jsonc`

已有测试命令：

```bash
cd /Users/usr/Downloads/mindbridge/mindbridge-app
npm run check
npx wrangler pages functions build functions --outdir .wrangler/check-build
```

不要回退到以下反模式：

- 根据 UA 判断桌面/移动并选择不同 SDK；
- 同时尝试 `dd.runtime.permission.requestAuthCode`、`dd.getAuthCode`、`dd.requestAuthCode` 等多个分支；
- `dd.ready` 与立即调用同时启动；
- 静默 catch、无限等待或让用户手点登录掩盖自动免登失败；
- 从 URL 或请求体信任 CorpId；
- 把部署 preview URL 当作正式入口；
- 在普通日志打印授权码、access token、userid、匿名 ID 或 Cookie。

Stage 1 仍有两项补充回归，不应阻塞 Stage 2 开发，但发布前必须完成：第二名真实员工隔离验证，以及至少一台移动端钉钉验证。详见技术债 TD-004。

## 5. 当前真实状态：为什么登录后还没有进入树洞

现在的 `mindbridge-app` 只包含 Stage 1 的技术验收页。它会自动建立匿名会话，但成功后仍停留在“匿名会话已建立”，没有迁移 Demo 的员工产品界面。

因此当前进度应表述为：

- 身份与隐私底座：完成。
- 员工端可用产品：尚未完成。
- Demo 视觉与业务交互迁移：尚未开始。
- 机器人、疗愈师端、HR 端：尚未进入真实实现。

下一个工作目标不是继续美化登录页，而是完成 Stage 2A：真实身份之后的员工 H5 壳和最小业务闭环。

## 6. Stage 2：员工端真实闭环

### Stage 2A：启动体验与员工产品壳（下一项，最高优先级）

把 Demo 中有价值的员工界面迁移到真实 App，但重写为可维护的模块，不要复制一个几千行 HTML 单体。

目标启动流程：

```text
钉钉工作台点击 MindBridge
  → 检查 HttpOnly session
  → 无 session：自动 requestAuthCode → 后端交换 → 建立匿名会话
  → 新会话播放一次简洁的隐私连接动画（约 0.8–1.5 秒）
  → 已有 session 不重复播放长动画，直接进入员工端
  → 默认进入“倾诉树洞”；也可明确决定默认进入“匿名广场”
```

这里必须作一个产品判断：原 Demo 的主 tab 默认是“倾诉树洞”，用户口述提到“树洞广场”。建议保持三个一级入口——倾诉树洞、匿名广场、我的活动——默认进入倾诉树洞，因为私密倾诉比公共发布更安全；匿名广场是第二 tab。若产品负责人明确要求默认广场，再调整。

启动动画只展示隐私边界，不显示真实姓名、工号、userid，也不要在前端展示真实 anonymous id。可以展示仅用于体验的不可反查昵称；若需要稳定昵称，应由 care domain 基于 anonymous id 派生并只返回显示名。

Stage 2A 验收：

- 每次从钉钉进入都自动完成 session 检查或免登，无登录按钮。
- 新用户看到一次短动画后自动进入员工端；老用户快速直达。
- 正常流程不暴露技术错误码；失败页保留可操作的重试和管理员诊断码。
- 三个 tab 可用、适配钉钉 PC 和移动 WebView。
- 刷新、关闭重开、session 过期三种状态行为一致且可测试。
- 保留无障碍语义和 reduced-motion 降级。

### Stage 2B：Care Domain 数据模型与 API

为以下真实业务建立 migrations、repository/service 层和 API：

- employee profile/preferences：只属于 anonymous id；
- mood check-ins / stress self-assessment；
- private conversations 与 messages；
- anonymous wall posts、comments/reactions（若首版需要）；
- support resources 与 recommendation events；
- appointments、consent grants、follow-ups；
- risk assessments 与 escalation state；
- employee-visible history；
- aggregate events，供未来 HR 看板使用。

所有表使用内部 UUID/ULID 与 `anon_id`，禁止加入 `userid`。敏感原文与聚合事件分表；定义保留期与删除机制。所有写 API 做 schema validation、幂等、防重放、速率限制和统一错误码。

### Stage 2C：倾诉、风险与支持建议

先迁移 Demo 中已有的规则引擎作为透明、安全的基线，再接入大模型。AI 不能做医学诊断；危机规则必须独立于模型并可测试。风险输出至少为 green/yellow/red，但员工界面避免把人标签化。

红色流程：停止普通自动推荐 → 明确说明边界 → 征求员工知情同意 → 同意后才建立疗愈师工单。HR 只能看到聚合计数，不能看到个案详情或原文。紧急危险场景需要展示本地适用的紧急资源，但不能谎称系统已经联系了第三方。

### Stage 2D：预约、历史与控制权

- 匿名预约疗愈师；
- “我希望被关心，但不希望身份被暴露”的授权机制；
- 员工查看自己的历史、预约和支持资源；
- 清空/删除自己的记录；
- 撤销特定授权；
- 清楚展示哪些数据被记录、谁能看到、保留多久。

## 7. Stage 3：钉钉机器人

机器人使用官方 Node Stream SDK，运行在常驻 Node 服务，不放进 Cloudflare Durable Object。

首版能力：

- 员工私聊机器人；
- 识别钉钉发送者，但 `userid` 只进入 Identity Relay；
- 解析到与 H5 相同的 canonical anonymous id；
- 在匿名上下文中继续对话；
- 对已授权员工发送关怀、预约提醒和回访；
- 业务对话、疗愈师端和 HR 端不写 `userid`。

必须做的现场证明：同一员工在 H5 和机器人内产生的事件归到同一匿名主体；换第二名员工则是另一主体；疗愈师仍不知道员工是谁。

需要另外核实钉钉对企业内部机器人私聊的审计/存档边界，不能在方案里无依据宣称绝对私密。

## 8. Stage 4：疗愈师端与 HR 端

疗愈师端只看匿名个案编号、风险级别、经员工授权的必要上下文、预约和干预记录。不能搜索姓名、部门、钉钉账号；查看原文等扩权必须再次获得员工授权并进入审计。

HR 端只看聚合指标：压力趋势、风险人数区间、覆盖率、活动效果、团队变化等。默认禁止个人下钻。组织维度最小样本阈值建议为 10；低于阈值不出数，也不能通过多个筛选器交叉推断个人。

## 9. 路演数据策略

建立一个可重置的演示企业，例如“星原科技，200 人”。

- seed 数据提供 90 天历史趋势、部门聚合、匿名帖子、活动效果和已结束案例；全部带 `data_origin='demo_seed'`。
- 现场真实钉钉员工产生的数据带 `data_origin='live'`，实时叠加到看板。
- 看板顶部持续显示“模拟基线 + 当前演示事件”，不能只在说明页标一次。
- 真实数据和 seed 数据必须可分别查询、分别清理。
- 准备一键 reset demo tenant，但该操作必须有管理员权限、确认和审计。
- 预置数据不得包含真实员工姓名、工号、联系方式或可识别案例。
