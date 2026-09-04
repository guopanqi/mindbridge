ALTER TABLE intervention_matrix ADD COLUMN l1_activity_id TEXT;
ALTER TABLE intervention_matrix ADD COLUMN l2_activity_id TEXT;
-- 仅一次性迁移历史配置；运行时此后只依赖稳定ID。
UPDATE intervention_matrix SET l1_activity_id=(SELECT activity_id FROM resource_catalog WHERE name=l1_name),
 l2_activity_id=(SELECT activity_id FROM resource_catalog WHERE name=l2_name);
