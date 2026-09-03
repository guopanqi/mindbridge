import assert from 'node:assert/strict';
import test from 'node:test';

import { MIN_SAMPLE, percentage, riskBand, suppress, suppressSeries } from '../functions/api/_lib/metrics.js';

test('样本量低于阈值时不出数，且不泄露真实样本量', () => {
  const result = suppress(42, 9);
  assert.equal(result.suppressed, true);
  assert.equal(result.value, undefined);
  assert.equal(result.sampleSize, null);
  assert.equal(result.minSample, MIN_SAMPLE);
});

test('样本量刚好达到阈值时放行', () => {
  const result = suppress(42, 10);
  assert.equal(result.suppressed, false);
  assert.equal(result.value, 42);
});

test('时间序列逐点判断，样本不足的点单独抑制', () => {
  const series = suppressSeries([
    { bucket: '2026-09-01', value: 3.1, sampleSize: 40 },
    { bucket: '2026-09-02', value: 2.8, sampleSize: 4 },
  ]);
  assert.equal(series[0].suppressed, false);
  assert.equal(series[1].suppressed, true);
  assert.equal(series[1].value, undefined);
});

test('样本量非法（null/NaN）时按抑制处理，不能默认放行', () => {
  for (const bad of [null, undefined, NaN, -1]) {
    assert.equal(suppress(1, bad).suppressed, true, `sampleSize=${bad} 必须抑制`);
  }
});

test('风险人数以区间输出，不给出精确人数', () => {
  assert.equal(riskBand(0), '0');
  assert.equal(riskBand(1), '1-5');
  assert.equal(riskBand(12), '6-15');
  assert.equal(riskBand(99), '30+');
});

test('百分比保留一位小数且分母为零时返回 0', () => {
  assert.equal(percentage(1, 3), 33.3);
  assert.equal(percentage(5, 0), 0);
});
