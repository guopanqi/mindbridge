-- 去掉活动前后自评：没有前测就不该声称测到了改善效果。
-- 完成活动即记为完成；提交页只留一个可选的帮助度，用与回访一致的三选一措辞。
ALTER TABLE resource_events ADD COLUMN helpfulness TEXT;
-- 历史前后测分数按方案清理：口径已废弃，留着只会被误读成效果证据。
UPDATE resource_events SET pre_score = NULL, post_score = NULL;
