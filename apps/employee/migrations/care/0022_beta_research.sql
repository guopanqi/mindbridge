-- 全新内测库的组织与研究事实。此文件只准备存储结构；入口和埋点由后续代码接入。
-- 不迁入、不回填钉钉或路演数据；内测库从空数据开始。
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('beta', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS beta_invites (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  token_digest TEXT NOT NULL UNIQUE,
  expires_at INTEGER,
  max_joins INTEGER,
  join_count INTEGER NOT NULL DEFAULT 0,
  disabled_at INTEGER,
  created_at INTEGER NOT NULL,
  CHECK (max_joins IS NULL OR max_joins > 0)
);
CREATE INDEX IF NOT EXISTS idx_beta_invites_org ON beta_invites(organization_id);

CREATE TABLE IF NOT EXISTS beta_memberships (
  anon_id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  invite_id TEXT REFERENCES beta_invites(id),
  browser_credential_digest TEXT UNIQUE,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_beta_memberships_org ON beta_memberships(organization_id, created_at);

ALTER TABLE sessions ADD COLUMN organization_id TEXT;
ALTER TABLE sessions ADD COLUMN entry_channel TEXT;
CREATE INDEX IF NOT EXISTS idx_sessions_org ON sessions(organization_id, expires_at);

ALTER TABLE posts ADD COLUMN organization_id TEXT;
CREATE INDEX IF NOT EXISTS idx_posts_org_created ON posts(organization_id, deleted_at, created_at);

-- 逐人产品行为事实；不接受自由文本或原文，属性由写入代码按事件白名单校验。
CREATE TABLE IF NOT EXISTS product_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  anon_id TEXT NOT NULL,
  entry_channel TEXT NOT NULL CHECK (entry_channel IN ('beta_web', 'dingtalk')),
  event_name TEXT NOT NULL,
  occurred_at INTEGER NOT NULL,
  object_type TEXT,
  object_id TEXT,
  properties_json TEXT NOT NULL DEFAULT '{}',
  app_version TEXT NOT NULL,
  content_version TEXT,
  schema_version INTEGER NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  data_origin TEXT NOT NULL DEFAULT 'live' CHECK (data_origin IN ('live', 'demo_seed')),
  CHECK (json_valid(properties_json))
);
CREATE INDEX IF NOT EXISTS idx_product_events_org_time ON product_events(organization_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_product_events_person_time ON product_events(organization_id, anon_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_product_events_name_time ON product_events(organization_id, event_name, occurred_at);

-- 一行代表一次确实展示给参与者的可选问题；未回答也保留，用于计算作答率。
-- answered/skipped 由后续 API 实现；本文不把主观回答当作临床量表分数。
CREATE TABLE IF NOT EXISTS experience_feedback (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  anon_id TEXT NOT NULL,
  question_code TEXT NOT NULL,
  question_version INTEGER NOT NULL CHECK (question_version > 0),
  context_type TEXT NOT NULL CHECK (context_type IN ('chat', 'activity', 'followup')),
  context_id TEXT NOT NULL,
  offered_at INTEGER NOT NULL,
  answer_code TEXT,
  answered_at INTEGER,
  skipped_at INTEGER,
  app_version TEXT NOT NULL,
  content_version TEXT,
  data_origin TEXT NOT NULL DEFAULT 'live' CHECK (data_origin IN ('live', 'demo_seed')),
  CHECK (NOT (answered_at IS NOT NULL AND skipped_at IS NOT NULL)),
  CHECK ((answer_code IS NULL) = (answered_at IS NULL)),
  UNIQUE (anon_id, question_code, question_version, context_type, context_id)
);
CREATE INDEX IF NOT EXISTS idx_experience_feedback_org_question ON experience_feedback(organization_id, question_code, offered_at);
CREATE INDEX IF NOT EXISTS idx_experience_feedback_person ON experience_feedback(organization_id, anon_id, offered_at);
