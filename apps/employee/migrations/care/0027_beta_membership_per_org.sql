-- 同一浏览器可以分别记住每个组织里的假名。
-- 凭证按「浏览器 + 组织」唯一；换组织不再换发凭证，因此不会丢掉原组织的身份，也不会多占名额。
CREATE TABLE beta_memberships_v2 (
  anon_id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  invite_id TEXT REFERENCES beta_invites(id),
  browser_credential_digest TEXT,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  revoked_at INTEGER,
  UNIQUE (browser_credential_digest, organization_id)
);
INSERT INTO beta_memberships_v2 (anon_id, organization_id, invite_id, browser_credential_digest, created_at, last_seen_at, revoked_at)
SELECT anon_id, organization_id, invite_id, browser_credential_digest, created_at, last_seen_at, revoked_at FROM beta_memberships;
DROP TABLE beta_memberships;
ALTER TABLE beta_memberships_v2 RENAME TO beta_memberships;
CREATE INDEX IF NOT EXISTS idx_beta_memberships_org ON beta_memberships(organization_id, created_at);
CREATE INDEX IF NOT EXISTS idx_beta_memberships_credential ON beta_memberships(browser_credential_digest, organization_id);
