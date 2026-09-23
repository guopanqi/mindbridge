-- 内测期所有新支持请求默认交由李佳；分配与受理分开记录。
ALTER TABLE appointments ADD COLUMN assigned_staff_id TEXT;
CREATE INDEX IF NOT EXISTS idx_appointments_assignee ON appointments(assigned_staff_id, status, created_at);

-- 评审组织现有演示个案也交给李佳，避免演示时由已停用的假账号占住。
UPDATE appointments
SET assigned_staff_id = 'stf_demo_healer',
    claimed_by = CASE WHEN claimed_by IS NULL THEN NULL ELSE 'stf_demo_healer' END
WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
  AND data_origin = 'demo_seed';

UPDATE context_requests SET staff_id = 'stf_demo_healer'
WHERE data_origin = 'demo_seed'
  AND appointment_id IN (
    SELECT id FROM appointments
    WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
      AND data_origin = 'demo_seed'
  );
