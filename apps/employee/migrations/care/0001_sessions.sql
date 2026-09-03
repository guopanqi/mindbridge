CREATE TABLE IF NOT EXISTS sessions (
  session_digest TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
