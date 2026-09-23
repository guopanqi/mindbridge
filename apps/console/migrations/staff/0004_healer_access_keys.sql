-- 预设疗愈师入口。
--
-- 疗愈师不属于客户的钉钉组织，也不应该在内测现场做「生成邀请码 → 复制 → 粘贴」
-- 这种多步操作。改为长期有效的个人入口密钥：一次配置，之后打开链接即已登录。
-- 密钥只存摘要；泄露后可单独吊销而不影响其他疗愈师。
CREATE TABLE IF NOT EXISTS staff_access_keys (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  key_digest TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  last_used_at INTEGER,
  revoked_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_staff_access_keys_staff ON staff_access_keys(staff_id);

-- 疗愈师的执业信息，供个案台展示，不含任何员工信息。
ALTER TABLE staff ADD COLUMN credential TEXT;
