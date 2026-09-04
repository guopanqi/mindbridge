import assert from 'node:assert/strict';
import test from 'node:test';

import { buildModelVisibleContext } from '../functions/api/_lib/harness/context.js';
import { buildInstructions } from '../functions/api/_lib/harness/instructions.js';
import { runConversationHarness } from '../functions/api/_lib/harness/index.js';
import { MODEL_DECISION_SCHEMA, ResponsesModelGateway } from '../functions/api/_lib/harness/model-gateway.js';
import { applyStatePatch, emptyUserState, validateDecision } from '../functions/api/_lib/harness/model-contract.js';
import { fallbackNeedsCrisis, safeFallback } from '../functions/api/_lib/harness/safety.js';
import { searchActivities } from '../functions/api/_lib/harness/tools.js';

const decision = (overrides = {}) => ({
  reply: { text: '我在听。' },
  supportAssessment: { level: 'blue', confidence: 0.7, safetyStatus: 'not_indicated', evidence: [] },
  statePatch: { addTopics: [], removeTopics: [], setEmotion: null, addOpenLoops: [], closeOpenLoops: [] },
  toolCall: null,
  ...overrides,
});

test('所有契约重试共享八秒预算，耗尽后不再调用模型', async () => {
  let time = 0;
  const budgets = [];
  const gateway = { async generate(request) {
    budgets.push(request.timeoutMs);
    time += 4000;
    throw new Error('MODEL_OUTPUT_JSON_INVALID');
  } };
  await assert.rejects(runConversationHarness({
    env: {}, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '你好', clock: () => time,
  }), /MODEL_TIMEOUT/);
  assert.deepEqual(budgets, [8000, 4000]);
});

test('工具无结果直接说明不可用，不浪费第二次措辞调用', async () => {
  let time = 0;
  const budgets = [];
  const gateway = { async generate(request) {
    budgets.push(request.timeoutMs);
    time += 2000;
    return {
      decision: decision(request.toolResult ? {} : { toolCall: { name: 'search_activities', arguments: { query: '睡眠', limit: 1 } } }),
      usage: { inputTokens: 1, outputTokens: 1 },
      meta: { provider: 'fixture', model: 'fixture', latencyMs: 2000 },
    };
  } };
  const env = { CARE_DB: { prepare() { return { bind() { return { async all() {
    time += 1000;
    return { results: [] };
  } }; } }; } } };
  await runConversationHarness({ env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '活动', clock: () => time });
  assert.deepEqual(budgets, [8000]);
});

