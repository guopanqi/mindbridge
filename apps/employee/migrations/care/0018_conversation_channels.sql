-- 跨渠道共享身份级锁；租约过期后的旧处理不能提交。
CREATE TABLE conversation_locks (
  anon_id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE conversation_write_guards (token TEXT PRIMARY KEY NOT NULL);

-- 与消息同一事务保存机器人结果，重投不重复调用模型。
-- 不保存钉钉 userid、明文消息或 sessionWebhook。
CREATE TABLE inbound_messages (
  request_key TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  response_cipher TEXT,
  content_key_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX idx_inbound_expiry ON inbound_messages(expires_at);
