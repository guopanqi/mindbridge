-- 活动目录与参与流程。
--
-- 效果度量采用前后自评差值：员工在开始前和结束后各给一次 1-10 自评，
-- direction 说明这个分数是越低越好（down）还是越高越好（up）。
-- 「活动效果」看板据此得出「紧张感平均下降 X 分」，而不是只有参与计数。
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  form TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  pre_label TEXT NOT NULL DEFAULT '',
  low_label TEXT NOT NULL DEFAULT '',
  high_label TEXT NOT NULL DEFAULT '',
  direction TEXT NOT NULL DEFAULT 'down',
  score_label TEXT NOT NULL DEFAULT '',
  schedule TEXT,
  location TEXT,
  stages_json TEXT NOT NULL DEFAULT '[]',
  enabled INTEGER NOT NULL DEFAULT 1,
  data_origin TEXT NOT NULL DEFAULT 'demo_seed'
);

-- 资源目录与活动目录用名称对应，配置矩阵选中的资源即可打开对应活动。
ALTER TABLE resource_catalog ADD COLUMN activity_id TEXT;

-- 参与记录挂在 resource_events 上，保持「推荐 → 参与 → 完成 → 评分」同一条链。
ALTER TABLE resource_events ADD COLUMN pre_score INTEGER;
ALTER TABLE resource_events ADD COLUMN post_score INTEGER;
ALTER TABLE resource_events ADD COLUMN stage_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE resource_events ADD COLUMN activity_id TEXT;
