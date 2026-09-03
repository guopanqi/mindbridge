-- 资源反馈：让「活动效果」有真实数据来源。
-- 员工可以标记自己参加/完成了某项资源并打分；HR 端只看聚合，看不到是谁。
ALTER TABLE resource_events ADD COLUMN rating INTEGER;
ALTER TABLE resource_events ADD COLUMN feedback_at INTEGER;
