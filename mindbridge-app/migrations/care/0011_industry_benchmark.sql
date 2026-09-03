-- 跨企业行业基准。
--
-- 目前只有一个真实租户，行业对照必然是模拟的，因此整表默认 data_origin='demo_seed'，
-- 由接口原样带出，UI 必须据此标注为模拟对照，而不是把「模拟」二字写死在前端。
-- 将来接入多租户后，同一张表可以写入 data_origin='live' 的真实聚合行。
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  industry TEXT PRIMARY KEY,
  companies INTEGER NOT NULL,
  employees INTEGER NOT NULL,
  use_rate REAL NOT NULL,
  completion_rate REAL NOT NULL,
  avg_rating REAL NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'demo_seed',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS industry_topics (
  industry TEXT NOT NULL,
  topic TEXT NOT NULL,
  share REAL NOT NULL,
  delta REAL NOT NULL DEFAULT 0,
  data_origin TEXT NOT NULL DEFAULT 'demo_seed',
  PRIMARY KEY (industry, topic)
);

CREATE TABLE IF NOT EXISTS industry_activity_effects (
  industry TEXT NOT NULL,
  activity TEXT NOT NULL,
  participation_rate REAL NOT NULL,
  completion_rate REAL NOT NULL,
  avg_rating REAL NOT NULL,
  data_origin TEXT NOT NULL DEFAULT 'demo_seed',
  PRIMARY KEY (industry, activity)
);
