import { withConversationLock } from './lock.js';
import { hydrateCards } from './card-state.js';
// 倾诉树洞：员工原文与 UserState 只以密文进入 care D1；模型输出必须经过 Harness 校验。
import {
  ApiError, aggregateStatement, ensureProfile, newId,
  openBody, requireText, sealBody,
} from '../care.js';
import { createModelGateway } from '../harness/model-gateway.js';
import { emptyUserState } from '../harness/model-contract.js';
import { runConversationHarness } from '../harness/index.js';
import { CRISIS_RESOURCES, fallbackNeedsCrisis, safeFallback } from '../harness/safety.js';

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const HISTORY_LIMIT = 60;
const RETENTION_DAYS = 180;

const messageAad = (conversationId) => `care:message:${conversationId}`;
const stateAad = (conversationId) => `care:state:${conversationId}`;

async function loadHarnessState(env, conversationId) {
  const row = await env.CARE_DB.prepare(
    'SELECT state_cipher, content_key_version, revision FROM conversation_state WHERE conversation_id = ?'
  ).bind(conversationId).first();
  if (!row) return { state: emptyUserState(), revision: 0 };
  const plaintext = await openBody(env, row.state_cipher, row.content_key_version, stateAad(conversationId));
  if (!plaintext) throw new Error('HARNESS_STATE_DECRYPT_FAILED');
  try {
    return { state: { ...emptyUserState(), ...JSON.parse(plaintext) }, revision: Number(row.revision) || 0 };
  } catch {
    throw new Error('HARNESS_STATE_INVALID');
  }
}

// AAD 绑定 conversationId，而会话按 anon_id 唯一（见 activeConversation），与 channel 无关。
// 渠道共享同一会话，历史逐条按原 conversationId 解密。
async function loadConversationMessages(env, conversationId, limit = 20) {
  const { results } = await env.CARE_DB.prepare(
    `SELECT role, body_cipher, content_key_version, created_at
     FROM messages WHERE conversation_id = ? AND role IN ('user','assistant')
     ORDER BY created_at DESC, rowid DESC LIMIT ?`
  ).bind(conversationId, limit).all();
  const out = [];
  for (const row of (results || []).slice().reverse()) {
    const text = await openBody(env, row.body_cipher, row.content_key_version, messageAad(conversationId));
    if (text !== null) out.push({ role: row.role, text, at: row.created_at });
  }
  return out;
}

async function respondWithHarness(env, { text, conversation, profileContext, now, channel }) {
  let harness;
  let revision;
  let loadedState = emptyUserState();
  try {
    const loaded = await Promise.all([
      loadHarnessState(env, conversation.id).catch(() => { throw new Error('HARNESS_STATE_LOAD_FAILED'); }),
      loadConversationMessages(env, conversation.id).catch(() => { throw new Error('HARNESS_HISTORY_LOAD_FAILED'); }),
    ]);
    revision = loaded[0].revision;
    loadedState = loaded[0].state;
    harness = await runConversationHarness({
      env,
      gateway: createModelGateway(env),
      userState: loaded[0].state,
      recentMessages: loaded[1],
      currentMessage: text,
      channel,
      profileContext,
      now,
    });
  } catch (error) {
    // 不记录输入与异常正文；不假装生成了正常回复，也不更新语义状态。
    console.error(JSON.stringify({ event: 'conversation_model_unavailable', reasonCode: modelFailureCode(error) }));
    // 降级时也要发出紧急资源卡片，否则明确求救会只收到一句"暂时没能回应"。
    return {
      result: safeFallback(loadedState, text),
      enteredRed: fallbackNeedsCrisis(text) && loadedState.supportLevel !== 'red',
      degraded: true,
    };
  }
  const level = harness.nextState.supportLevel === 'blue'
    ? 'green'
    : harness.nextState.supportLevel;
  const resource = harness.activity ? {
    name: harness.activity.title,
    description: harness.activity.description,
    icon: '🌿',
    level: harness.activity.level || 'L1',
    emotion: harness.nextState.emotion || '平静',
    configured: true,
    activityId: harness.activity.id,
  } : null;
  return {
    result: {
      level,
      emotion: harness.nextState.emotion || '平静',
      rule: `harness-v1 · confidence ${harness.decision.supportAssessment.confidence.toFixed(2)}`,
      reply: harness.decision.reply.text,
      resource,
      crisis: level === 'red'
        ? { resources: CRISIS_RESOURCES, disclaimer: 'MindBridge 不会替你拨打，打不打由你决定。' }
        : null,
    },
    harness: { ...harness, revision },
    enteredRed: loadedState.supportLevel !== 'red' && harness.nextState.supportLevel === 'red',
  };
}

