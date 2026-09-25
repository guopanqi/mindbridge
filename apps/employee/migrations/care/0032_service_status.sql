-- 产品侧服务状态独立于组织启停；组织可以预先配置尚未开放的服务。
CREATE TABLE service_status (
  service_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('coming_soon', 'open', 'paused', 'retired')),
  preview_visible INTEGER NOT NULL DEFAULT 0 CHECK (preview_visible IN (0, 1)),
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);

INSERT INTO service_status (service_id, status, preview_visible, updated_at)
SELECT 'activity:' || id,
  CASE WHEN content_available = 1 AND enabled = 1 THEN 'open' ELSE 'coming_soon' END,
  CASE WHEN kind = 'offline' AND content_available = 0 THEN 1 ELSE 0 END,
  0 FROM activities;

INSERT INTO service_status (service_id, status, preview_visible, updated_at)
VALUES ('healer-referral', 'coming_soon', 0, 0);
