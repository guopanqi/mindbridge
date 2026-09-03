-- 演示租户档案。headcount 是模拟基线人数，UI 必须持续标注它是模拟值。
CREATE TABLE IF NOT EXISTS tenant_profile (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  headcount INTEGER NOT NULL,
  industry TEXT NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'demo_seed',
  updated_at INTEGER NOT NULL
);
