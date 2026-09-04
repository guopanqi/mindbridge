import { buildModelVisibleContext } from './context.js';
import { buildInstructions, PROMPT_VERSION } from './instructions.js';
import { applyStatePatch, validateDecision } from './model-contract.js';
import { executeTool } from './tools.js';

export async function runConversationHarness({ env, gateway, userState, recentMessages, currentMessage, channel = 'h5', profileContext = 'none', now = Date.now(), clock = () => Date.now() }) {
  // 首次调用、契约重试和工具后的措辞调用共享预算，不为每次调用重置计时。
  const deadlineAt = clock() + 8_000;
  const requestId = `mdl_${crypto.randomUUID().replace(/-/g, '')}`;
  const context = buildModelVisibleContext({ userState, recentMessages, currentMessage, channel, profileContext });
  const first = await generateValidated(gateway, {
    instructions: buildInstructions({ userState: context.userState }),
    context,
    promptVersion: PROMPT_VERSION,
  }, deadlineAt, clock);
  let decision = first.decision;
  let activity = null;
  let totalInputTokens = first.usage.inputTokens;
  let totalOutputTokens = first.usage.outputTokens;
  let totalLatencyMs = first.meta.latencyMs;

  // 红色状态不执行普通资源推荐，即使模型错误地提出了工具调用。
  if (decision.toolCall && decision.supportAssessment.level !== 'red' && userState?.supportLevel !== 'red') {
    const toolResult = await executeTool(env, decision.toolCall, { emotion: decision.statePatch.setEmotion, level: decision.supportAssessment.level });
    toolResult.activities = (toolResult.activities || []).filter(
      (item) => !(userState?.recentRecommendations || []).includes(item.id)
    );
    activity = toolResult.activities?.[0] || null;
    const second = await generateValidated(gateway, {
      instructions: buildInstructions({ userState: context.userState, toolPhase: true }),
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

// 模型可能改写标点或只用活动名的前半段，比对时先去掉标点与空白再放宽到前缀。
function mentionsActivity(reply, title) {
  const normalize = (value) => String(value || '').replace(/[\s\p{P}\p{S}]/gu, '');
  const text = normalize(reply);
  const name = normalize(title);
  if (!name) return false;
  return text.includes(name) || (name.length >= 5 && text.includes(name.slice(0, 5)));
}

function addUsage(first, second) {
  return first === null || second === null ? null : first + second;
}
