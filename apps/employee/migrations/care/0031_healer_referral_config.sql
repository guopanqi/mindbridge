-- 真人支持按组织单独开放；未配置时默认关闭。
CREATE TABLE organization_healer_settings (
  organization_id TEXT PRIMARY KEY REFERENCES organizations(id),
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);
