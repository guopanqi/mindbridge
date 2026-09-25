-- 行业干预模板：工作人员在服务端维护的多行业预设，来源于原型 TPL，
-- 但只引用当前活动库中真实存在的活动 ID（L1 线上自助 + L2 线下小组）。
-- 模板只写差异情绪：未列出的情绪沿用 intervention_matrix 全局默认。
-- 企业/公开组织套用时整批拷贝进 organization_intervention_matrix，之后仍可逐行微调；
-- 活动退役或新增时由工作人员更新模板行，无需改客户端。
CREATE TABLE IF NOT EXISTS industry_matrix_templates (
  industry TEXT NOT NULL,
  emotion TEXT NOT NULL,
  l1_activity_id TEXT,
  l2_activity_id TEXT,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  PRIMARY KEY (industry, emotion)
);

-- 模板行不设外键：活动由内容导入脚本维护、情绪行可能被运维调整，模板种子必须能独立存在；
-- 写入与套用时由代码校验情绪与活动的存在性与层级，缺失的行跳过并如实报告。
INSERT OR IGNORE INTO industry_matrix_templates (industry, emotion, l1_activity_id, l2_activity_id, enabled, updated_at) VALUES
  ('互联网/IT', '焦虑', 'breathing', 'mindfulness-workshop', 1, 0),
  ('互联网/IT', '疲惫', 'bodyscan-text', 'mindfulness-workshop', 1, 0),
  ('互联网/IT', '紧张', 'pmr', 'mindfulness-workshop', 1, 0),
  ('互联网/IT', '迷茫', 'value-anchor', 'identity-story-group', 1, 0),
  ('金融/银行', '焦虑', 'breathing', 'mindfulness-workshop', 1, 0),
  ('金融/银行', '紧张', 'pmr', 'mindfulness-workshop', 1, 0),
  ('金融/银行', '迷茫', 'value-anchor', 'identity-story-group', 1, 0),
  ('金融/银行', '孤独', 'writing-practice', 'mindfulness-workshop', 1, 0),
  ('医护/护理', '疲惫', 'stretch-guide', 'balint-peer-group', 1, 0),
  ('医护/护理', '低落', 'gratitude-checkin', 'balint-peer-group', 1, 0),
  ('医护/护理', '迷茫', 'value-anchor', 'balint-peer-group', 1, 0),
  ('医护/护理', '紧张', 'pmr', 'balint-peer-group', 1, 0),
  ('教育', '疲惫', 'stretch-guide', 'mindfulness-workshop', 1, 0),
  ('教育', '低落', 'gratitude-checkin', 'mindfulness-workshop', 1, 0),
  ('教育', '烦躁', 'pause-card', 'flow-flower-group', 1, 0),
  ('教育', '委屈', 'writing-practice', 'flow-flower-group', 1, 0),
  ('教育', '愤怒', 'pause-card', 'mindfulness-workshop', 1, 0),
  ('客服/服务业', '烦躁', 'pause-card', 'flow-flower-group', 1, 0),
  ('客服/服务业', '委屈', 'writing-practice', 'flow-flower-group', 1, 0),
  ('客服/服务业', '愤怒', 'pause-card', 'flow-flower-group', 1, 0),
  ('客服/服务业', '孤独', 'gratitude-checkin', 'mindfulness-workshop', 1, 0),
  ('客服/服务业', '疲惫', 'bodyscan-text', 'flow-flower-group', 1, 0),
  ('制造业', '孤独', 'bodyscan-text', 'mindfulness-workshop', 1, 0),
  ('制造业', '紧张', 'stretch-guide', 'mindfulness-workshop', 1, 0),
  ('制造业', '愤怒', 'pause-card', 'mindfulness-workshop', 1, 0),
  ('制造业', '疲惫', 'bodyscan-text', 'mindfulness-workshop', 1, 0),
  ('制造业', '迷茫', 'value-anchor', 'identity-story-group', 1, 0),
  ('科技企业', '焦虑', 'breathing', 'identity-story-group', 1, 0),
  ('科技企业', '迷茫', 'value-anchor', 'identity-story-group', 1, 0),
  ('科技企业', '孤独', 'writing-practice', 'mindfulness-workshop', 1, 0),
  ('科技企业', '紧张', 'pmr', 'mindfulness-workshop', 1, 0),
  ('公益组织', '疲惫', 'breathing', 'balint-peer-group', 1, 0),
  ('公益组织', '低落', 'gratitude-checkin', 'balint-peer-group', 1, 0),
  ('公益组织', '委屈', 'writing-practice', 'flow-flower-group', 1, 0),
  ('公益组织', '孤独', 'writing-practice', 'mindfulness-workshop', 1, 0);
