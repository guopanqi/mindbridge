import { buildModelVisibleContext } from './context.js';
import { buildInstructions, PROMPT_VERSION } from './instructions.js';
import { applyStatePatch, validateDecision } from './model-contract.js';
import { executeTool } from './tools.js';

export async function runConversationHarness({ env, gateway, userState, recentMessages, currentMessage, channel = 'h5', profileContext = 'none', organizationId = null, healerEnabled = false, now = Date.now(), clock = () => Date.now() }) {
  // 首次调用、契约重试和工具后的措辞调用共享预算，不为每次调用重置计时。
  const deadlineAt = clock() + 8_000;
  const requestId = `mdl_${crypto.randomUUID().replace(/-/g, '')}`;
  const context = buildModelVisibleContext({ userState, recentMessages, currentMessage, channel, profileContext });
  const first = await generateValidated(gateway, {
    instructions: buildInstructions({ userState: context.userState, healerEnabled }),
    context,
    promptVersion: PROMPT_VERSION,
  }, deadlineAt, clock);
  let decision = first.decision;
  let activity = null;
  let totalInputTokens = first.usage.inputTokens;
  let totalOutputTokens = first.usage.outputTokens;
  let totalLatencyMs = first.meta.latencyMs;
  const explicitRequest = isActivityRequest(currentMessage);
  const canOffer = decision.supportAssessment.level !== 'red' && userState?.supportLevel !== 'red'
    && decision.supportAssessment.safetyStatus !== 'needs_clarification'
    && (userState?.safetyCheck !== 'pending' || decision.supportAssessment.safetyStatus === 'denied');
  if (explicitRequest && canOffer) {
    decision = { ...decision, toolCall: { name: 'search_activities', arguments: { query: currentMessage, limit: 3 } } };
  }

  // 红色状态不执行普通资源推荐，即使模型错误地提出了工具调用。
  if (decision.toolCall && canOffer) {
    const repeatNamed = explicitRequest && /再|重复|重来/.test(currentMessage)
      && /呼吸|肌肉放松|身体扫描|舒展|三件好事|书写|价值锚点/.test(currentMessage)
      && !/其他|别的|换/.test(currentMessage);
    const toolResult = await executeTool(env, decision.toolCall, {
      emotion: decision.statePatch.setEmotion, level: decision.supportAssessment.level,
      explicitRequest, excludeIds: repeatNamed ? [] : userState?.recentRecommendations || [], organizationId,
    });
    activity = toolResult.activities?.[0] || null;
    if (explicitRequest || !activity) {
      // 功能请求的回答来自检索事实，不再耗费第二轮模型把“想要活动”重新解释成心理诉求。
      const repeated = activity && userState?.recentRecommendations?.includes(activity.id);
      decision = { ...decision, toolCall: null, reply: { text: activity
        ? repeated
          ? `如果你想再做一次，可以打开刚才的「${activity.title}」。`
          : `要不先看看「${activity.title}」？你可以按自己的节奏来。`
        : activityEmptyReply(toolResult.status) } };
    } else {
    const second = await generateValidated(gateway, {
      instructions: buildInstructions({ userState: context.userState, toolPhase: true, healerEnabled }),
      context,
      toolResult,
      promptVersion: PROMPT_VERSION,
    }, deadlineAt, clock);
    const completion = second.decision;
    // 模型偶尔会在措辞轮再提一次检索（尤其查库为空时）。这不值得让整次对话跌进降级回复：
    // 静默丢弃多余的 toolCall，采纳它已经写好的文案即可。
    if (completion.toolCall) {
      console.warn(JSON.stringify({ event: 'harness_tool_loop_ignored', requestId }));
    }
    // 工具后的调用只负责基于真实结果完成措辞，不能覆盖首次安全评估与状态更新。
    decision = { ...decision, reply: completion.reply, toolCall: null };
    // 卡片必须是文字里真正介绍的那一个：模型常常从多条结果里挑第二条来讲，
    // 若固定取第一条，用户看到的卡片会和文字对不上。一条都没提就不挂卡片。
    const named = (toolResult.activities || []).find((item) => mentionsActivity(decision.reply.text, item.title));
    if (!named) {
      console.warn(JSON.stringify({ event: 'harness_activity_card_dropped', requestId, candidates: (toolResult.activities || []).length }));
    }
    activity = named || null;
    totalInputTokens = addUsage(totalInputTokens, second.usage.inputTokens);
    totalOutputTokens = addUsage(totalOutputTokens, second.usage.outputTokens);
    totalLatencyMs += second.meta.latencyMs;
    }
  } else if (decision.toolCall) {
    decision = { ...decision, toolCall: null };
  }

  const nextState = applyStatePatch(userState, decision, now);
  if (activity && !nextState.recentRecommendations.includes(activity.id)) {
    nextState.recentRecommendations = [...nextState.recentRecommendations, activity.id].slice(-12);
  }
  return {
    decision,
    nextState,
    activity,
    modelRun: {
      id: requestId,
      requestId,
      purpose: 'conversation',
      provider: first.meta.provider,
      model: first.meta.model,
      promptVersion: PROMPT_VERSION,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      latencyMs: totalLatencyMs,
      status: 'success',
      createdAt: now,
    },
  };
}

