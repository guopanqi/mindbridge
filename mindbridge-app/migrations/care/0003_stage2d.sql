-- Stage 2D：情绪打卡、匿名预约、授权与撤销。
-- 同样只以 anon_id 为主体；预约不保存员工原文，只保存员工明确选择要共享的内容。

CREATE TABLE IF NOT EXISTS mood_checkins (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  mood TEXT NOT NULL,
  stress_score INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  bucket_day TEXT NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_anon ON mood_checkins(anon_id, created_at);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_day ON mood_checkins(bucket_day);

-- 匿名预约：疗愈师只会看到个案编号与员工明确授权的上下文。
-- Stage 2 只实现员工侧；status 停在 requested，疗愈师接单在 Stage 4。
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  case_code TEXT NOT NULL UNIQUE,
  anon_id TEXT NOT NULL,
  conversation_id TEXT,
  risk_level TEXT NOT NULL DEFAULT 'yellow',
  status TEXT NOT NULL DEFAULT 'requested',
  share_context INTEGER NOT NULL DEFAULT 0,
  note_cipher TEXT,
  content_key_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  cancelled_at INTEGER,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_appointments_anon ON appointments(anon_id, created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status, created_at);

-- 授权：员工可随时撤销。撤销保留记录，不物理删除，以便审计"曾经授权过什么"。
CREATE TABLE IF NOT EXISTS consent_grants (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  scope TEXT NOT NULL,
  granted_at INTEGER NOT NULL,
  revoked_at INTEGER,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_consent_anon ON consent_grants(anon_id, scope);
