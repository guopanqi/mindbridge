-- 团队节奏：来自钉钉考勤等行为元数据的组织级聚合。
--
-- 硬约束：本表只保存聚合值与样本量，永远不出现 userid、姓名或任何个人打卡记录。
-- 拉取过程中 userid 只在 Worker 内存里短暂存在，不落任何库。
CREATE TABLE IF NOT EXISTS org_rhythm (
  id TEXT PRIMARY KEY,
  bucket_day TEXT NOT NULL,
  metric TEXT NOT NULL,
  value REAL NOT NULL,
  sample_size INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'number',
  source TEXT NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live',
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_org_rhythm_key ON org_rhythm(bucket_day, metric, data_origin);
CREATE INDEX IF NOT EXISTS idx_org_rhythm_metric ON org_rhythm(metric, bucket_day);
