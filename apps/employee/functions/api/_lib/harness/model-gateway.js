const MAX_RESPONSE_BYTES = 256 * 1024;
const DEFAULT_TIMEOUT_MS = 8_000;

export const MODEL_DECISION_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['reply', 'supportAssessment', 'statePatch', 'toolCall'],
  properties: {
    reply: {
      type: 'object', additionalProperties: false, required: ['text'],
      properties: { text: { type: 'string', minLength: 1, maxLength: 2000 } },
    },
    supportAssessment: {
      type: 'object', additionalProperties: false, required: ['level', 'confidence', 'safetyStatus', 'evidence'],
      properties: {
        level: { type: 'string', enum: ['blue', 'yellow', 'red'] },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        safetyStatus: { type: 'string', enum: ['not_indicated', 'needs_clarification', 'immediate_risk', 'denied'] },
        evidence: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 160 } },
      },
    },
    statePatch: {
      type: 'object', additionalProperties: false,
      required: ['addTopics', 'removeTopics', 'setEmotion', 'addOpenLoops', 'closeOpenLoops'],
      properties: {
        addTopics: { type: 'array', maxItems: 12, items: { type: 'string', maxLength: 80 } },
        removeTopics: { type: 'array', maxItems: 12, items: { type: 'string', maxLength: 80 } },
        setEmotion: { type: ['string', 'null'], maxLength: 40 },
        addOpenLoops: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 160 } },
        closeOpenLoops: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 160 } },
      },
    },
    toolCall: {
      anyOf: [
        { type: 'null' },
        {
          type: 'object', additionalProperties: false, required: ['name', 'arguments'],
          properties: {
            name: { type: 'string', enum: ['search_activities'] },
            arguments: {
              type: 'object', additionalProperties: false, required: ['query', 'limit'],
              properties: {
                query: { type: 'string', maxLength: 200 },
                limit: { type: 'integer', minimum: 1, maximum: 3 },
              },
            },
          },
        },
      ],
    },
  },
};

async function readJsonBounded(response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('MODEL_EMPTY_RESPONSE');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error('MODEL_RESPONSE_TOO_LARGE');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function outputText(payload) {
  if (typeof payload.output_text === 'string') return payload.output_text;
  const parts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && typeof content.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('');
}

export class ResponsesModelGateway {
  constructor({ apiOrigin, apiKey, model, timeoutMs = DEFAULT_TIMEOUT_MS, fetchImpl, now = () => Date.now() }) {
    if (!apiOrigin || !apiKey || !model) throw new Error('MODEL_CONFIGURATION_MISSING');
    this.url = `${apiOrigin.replace(/\/$/, '')}/responses`;
    this.provider = new URL(apiOrigin).hostname;
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
    // workerd 的 fetch 依赖宿主 this，不能把裸函数引用直接保存后再调用。
    this.fetchImpl = fetchImpl || ((input, init) => fetch(input, init));
    this.now = now;
  }

  async generate(request) {
    const startedAt = this.now();
    const controller = new AbortController();
    const timeoutMs = Math.min(this.timeoutMs, request.timeoutMs ?? this.timeoutMs);
    if (timeoutMs <= 0) throw new Error('MODEL_TIMEOUT');
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response;
      try {
        response = await this.fetchImpl(this.url, {
          method: 'POST', signal: controller.signal,
          headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            store: false,
            // 对话决策需要低延迟和稳定结构，不需要暴露或续接推理链。
            reasoning: { effort: 'none' },
            max_output_tokens: 1600,
            instructions: request.instructions,
            input: JSON.stringify({ context: request.context, toolResult: request.toolResult || null }),
            text: {
              format: {
                type: 'json_schema', name: 'mindbridge_decision', strict: true,
                schema: MODEL_DECISION_SCHEMA,
              },
            },
          }),
        });
      } catch (error) {
        if (error?.name === 'AbortError') throw new Error('MODEL_TIMEOUT');
        console.error(JSON.stringify({
          event: 'model_gateway_network_error',
          errorName: String(error?.name || 'unknown').slice(0, 40),
          errorMessage: String(error?.message || 'unknown').slice(0, 160),
          causeCode: String(error?.cause?.code || '').slice(0, 60),
        }));
        throw new Error('MODEL_NETWORK_FAILED');
      }
      let payload;
      try {
        payload = await readJsonBounded(response);
      } catch (error) {
        if (controller.signal.aborted) throw new Error('MODEL_TIMEOUT');
        if (String(error?.message || '').startsWith('MODEL_')) throw error;
        throw new Error('MODEL_RESPONSE_JSON_INVALID');
      }
      if (!response.ok) throw new Error(`MODEL_HTTP_${response.status}`);
      // 截断的 JSON 与"模型没话说"是两回事，重试策略不同，必须分开报。
      if (payload.status === 'incomplete') throw new Error('MODEL_OUTPUT_TRUNCATED');
      const text = outputText(payload);
      if (!text) throw new Error('MODEL_OUTPUT_EMPTY');
      return {
        decision: parseDecision(text),
        usage: { inputTokens: payload.usage?.input_tokens ?? null, outputTokens: payload.usage?.output_tokens ?? null },
        meta: { provider: this.provider, model: this.model, latencyMs: Math.max(0, this.now() - startedAt) },
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

// 供应商的 strict json_schema 并非约束解码：模型会把 schema 本身当作正文回显，
// 有时还会在其后紧跟真正的实例。逐个扫描顶层 JSON 对象，取第一个像 ModelDecision 的。
function parseDecision(text) {
  for (const candidate of jsonObjects(text)) {
    if (candidate && typeof candidate === 'object' && candidate.reply && typeof candidate.reply.text === 'string') {
      return candidate;
    }
  }
  throw new Error('MODEL_OUTPUT_JSON_INVALID');
}

function* jsonObjects(text) {
  for (let start = text.indexOf('{'); start !== -1; start = text.indexOf('{', start + 1)) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') inString = true;
      else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) {
        try { yield JSON.parse(text.slice(start, i + 1)); } catch { /* 不是完整对象，继续找下一个起点 */ }
        start = i;
        break;
      }
    }
  }
}

export function createModelGateway(env) {
  return new ResponsesModelGateway({
    apiOrigin: env.MODEL_API_ORIGIN || 'https://api.openai.com/v1',
    apiKey: env.MODEL_API_KEY,
    model: env.MODEL_NAME,
    timeoutMs: Number(env.MODEL_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  });
}
