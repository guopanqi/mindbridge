-- 活动回访：按真实时间到期，不做演示加速。
--
-- 到期时间是真实的自然日间隔（默认 3 天）。没有推送通道时，
-- 员工下次打开树洞才会看到回访问题——这是如实的行为，不伪造「已推送」。
CREATE TABLE IF NOT EXISTS follow_ups (
  id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  resource_event_id TEXT,
  activity_id TEXT,
  activity_title TEXT NOT NULL,
  question TEXT NOT NULL,
  due_at INTEGER NOT NULL,
  state TEXT NOT NULL DEFAULT 'scheduled',
  answer TEXT,
  answered_at INTEGER,
  delivered_at INTEGER,
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON follow_ups(anon_id, state, due_at);