test('Gateway 在读取响应正文期间超时仍归类为 MODEL_TIMEOUT', async () => {
  const gateway = new ResponsesModelGateway({
    apiOrigin: 'https://model.example', apiKey: 'fixture', model: 'fixture', timeoutMs: 10,
    fetchImpl: async (_url, { signal }) => new Response(new ReadableStream({
      start(controller) { signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError'))); },
    })),
  });
  await assert.rejects(gateway.generate({}), /MODEL_TIMEOUT/);
});

test('Model-visible Context 只保留最近二十条有效对话', () => {
  const recentMessages = Array.from({ length: 26 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', text: `m${index}` }));
  recentMessages.push({ role: 'resource', text: '不应直接进入模型' });
  const context = buildModelVisibleContext({ userState: null, recentMessages, currentMessage: '现在', profileContext: 'manager' });
  assert.equal(context.recentMessages.length, 20);
  assert.equal(context.recentMessages[0].text, 'm6');
  assert.equal(context.currentMessage, '现在');
  assert.equal(context.profileContext, 'manager');
});

test('模型只能提出白名单内的只读活动工具', () => {
  assert.throws(() => validateDecision(decision({ toolCall: { name: 'enroll_activity', arguments: {} } })), /MODEL_TOOL_NOT_ALLOWED/);
  assert.equal(validateDecision(decision({ toolCall: { name: 'search_activities', arguments: { limit: 2 } } })).toolCall.name, 'search_activities');
});

test('State Patch 增量更新状态，不允许模型重写整个 UserState', () => {
  const previous = { ...emptyUserState(), ongoingTopics: ['工作压力'], openLoops: ['是否需要建议'] };
  const next = applyStatePatch(previous, validateDecision(decision({
    supportAssessment: { level: 'yellow', confidence: 0.8, safetyStatus: 'not_indicated', evidence: ['持续失眠'] },
    statePatch: {
      addTopics: ['睡眠困难'], removeTopics: [], setEmotion: '疲惫',
      addOpenLoops: ['失眠是否影响工作'], closeOpenLoops: ['是否需要建议'],
    },
  })), 1234);
  assert.deepEqual(next.ongoingTopics, ['工作压力', '睡眠困难']);
  assert.deepEqual(next.openLoops, ['失眠是否影响工作']);
  assert.equal(next.supportLevel, 'yellow');
  assert.equal(next.updatedAt, 1234);
});

test('自动状态更新只能升级，不能把未关闭的红色状态直接降级', () => {
  const previous = { ...emptyUserState(), supportLevel: 'red', safetyCheck: 'pending' };
  const next = applyStatePatch(previous, validateDecision(decision()), 1234);
  assert.equal(next.supportLevel, 'red');
});

test('用户明确否认即时风险后，待复核红色状态降为黄色', () => {
  const previous = { ...emptyUserState(), supportLevel: 'red', safetyCheck: 'pending' };
  const next = applyStatePatch(previous, validateDecision(decision({
    supportAssessment: { level: 'yellow', confidence: 0.9, safetyStatus: 'denied', evidence: ['明确否认当前想法和计划'] },
  })), 1234);
  assert.equal(next.supportLevel, 'yellow');
  assert.equal(next.safetyCheck, 'resolved');
});

test('观察到即时风险时等级必须是红色', () => {
  assert.throws(() => validateDecision(decision({
    supportAssessment: { level: 'yellow', confidence: 0.8, safetyStatus: 'immediate_risk', evidence: ['明确计划'] },
  })), /MODEL_SAFETY_LEVEL_INCONSISTENT/);
});

test('红色是跨轮状态，本轮观察可以是任意安全状态', () => {
  // 红色用户这一轮只是问活动，模型给 red + not_indicated 是合理的，不能当契约违规。
  for (const safetyStatus of ['not_indicated', 'needs_clarification', 'denied', 'immediate_risk']) {
    const decided = validateDecision(decision({
      supportAssessment: { level: 'red', confidence: 0.8, safetyStatus, evidence: ['x'] },
    }));
    assert.equal(decided.supportAssessment.safetyStatus, safetyStatus);
  }
});

test('动态 Instruction 描述行为，不把状态标签直接暴露给生成模型', () => {
  const instruction = buildInstructions({ userState: { supportLevel: 'red' } });
  assert.match(instruction, /确认即时安全/);
  assert.doesNotMatch(instruction, /红色用户|RED/);
  assert.match(instruction, /不能替用户报名/);
});

test('活动检索只返回 enabled 活动并限制条数', async () => {
  const seen = [];
  const env = {
    CARE_DB: {
      prepare(sql) {
        seen.push(sql);
        return {
          bind(...values) {
            seen.push(values);
            return { all: async () => ({ results: [{ id: 'breathing', title: '三分钟呼吸着陆法' }] }) };
          },
        };
      },
    },
  };
  const result = await searchActivities(env, { query: '我最近压力很大', limit: 99 });
  assert.equal(result.activities[0].id, 'breathing');
  assert.match(seen[0], /enabled = 1/);
  assert.ok(seen[1].length <= 3);
});

test('明确请求活动仅用一次安全评估和真实检索，必定附卡片', async () => {
  let calls = 0;
  const gateway = {
    async generate(request) {
      calls++;
      return {
        decision: request.toolResult
          ? decision({ reply: { text: '可以先看看三分钟呼吸着陆法。' } })
          : decision({ toolCall: { name: 'search_activities', arguments: { query: '压力', limit: 1 } } }),
        usage: { inputTokens: 10, outputTokens: 5 },
        meta: { provider: 'test-fixture', model: 'fixture', latencyMs: 1 },
      };
    },
  };
  const env = {
    CARE_DB: {
      prepare() {
        return {
          bind() {
            return { all: async () => ({ results: [{ id: 'breathing', title: '三分钟呼吸着陆法', description: '放松' }] }) };
          },
        };
      },
    },
  };
  const result = await runConversationHarness({
    env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '有什么活动吗', now: 100,
  });
  assert.equal(calls, 1);
  assert.equal(result.activity.id, 'breathing');
  assert.match(result.decision.reply.text, /三分钟呼吸着陆法/);
  assert.equal(result.modelRun.provider, 'test-fixture');
});

test('红色评估会阻断普通活动工具', async () => {
  let dbCalls = 0;
  const gateway = {
    async generate() {
      return {
        decision: decision({
          supportAssessment: { level: 'red', confidence: 0.95, safetyStatus: 'immediate_risk', evidence: ['即时安全风险'] },
          toolCall: { name: 'search_activities', arguments: { query: '放松', limit: 1 } },
        }),
        usage: { inputTokens: 4, outputTokens: 3 },
        meta: { provider: 'fixture', model: 'fixture', latencyMs: 1 },
      };
    },
  };
  const env = { CARE_DB: { prepare() { dbCalls++; throw new Error('不应访问活动目录'); } } };
  const result = await runConversationHarness({
    env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '现在很危险', now: 100,
  });
  assert.equal(dbCalls, 0);
  assert.equal(result.activity, null);
  assert.equal(result.nextState.supportLevel, 'red');
});

test('显式活动请求不能绕过本轮或跨轮未解决的安全评估', async () => {
  for (const [previous, assessment] of [
    [emptyUserState(), { level: 'red', confidence: 1, safetyStatus: 'immediate_risk', evidence: [] }],
    [{ ...emptyUserState(), supportLevel: 'yellow', safetyCheck: 'pending' }, { level: 'yellow', confidence: 1, safetyStatus: 'needs_clarification', evidence: [] }],
  ]) {
    const gateway = { async generate() { return {
      decision: decision({ reply: { text: '先确认你现在是否安全。' }, supportAssessment: assessment }),
      usage: { inputTokens: 1, outputTokens: 1 }, meta: { provider: 'fixture', model: 'fixture', latencyMs: 1 },
    }; } };
    const env = { CARE_DB: { prepare() { throw new Error('不能检索活动'); } } };
    const result = await runConversationHarness({ env, gateway, userState: previous, recentMessages: [], currentMessage: '还有什么活动？' });
    assert.equal(result.activity, null);
    assert.equal(result.decision.reply.text, '先确认你现在是否安全。');
  }
});

test('工具后的措辞调用不能降低首次安全评估', async () => {
  let calls = 0;
  const gateway = {
    async generate(request) {
      calls++;
      return {
        decision: request.toolResult
          ? decision({ supportAssessment: { level: 'blue', confidence: 0.9, safetyStatus: 'not_indicated', evidence: [] } })
          : decision({
            supportAssessment: { level: 'yellow', confidence: 0.85, safetyStatus: 'not_indicated', evidence: ['持续失眠'] },
            toolCall: { name: 'search_activities', arguments: { query: '睡眠', limit: 1 } },
          }),
        usage: { inputTokens: 2, outputTokens: 1 },
        meta: { provider: 'fixture', model: 'fixture', latencyMs: 2 },
      };
    },
  };
  const env = {
    CARE_DB: { prepare() { return { bind() { return { all: async () => ({ results: [{ id: 'sleep', title: '睡眠活动' }] }) }; } }; } },
  };
  const result = await runConversationHarness({
    env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '一直睡不好', now: 100,
  });
  assert.equal(calls, 2);
  assert.equal(result.decision.supportAssessment.level, 'yellow');
  assert.equal(result.nextState.supportLevel, 'yellow');
  assert.deepEqual(result.modelRun.inputTokens, 4);
  assert.deepEqual(result.modelRun.outputTokens, 2);
});

test('模型偶发违反输出契约时只重试一次', async () => {
  let calls = 0;
  const gateway = {
    async generate() {
      calls++;
      if (calls === 1) throw new Error('MODEL_OUTPUT_JSON_INVALID');
      return {
        decision: decision(), usage: { inputTokens: 2, outputTokens: 1 },
        meta: { provider: 'test-fixture', model: 'fixture', latencyMs: 2 },
      };
    },
  };
  const result = await runConversationHarness({
    env: {}, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '你好', now: 100,
  });
  assert.equal(calls, 2);
  assert.equal(result.decision.reply.text, '我在听。');
});

test('Responses Gateway 关闭供应商存储并使用严格结构化输出', async () => {
  let sent;
  const payload = {
    output: [{ content: [{ type: 'output_text', text: JSON.stringify(decision()) }] }],
    usage: { input_tokens: 12, output_tokens: 8 },
  };
  const gateway = new ResponsesModelGateway({
    apiOrigin: 'https://model.example/v1', apiKey: 'test-key', model: 'test-model',
    fetchImpl: async (url, init) => {
      sent = { url, init, body: JSON.parse(init.body) };
      return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } });
    },
    now: (() => { let value = 100; return () => value += 10; })(),
  });
  const result = await gateway.generate({ instructions: 'instruction', context: { currentMessage: 'hello' } });
  assert.equal(sent.url, 'https://model.example/v1/responses');
  assert.equal(sent.body.store, false);
  assert.deepEqual(sent.body.reasoning, { effort: 'none' });
  assert.equal(sent.body.max_output_tokens, 1600);
  assert.equal(sent.body.text.format.strict, true);
  assert.deepEqual(sent.body.text.format.schema, MODEL_DECISION_SCHEMA);
  assert.equal(result.decision.reply.text, '我在听。');
  assert.deepEqual(result.usage, { inputTokens: 12, outputTokens: 8 });
  assert.equal(result.meta.provider, 'model.example');
});

