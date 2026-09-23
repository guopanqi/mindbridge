-- 内容目录全局维护；开放状态与情绪推荐矩阵按组织覆盖。
CREATE TABLE organization_activity_settings (
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  activity_id TEXT NOT NULL REFERENCES activities(id),
  enabled INTEGER NOT NULL CHECK (enabled IN (0, 1)),
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  PRIMARY KEY (organization_id, activity_id)
);

CREATE TABLE organization_intervention_matrix (
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  emotion TEXT NOT NULL REFERENCES intervention_matrix(emotion),
  l1_activity_id TEXT REFERENCES activities(id),
  l2_activity_id TEXT REFERENCES activities(id),
  enabled INTEGER NOT NULL CHECK (enabled IN (0, 1)),
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  PRIMARY KEY (organization_id, emotion)
);

-- 公开组织管理凭证独立于参与者邀请；参与者不能修改本组织配置。
CREATE TABLE beta_admin_credentials (
  organization_id TEXT PRIMARY KEY REFERENCES organizations(id),
  token_digest TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE TABLE beta_admin_sessions (
  session_digest TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_beta_admin_sessions_org ON beta_admin_sessions(organization_id, expires_at);
