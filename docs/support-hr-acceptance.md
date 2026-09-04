# 支持与 HR 联动验收记录

验收日期：2026-09-04（Asia/Singapore）。范围限定为员工匿名预约、疗愈师个案台、二次上下文授权/撤销，以及 HR 聚合指标；活动表与机器人链路不作为本次前置条件。

## 环境与方法

代码证据来自 `apps/employee/functions/api/appointments/index.js`、`authorizations.js`、`consents.js`、`internal/cases.js`、`internal/metrics.js` 与 `apps/employee/functions/api/_lib/metrics.js`。本地实测使用 Wrangler Pages + 真实 SQLite D1，迁移应用在独立 `/tmp` 持久化目录，员工端监听 `127.0.0.1:8791`；已存在的控制台 `127.0.0.1:8789` 未触碰。所有员工文本、员工 ID、session 与服务 token 均为本地合成值，没有调用远端个人数据、伪造生产会话、发送真实预约/通知或部署。

验收回归测试位于 [`apps/employee/test/support-acceptance.test.js`](../apps/employee/test/support-acceptance.test.js)，运行：

```sh
cd apps/employee
node --test test/support-acceptance.test.js
```

## 已通过

本地 HTTP 实测得到：创建预约返回 `status=requested` 和格式为 `MB-******` 的个案编号；内部个案接口可见同一编号且初态为 `pending`；`claim → start → close` 后员工 `/api/appointments` 返回 `status=done`。未批准上下文时，疗愈师读取返回 `403 CONTEXT_NOT_AUTHORIZED`；员工批准后可读合成的两条消息。

指标接口在真实 SQLite 中以 `live=1`、`demo_seed=10` 的混合数据验证：`origin=live` 的 activeUsers、coverage、temperature 仍被 `minSample=10` 抑制，而 `origin=demo_seed` 独立放行 10 人；不能用 demo seed 凑 live 的阈值。测试还覆盖 live 人数 1、4、5、9、10，只有 10 放行。

另起隔离 console Pages worker（`127.0.0.1:8792`，synthetic `hr_viewer/healer` 会话）验证 console→care HTTP 代理：`/api/cases` 返回匿名个案元数据且不带对话片段，`/api/metrics?days=7` 返回 `origin=live` 与 k=10 抑制结果；console health 显示 `careBindingAbsent=true`。

## 撤销历史数据回归

本地 HTTP 实测顺序为“员工勾选共享上下文 → 疗愈师申请 → 员工批准 → 疗愈师读到合成上下文 → 员工撤销 `share_context_with_healer`”。当前新代码下，撤销接口返回 `granted=false`，员工 `/api/consents` 显示 `granted=false`，随后读取返回 403、列表不返回正文；新发生的撤销链路已通过。另用 SQLite 模拟修复上线前的历史状态（grant 已有 `revoked_at`、request 仍为 `approved`），当前代码也按 grant 拒绝读取并在列表标为 revoked，回归已通过。

该历史场景曾在修复前失败；根因是 `internal/cases.js` 只检查 `context_requests.status='approved'`，没有同时检查预约对应的当前 `consent_grants`。现已改为读取时以 grant 撤销为硬条件，列表也不再将其标为 approved；历史授权记录仍可保留供员工查看。

## 未测与边界

未测真实钉钉身份中继、真实疗愈师浏览器真机、跨服务 console→care 线上链路、远端 D1 部署迁移、真实通知发送；这些不能用本地合成会话替代。当前指标接口的 live 侧采取保守抑制策略，`aggregate_events` 不含匿名主体，无法证明单个情绪分组达到 k 时应继续保持不出精确值。
