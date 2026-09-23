-- 两种入口共同写入 CARE；主体与组织关系不依赖短期会话。
CREATE TABLE IF NOT EXISTS subject_organizations (
  anon_id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  entry_channel TEXT NOT NULL CHECK (entry_channel IN ('beta_web', 'dingtalk')),
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subject_organizations_org ON subject_organizations(organization_id, created_at);

-- 组织类型不等于已获外部数据权限；能力必须单独开启。
CREATE TABLE IF NOT EXISTS organization_capabilities (
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  capability TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (organization_id, capability)
);

ALTER TABLE aggregate_events ADD COLUMN organization_id TEXT;
CREATE INDEX IF NOT EXISTS idx_aggregate_events_org_day ON aggregate_events(organization_id, bucket_day, event_type);

ALTER TABLE org_rhythm ADD COLUMN organization_id TEXT;
DROP INDEX IF EXISTS idx_org_rhythm_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_rhythm_key ON org_rhythm(organization_id, bucket_day, metric, data_origin);

ALTER TABLE appointments ADD COLUMN organization_id TEXT;
CREATE INDEX IF NOT EXISTS idx_appointments_org_status ON appointments(organization_id, status, created_at);
