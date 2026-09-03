-- 疗愈师通常不属于客户的钉钉组织，因此走独立的邀请码登录。
-- 存储仍然落在 staff 库，共用 staff_id 与审计，避免维护第二套身份体系。
CREATE TABLE IF NOT EXISTS healer_invites (
  id TEXT PRIMARY KEY,
  code_digest TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  staff_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_healer_invites_expires ON healer_invites(expires_at);
