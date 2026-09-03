-- 干预阶梯配置：HR 可编辑的情绪信号 → 资源映射。
-- 这张表是员工端推荐的真实数据源：改这里，员工端下一次推荐就会变。
CREATE TABLE IF NOT EXISTS intervention_matrix (
  emotion TEXT PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT '',
  l1_name TEXT NOT NULL,
  l1_desc TEXT NOT NULL DEFAULT '',
  l2_name TEXT NOT NULL,
  l2_desc TEXT NOT NULL DEFAULT '',
  l3_action TEXT NOT NULL DEFAULT '疗愈师介入',
  enabled INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);

-- 可选资源清单：配置界面的下拉选项，同样可增删。
CREATE TABLE IF NOT EXISTS resource_catalog (
  name TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1
);

-- 办公数据感知：每个信号是否启用、来源、以及是否已真正接通钉钉。
CREATE TABLE IF NOT EXISTS sensing_signals (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 0,
  requires_permission TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);
