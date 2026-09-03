-- 区分资源是系统推荐的还是员工自己找到的，两者的参与率含义不同。
ALTER TABLE resource_events ADD COLUMN source TEXT NOT NULL DEFAULT 'recommended';
