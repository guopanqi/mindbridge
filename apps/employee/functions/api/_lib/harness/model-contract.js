const LEVELS = new Set(['blue', 'yellow', 'red']);
const SAFETY_STATUSES = new Set(['not_indicated', 'needs_clarification', 'immediate_risk', 'denied']);
const TOOL_NAMES = new Set(['search_activities']);
// 情绪必须落在固定词表：HR 看板与干预矩阵都按这些词聚合，自由文本会把趋势打散。
const EMOTIONS = new Set(['焦虑', '疲惫', '烦躁', '低落', '紧张', '孤独', '委屈', '愤怒', '迷茫']);

export function emptyUserState() {
  return {
    schemaVersion: 1,
    supportLevel: 'blue',
    safetyCheck: 'none',
    emotion: null,
    ongoingTopics: [],
    preferences: {},
    openLoops: [],
    recentRecommendations: [],
  };
}

function strings(value, max = 12) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))].slice(0, max);
}

export function validateDecision(value) {
  if (!value || typeof value !== 'object') throw new Error('MODEL_DECISION_INVALID');
  const text = value.reply?.text;
  if (typeof text !== 'string' || !text.trim() || text.length > 2000) throw new Error('MODEL_REPLY_INVALID');

  const level = value.supportAssessment?.level;
  if (!LEVELS.has(level)) throw new Error('MODEL_SUPPORT_LEVEL_INVALID');
  const confidence = Number(value.supportAssessment?.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error('MODEL_CONFIDENCE_INVALID');
  const safetyStatus = value.supportAssessment?.safetyStatus;
  if (!SAFETY_STATUSES.has(safetyStatus)) throw new Error('MODEL_SAFETY_STATUS_INVALID');
  // supportLevel 是跨轮持续的状态，safetyStatus 是本轮的观察，两者时间尺度不同：
  // 红色用户这一轮说"有什么活动吗"，完全可能是 red + not_indicated。
  // 真正必须成立的只有一个方向——本轮观察到即时风险，等级就必须是红色。
  if (level !== 'red' && safetyStatus === 'immediate_risk') throw new Error('MODEL_SAFETY_LEVEL_INCONSISTENT');

  let toolCall = null;
  if (value.toolCall !== null && value.toolCall !== undefined) {
    if (!TOOL_NAMES.has(value.toolCall?.name)) throw new Error('MODEL_TOOL_NOT_ALLOWED');
    if (!value.toolCall.arguments || typeof value.toolCall.arguments !== 'object' || Array.isArray(value.toolCall.arguments)) {
      throw new Error('MODEL_TOOL_ARGUMENTS_INVALID');
    }
    toolCall = { name: value.toolCall.name, arguments: value.toolCall.arguments };
  }

  const patch = value.statePatch || {};
  return {
    reply: { text: text.trim() },
    supportAssessment: {
      level,
      confidence,
      safetyStatus,
      evidence: strings(value.supportAssessment.evidence, 6),
    },
    statePatch: {
      addTopics: strings(patch.addTopics),
      removeTopics: strings(patch.removeTopics),
      setEmotion: EMOTIONS.has(String(patch.setEmotion || '').trim()) ? String(patch.setEmotion).trim() : null,
      addOpenLoops: strings(patch.addOpenLoops, 6),
      closeOpenLoops: strings(patch.closeOpenLoops, 6),
    },
    toolCall,
  };
}

export function applyStatePatch(previous, decision, now = Date.now()) {
  const state = { ...emptyUserState(), ...(previous || {}) };
  const patch = decision.statePatch;
  const removed = new Set(patch.removeTopics);
  const topics = [...strings(state.ongoingTopics), ...patch.addTopics].filter((item) => !removed.has(item));
  const closed = new Set(patch.closeOpenLoops);
  const openLoops = [...strings(state.openLoops, 20), ...patch.addOpenLoops].filter((item) => !closed.has(item));
  const safetyStatus = decision.supportAssessment.safetyStatus;
  const supportLevel = nextSupportLevel(state, decision.supportAssessment);
  const safetyCheck = safetyStatus === 'immediate_risk' || safetyStatus === 'needs_clarification'
    ? 'pending'
    : safetyStatus === 'denied'
      ? 'resolved'
      : state.safetyCheck;
  return {
    ...state,
    schemaVersion: 1,
    supportLevel,
    safetyCheck,
    supportConfidence: decision.supportAssessment.confidence,
    emotion: patch.setEmotion || state.emotion || null,
    ongoingTopics: strings(topics),
    openLoops: strings(openLoops, 12),
    updatedAt: now,
  };
}

function nextSupportLevel(state, assessment) {
  if (assessment.safetyStatus === 'immediate_risk') return 'red';
  if (assessment.safetyStatus === 'denied' && state.safetyCheck === 'pending') return 'yellow';
  // 尚未回答安全澄清问题时维持 red/yellow；普通闲聊不能悄悄解除它。
  if (state.safetyCheck === 'pending') {
    const order = { blue: 0, yellow: 1, red: 2 };
    return order[state.supportLevel] > order[assessment.level] ? state.supportLevel : assessment.level;
  }
  // 没有待澄清的安全问题时允许降级，否则一次抱怨就会把用户永久钉在 yellow，
  // 让 risk_events 与 HR 看板持续误报。red 只能经 denied 或显式复核解除。
  if (state.supportLevel === 'red') return assessment.level === 'red' ? 'red' : 'yellow';
  return assessment.level;
}
