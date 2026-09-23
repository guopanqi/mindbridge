-- 早期评审脚本把模拟使用量写成 live。仅校正已知评审组织的脚本假号；
-- 不改变评审真实参与者或其他组织的数据。
UPDATE aggregate_events SET data_origin = 'demo_seed'
WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
  AND id LIKE 'agg_rv%' AND data_origin = 'live';

UPDATE messages SET data_origin = 'demo_seed'
WHERE anon_id IN (
  SELECT anon_id FROM subject_organizations
  WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
    AND anon_id LIKE 'rvseed_%'
) AND data_origin = 'live';

UPDATE risk_events SET data_origin = 'demo_seed'
WHERE anon_id IN (
  SELECT anon_id FROM subject_organizations
  WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
    AND anon_id LIKE 'rvseed_%'
) AND data_origin = 'live';

UPDATE resource_events SET data_origin = 'demo_seed'
WHERE anon_id IN (
  SELECT anon_id FROM subject_organizations
  WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
    AND anon_id LIKE 'rvseed_%'
) AND data_origin = 'live';

UPDATE appointments SET data_origin = 'demo_seed'
WHERE organization_id = 'org_beta_ffb0a424ad1549ddbb4f76ab5033ee9e'
  AND anon_id LIKE 'rvseed_%' AND data_origin = 'live';
