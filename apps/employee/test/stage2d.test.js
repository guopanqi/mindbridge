import assert from 'node:assert/strict';
import test from 'node:test';

import { CRISIS_RESOURCES, safeFallback } from '../functions/api/_lib/harness/safety.js';
import { SCOPES } from '../functions/api/consents.js';
import { MOODS } from '../functions/api/checkin.js';

test('已验证红色状态在模型不可用时仍返回紧急资源', () => {
  const result = safeFallback({ supportLevel: 'red' });
  assert.equal(result.level, 'red');
  assert.ok(result.crisis);
  assert.equal(result.crisis.resources[0].contact, '12356');
  assert.match(result.crisis.disclaimer, /不会替你拨打/);
});

test('普通状态的模型降级不展示紧急资源，避免过度惊吓', () => {
  assert.equal(safeFallback({ supportLevel: 'blue' }).crisis, null);
});

test('紧急资源文案不能宣称 24 小时（官方要求为每日至少 18 小时）', () => {
  for (const item of CRISIS_RESOURCES) {
    assert.ok(!`${item.name}${item.note}`.includes('24'), `${item.name} 不应声称 24 小时`);
  }
});

test('授权项默认可枚举且都有中文说明', () => {
  assert.deepEqual(Object.keys(SCOPES).sort(), ['followup_contact', 'share_context_with_healer']);
  for (const label of Object.values(SCOPES)) assert.ok(label.length > 5);
});

test('打卡选项固定为五档，避免自由文本进入趋势统计', () => {
  assert.equal(MOODS.length, 5);
  assert.ok(MOODS.includes('快撑不住'));
});