function modelFailureCode(error) {
  const message = String(error?.message || '');
  if (error?.name === 'AbortError') return 'MODEL_TIMEOUT';
  if (/^(MODEL|HARNESS)_[A-Z0-9_]+$/.test(message)) return message;
  if (/^MODEL_HTTP_\d{3}$/.test(message)) return message;
  if (message.includes('fetch failed')) return 'MODEL_NETWORK_FAILED';
  return 'MODEL_RUNTIME_FAILED';
}

export async function loadMessages(env, anonId, limit = HISTORY_LIMIT) {
  const { results } = await env.CARE_DB.prepare(
    'SELECT id, conversation_id, role, body_cipher, content_key_version, created_at FROM messages WHERE anon_id = ? ORDER BY created_at DESC, rowid DESC LIMIT ?'
  ).bind(anonId, limit).all();
  const ordered = (results || []).slice().reverse();
  const out = [];
  for (const row of ordered) {
    const text = await openBody(env, row.body_cipher, row.content_key_version, messageAad(row.conversation_id));
    if (text === null) continue;
    out.push(shape(row, text));
  }
  return hydrateCards(env, anonId, out);
}

function shape(row, text) {
  if (row.role === 'resource' || row.role === 'consent' || row.role === 'crisis') {
    let payload = null;
    try { payload = JSON.parse(text); } catch { payload = null; }
    return { id: row.id, role: row.role, at: row.created_at, card: payload };
  }
  return { id: row.id, role: row.role, at: row.created_at, text };
}

