# Stage 5 Conversation Harness（第一阶段）

## 决策

树洞 H5 与后续钉钉机器人共用一个 Conversation Harness。钉钉只作为渠道适配层，不复制对话、风险或活动逻辑。

生产运行时只使用 Responses API Model Gateway。Fake 只通过测试依赖注入，不进入生产路由；模型不可用时使用确定性安全降级，不回退旧规则对话。

## 当前垂直链路

```text
用户消息
  → 加密 Durable Log（messages）
  → 读取加密 UserState（conversation_state）
  → Context Builder（最近 10 条原文 + State + 当前消息）
  → Instruction Builder
  → Responses API Model Gateway
  → ModelDecision 校验
  → 可选 search_activities（只读）
  → State Patch 合并并加密写回
  → 回复与真实活动卡片
```

## 确定性边界

- 模型输出始终是 proposal，不是事实或已执行动作。
- 第一版唯一模型工具是 `search_activities`。
- 报名、转介、共享上下文继续由现有页面和按钮确认。
- 安全澄清未完成（`safetyCheck === 'pending'`）时状态只升不降；澄清结束后允许降级，否则一次抱怨会把用户永久钉在 yellow，让 `risk_events` 与 HR 看板持续误报。red 只能经 `denied` 降到 yellow。
- `setEmotion` 只接受固定九词表，与干预矩阵和 HR 情绪趋势聚合口径一致；模型自创词按未识别处理。
- 模型不可用且当前消息含明确求救词时，降级路径仍升级到 red 并给出紧急资源卡片。
- 模型不可用时返回确定性安全降级，不更新语义状态、不调用工具。
- `model_runs` 只保存模型、Prompt 版本、延迟和 token 元数据，不保存 Prompt 或回复正文。
- UserState 属于敏感心理数据，使用与消息相同的 AES-GCM 内容密钥加密。

## 真实模型验收（DeepSeek Responses API）

对 `deepseek-v4-flash` 的实测结论：

- 供应商的 `text.format.json_schema` + `strict` **不是约束解码**。首版 Prompt 下约 40% 的回答把 Schema 本身当正文回显，有时还在其后紧跟真正的实例。因此：Instruction 里必须有显式输出契约（含实例形状），Gateway 必须能从含噪文本中扫描出第一个像 ModelDecision 的顶层 JSON 对象。修复后单次调用违约率降到约 4%，经 Harness 重试后基本不可见。
- `status: "incomplete"` 必须单独识别为 `MODEL_OUTPUT_TRUNCATED` 并重试，不能和"模型没话说"混为一谈。
- 首轮延迟 p50 约 1.7s、p95 约 3.7s；带工具的两次调用约 4s。前端需要有明确的等待态。
- 模型不会主动遵守"没调用工具就不能提活动名"，必须在 Instruction 里写死，否则它会凭印象编出目录里不存在的活动，导致卡片、`resource_events` 与报名链路全部落空。当前仍有约 1/6 概率该调用工具时改为追问一句（安全的失败方式），是已知残留。
- `supportLevel` 与 `safetyStatus` 是两个时间尺度：前者是跨轮持续的状态，后者是本轮的观察。契约一度要求"red 必须配 immediate_risk"，结果红色用户只要说一句普通的话（否认风险、问有什么活动）就会被判契约违规、耗尽重试直接降级。现在只保留唯一真正必须成立的方向：**本轮观察到 `immediate_risk`，等级就必须是 red**。

## 对话实验台（改 Prompt / 改 Harness 的标准循环）

`./lab`（`apps/employee/lab` → `scripts/harness-lab.mjs`）直接驱动真实模型跑 Harness，绕开 wrangler、D1 与加密层；活动目录用 `seed/activities.sql` 的内存替身。`./lab --help` 是完整规格，这里只讲设计意图。

五个子命令：`chat`（人用，找手感）、`run`（agent 和 CI 用，做回归）、`context`（不调模型，只看上下文）、`bench`（压测）、`sessions`（列存档）。

### 三种给上下文的方式，用途不同

| 方式 | 前置从哪来 | 测什么 |
|---|---|---|
| `--turns "a" "b"` | 真实回复回灌 | 对话质量。前置不确定，失败时不易定位 |
| `--given '<json>'` | 手写状态和历史 | 状态机。前置是常量，一次调用只测一件事 |
| `--session <名字>` | 磁盘存档 | 跨时间的记忆。可续跑、可分享复现、可从某点分叉 |

`--given` 不是省事，是**把不确定的前置换成确定的前置**：红→黄这条转换原先要先真跑一轮升红（那一轮本身会抖），失败时分不清是升红错了还是降黄错了。`test/scenarios/15-state-machine.json` 全部是这种写法。代价是注入的 history 是假的——所以**状态机断言用 `given`，对话质量用真实多轮，手感用 `chat`**。

### 观察上下文本身

```bash
./lab context --session alice --advance 1d      # 不调模型，打印真正会发出去的 context + instructions
./lab context --session alice --json            # 机器可读
```

这是唯一能回答"模型此刻究竟看到什么"的入口，零成本零抖动。窗口截掉了几条、时间戳是什么形状、UserState 累积到多大，都在输出末尾的「观察」段里。

### 接口对 agent 友好的几条约束

