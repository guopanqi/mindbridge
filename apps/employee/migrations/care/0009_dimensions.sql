-- 部门维度与议题分类：让部门概览和组织议题热度可以从真实数据算出来，
-- 而不是写在代码里。
--
-- department 只存在于模拟 seed 人群；真实员工不采集部门，值为 NULL，
-- 因此真实员工不会出现在任何部门下钻里——这是设计，不是缺陷。
ALTER TABLE profiles ADD COLUMN department TEXT;

-- 议题在发帖时分类并落库，HR 端只做计数，不接触原文。
ALTER TABLE posts ADD COLUMN topic TEXT;
