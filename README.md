# MindBridge

面向企业与内测组织的**匿名员工心理支持系统**。

钉钉和网页邀请是进入组织的不同方式；聊天、广场、活动和组织报表都按组织隔离。参与者使用组织内匿名身份，工作人员按职责实名访问管理端。

---

## 这个仓库里有什么

| 目录 | 是什么 | 部署到 |
|---|---|---|
| `apps/employee/` | 员工端 H5 + Care Domain API | Cloudflare Pages `mindbridge-beta` |
| `apps/console/` | HR 看板 + 疗愈师个案台 | Cloudflare Pages `mindbridge-console` |
| `apps/bot-stream/` | 钉钉 Stream 私聊接收器，共用员工端对话服务 | 常驻 Node 进程 |
| `docs/` | 当前架构、内测操作与研究数据字典 | — |
| `路演/` | 比赛与路演材料：PPT、视频、原型、赛题。不参与产品发布 | — |
| `assets/` | 截图与图标 | — |

员工端直接部署到 `https://mindbridge-beta.pages.dev/`。旧项目 `mindbridge-app` 暂时保留供已发出的旧邀请链接使用，不再接收新部署。活动内容由 `apps/employee/content/activities/*.json` 维护，经校验后导入 D1。路演原型在 `路演/原型/`，里面的数据是写死的，不作为产品数据来源。

## 架构边界（不可破坏）

```text
钉钉工作台 H5
      │  userid 只允许在认证边界内短暂出现
      ▼
Identity Relay（D1: mindbridge-identity）
  HMAC 派生稳定匿名身份 · 加密保存钉钉身份映射 · 支持密钥版本轮换
      │  只输出 canonical anonymous id
      ▼
  Care Domain（D1: mindbridge-beta-care）
  会话 / 情绪 / 帖子 / 活动 / 预约 / 风险 / 聚合事件
  永不保存 userid、姓名、手机号
      │
      │  console 不绑定 CARE_DB，只能调用固定输出阈值抑制结果的内部接口
      ▼
Staff（D1: mindbridge-staff）
  HR 与疗愈师的实名身份 · 角色 · 审计日志
```

三个 D1 物理分离。**任何把 userid 放进 care 库、浏览器、URL、前端响应或普通日志的做法都不允许。**

### 其他硬约束

- 员工倾诉原文、广场帖子与回复在 care 库中只以 AES-GCM 密文保存
- 危机判定由**确定性规则引擎**产出（`_lib/triage.js`），未来接入模型也只能改写措辞，不得覆盖风险级别
- HR 只能看聚合：任何维度样本量 < 10 不出数，阈值**硬编码不可配置**
- 员工端不返回命中的规则说明——规则应对企业可解释，但不该对当事人贴标签

## 快速开始

### 常用操作（仓库根目录）

```bash
npm run deploy:console   # 校验、构建、部署管理端及疗愈师页面，并验证线上资源
npm run deploy:employee  # 同上，部署员工端及 Care API
npm run deploy:all       # 两端先全部通过检查，再按 employee → console 顺序部署
npm run check:apps       # 根目录静态检查 + 两端构建和测试，不发布
npm run build:apps       # 仅构建两端
npm run health           # 两端线上健康检查，不发布
npm run dev:console      # 构建并启动本地 8789
npm run dev:employee     # 构建并启动本地 8788，另开终端
```

统一入口为 `bash scripts/app.sh <操作> <console|employee|all>`，无参数只显示帮助。
首次使用需在根目录、`apps/console`、`apps/employee` 分别执行 `npm ci`，部署前需 Wrangler 已登录。
发布明确使用生产分支 `main`，会包含当前工作区未提交的应用改动；两端发布不是原子事务，失败即停止，不自动回滚已成功的一端。
脚本按 Cloudflare Pages 的 Direct Upload 流程构建后发布 Functions 和静态资源，随后核对生产地址的健康状态及 HTML/JS/CSS 内容。
数据库迁移、种子数据、活动内容导入均不会自动执行；它们仍需单独明确操作，避免普通部署意外改数据。
路演原型发布继续使用 `bash scripts/deploy-prototype.sh`，不包含在 `deploy:all` 中。

```bash
cd apps/employee && npm ci && npm run check
cd apps/console && npm ci && npm run check
```

本地跑起来（两个服务要同时开，console 通过内部接口向 care 取数）：

```bash
cd apps/employee && npx wrangler pages dev public --port 8788
cd apps/console && npx wrangler pages dev public --port 8789
```

本地无法走钉钉免登。验证员工端时，直接往本地 care 库 `sessions` 表插一行，
再在浏览器里设同名 Cookie。详见各项目 README。

## 读文档的顺序

1. `docs/README.md` — 当前工程文档索引
2. `docs/组织-入口-地址.md` — 组织、入口、评审聚合页及相关链接的唯一说明
3. `docs/公开组织内测执行与测试手册.md` — 创建测试组织及执行内测
4. `docs/内测组织与研究数据字典.md` — 匿名身份、研究事件与分析口径
5. 各应用 README — 本地运行、配置与发布

路演和比赛材料不在这条阅读顺序里，见 `路演/README.md`。

## 关键约束

- **不要把原型当产品**：`路演/原型/` 里的数据全是写死的，产品里任何一个数字都必须有真实来源。
  查不到就显示"未接入 / 样本不足"，绝不显示看起来像真的假数字。
- 面向组织的业务数据必须按组织范围读写；公开组织没有钉钉办公数据权限。
- 评审演示数据归属于评审组织，行业对照明确标记为模拟数据，不能混入真实组织指标。
