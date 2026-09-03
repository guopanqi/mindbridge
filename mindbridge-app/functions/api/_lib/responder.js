// 回应生成的唯一入口。
//
// 当前实现 = 纯规则引擎（Stage 2 基线）。
// 后续接入外部大模型时，模型层只能插在这里，并且只允许改写 `reply` 的措辞：
// `level` / `rule` / `resource` 必须继续由 triage() 产出，模型不得覆盖，
// 也不得因为模型调用失败而降级危机判定——失败时回落到规则回复即可。
import { triage } from './triage.js';

export const CRISIS_RESOURCES = [
  {
    name: '全国统一心理援助热线',
    contact: '12356',
    // 国家卫健委 2024 年 12 月发文启用；各地热线要求每日至少 18 小时服务，
    // 不是全天 24 小时，文案上不要写成 24 小时。
    note: '国家卫生健康委统一号码，可提供心理咨询与危机干预',
  },
];

export function respond(text, state, contextTag) {
  const result = triage(text, state, contextTag);
  return {
    ...result,
    // 危机场景展示可拨打的资源，但系统不会代替员工联系任何人。
    crisis: result.level === 'red'
      ? { resources: CRISIS_RESOURCES, disclaimer: 'MindBridge 不会替你拨打这些电话，是否联系由你决定。' }
      : null,
  };
}
