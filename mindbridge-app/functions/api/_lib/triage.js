// 规则基线分诊引擎：完全确定性、可单测、与任何大模型无关。
// 危机判定必须留在这里；后续接入模型时，模型只能改写共情措辞，不得改写 level。
import {
  CONTEXT_REPLY, EMO, FALLBACK, INTENT, KW,
  NEG, NEG_EXC, RED, RED_REPLY, RG, STRONG, WEAK, YELLOW,
} from './triage-data.js';

export const CONTEXT_TAGS = ['none', 'highIntensity', 'manager', 'newcomer', 'returner', 'techTransition', 'crossCulture'];

export function seed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

function clauses(t) {
  return t.split(/[。！？!?；;，,、\n.]+/).map((s) => s.trim()).filter(Boolean);
}

function isNeg(c, k) {
  const i = c.indexOf(k);
  if (i < 0) return false;
  const pre = c.slice(Math.max(0, i - 5), i);
  if (NEG_EXC.some((x) => pre.includes(x))) return false;
  return NEG.some((n) => pre.includes(n));
}

function intensity(c) {
  let v = 1;
  STRONG.forEach((w) => { if (c.includes(w)) v += 0.45; });
  WEAK.forEach((w) => { if (c.includes(w)) v -= 0.4; });
  if (/[!！]/.test(c)) v += 0.3;
  if (/(.)\1{2,}/.test(c)) v += 0.2;
  return Math.max(0.3, Math.min(3, v));
}

export function emptyState() {
  return { turn: 0, sig: 0, inten: 0, hist: [], given: [] };
}

export function analyze(text, state) {
  const st = state || emptyState();
  const cls = clauses(text);
  const score = {};
  const hits = [];
  let inten = 0;
  let n = 0;
  cls.forEach((c, ci) => {
    const w = 1 + ci * 0.25;
    const iv = intensity(c);
    KW.forEach((g) => g.w.forEach((k) => {
      if (!c.includes(k)) return;
      if (isNeg(c, k)) { hits.push({ k, neg: true }); return; }
      score[g.e] = (score[g.e] || 0) + w * iv;
      hits.push({ k, neg: false });
      inten += iv;
      n++;
    }));
  });
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const emo = ranked.map((x) => x[0]);
  const carried = (!emo.length && st.hist.length) ? st.hist[st.hist.length - 1] : null;
  const top = emo[0] || carried || '平静';
  let lv = 'green';
  let rule = '';

  // 危机判定：否定语境保守降级为 yellow，绝不直接放行。
  const rHit = RED.filter((k) => text.includes(k));
  const rReal = rHit.filter((k) => !cls.some((c) => c.includes(k) && isNeg(c, k)));
  const yHit = YELLOW.filter((k) => text.includes(k));
  if (rReal.length) {
    lv = 'red';
    rule = `命中危机词「${rReal[0]}」→ 征求同意后转接`;
  } else if (rHit.length) {
    lv = 'yellow';
    rule = `危机词「${rHit[0]}」处于否定语境 → 保守降级为黄色`;
  } else if (yHit.length) {
    lv = 'yellow';
    rule = `命中黄色词「${yHit[0]}」→ 升级需关注`;
  }

  // 会话累积升级（状态由 care D1 持久化，跨消息生效）
  const next = {
    turn: st.turn,
    sig: st.sig + (n ? 1 : 0),
    inten: st.inten + inten,
    hist: top !== '平静' ? [...st.hist, top].slice(-20) : [...st.hist],
    given: [...st.given],
  };
  const last3 = next.hist.slice(-3);
  if (lv === 'green' && next.sig >= 3 && next.inten >= 4.5) {
    lv = 'yellow';
    rule = `累计信号 ${next.sig} 次 · 强度 ${next.inten.toFixed(1)} → 升级黄色`;
  } else if (lv === 'green' && last3.length === 3 && last3.every((x) => x === last3[0])) {
    lv = 'yellow';
    rule = `「${last3[0]}」连续 3 次 → 升级黄色`;
  }

  const low = text.toLowerCase();
  const intent = INTENT.find((x) => x.w.some((w) => low.includes(w.toLowerCase())));
  if (!rule) rule = n ? `情绪匹配「${top}」· 强度 ${inten.toFixed(1)} → 绿色自助资源` : '未命中信号 · 仅共情承接';

  return {
    emo: emo.length ? emo : ['平静'],
    top,
    lv,
    hits,
    rule,
    inten,
    n,
    intent: rReal.length ? null : intent,
    nextState: next,
  };
}

function contextReplyLine(contextTag, text) {
  const lines = CONTEXT_REPLY[contextTag];
  if (!lines || !lines.length) return '';
  return lines[seed(text) % lines.length];
}

export function genReply(a, state, text, contextTag) {
  const st = state || emptyState();
  if (a.lv === 'red') return RED_REPLY;
  if (a.intent) { const R = a.intent.r; return R[seed(text) % R.length]; }
  if (text.replace(/[^一-龥a-z]/gi, '').length <= 2 && !a.n) {
    const s = ['嗯，我在。', '我在听。', '慢慢来，不着急。'];
    return s[seed(text) % s.length];
  }
  const g = RG[a.top] || RG['平静'];
  const r = seed(`${text}#${st.turn}`);
  const P = (A, o) => A[(r + (o || 0)) % A.length];
  const kw = (a.hits.find((h) => !h.neg) || {}).k;
  const out = [];
  if (kw && st.turn >= 1 && r % 3 !== 0) out.push(`你说到"${kw}"。`);
  out.push(`${P(g.ack, 0)}。`);
  const ctxLine = contextReplyLine(contextTag, text);
  if (ctxLine) out.push(`${ctxLine}。`);
  if (st.turn >= 1 && r % 2 === 0) out.push(`${P(g.norm, 1)}。`);
  out.push(st.turn <= 3 ? P(g.ask, 2) : P(g.hold, 3));
  const s = out.join('').trim();
  return s || FALLBACK[seed(text + st.turn) % FALLBACK.length];
}

// 资源推荐：红色不做普通自动推荐，先走知情同意；同一资源不重复推送。
export function pickResource(a, state) {
  if (a.lv === 'red' || !a.n) return null;
  const item = EMO[a.top];
  if (!item) return null;
  const level = a.lv === 'yellow' ? 'L2' : 'L1';
  const res = a.lv === 'yellow' ? item.yellow : item.res;
  if ((state?.given || []).includes(res.n)) return null;
  if (a.lv === 'green' && (state?.turn || 0) < 1) return null;
  return { name: res.n, description: res.d, icon: res.i, level, emotion: a.top };
}

export function triage(text, state, contextTag) {
  const a = analyze(text, state);
  const reply = genReply(a, state, text, contextTag);
  const resource = pickResource(a, state);
  const nextState = {
    ...a.nextState,
    turn: (state?.turn || 0) + 1,
    given: resource ? [...a.nextState.given, resource.name].slice(-40) : a.nextState.given,
  };
  return { level: a.lv, emotion: a.top, rule: a.rule, reply, resource, nextState };
}
