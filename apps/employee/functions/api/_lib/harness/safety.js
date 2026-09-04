export const CRISIS_RESOURCES = [
  {
    name: '全国统一心理援助热线',
    contact: '12356',
    note: '国家卫生健康委统一号码，可提供心理咨询与危机干预',
  },
];

// 只在模型不可用的降级路径上使用：宁可多给一次紧急资源，也不能让明确的求救
// 因为一次 502 就收到"我暂时没能正常回应"。不参与正常对话判断。
const FALLBACK_CRISIS = /自杀|轻生|跳下去|跳楼|不想活|活不下去|结束(自己的)?生命|割腕|上吊|一了百了|想死/;

export function fallbackNeedsCrisis(currentMessage) {
  return FALLBACK_CRISIS.test(String(currentMessage || ''));
}

export function safeFallback(state, currentMessage = '') {
  const escalate = fallbackNeedsCrisis(currentMessage);
  const level = escalate || state?.supportLevel === 'red' ? 'red' : state?.supportLevel === 'yellow' ? 'yellow' : 'green';
  return {
    level,
    emotion: state?.emotion || '平静',
    rule: 'deterministic-safe-fallback',
    reply: level === 'red'
      ? '我暂时没能生成完整回应。如果你现在可能伤害自己，请先远离可能造成伤害的物品，并尽快联系身边可信任的人。'
      : '我暂时没能正常回应，但你刚才的内容已经安全保存。你可以稍后继续，我会从这里接上。',
    resource: null,
    crisis: level === 'red'
      ? { resources: CRISIS_RESOURCES, disclaimer: 'MindBridge 不会替你拨打这些电话，是否联系由你决定。' }
      : null,
  };
}