test('确定性降级不会假装完成正常对话或调用资源', () => {
  const fallback = safeFallback({ supportLevel: 'yellow', emotion: '疲惫' });
  assert.equal(fallback.level, 'yellow');
  assert.equal(fallback.resource, null);
  assert.match(fallback.reply, /暂时没能正常回应/);
});

test('供应商回显 JSON Schema 时仍能取出真正的决策实例', async () => {
  const echo = JSON.stringify(MODEL_DECISION_SCHEMA) + JSON.stringify(decision({ reply: { text: '我在听你说。' } }));
  const gateway = new ResponsesModelGateway({
    apiOrigin: 'https://model.example/v1', apiKey: 'k', model: 'm',
    fetchImpl: async () => new Response(JSON.stringify({
      status: 'completed',
      output: [{ content: [{ type: 'output_text', text: echo }] }],
    }), { status: 200 }),
  });
  const result = await gateway.generate({ instructions: 'i', context: {} });
  assert.equal(result.decision.reply.text, '我在听你说。');
});

test('输出被截断时报可重试的截断错误，而不是当作模型正常回应', async () => {
  const gateway = new ResponsesModelGateway({
    apiOrigin: 'https://model.example/v1', apiKey: 'k', model: 'm',
    fetchImpl: async () => new Response(JSON.stringify({
      status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' },
      output: [{ content: [{ type: 'output_text', text: '{"reply":{"text":"半句' }] }],
    }), { status: 200 }),
  });
  await assert.rejects(() => gateway.generate({ instructions: 'i', context: {} }), /MODEL_OUTPUT_TRUNCATED/);
});

