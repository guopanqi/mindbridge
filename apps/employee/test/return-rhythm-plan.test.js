import test from 'node:test';
import assert from 'node:assert/strict';
import { privatePlan, shareablePlan } from '../src/activities/return-rhythm-plan.js';

test('可分享返岗计划只带工作安排，排除私人状态和预警信号', () => {
  const state = {
    capacity: '较低', difficulties: ['专注'],
    adjustments: ['灵活安排工作地点或时间', '需要专业支持'],
    otherAdjustment: '每天下午留出交接时间',
    weeks: [
      { schedule: '周一至周四上午', priority: '交接任务', defer: '跨组项目' },
      { schedule: '周一至周五下午', priority: '核心任务', defer: '' },
    ],
    signs: '连续失眠', response: '联系专业人员', reviewDate: '2026-10-02',
  };
  const personal = privatePlan(state);
  const shared = shareablePlan(state);
  for (const phrase of ['较低', '专注', '连续失眠', '联系专业人员', '需要专业支持']) {
    assert.ok(personal.includes(phrase));
    assert.ok(!shared.includes(phrase));
  }
  for (const phrase of ['周一至周四上午', '交接任务', '跨组项目', '2026-10-02']) {
    assert.ok(shared.includes(phrase));
  }
  assert.ok(shared.includes('待商议'));
});
