-- 参与者主动写下的产品建议。正文只给产品团队改进用，不进入研究事件。
CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  anon_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  entry_channel TEXT NOT NULL CHECK (entry_channel IN ('beta_web', 'dingtalk'))
);
CREATE INDEX IF NOT EXISTS idx_suggestions_person_time ON suggestions(anon_id, created_at);
CREATE INDEX IF NOT EXISTS idx_suggestions_org_time ON suggestions(organization_id, created_at);