test('情绪只接受固定词表，自创词按未识别处理以免打散 HR 趋势', () => {
  const next = applyStatePatch(emptyUserState(), validateDecision(decision({
    statePatch: { addTopics: [], removeTopics: [], setEmotion: '挫败', addOpenLoops: [], closeOpenLoops: [] },
  })), 1);
  assert.equal(next.emotion, null);
  const known = applyStatePatch(emptyUserState(), validateDecision(decision({
    statePatch: { addTopics: [], removeTopics: [], setEmotion: '疲惫', addOpenLoops: [], closeOpenLoops: [] },
  })), 1);
  assert.equal(known.emotion, '疲惫');
});

test('没有待澄清安全问题时黄色可以降回蓝色，避免永久误报风险事件', () => {
  const previous = { ...emptyUserState(), supportLevel: 'yellow', safetyCheck: 'none' };
  assert.equal(applyStatePatch(previous, validateDecision(decision()), 1).supportLevel, 'blue');
});

test('待澄清期间不允许降级', () => {
  const previous = { ...emptyUserState(), supportLevel: 'yellow', safetyCheck: 'pending' };
  assert.equal(applyStatePatch(previous, validateDecision(decision()), 1).supportLevel, 'yellow');
});

test('模型不可用时，明确求救仍然升级到红色并给出紧急资源', () => {
  const fallback = safeFallback(emptyUserState(), '我今晚就想跳下去');
  assert.equal(fallback.level, 'red');
  assert.ok(fallback.crisis.resources.length > 0);
  assert.equal(fallbackNeedsCrisis('今天加班好累'), false);
});

