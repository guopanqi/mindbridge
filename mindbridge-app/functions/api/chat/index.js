// 倾诉树洞：员工原文只以密文进入 care D1，风险判定走确定性规则引擎。
import { json } from '../_lib/http.js';
import {
  ApiError, aggregateStatement, ensureProfile, handleError, newId,
  openBody, readJson, requireSession, requireText, sealBody,
} from '../_lib/care.js';
import { triage } from '../_lib/triage.js';

const CONVERSATION_WINDOW_MS = 6 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const HISTORY_LIMIT = 60;
const RETENTION_DAYS = 180;

const messageAad = (conversationId) => `care:message:${conversationId}`;

async function loadMessages(env, anonId, limit = HISTORY_LIMIT) {
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
  return out;
}

function shape(row, text) {
  if (row.role === 'resource' || row.role === 'consent') {
    let payload = null;
    try { payload = JSON.parse(text); } catch { payload = null; }
    return { id: row.id, role: row.role, at: row.created_at, card: payload };
  }
  return { id: row.id, role: row.role, at: row.created_at, text };
}

async function activeConversation(env, anonId, now) {
  const row = await env.CARE_DB.prepare(
    'SELECT id, turn_count, signal_count, intensity_total, emotion_history, offered_resources, highest_level, last_message_at FROM conversations WHERE anon_id = ? ORDER BY last_message_at DESC LIMIT 1'
  ).bind(anonId).first();
  if (row && now - row.last_message_at < CONVERSATION_WINDOW_MS) return row;
  const id = newId('conv');
  await env.CARE_DB.prepare(
    'INSERT INTO conversations (id, anon_id, channel, started_at, last_message_at, data_origin) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, anonId, 'h5', now, now, 'live').run();
  return {
    id, turn_count: 0, signal_count: 0, intensity_total: 0,
    emotion_history: '[]', offered_resources: '[]', highest_level: 'green', last_message_at: now,
  };
}

function parseList(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    return json({ ok: true, messages: await loadMessages(env, anonId) });
  } catch (error) {
    return handleError(error, 'chat_history_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { profile } = await ensureProfile(env, anonId);
    const text = requireText((await readJson(request))?.text, { min: 1, max: 800, field: 'text' });
    const now = Date.now();

    const recent = await env.CARE_DB.prepare(
      "SELECT COUNT(*) AS n FROM messages WHERE anon_id = ? AND role = 'user' AND created_at > ?"
    ).bind(anonId, now - RATE_WINDOW_MS).first();
    if ((recent?.n || 0) >= RATE_LIMIT) {
      throw new ApiError('RATE_LIMITED', 429, '你发送得有点快，休息一下再继续，我一直在。');
    }

    const conversation = await activeConversation(env, anonId, now);
    const state = {
      turn: conversation.turn_count,
      sig: conversation.signal_count,
      inten: conversation.intensity_total,
      hist: parseList(conversation.emotion_history),
      given: parseList(conversation.offered_resources),
    };
    const aad = messageAad(conversation.id);
    const expiresAt = now + RETENTION_DAYS * 86400_000;

    const result = triage(text, state, profile.context_tag);
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
    const appended = [
      { id: userId, role: 'user', at: now, text },
      { id: replyId, role: 'assistant', at: now + 1, text: result.reply },
    ];

    if (result.resource) {
      const cardId = newId('msg');
      const sealed = await sealBody(env, JSON.stringify(result.resource), aad);
      statements.push(insert(cardId, 'resource', sealed, result.level, now + 2));
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO resource_events (id, anon_id, conversation_id, resource_name, resource_level, risk_level, state, created_at, updated_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId('res'), anonId, conversation.id, result.resource.name, result.resource.level, result.level, 'offered', now, now, 'live'));
      statements.push(aggregateStatement(env, { eventType: 'resource_offered', emotion: result.emotion, level: result.level, at: now }));
      appended.push({ id: cardId, role: 'resource', at: now + 2, card: result.resource });
    }

    if (result.level === 'red') {
      // 红色：停止普通推荐，先说明边界并征求知情同意，绝不谎称已代为联系任何人。
      const card = {
        kind: 'consent',
        title: '这些感受值得被专业的人接住',
        body: '我能陪你说话，但我不能替代专业支持。如果你愿意，我可以在不透露你身份的前提下，把「有人现在需要支持」这件事交给持证疗愈师；要不要这样做，完全由你决定。',
        actions: ['我愿意，请安排疗愈师', '暂时不用，我想继续说说'],
      };
      const cardId = newId('msg');
      const sealed = await sealBody(env, JSON.stringify(card), aad);
      statements.push(insert(cardId, 'consent', sealed, 'red', now + 3));
      appended.push({ id: cardId, role: 'consent', at: now + 3, card });
    }

    if (result.level !== 'green') {
      statements.push(env.CARE_DB.prepare(
        'INSERT INTO risk_events (id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId('risk'), anonId, conversation.id, result.level, result.rule, result.emotion, 'rules-v1', now, 'live'));
      statements.push(aggregateStatement(env, { eventType: 'risk_flagged', emotion: result.emotion, level: result.level, at: now }));
    }

    const order = { green: 0, yellow: 1, red: 2 };
    const highest = order[result.level] > order[conversation.highest_level] ? result.level : conversation.highest_level;
    statements.push(env.CARE_DB.prepare(
      'UPDATE conversations SET turn_count = ?, signal_count = ?, intensity_total = ?, emotion_history = ?, offered_resources = ?, highest_level = ?, last_message_at = ? WHERE id = ?'
    ).bind(
      result.nextState.turn, result.nextState.sig, result.nextState.inten,
      JSON.stringify(result.nextState.hist), JSON.stringify(result.nextState.given),
      highest, now, conversation.id
    ));

    await env.CARE_DB.batch(statements);
    // 只把员工需要看到的内容返回前端：不含 rule、不含 anon_id。
    return json({ ok: true, messages: appended });
  } catch (error) {
    return handleError(error, 'chat_send_failed');
  }
}

// 员工可以随时清空自己的倾诉记录；聚合事件不含原文，按设计保留。
export async function onRequestDelete({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await env.CARE_DB.batch([
      env.CARE_DB.prepare('DELETE FROM messages WHERE anon_id = ?').bind(anonId),
      env.CARE_DB.prepare('DELETE FROM conversations WHERE anon_id = ?').bind(anonId),
    ]);
    return json({ ok: true, messages: [] });
  } catch (error) {
    return handleError(error, 'chat_clear_failed');
  }
}
