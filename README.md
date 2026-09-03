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
| `prototype/` | **交互原型**，只读参考，不是产品 | Pages `mindbridge-demo` |
| `docs/` | 技术债台账、路演需求、产品方案、比赛材料 | — |
| `assets/` | 截图与图标 | — |
| `archive/`、`PPT/` | 历史产物，只进不出 | — |

`prototype/mindbridge-demo.html` 是单文件原型。产品里的词典、话术、活动内容都是**从它逐行提取**的
（见 `functions/api/_lib/*-data.js`），不是重写的。改这些内容要回原型对照。

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
| Stage 5 钉钉机器人 + 外部大模型 | **未开始** |

**注意**：Stage 2-4 的验证目前大多只在本地完成，远端 D1 尚未灌入数据。
生产验收未通过之前，不要对外声称这些能力已上线。

## 读文档的顺序

1. `docs/mindbridge-app-临时处理与技术债.md` — **先读这个**。所有临时处理、已知缺口、
   有意的取舍都在这里，且有维护规则约束它不许与代码漂移
2. `docs/路演需求.md` — 只服务于路演、不进产品主干的需求
3. `apps/employee/README.md`、`apps/console/README.md` — 各自的配置与验收方式

## 两条不要犯的错

- **不要把原型当产品**：`prototype/` 里的数据全是写死的，产品里任何一个数字都必须有真实来源。
  查不到就显示"未接入 / 样本不足"，绝不显示看起来像真的假数字。
- **不要跳过技术债台账**：改了某项技术债对应的代码，必须在同一次提交里更新对应条目。