// 只识别当前明确的功能请求，不把提到“活动”本身当成需要推荐。
export function isActivityRequest(text) {
  if (/不(?:想|要|需要)(?:再|做|参加|任何|什么|这些|这个)?(?:活动|练习|音频|视频|呼吸|跟练)|别推荐|不用推荐/.test(text)) return false;
  return /(?:有什么|还有什么|有没有|哪些|什么样的|推荐|找|来一个|来个|换一个|换个|给我|想要|想做|想参加|再做|再来|重来|重复).{0,24}(?:活动|练习|音频|视频|呼吸|跟练)/.test(text)
    || /(?:活动|练习|音频|视频).{0,12}(?:有哪些|有吗|推荐|再来|换一个|换个)/.test(text);
}

function activityEmptyReply(status) {
  if (status === 'exhausted') return '当前可用的活动都已向你推荐过，暂时没有其他活动。可以从之前的卡片或「我的活动」重新打开。';
  if (status === 'configured_repeated') return '这次匹配到的活动之前已经推荐过，可以重新打开之前的卡片，或去活动库看看其他活动。';
  if (status === 'configured_unavailable') return '这次匹配到的活动暂时不可用，可以去活动库查看其他已开放的内容。';
  if (status === 'policy_disabled') return '当前这类活动推荐暂未开放，你可以到「我的活动」里的活动库查看其他可用内容。';
  return '目前没有可用的活动内容，暂时无法提供活动卡片。';
}

async function generateValidated(gateway, request, deadlineAt, clock) {
  const MAX_ATTEMPTS = 3;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const timeoutMs = deadlineAt - clock();
      if (timeoutMs <= 0) throw new Error('MODEL_TIMEOUT');
      const response = await gateway.generate({ ...request, timeoutMs });
      if (clock() >= deadlineAt) throw new Error('MODEL_TIMEOUT');
      return { ...response, decision: validateDecision(response.decision) };
    } catch (error) {
      const code = String(error?.message || '');
      const retryable = /^MODEL_(?:OUTPUT_JSON|DECISION|REPLY|SUPPORT_LEVEL|SAFETY_STATUS|CONFIDENCE|TOOL_ARGUMENTS)_INVALID$/.test(code)
        || code === 'MODEL_SAFETY_LEVEL_INCONSISTENT'
        || code === 'MODEL_OUTPUT_TRUNCATED'
        || code === 'MODEL_OUTPUT_EMPTY';
      if (!retryable || attempt === MAX_ATTEMPTS - 1) throw error;
    }
  }
  throw new Error('MODEL_DECISION_INVALID');
}

// 模型天然会简称或改写活动名：标题「三分钟呼吸着陆法」会被说成「呼吸着陆法」
// 或「三分钟的呼吸练习」，这些和卡片仍是连贯的。要挡的只是文字完全在讲别的事。
// 因此比对最长公共子串而不是精确标题——精确匹配会把大多数合格回复也丢掉。
const MIN_SHARED_RUN = 3;
function mentionsActivity(reply, title) {
  const normalize = (value) => String(value || '').replace(/[\s\p{P}\p{S}]/gu, '');
  const text = normalize(reply);
  const name = normalize(title);
  if (!name || !text) return false;
  if (name.length <= MIN_SHARED_RUN) return text.includes(name);
  let previous = new Array(text.length + 1).fill(0);
  for (let i = 1; i <= name.length; i++) {
    const current = new Array(text.length + 1).fill(0);
    for (let j = 1; j <= text.length; j++) {
      if (name[i - 1] !== text[j - 1]) continue;
      current[j] = previous[j - 1] + 1;
      if (current[j] >= MIN_SHARED_RUN) return true;
    }
    previous = current;
  }
  return false;
}

function addUsage(first, second) {
  return first === null || second === null ? null : first + second;
}
