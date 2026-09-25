const listed = values => values.length ? values.join('、') : '待商议';
const value = text => text?.trim() || '待商议';
const week = (label, item) => `${label}\n工作日与时段：${value(item.schedule)}\n优先任务：${value(item.priority)}\n暂缓或调整：${value(item.defer)}`;

export function privatePlan(state) {
  return [
    '我的返岗节奏计划（仅供本人留存）',
    `生成日期：${new Date().toLocaleDateString('zh-CN')}`,
    '',
    `当前可承受的工作量：${value(state.capacity)}`,
    `目前较困难的方面：${listed(state.difficulties)}`,
    `希望尝试的工作调整：${listed(state.adjustments)}`,
    state.otherAdjustment.trim() ? `其他调整：${state.otherAdjustment.trim()}` : '',
    '',
    week('第 1 周', state.weeks[0]), '', week('第 2 周', state.weeks[1]), '',
    `留意的预警信号：${value(state.signs)}`,
    `出现时准备采取的行动：${value(state.response)}`,
    `计划复盘时间：${value(state.reviewDate)}`,
    '复盘时问自己：哪些调整有效？哪些地方仍然困难？下一阶段保持、增加还是减少？',
    '',
    '这是一份个人草案，可随实际情况与相关人员协商调整。',
  ].filter(line => line !== '').join('\n');
}

export function shareablePlan(state) {
  const workAdjustments = state.adjustments.filter(item => item !== '需要专业支持');
  return [
    '返岗工作安排讨论稿',
    '以下内容由本人选择分享，用于讨论工作安排；尚未协商确认。', '',
    `建议尝试的工作调整：${listed(workAdjustments)}`,
    state.otherAdjustment.trim() ? `其他工作调整：${state.otherAdjustment.trim()}` : '',
    '',
    week('第 1 周', state.weeks[0]), '', week('第 2 周', state.weeks[1]), '',
    `建议复盘时间：${value(state.reviewDate)}`,
    '具体安排、实施时间和持续多久，请双方协商确认。',
  ].filter(line => line !== '').join('\n');
}
