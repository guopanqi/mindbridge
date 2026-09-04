# MindBridge

企业钉钉组织内的**匿名员工心理支持系统**。

不是"带钉钉外壳的心理健康网页"，也不是把交互原型上线。核心约束是：
**需要保护的人匿名，负有责任的人实名。**

---

## 这个仓库里有什么

| 目录 | 是什么 | 部署到 |
|---|---|---|
| `apps/employee/` | 员工端 H5 + Care Domain API | Cloudflare Pages `mindbridge-app` |
| `apps/console/` | HR 看板 + 疗愈师个案台 | Cloudflare Pages `mindbridge-console` |
| `apps/bot-stream/` | 钉钉 Stream 私聊接收器，共用员工端对话服务 | 常驻 Node 进程 |
| `prototype/` | **交互原型**，只读参考，不是产品 | Pages `mindbridge-demo` |
| `docs/` | 技术债台账、路演需求、产品方案、比赛材料 | — |
| `assets/` | 截图与图标 | — |
| `archive/`、`PPT/` | 历史产物，只进不出 | — |

`prototype/mindbridge-prototype.html` 是只读交互原型。活动内容现在由 `apps/employee/content/activities/*.json`
维护，经校验与幂等导入写入 D1；不再通过修改原型或生成脚本来维护活动。

## 架构边界（不可破坏）

```text
钉钉工作台 H5
      │  userid 只允许在认证边界内短暂出现
      ▼
Identity Relay（D1: mindbridge-identity）
  HMAC 派生稳定匿名身份 · 加密保存钉钉身份映射 · 支持密钥版本轮换
      │  只输出 canonical anonymous id
      ▼
Care Domain（D1: mindbridge-care）
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
原型发布继续使用 `bash scripts/deploy-prototype.sh`，不包含在 `deploy:all` 中。

```bash
cd apps/employee && npm install && npm run check     # 构建 + 29 项单测
cd apps/console && npm install && npm run check       # 构建 + 8 项单测/边界测试
```

本地跑起来（两个服务要同时开，console 通过内部接口向 care 取数）：

```bash
cd apps/employee && npx wrangler pages dev public --port 8788
cd apps/console && npx wrangler pages dev public --port 8789
```

本地无法走钉钉免登。验证员工端时，直接往本地 care 库 `sessions` 表插一行，
再在浏览器里设同名 Cookie。详见各项目 README。

## 进度

| 阶段 | 状态 |
|---|---|
| Stage 1 钉钉真实免登与匿名身份 | 已完成，生产验证 |
| Stage 2 员工端闭环（树洞 / 广场 / 资源库 / 活动 / 预约 / 授权） | 已完成 |
| Stage 3 HR 看板 + 演示数据体系 | 已完成 |
| Stage 4 疗愈师个案台 + 二次授权 + 审计 | 已完成 |
| Stage 5 钉钉机器人 + 外部大模型 | H5 模型链路已上线；Stream 已真实连接，双入口收发闭环待验收 |

**验收边界**：0017–0019 迁移及 6 个文字活动已导入远端并部署。人工支持/HR 已通过隔离 D1 + HTTP 回归，
不等于真实钉钉与疗愈师真机闭环全部通过。详见 `docs/stage5-channels-implementation.md`。

## 读文档的顺序

1. `docs/mindbridge-app-临时处理与技术债.md` — **先读这个**。所有临时处理、已知缺口、
   有意的取舍都在这里，且有维护规则约束它不许与代码漂移
2. `docs/路演需求.md` — 只服务于路演、不进产品主干的需求
3. `apps/employee/README.md`、`apps/console/README.md` — 各自的配置与验收方式

## 两条不要犯的错

- **不要把原型当产品**：`prototype/` 里的数据全是写死的，产品里任何一个数字都必须有真实来源。
  查不到就显示"未接入 / 样本不足"，绝不显示看起来像真的假数字。
- **不要跳过技术债台账**：改了某项技术债对应的代码，必须在同一次提交里更新对应条目。