async function activeConversation(env, anonId, now) {
  const row = await env.CARE_DB.prepare(
    'SELECT id, channel, turn_count, signal_count, intensity_total, emotion_history, offered_resources, highest_level, last_message_at FROM conversations WHERE anon_id = ? ORDER BY last_message_at DESC LIMIT 1'
  ).bind(anonId).first();
  // 树洞是长期关系容器；时间间隔只影响未来的上下文压缩，不切断会话身份。
  if (row) return row;
  const id = newId('conv');
  await env.CARE_DB.prepare(
    'INSERT INTO conversations (id, anon_id, channel, started_at, last_message_at, data_origin) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, anonId, 'h5', now, now, 'live').run();
  return {
    id, turn_count: 0, signal_count: 0, intensity_total: 0,
    emotion_history: '[]', offered_resources: '[]', highest_level: 'green', last_message_at: now,
  };
}

export async function handleInbound({ env, anonId, text, channel = 'h5', requestKey = null, fingerprint = null }) {
  if (!['h5', 'dingtalk'].includes(channel)) throw new ApiError('CHANNEL_INVALID');
  return withConversationLock(env, anonId, async ({ fence, unfence }) => {
    if (requestKey) {
      const cached = await env.CARE_DB.prepare('SELECT anon_id, fingerprint, response_cipher, content_key_version FROM inbound_messages WHERE request_key=?').bind(requestKey).first();
      if (cached) {
        if (cached.anon_id !== anonId || cached.fingerprint !== fingerprint) throw new ApiError('INBOUND_CONFLICT', 409);
        if (!cached.response_cipher) throw new ApiError('INBOUND_CLEARED', 410);
        const plaintext = await openBody(env, cached.response_cipher, cached.content_key_version, `care:inbound:${requestKey}`);
        if (!plaintext) throw new ApiError('INBOUND_UNREADABLE', 503);
        return JSON.parse(plaintext);
      }
    }
    const { profile } = await ensureProfile(env, anonId);
    text = requireText(text, { min: 1, max: 800, field: 'text' });
    const now = Date.now();

    const recent = await env.CARE_DB.prepare(
      "SELECT COUNT(*) AS n FROM messages WHERE anon_id = ? AND role = 'user' AND created_at > ?"
    ).bind(anonId, now - RATE_WINDOW_MS).first();
    if ((recent?.n || 0) >= RATE_LIMIT) {
      throw new ApiError('RATE_LIMITED', 429, '你发送得有点快，休息一下再继续，我一直在。');
    }

    const conversation = await activeConversation(env, anonId, now);
    const aad = messageAad(conversation.id);
    const expiresAt = now + RETENTION_DAYS * 86400_000;

    const engineOutput = await respondWithHarness(env, {
      text, conversation, profileContext: profile.context_tag, now, channel,
    });
    const result = engineOutput.result;
    const userSealed = await sealBody(env, text, aad);
    const replySealed = await sealBody(env, result.reply, aad);

    const insert = (id, role, sealed, riskLevel, at) => env.CARE_DB.prepare(
      'INSERT INTO messages (id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, expires_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, conversation.id, anonId, role, sealed.cipher, sealed.version, riskLevel, at, expiresAt, 'live');

    const userId = newId('msg');
    const replyId = newId('msg');
    const statements = [
      insert(userId, 'user', userSealed, result.level, now),
      insert(replyId, 'assistant', replySealed, result.level, now + 1),
      aggregateStatement(env, { eventType: 'chat_message', emotion: result.emotion, level: result.level, at: now }),
    ];

    if (engineOutput.harness) {
      const sealedState = await sealBody(env, JSON.stringify(engineOutput.harness.nextState), stateAad(conversation.id));
      const run = engineOutput.harness.modelRun;
      statements.push(env.CARE_DB.prepare(
        `INSERT INTO conversation_state
           (conversation_id, schema_version, state_cipher, content_key_version, revision, updated_at, data_origin)
         VALUES (?, ?, ?, ?, ?, ?, 'live')
         ON CONFLICT(conversation_id) DO UPDATE SET
           schema_version = excluded.schema_version,
           state_cipher = excluded.state_cipher,
           content_key_version = excluded.content_key_version,
           revision = excluded.revision,
           updated_at = excluded.updated_at
         WHERE conversation_state.revision = ?`
      ).bind(
        conversation.id, engineOutput.harness.nextState.schemaVersion,
        sealedState.cipher, sealedState.version, engineOutput.harness.revision + 1, now,
        engineOutput.harness.revision
      ));
      statements.push(env.CARE_DB.prepare(
        `INSERT INTO model_runs
           (id, conversation_id, request_id, purpose, provider, model, prompt_version,
            input_tokens, output_tokens, latency_ms, status, created_at, data_origin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live')`
      ).bind(
        run.id, conversation.id, run.requestId, run.purpose, run.provider, run.model,
        run.promptVersion, run.inputTokens, run.outputTokens, run.latencyMs, run.status, run.createdAt
      ));
    }
    const appended = [
      { id: userId, role: 'user', at: now, text },
      { id: replyId, role: 'assistant', at: now + 1, text: result.reply },
    ];

    if (result.resource) {
      const cardId = newId('msg');
      const resourceEventId = newId('res');
      // 卡片里带上推荐事件 id，员工点开就能直接进入活动引导流程。
      result.resource.eventId = resourceEventId;
      const sealed = await sealBody(env, JSON.stringify(result.resource), aad);
      statements.push(insert(cardId, 'resource', sealed, result.level, now + 2));
      // 推荐理由只用本次识别到的情绪，不引用原文：这条会显示在「我的活动」里，
      // 也可能被别人瞥见，所以措辞必须是员工自己看了不难堪的程度。
      const offerReason = result.emotion ? `根据你刚才说到的「${result.emotion}」` : '根据你刚才说的情况';
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO resource_events (id, anon_id, conversation_id, resource_name, resource_level, risk_level, state, created_at, updated_at, data_origin, activity_id, offer_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(resourceEventId, anonId, conversation.id, result.resource.name, result.resource.level, result.level, 'offered', now, now, 'live', result.resource.activityId || null, offerReason));
      statements.push(aggregateStatement(env, { eventType: 'resource_offered', emotion: result.emotion, level: result.level, at: now }));
      appended.push({ id: cardId, role: 'resource', at: now + 2, card: result.resource });
    }

    if (result.level === 'red' && engineOutput.enteredRed) {
      // 红色第一步：先给人，不给号码。说明边界并征求知情同意，绝不谎称已代为联系任何人。
      const card = {
        kind: 'consent',
        tone: 'urgent',
        title: '这件事不该你一个人扛',
        body: '我能陪你说话，但我不能替代专业支持。只要你同意，值班的持证疗愈师会在 30 分钟内联系你，全程只用一个个案编号，他不会知道你是谁、在哪个部门。',
        actions: [
          { label: '我愿意，请安排疗愈师', action: 'request_appointment' },
          { label: '暂时不用，我想再待会儿', action: 'dismiss' },
        ],
      };
      const cardId = newId('msg');
      const sealed = await sealBody(env, JSON.stringify(card), aad);
      statements.push(insert(cardId, 'consent', sealed, 'red', now + 3));
      appended.push({ id: cardId, role: 'consent', at: now + 3, card });
    }

    // 热线不是红色的默认推送：只有当同意卡已经给过、员工还没接受，红色又持续了一轮时才补上，
    // 而且整段对话只补这一次——反复弹号码，对已经说"说了也没用"的人只是噪音。
    // 模型不可用的降级路径例外：那一轮拿不到判断，宁可多给一次号码。
    if (result.level === 'red' && result.crisis && (!engineOutput.enteredRed || engineOutput.degraded)) {
      const already = await env.CARE_DB.prepare(
        "SELECT 1 AS hit FROM messages WHERE anon_id = ? AND role = 'crisis' LIMIT 1"
      ).bind(anonId).first();
      const offered = engineOutput.degraded || await env.CARE_DB.prepare(
        "SELECT 1 AS hit FROM messages WHERE anon_id = ? AND role = 'consent' LIMIT 1"
      ).bind(anonId).first();
      if (!already && offered) {
        const crisisCard = { kind: 'crisis', ...result.crisis };
        const crisisId = newId('msg');
        const crisisSealed = await sealBody(env, JSON.stringify(crisisCard), aad);
        statements.push(insert(crisisId, 'crisis', crisisSealed, 'red', now + 4));
        appended.push({ id: crisisId, role: 'crisis', at: now + 4, card: crisisCard });
      }
    }

    if (result.level !== 'green') {
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO risk_events (id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId('risk'), anonId, conversation.id, result.level, result.rule, result.emotion, 'harness-v1', now, 'live'));
      statements.push(aggregateStatement(env, { eventType: 'risk_flagged', emotion: result.emotion, level: result.level, at: now }));
    }

    const order = { green: 0, yellow: 1, red: 2 };
    const highest = order[result.level] > order[conversation.highest_level] ? result.level : conversation.highest_level;
    statements.push(env.CARE_DB.prepare(
      'UPDATE conversations SET turn_count = ?, signal_count = ?, intensity_total = ?, emotion_history = ?, offered_resources = ?, highest_level = ?, last_message_at = ? WHERE id = ?'
    ).bind(
      conversation.turn_count + 1, conversation.signal_count, conversation.intensity_total,
      conversation.emotion_history, conversation.offered_resources,
      highest, now, conversation.id
    ));

    const response = { ok: true, messages: appended };
    if (requestKey) {
      const sealed = await sealBody(env, JSON.stringify(response), `care:inbound:${requestKey}`);
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO inbound_messages (request_key, anon_id, fingerprint, response_cipher, content_key_version, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(requestKey, anonId, fingerprint, sealed.cipher, sealed.version, now, now + 7 * 86400_000));
    }
    await env.CARE_DB.batch([fence(), ...statements, unfence()]);
    // 只把员工需要看到的内容返回前端：不含 rule、不含 anon_id。
    return response;
  });
}

export async function clearConversation(env, anonId) {
  return withConversationLock(env, anonId, async ({ fence, unfence }) => {
    await env.CARE_DB.batch([
      fence(),
      env.CARE_DB.prepare('UPDATE inbound_messages SET response_cipher=NULL WHERE anon_id=?').bind(anonId),
      env.CARE_DB.prepare('DELETE FROM conversation_state WHERE conversation_id IN (SELECT id FROM conversations WHERE anon_id=?)').bind(anonId),
      env.CARE_DB.prepare('DELETE FROM model_runs WHERE conversation_id IN (SELECT id FROM conversations WHERE anon_id=?)').bind(anonId),
      env.CARE_DB.prepare('DELETE FROM messages WHERE anon_id=?').bind(anonId),
      env.CARE_DB.prepare('DELETE FROM conversations WHERE anon_id=?').bind(anonId),
      unfence(),
    ]);
    return { ok: true, messages: [] };
  });
}
