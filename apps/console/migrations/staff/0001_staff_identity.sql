-- 工作人员实名身份库。与 mindbridge-care、mindbridge-identity 物理隔离。
--
-- 原则：需要保护的人匿名，负有责任的人实名。
-- 这里保存实名信息是设计要求，不是泄漏；但 care / analytics 侧永远只接收 staff_id。

CREATE TABLE IF NOT EXISTS staff (
  staff_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  -- 钉钉 userid 的 HMAC，用于登录时查找；不可反查。
  subject_lookup TEXT UNIQUE,
  -- 钉钉 userid 的密文，仅在需要回调钉钉时解开；外部账号此列为空。
  subject_cipher TEXT,
  subject_key_version TEXT,
  display_name TEXT NOT NULL,
  -- admin / hr_viewer / healer，逗号分隔
  roles TEXT NOT NULL,
  auth_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_seen_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_staff_tenant ON staff(tenant_id, status);

CREATE TABLE IF NOT EXISTS staff_sessions (
  session_digest TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_sessions_expires ON staff_sessions(expires_at);

-- 一次性 SSO code 记录，防重放。
CREATE TABLE IF NOT EXISTS sso_code_uses (
  code_digest TEXT PRIMARY KEY,
  used_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sso_code_used_at ON sso_code_uses(used_at);

-- 审计：谁、在什么时候、做了什么。对象只记录报表名或匿名个案编号，不含员工原文。
CREATE TABLE IF NOT EXISTS staff_audit (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  action TEXT NOT NULL,
  object_type TEXT,
  object_id TEXT,
  result TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_staff ON staff_audit(staff_id, created_at);
CREATE INDEX IF NOT EXISTS idx_staff_audit_created ON staff_audit(created_at);
