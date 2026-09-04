# 活动内容维护

此目录每个 JSON 是最终活动内容，不使用 prototype engine。文件名必须等于稳定活动 ID。
`../activity.schema.json` 定义文档结构；新 stage 必须提供可执行的 `fallbackHint`。

从 employee 目录执行：

```sh
node scripts/import-activities.mjs --check
node scripts/import-activities.mjs --local
node scripts/import-activities.mjs --local --apply
```

生产必须显式改用 `--remote`；不加 `--apply` 只比较并报告，不写库。
先执行迁移 0017。新建文件即增加活动；修改任何内容须递增 `contentVersion`。
删除文件不会删除线上记录，停用内容应改 `available: false` 并升版本。

`available` 属于内容维护；数据库 `enabled` 属于 HR，导入不会覆盖。
资源目录映射在 `../resource-activities.json`：`name` 是现有 HR 目录主键，
`activityId` 显式指向内容 ID。修改活动标题不必修改资源目录名；不可按标题自动推断。

开始参与时冻结内容快照，后续内容更新或目录停用不破坏已经开始的体验。
新开始/新推荐要求内容可用、活动启用及关联资源目录启用同时成立。
首批仅六个文字活动，没有可播放音频或真实线下场次。

导入是运维操作，禁止并发导入。全部文件先校验、版本预检，写入后再次比对哈希；
不承诺整个 CLI SQL 文件的全有或全无发布。中断后可以重跑，同版本同内容不改写。
不要添加 BEGIN/COMMIT：D1 官方导入文档要求移除显式事务语句。
https://developers.cloudflare.com/d1/best-practices/import-export-data/
