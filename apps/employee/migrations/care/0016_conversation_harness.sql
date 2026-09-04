-- Stage 5 对话 Harness 的持久状态与模型运行元数据。
-- UserState 仍属于敏感心理数据，和消息正文一样加密保存。
CREATE TABLE IF NOT EXISTS conversation_state (
  conversation_id TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL DEFAULT 1,
  state_cipher TEXT NOT NULL,
  content_key_version TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE TABLE IF NOT EXISTS model_runs (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  latency_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'live'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_model_runs_request ON model_runs(request_id);
CREATE INDEX IF NOT EXISTS idx_model_runs_conversation ON model_runs(conversation_id, created_at);
