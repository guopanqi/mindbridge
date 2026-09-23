-- 会话绑定组织：企业与公开组织共用同一管理后台，按会话上的组织取数。
ALTER TABLE staff_sessions ADD COLUMN organization_id TEXT;
ALTER TABLE staff_sessions ADD COLUMN organization_kind TEXT;
ALTER TABLE staff_sessions ADD COLUMN organization_name TEXT;