test('契约违规最多重试到第三次', async () => {
  let calls = 0;
  const gateway = {
    async generate() {
      calls++;
      if (calls < 3) throw new Error('MODEL_OUTPUT_JSON_INVALID');
      return { decision: decision(), usage: { inputTokens: 1, outputTokens: 1 }, meta: { provider: 'f', model: 'f', latencyMs: 1 } };
    },
  };
  const result = await runConversationHarness({ env: {}, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '你好', now: 1 });
  assert.equal(calls, 3);
  assert.equal(result.decision.reply.text, '我在听。');
});

test('Instruction 明确禁止承诺绝对保密并说明真实的隐私边界', () => {
  const instruction = buildInstructions({ userState: {} });
  assert.match(instruction, /不会告诉任何人/);
  assert.match(instruction, /聚合统计/);
  assert.match(instruction, /只输出一个 JSON 实例对象/);
});

test('红色状态下用户否认风险是合法组合，不能当作契约违规', () => {
  const decided = validateDecision(decision({
    supportAssessment: { level: 'red', confidence: 0.8, safetyStatus: 'denied', evidence: ['当前否认想法与计划'] },
  }));
  assert.equal(decided.supportAssessment.safetyStatus, 'denied');
  const next = applyStatePatch({ ...emptyUserState(), supportLevel: 'red', safetyCheck: 'pending' }, decided, 1);
  assert.equal(next.supportLevel, 'yellow');
});

test('文字没提到活动时不挂卡片，避免图文各说各话', async () => {
  const gateway = {
    async generate(request) {
      return {
        decision: request.toolResult
          // 工具查到了活动，但措辞轮完全没提它——此时不应该再挂卡片。
          ? decision({ reply: { text: '这种涣散是最近才开始的，还是一直这样？' } })
          : decision({ toolCall: { name: 'search_activities', arguments: { query: '专注', limit: 1 } } }),
        usage: { inputTokens: 1, outputTokens: 1 }, meta: { provider: 'f', model: 'f', latencyMs: 1 },
      };
    },
  };
  const env = { CARE_DB: { prepare() { return { bind() { return { all: async () => ({ results: [{ id: 'art-group', title: '心流插花艺术疗愈' }] }) }; } }; } } };
  const result = await runConversationHarness({
    env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '有什么能帮我专注', now: 1,
  });
  assert.equal(result.activity, null);
  assert.ok(!result.nextState.recentRecommendations.includes('art-group'));
});

test('模型用简称或改写活动名时仍然挂卡片', async () => {
  // 标题「三分钟呼吸着陆法」被说成「呼吸着陆法」，文字与卡片依然连贯，不该丢。
  for (const wording of ['我这边有一个「呼吸着陆法」，跟着做就行。', '有一项三分钟的呼吸练习，很适合现在。']) {
    const gateway = {
      async generate(request) {
        return {
          decision: request.toolResult
            ? decision({ reply: { text: wording } })
            : decision({ toolCall: { name: 'search_activities', arguments: { query: '放松', limit: 1 } } }),
          usage: { inputTokens: 1, outputTokens: 1 }, meta: { provider: 'f', model: 'f', latencyMs: 1 },
        };
      },
    };
    const env = { CARE_DB: { prepare() { return { bind() { return { all: async () => ({ results: [{ id: 'breathing', title: '三分钟呼吸着陆法' }] }) }; } }; } } };
    const result = await runConversationHarness({
      env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '有什么活动吗', now: 1,
    });
    assert.equal(result.activity?.id, 'breathing', wording);
  }
});

test('文字点名了活动时正常挂卡片', async () => {
  const gateway = {
    async generate(request) {
      return {
        decision: request.toolResult
          ? decision({ reply: { text: '可以试试「心流插花艺术疗愈」，把注意力放回手上的动作。' } })
          : decision({ toolCall: { name: 'search_activities', arguments: { query: '专注', limit: 1 } } }),
        usage: { inputTokens: 1, outputTokens: 1 }, meta: { provider: 'f', model: 'f', latencyMs: 1 },
      };
    },
  };
  const env = { CARE_DB: { prepare() { return { bind() { return { all: async () => ({ results: [{ id: 'art-group', title: '心流插花艺术疗愈' }] }) }; } }; } } };
  const result = await runConversationHarness({
    env, gateway, userState: emptyUserState(), recentMessages: [], currentMessage: '有什么能帮我专注', now: 1,
  });
  assert.equal(result.activity.id, 'art-group');
});
