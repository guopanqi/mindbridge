-- Stage 4 Demo 对齐：个案脱敏背景、部门、标签、SLA与处置流
ALTER TABLE appointments ADD COLUMN department TEXT DEFAULT '研发中心';
ALTER TABLE appointments ADD COLUMN work_profile_json TEXT;
ALTER TABLE appointments ADD COLUMN tags_json TEXT;
ALTER TABLE appointments ADD COLUMN response_minutes INTEGER;
ALTER TABLE appointments ADD COLUMN log_json TEXT;
ALTER TABLE appointments ADD COLUMN sla_at INTEGER;