- `--help` 是规格而不是文档：命令、开关、场景文件格式、断言键、工作流建议都在里面，读完即可用。
- **拼错的开关必须报错**。被静默忽略的 `--repeats` 会让调用方以为跑了 3 遍、实际只跑 1 遍——这种错误比崩溃更危险。每个子命令声明自己接受哪些开关，越界即退出码 2 并列出可用项。
- 语义冲突直接拒绝而不是猜。`--session` 配 `--repeat 3` 无法定义该留谁的状态，报错让调用方明确意图。
- `run` / `context` / `bench` / `sessions` 都支持 `--json`；退出码 0 通过、1 失败、2 用法错误。

### 两个反复踩到的坑

- 因为模型输出天生有抖动，**单次通过不算通过**。隐私边界的过度承诺、活动检索漏调用、`red` + `denied` 契约拒绝，全部是 `--repeat` 才暴露出来的。
- 断言正则要考虑否定式，而且否定词未必紧邻。`建议你(吃|服用)` 会匹配"我不能建议你吃药"；加了单字符 lookbehind 之后，"也不**能**建议你吃药"照样漏网。这类误报会把正确行为报成失败，比漏报更浪费时间。

## 用户体验修正（第 1 轮真人情境测试后）

五组全流程情境测试暴露四个体感问题，前三个已修：

- **字数倒挂**。用户从"好累"退到"嗯"再到"…"，输入递减到 0，回复却从 34 字涨到 137 字。已累垮的人迎面收到三段温柔长文，只会产生阅读压力和回应负疚。Instruction 增加 `LENGTH` 段：篇幅与用户投入相称，越沉默回得越短。修后曲线 36 → 15 → 25 → 1 字。
- **图文割裂**。工具查到了活动、前端挂出了卡片，但回复文字只字不提，用户像是被硬塞了广告。根因有两层：措辞轮没有被要求点名活动；且 harness 固定取 `activities[0]` 挂卡，而模型常常挑第二条来讲。现在卡片跟随文字实际点名的那一条，一条都没提就不挂卡（`harness_activity_card_dropped`）。
- **收尾时的习惯性反问**。用户道谢准备离场，模型仍追加一问把人留住。`LENGTH` 段明确：不是每轮都必须有问题，用户收尾时接住并放手。
- **等待期静止**。双轮调用约 4–6 秒，前端只有静态"正在听…"，手机上会被当成卡死。改为三点呼吸动效，并遵守 `prefers-reduced-motion`。

回归用 `./lab run 30-ux`，其中 `replyMaxChars` 阈值定在 80 字：原始 bug 曲线（86/108/137）会被抓住，正常波动（约 60 字）不会误报。

## 已定位、待决策

- **契约只校验形状，不校验实质**。线上真实发生过：用户在钉钉问"有什么活动吗"，模型回了"需要前缀"四个字，`validateDecision`（非空、≤2000 字）放行，原样发给了用户。lab 复现 12 次未再现，属于低频模型故障。
  尝试过按"用户投入 ≥6 字则回复不得短于 8 字"重试，**已撤销**：桩数据里合格的极简共情"我在听。"同样是 4 字，和"需要前缀"一样长，长度分不开两者，这个启发式会误杀好回复。目前没有便宜可靠的检测手段；可选路径是换更强的模型，或加一次校验调用（代价是延迟翻倍）。先接受并记录。
- **排查这类问题要解 inbox 密文，不能只看日志**。`apps/bot-stream/data/inbox.sqlite` 的 `result` 列存着当时生成的完整回复（AES-256-GCM，密钥在 `.env` 的 `BOT_INBOX_KEY`）。元数据表（state/attempts/created_at）能确认"收到没有、发出去没有"，密文才能回答"究竟发了什么"。这次正是先看元数据得出"发送成功"，再解密才发现文案本身就是坏的。

- **上下文里没有"现在"**。`recentMessages` 每条带 `at`，但 `currentMessage` 不带，context 里也没有参考时刻，所以模型无法判断距上一轮过了多久。实测：`./lab run --session demo --advance 1d --turns "我又来了"` 之后模型回"**刚才**聊到需求改了七版"——把一天当成刚刚。
- **`at` 是原始 epoch 毫秒**（`1788445661485`）。即使补上"现在"，这种表示也很难让模型算出"隔了一天"。改 ISO 或相对表述（"3 天前"）是更可能奏效的方向。
- 这两条都属于改 Harness 而非改工具，动之前应先用 `./lab context` 看清实际形状。
- 已修：`safetyCheck` 为 `pending` 时，用户转移话题曾被模型读成 `denied` 而悄悄降级，且模型会顺着新话题聊下去。现在 `denied` 收紧为"直接回答了安全询问并明确否认"，并在 pending 时注入一条指令要求先把安全问题问完。这是放宽 `red` 与 `safetyStatus` 的耦合之后暴露出来的，靠 `--given` 把状态钉死才定位到。

## 尚未实现

部署边界：H5 与 Stream Adapter 已复用同一对话服务，Stream 真实连接尚受本地凭据阻塞，详见 `stage5-channels-implementation.md`。模型重试与工具后生成共享 8 秒总预算，前端 12 秒超时包含响应正文读取。消息与回复仍以一次 batch 原子写入；连接中断时前端同步历史，无法确认时明确提示结果未知，不自动重发。

- Shadow Mode 与供应商故障切换。
- Conversation 与 Episode 分离。
- Open Loops 的独立生命周期。
- Memory Items、摘要与 idle-gap microcompact。
- Shadow Mode 对照运行和离线评测集。

这些能力应在当前真实 Gateway 链路稳定后依次增加，不能同时塞进首个版本。
