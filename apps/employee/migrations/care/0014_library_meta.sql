-- 资源库浏览所需的元数据：适合什么、核心方法。
-- 员工可以主动浏览全部资源，不必等系统推荐。
ALTER TABLE activities ADD COLUMN suited_for TEXT NOT NULL DEFAULT '';
ALTER TABLE activities ADD COLUMN core_method TEXT NOT NULL DEFAULT '';
ALTER TABLE activities ADD COLUMN level TEXT NOT NULL DEFAULT 'L1';
