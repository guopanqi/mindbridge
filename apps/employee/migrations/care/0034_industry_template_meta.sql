-- 行业模板的目标陈述：取自 0817 方案“八大行业方案总览”的核心疗愈目标，
-- 管理端模板菜单的副标题直接读这里；模板行变更不影响目标，目标由工作人员按方案演进维护。
CREATE TABLE IF NOT EXISTS industry_template_meta (
  industry TEXT PRIMARY KEY,
  goal TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL,
  updated_by TEXT
);

INSERT OR IGNORE INTO industry_template_meta (industry, goal, updated_at) VALUES
  ('互联网/IT', '从“被时间追着跑”到“掌控时间”', 0),
  ('金融/银行', '从“被KPI压垮”到“重新掌控”', 0),
  ('医护/护理', '从“情绪被掏空”到“被同行托住”', 0),
  ('教育', '从“被掏空”到“被接住”', 0),
  ('客服/服务业', '从“付出情绪”到“被滋养”', 0),
  ('制造业', '从“我一个人”到“我们一起”', 0),
  ('科技企业', '从“我会被替代”到“我能适应变化”', 0),
  ('公益组织', '从“一个人扛”到“大家一起扛”', 0);
