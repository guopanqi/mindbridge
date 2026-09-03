-- Stage 4：个案调度与二次授权。
-- 疗愈师默认只能看到匿名个案编号、风险级别与员工在预约时主动填写的内容；
-- 要看对话上下文必须单独发起请求，并由员工本人在员工端同意。

ALTER TABLE appointments ADD COLUMN claimed_by TEXT;
ALTER TABLE appointments ADD COLUMN claimed_at INTEGER;
ALTER TABLE appointments ADD COLUMN closed_at INTEGER;

CREATE TABLE IF NOT EXISTS case_notes (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  body_cipher TEXT NOT NULL,
  content_key_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_case_notes_appointment ON case_notes(appointment_id, created_at);

-- 二次授权请求。status: pending / approved / denied / expired
CREATE TABLE IF NOT EXISTS context_requests (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  decided_at INTEGER,
  expires_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_context_requests_anon ON context_requests(anon_id, status);
CREATE INDEX IF NOT EXISTS idx_context_requests_appointment ON context_requests(appointment_id, created_at);
