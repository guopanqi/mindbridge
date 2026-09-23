-- 内测疗愈师由系统侧预置，使用唯一登录名进入全局个案台。
ALTER TABLE staff ADD COLUMN login_name TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_staff_login_name ON staff(login_name) WHERE login_name IS NOT NULL;

-- 保留历史个案和审计所用 staff_id；同名历史测试账号不自动获得登录名。
UPDATE staff SET login_name = '李佳', auth_method = 'name_login'
WHERE staff_id = 'stf_demo_healer' AND roles = 'healer' AND status = 'active';
UPDATE staff SET login_name = '评审疗愈师', auth_method = 'name_login'
WHERE staff_id = 'stf_review_healer' AND roles = 'healer' AND status = 'active';

DROP TABLE IF EXISTS healer_invites;
DROP TABLE IF EXISTS staff_access_keys;
