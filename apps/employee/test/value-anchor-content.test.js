import test from 'node:test';
import assert from 'node:assert/strict';
import { valueSentence, valueCard } from '../src/activities/value-anchor-content.js';

test('价值表达从个人领域与品质生成，行动限定在未来 24 小时', () => {
  assert.equal(valueSentence('工作', ['可靠', '愿意学习']), '在工作中，我希望成为一个可靠、愿意学习的人。');
  assert.equal(valueSentence('家庭', ['有耐心']), '在家庭中，我希望成为一个有耐心的人。');
  const card = valueCard({ domain: '家庭', qualities: ['有耐心'], statement: '', action: '今晚认真听家人说十分钟', when: '今晚饭后' });
  assert.ok(card.includes('在家庭中'));
  assert.ok(card.includes('未来 24 小时，我会：今晚认真听家人说十分钟'));
  assert.ok(card.includes('今晚饭后'));
});
