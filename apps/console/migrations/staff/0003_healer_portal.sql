-- 预设疗愈师门户：疗愈师不在客户的钉钉组织里，也不应在内测当天临时兑换邀请码。
-- 一次性配置一个长期有效的门户密钥，密钥在首次打开时立即换成会话 Cookie。
-- 密钥可随时吊销（revoked_at），并且只授予 healer 角色。
CREATE TABLE IF NOT EXISTS healer_portal_keys (
  id TEXT PRIMARY KEY,
  key_digest TEXT NOT NULL UNIQUE,
  staff_id TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  created_at INTEGER NOT NULL,
  last_used_at INTEGER,
  revoked_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_portal_keys_staff ON healer_portal_keys(staff_id);

-- 疗愈师需要展示专业资质抬头（如「UNIHEAL 国际疗愈师 · UH-2024-0871」）。
ALTER TABLE staff ADD COLUMN title TEXT;
