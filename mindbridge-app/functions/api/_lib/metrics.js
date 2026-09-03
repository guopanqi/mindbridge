// HR 聚合指标：唯一允许输出给管理端的数据形态。
//
// 两条硬规则，任何改动都必须保持：
// 1. 输出里不得出现 anon_id、个案编号、原文或任何可定位到个人的字段；
// 2. 任何维度的样本量低于 MIN_SAMPLE 时不出数，返回抑制标记而不是真实值。
//
// 阈值写死在代码里，不做成企业可配置项：可配置的阈值等于给保护开后门。
export const MIN_SAMPLE = 10;

export function suppress(value, sampleSize) {
  if (!Number.isFinite(sampleSize) || sampleSize < MIN_SAMPLE) {
    return { suppressed: true, reason: 'MIN_SAMPLE', minSample: MIN_SAMPLE, sampleSize: null };
  }
  return { suppressed: false, value, sampleSize };
}

// 交叉筛选的防推断：多个维度叠加后样本会变小，必须按叠加后的样本量判断，
// 不能因为父级维度样本够就放行子级。
export function suppressSeries(points) {
  return points.map((point) => ({
    bucket: point.bucket,
    ...suppress(point.value, point.sampleSize),
  }));
}

export function percentage(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

// 风险人数一律以区间输出，避免"红色 1 人"这种在小团队里等于点名的表述。
export function riskBand(count) {
  if (count === 0) return '0';
  if (count <= 5) return '1-5';
  if (count <= 15) return '6-15';
  if (count <= 30) return '16-30';
  return '30+';
}
