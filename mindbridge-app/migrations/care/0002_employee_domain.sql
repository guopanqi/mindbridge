-- Care Domain 业务表。约束：任何表都不得出现 userid、姓名、手机号或组织身份字段。
-- 员工主体一律用 identity relay 输出的 canonical anonymous id（anon_id）。
-- data_origin: 'live' = 真实钉钉员工产生；'demo_seed' = 路演预置模拟数据。

CREATE TABLE IF NOT EXISTS profiles (
  anon_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  context_tag TEXT NOT NULL DEFAULT 'none',
  context_decided_at INTEGER,
  onboarded_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'h5',
  turn_count INTEGER NOT NULL DEFAULT 0,
  signal_count INTEGER NOT NULL DEFAULT 0,
  intensity_total REAL NOT NULL DEFAULT 0,
  emotion_history TEXT NOT NULL DEFAULT '[]',
  offered_resources TEXT NOT NULL DEFAULT '[]',
  highest_level TEXT NOT NULL DEFAULT 'green',
  started_at INTEGER NOT NULL,
  last_message_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_conversations_anon ON conversations(anon_id, last_message_at);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  role TEXT NOT NULL,
  body_cipher TEXT NOT NULL,
  content_key_version TEXT NOT NULL,
  risk_level TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  body_cipher TEXT NOT NULL,
  content_key_version TEXT NOT NULL,
  emotion TEXT,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(deleted_at, created_at);

CREATE TABLE IF NOT EXISTS post_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  body_cipher TEXT NOT NULL,
  content_key_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_post_replies_post ON post_replies(post_id, created_at);

CREATE TABLE IF NOT EXISTS post_reactions (
  post_id TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'hug',
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live',
  PRIMARY KEY (post_id, anon_id, kind)
);

-- 资源推荐事件：不含原文，只记录推荐了什么、在什么风险级别下推荐。
CREATE TABLE IF NOT EXISTS resource_events (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  conversation_id TEXT,
  resource_name TEXT NOT NULL,
  resource_level TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'offered',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_resource_events_anon ON resource_events(anon_id, created_at);

-- 风险事件：保留触发规则说明与级别，供审计与聚合，不保留员工原话。
CREATE TABLE IF NOT EXISTS risk_events (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  conversation_id TEXT,
  level TEXT NOT NULL,
  rule TEXT NOT NULL,
  emotion TEXT,
  engine TEXT NOT NULL DEFAULT 'rules-v1',
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_risk_events_created ON risk_events(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_events_anon ON risk_events(anon_id, created_at);

-- 聚合事件：HR 看板唯一可读的来源，永远不含原文与个案标识。
CREATE TABLE IF NOT EXISTS aggregate_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  emotion TEXT,
  level TEXT,
  bucket_day TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_aggregate_events_day ON aggregate_events(bucket_day, event_type);
