# 数据导出目录

内测组织的研究数据导出统一放这里，按“组织 + 日期范围”建子目录，例如：

```
data-exports/org_beta_xxx-2026-09-23_2026-09-25/
  organizations.csv / participants.csv / events.csv / feedback.csv
  transcripts-<org>-<from>-<to>.csv（如含原文）
  export-audit.jsonl
```

用法（都在 `apps/employee` 下执行，输出目录直接指到这里）：

```sh
# 假名事件与反馈（需 D1 读取权限，不含原文）
node scripts/export-research.mjs <组织ID> <起始日> <截止日> ../../data-exports/<目录名> "<用途>"

# 真实聊天原文（需 RESEARCH_EXPORT_TOKEN，且组织已开 research_transcript_export）
RESEARCH_EXPORT_TOKEN=... node scripts/export-transcripts.mjs https://mindbridge-beta.pages.dev <组织ID> <起始日> <截止日> ../../data-exports/<目录名> "<用途>"
```

注意：

- CSV 含假名轨迹或聊天原文，只交给限定的研究人员，看完及时清理。
- 本目录的 CSV / JSONL 已在 `.gitignore` 中忽略，**不要**强行 `git add -f` 进仓库；只有本说明文件会被提交。
- 每次导出的 `export-audit.jsonl` 会追加操作者、用途与行数，留作审计。
