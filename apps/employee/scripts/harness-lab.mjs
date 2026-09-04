#!/usr/bin/env node
// 对话 Harness 实验台：不经过 wrangler / D1 / 加密层，直接驱动真实模型跑对话。
// 用法见 npm run lab -- --help。
import { createInterface } from 'node:readline/promises';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runConversationHarness } from '../functions/api/_lib/harness/index.js';
import { createModelGateway } from '../functions/api/_lib/harness/model-gateway.js';
import { emptyUserState } from '../functions/api/_lib/harness/model-contract.js';
import { buildInstructions, PROMPT_VERSION } from '../functions/api/_lib/harness/instructions.js';
import { buildModelVisibleContext } from '../functions/api/_lib/harness/context.js';
import { createFakeCareDb, loadActivities } from './harness-lab/fake-care-db.mjs';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const SCENARIO_DIR = join(ROOT, 'test/scenarios');
const C = { dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[36m', bold: '\x1b[1m', off: '\x1b[0m' };
const paint = (color, text) => `${C[color]}${text}${C.off}`;
const LEVEL_COLOR = { blue: 'blue', yellow: 'yellow', red: 'red' };

function loadEnv() {
  const path = join(ROOT, '.dev.vars');
  if (!existsSync(path)) throw new Error('缺少 apps/employee/.dev.vars，先从 .dev.vars.example 复制并填入 MODEL_API_KEY');
  const vars = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const at = line.indexOf('=');
    if (at < 1 || line.trimStart().startsWith('#')) continue;
    vars[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  // wrangler.jsonc 里的非敏感部署变量作为兜底，保证实验台和线上同构。
  const wrangler = JSON.parse(readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
  const env = { ...wrangler.vars, ...process.env, ...vars };
  if (!env.MODEL_API_KEY) throw new Error('.dev.vars 里没有 MODEL_API_KEY');
  return env;
}

function createLab(env, overrides = {}) {
  const toolLog = [];
  const activities = loadActivities(join(ROOT, 'content/activities'));
  return {
    env: { ...env, ...overrides, CARE_DB: createFakeCareDb(activities, toolLog) },
    gateway: createModelGateway({ ...env, ...overrides }),
    toolLog,
  };
}

// 一个 Session：持有 UserState 与最近消息，等价于 chat/index.js 从 D1 读出来的东西。
// given 用来直接把 Session 摆到某个中途状态：等价于"这个用户上周已经聊到这里了"，
// 让被测那一轮不必先靠若干次真实调用（本身就会抖）把状态跑出来。
function createSession(lab, { profileContext = 'none', channel = 'h5', given, saved } = {}) {
  const seed = () => ({
    state: { ...emptyUserState(), ...(saved?.state || given?.state || {}) },
    // 线上每条历史都带 created_at，lab 必须同样带上，否则模型看到的上下文与生产不同构。
    history: (saved?.history || given?.history || []).map((m, index) => (
      typeof m === 'string'
        ? { role: index % 2 ? 'assistant' : 'user', text: m, at: null }
        : { at: null, ...m }
    )),
    clock: saved?.clock || Date.now(),
  });
  let { state, history, clock } = seed();
  // 历史里没有时间戳的（手写 given）统一补在会话起点之前，保持单调递增。
  history = history.map((m, index) => (m.at ? m : { ...m, at: clock - (history.length - index) * 60_000 }));
  return {
    get state() { return state; },
    get history() { return history; },
    get clock() { return clock; },
    get profileContext() { return profileContext; },
    get channel() { return channel; },
    advance(ms) { clock += ms; },
    snapshot() { return { state, history, clock }; },
    reset() { ({ state, history, clock } = seed()); },
    // 不调用模型，只构造这一轮真正会发给模型的东西，用于观察上下文本身。
    inspect(text) {
      return {
        instructions: buildInstructions({ userState: state }),
        context: buildModelVisibleContext({
          userState: state, recentMessages: history, currentMessage: text,
          channel, profileContext,
        }),
      };
    },
    async say(text) {
      const startedAt = Date.now();
      const before = state;
      const toolsBefore = lab.toolLog.length;
      const now = clock;
      try {
        const run = await runConversationHarness({
          env: lab.env, gateway: lab.gateway, userState: state, recentMessages: history,
          currentMessage: text, channel, profileContext, now,
        });
        history = [...history, { role: 'user', text, at: now }, { role: 'assistant', text: run.decision.reply.text, at: now + 1 }].slice(-20);
        state = run.nextState;
        clock = now + 2;
        return { ok: true, run, before, wallMs: Date.now() - startedAt, tools: lab.toolLog.slice(toolsBefore) };
      } catch (error) {
        // 和线上一致：失败不写状态，但保留用户消息，便于观察下一轮如何接住。
        history = [...history, { role: 'user', text, at: now }].slice(-20);
        clock = now + 1;
        return { ok: false, error, before, wallMs: Date.now() - startedAt, tools: lab.toolLog.slice(toolsBefore) };
      }
    },
  };
}

const SESSION_DIR = join(ROOT, '.lab-sessions');
const sessionPath = (name) => join(SESSION_DIR, `${name.replace(/[^\w.-]/g, '_')}.json`);

function loadSaved(name) {
  if (!name) return undefined;
  const path = sessionPath(name);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : undefined;
}

function saveSession(name, session) {
  if (!name) return;
  mkdirSync(SESSION_DIR, { recursive: true });
  writeFileSync(sessionPath(name), JSON.stringify({
    ...session.snapshot(), profileContext: session.profileContext, channel: session.channel, savedAt: new Date().toISOString(),
  }, null, 2));
}

// "1d" / "26h" / "90m" —— 模拟隔了多久再回来说话。
function parseDuration(value) {
  const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)$/.exec(String(value).trim());
  if (!match) throw new Error(`无法解析时间间隔：${value}（用 30m / 6h / 2d 这样的写法）`);
  const unit = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]];
  return Number(match[1]) * unit;
}

function printTurn(text, outcome, { verbose = false } = {}) {
  console.log(`\n${paint('bold', '你 ›')} ${text}`);
  if (!outcome.ok) {
    console.log(`${paint('red', '✗ 降级')} ${outcome.error.message} ${paint('dim', outcome.wallMs + 'ms')}`);
    return;
  }
  const { decision, nextState, activity, modelRun } = outcome.run;
  const a = decision.supportAssessment;
  console.log(`${paint('bold', 'MB ›')} ${decision.reply.text}`);
  const drift = outcome.before.supportLevel !== nextState.supportLevel
    ? paint('dim', ` (${outcome.before.supportLevel}→)`) : '';
  console.log([
    `   ${paint(LEVEL_COLOR[nextState.supportLevel], nextState.supportLevel)}${drift}`,
    `safety=${a.safetyStatus}/${nextState.safetyCheck}`,
    `conf=${a.confidence}`,
    `emo=${nextState.emotion ?? '-'}`,
    activity ? paint('green', `activity=${activity.id}`) : 'activity=-',
    paint('dim', `${outcome.wallMs}ms · ${(modelRun.inputTokens ?? 0) + (modelRun.outputTokens ?? 0)}tok`),
  ].join('  '));
  if (verbose) {
    console.log(paint('dim', `   evidence: ${JSON.stringify(a.evidence)}`));
    console.log(paint('dim', `   topics:   ${JSON.stringify(nextState.ongoingTopics)}`));
    console.log(paint('dim', `   loops:    ${JSON.stringify(nextState.openLoops)}`));
    for (const call of outcome.tools) console.log(paint('dim', `   tool:     ${JSON.stringify(call.args)} → ${call.hits.join(',')}`));
  }
}

// ---- 断言 ----------------------------------------------------------------
// 断言失败时要报出可读的实际值。布尔型断言直接说"false"没有信息量，
// 这里给它们各自补一个真正有用的观测量。
const ACTUALS = {
  replyMaxChars: (o) => `${o.run.decision.reply.text.length} 字`,
  tool: (o) => (o.tools.length ? `调用了 ${o.tools.length} 次` : '未调用'),
  replyMatch: (o) => JSON.stringify(o.run.decision.reply.text.slice(0, 40)),
  replyNotMatch: (o) => JSON.stringify(o.run.decision.reply.text.slice(0, 40)),
  activity: (o) => o.run.activity?.id ?? 'null',
};

const CHECKS = {
  level: (o, want) => [o.run.nextState.supportLevel, want],
  assessedLevel: (o, want) => [o.run.decision.supportAssessment.level, want],
  safetyStatus: (o, want) => [o.run.decision.supportAssessment.safetyStatus, want],
  safetyCheck: (o, want) => [o.run.nextState.safetyCheck, want],
  emotion: (o, want) => [o.run.nextState.emotion, want],
  activity: (o, want) => (want === '*' ? [Boolean(o.run.activity), true] : [o.run.activity?.id ?? null, want]),
  tool: (o, want) => [o.tools.length > 0, want],
  replyMaxChars: (o, want) => [o.run.decision.reply.text.length <= want, true],
  replyMatch: (o, want) => [new RegExp(want).test(o.run.decision.reply.text), true],
  replyNotMatch: (o, want) => [new RegExp(want).test(o.run.decision.reply.text), false],
};

function checkTurn(outcome, expect) {
  const failures = [];
  if (!expect) return failures;
  if (!outcome.ok) return [`调用失败：${outcome.error.message}`];
  for (const [key, want] of Object.entries(expect)) {
    if (!CHECKS[key]) { failures.push(`未知断言 ${key}`); continue; }
    // 数组 = 任意一个满足即可，用于表达"blue 或 yellow 都能接受"这类合理区间。
    const options = Array.isArray(want) ? want : [want];
    const [raw] = CHECKS[key](outcome, options[0]);
    const actual = ACTUALS[key] ? ACTUALS[key](outcome) : raw;
    if (!options.some((option) => { const [got, target] = CHECKS[key](outcome, option); return got === target; })) {
      failures.push(`${key}: 期望 ${JSON.stringify(want)}，实际 ${typeof actual === 'string' ? actual : JSON.stringify(actual)}`);
    }
  }
  return failures;
}

function readScenarios(targets, flags = {}) {
  // --turns 用于探索：不落文件就跑一段多轮对话，找到问题后再固化成场景。
  if (flags.turns) {
    const given = flags.given ? JSON.parse(flags.given) : undefined;
    return [{ name: 'ad-hoc', profileContext: flags.profile || 'none', given, turns: targets, file: null }];
  }
  const files = targets.length
    ? targets.map((t) => (existsSync(t) ? t : join(SCENARIO_DIR, t.endsWith('.json') ? t : `${t}.json`)))
    : readdirSync(SCENARIO_DIR).filter((f) => f.endsWith('.json')).map((f) => join(SCENARIO_DIR, f));
  return files.flatMap((file) => {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    return (Array.isArray(parsed) ? parsed : [parsed]).map((s) => ({ ...s, file }));
  });
}

function turnRecord(scenario, turn, outcome) {
  const base = { scenario: scenario.name, say: turn.say, wallMs: outcome.wallMs };
  if (!outcome.ok) return { ...base, ok: false, error: outcome.error.message };
  const { decision, nextState, activity } = outcome.run;
  return {
    ...base,
    ok: true,
    reply: decision.reply.text,
    assessedLevel: decision.supportAssessment.level,
    level: nextState.supportLevel,
    safetyStatus: decision.supportAssessment.safetyStatus,
    safetyCheck: nextState.safetyCheck,
    confidence: decision.supportAssessment.confidence,
    evidence: decision.supportAssessment.evidence,
    emotion: nextState.emotion,
    topics: nextState.ongoingTopics,
    openLoops: nextState.openLoops,
    activity: activity?.id ?? null,
    tools: outcome.tools.map((call) => ({ args: call.args, hits: call.hits })),
  };
}

async function runScenario(lab, scenario, { verbose, quiet, json, records, makeSession }) {
  const session = makeSession ? makeSession(scenario) : createSession(lab, scenario);
  const failures = [];
  if (!quiet && !json) {
    console.log(`\n${paint('bold', '━━ ' + scenario.name + ' ━━')}`);
    if (scenario.given) console.log(paint('dim', `   given: ${JSON.stringify(scenario.given)}`));
  }
  for (const raw of scenario.turns) {
    const turn = typeof raw === 'string' ? { say: raw } : raw;
    const outcome = await session.say(turn.say);
    if (!quiet && !json) printTurn(turn.say, outcome, { verbose });
    const turnFailures = checkTurn(outcome, turn.expect);
    if (json) records.push({ ...turnRecord(scenario, turn, outcome), failures: turnFailures });
    for (const failure of turnFailures) {
      failures.push(`${scenario.name} · "${turn.say.slice(0, 16)}…" → ${failure}`);
      if (!quiet && !json) console.log(`   ${paint('red', '✗ ' + failure)}`);
    }
  }
  return failures;
}

// ---- 子命令 --------------------------------------------------------------
// 每个子命令声明自己接受的开关。拼错的开关必须报错而不是被忽略——
// 被静默忽略的 --repeats 会让调用方以为跑了 3 遍，实际只跑了 1 遍。
const COMMANDS = {
  chat: { flags: ['session', 'given', 'advance', 'profile', 'channel', 'model', 'verbose'], run: cmdChat },
  run: { flags: ['session', 'given', 'advance', 'profile', 'channel', 'model', 'turns', 'repeat', 'json', 'verbose', 'quiet'], run: cmdRun },
  context: { flags: ['session', 'given', 'advance', 'profile', 'channel', 'model', 'json'], run: cmdContext },
  bench: { flags: ['n', 'model', 'json'], run: cmdBench },
  sessions: { flags: ['json'], run: cmdSessions },
};

function openSession(lab, flags) {
  const saved = loadSaved(flags.session);
  if (flags.session && !saved && flags.session !== true) {
    console.error(paint('dim', `（新会话 ${flags.session}，之前没有存档）`));
  }
  const session = createSession(lab, {
    profileContext: flags.profile || saved?.profileContext || 'none',
    channel: flags.channel || saved?.channel || 'h5',
    given: flags.given ? JSON.parse(flags.given) : undefined,
    saved,
  });
  if (flags.advance) session.advance(parseDuration(flags.advance));
  return session;
}

async function cmdChat(lab, flags) {
  const session = openSession(lab, flags);
  let verbose = Boolean(flags.verbose);
  console.log(paint('dim', [
    `prompt=${PROMPT_VERSION}`, `model=${lab.env.MODEL_NAME}`,
    flags.session ? `session=${flags.session}（每轮自动存盘）` : 'session=未存盘（加 --session <名字> 可续跑）',
    `已载入 ${session.history.length} 条历史`,
  ].join(' · ')));
  console.log(paint('dim', '/state 看状态  /context 看这轮会发出去的上下文  /prompt 看指令  /reset 重开  /verbose  /quit'));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  for (;;) {
    const line = (await rl.question(paint('bold', '\n你 › '))).trim();
    if (!line) continue;
    if (line === '/quit' || line === '/exit') break;
    if (line === '/reset') { session.reset(); console.log(paint('dim', '已回到起点')); continue; }
    if (line === '/verbose') { verbose = !verbose; console.log(paint('dim', `verbose=${verbose}`)); continue; }
    if (line === '/state') { console.log(JSON.stringify(session.state, null, 2)); continue; }
    if (line === '/prompt') { console.log(session.inspect('').instructions); continue; }
    if (line === '/context') { console.log(JSON.stringify(session.inspect('（下一句）').context, null, 2)); continue; }
    process.stdout.write(paint('dim', '…'));
    const outcome = await session.say(line);
    process.stdout.write('\r  \r');
    printTurn(line, outcome, { verbose });
    saveSession(flags.session, session);
  }
  rl.close();
  return 0;
}

// 不调用模型，只把这一轮真正会发给模型的东西原样打出来。
// 用来观察上下文本身：窗口截断丢了什么、时间戳长什么样、状态累积到多大。
async function cmdContext(lab, flags, positional) {
  const session = openSession(lab, flags);
  const next = positional[0] ?? '（下一句用户消息）';
  const { instructions, context } = session.inspect(next);
  if (flags.json) {
    console.log(JSON.stringify({ model: lab.env.MODEL_NAME, promptVersion: PROMPT_VERSION, instructions, context }, null, 2));
    return 0;
  }
  const dropped = session.history.length - context.recentMessages.length;
  console.log(`${paint('bold', '── Instructions ──')} ${paint('dim', PROMPT_VERSION + ' · ' + instructions.length + ' 字')}`);
  console.log(instructions);
  console.log(`\n${paint('bold', '── Model-Visible Context ──')} ${paint('dim', JSON.stringify(context).length + ' 字符')}`);
  console.log(JSON.stringify(context, null, 2));
  console.log(`\n${paint('bold', '── 观察 ──')}`);
  console.log(`  会话共 ${session.history.length} 条历史，模型只看到最近 ${context.recentMessages.length} 条${dropped > 0 ? paint('yellow', `，截掉 ${dropped} 条`) : ''}`);
  const stamps = context.recentMessages.map((m) => m.at).filter(Boolean);
  console.log(`  时间戳：${stamps.length ? `${stamps.length}/${context.recentMessages.length} 条带 at，形如 ${stamps[0]}` : paint('yellow', '全部为 null——与线上不同构')}`);
  if (stamps.length > 1) {
    const span = stamps.at(-1) - stamps[0];
    console.log(`  跨度：${(span / 3_600_000).toFixed(1)} 小时（模型能否用上取决于 at 的表示方式）`);
  }
  console.log(`  UserState：topics ${context.userState.ongoingTopics.length} 条 · openLoops ${context.userState.openLoops.length} 条 · level ${context.userState.supportLevel}/${context.userState.safetyCheck}`);
  return 0;
}

async function cmdRun(lab, flags, targets) {
  const scenarios = readScenarios(targets, flags);
  const repeat = Number(flags.repeat) || 1;
  const all = [];
  const records = [];
  // --session 是"一条持续的对话"，和"一批场景跑很多遍"语义冲突：谁的状态该留下？
  // 与其猜，不如直接拒绝，让调用方明确意图。
  if (flags.session && (repeat > 1 || scenarios.length > 1)) {
    return fail('--session 只能用于单个场景、且 --repeat 为 1',
      '要续跑一条对话用 ./lab run --session <名字> --turns "..."；要查抖动去掉 --session。');
  }
  let live = null;
  const options = {
    verbose: flags.verbose, quiet: flags.quiet, json: flags.json, records,
    makeSession: flags.session
      ? (scenario) => (live = openSession(lab, { ...flags, given: scenario.given ? JSON.stringify(scenario.given) : flags.given }))
      : null,
  };
  for (let pass = 0; pass < repeat; pass++) {
    for (const scenario of scenarios) all.push(...await runScenario(lab, scenario, options));
  }
  if (live) saveSession(flags.session, live);
  const turns = scenarios.reduce((n, item) => n + item.turns.length, 0) * repeat;
  if (flags.json) {
    console.log(JSON.stringify({
      model: lab.env.MODEL_NAME, promptVersion: PROMPT_VERSION,
      scenarios: scenarios.length, repeat, turns, passed: all.length === 0,
      failures: all, turnsDetail: records,
    }, null, 2));
    return all.length ? 1 : 0;
  }
  console.log(`\n${paint('bold', '── 结果 ──')} ${scenarios.length} 个场景 × ${repeat} 轮 = ${turns} 次对话`);
  if (!all.length) { console.log(paint('green', '全部通过')); return 0; }
  console.log(paint('red', `${all.length} 项断言失败：`));
  for (const failure of all) console.log(`  ${paint('red', '✗')} ${failure}`);
  return 1;
}

async function cmdBench(lab, flags, messages) {
  const n = Number(flags.n) || 10;
  const pool = messages.length ? messages : readScenarios([], {}).flatMap((item) => item.turns.map((t) => (typeof t === 'string' ? t : t.say)));
  const jobs = Array.from({ length: n }, (_, i) => pool[i % pool.length]);
  const latencies = [];
  const failures = new Map();
  // 单轮无历史，并发打，专门量结构化输出的稳定性而不是对话质量。
  await Promise.all(jobs.map(async (text) => {
    const outcome = await createSession(lab).say(text);
    latencies.push(outcome.wallMs);
    if (!outcome.ok) failures.set(outcome.error.message, (failures.get(outcome.error.message) || 0) + 1);
  }));
  latencies.sort((a, b) => a - b);
  const at = (q) => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * q))];
  const bad = [...failures.values()].reduce((a, b) => a + b, 0);
  if (flags.json) {
    console.log(JSON.stringify({
      model: lab.env.MODEL_NAME, promptVersion: PROMPT_VERSION, n, degraded: bad,
      p50: at(0.5), p95: at(0.95), max: latencies.at(-1), errors: Object.fromEntries(failures),
    }, null, 2));
    return bad > n * 0.05 ? 1 : 0;
  }
  console.log(`\n${paint('bold', '── 压测 ──')} n=${n} model=${lab.env.MODEL_NAME} prompt=${PROMPT_VERSION}`);
  console.log(`降级率 ${bad ? paint('red', `${bad}/${n}`) : paint('green', `0/${n}`)}   p50=${at(0.5)}ms  p95=${at(0.95)}ms  max=${latencies.at(-1)}ms`);
  for (const [code, count] of failures) console.log(`  ${paint('red', '✗')} ${code} ×${count}`);
  return bad > n * 0.05 ? 1 : 0;
}

async function cmdSessions(lab, flags) {
  const names = existsSync(SESSION_DIR) ? readdirSync(SESSION_DIR).filter((f) => f.endsWith('.json')) : [];
  const rows = names.map((file) => {
    const saved = JSON.parse(readFileSync(join(SESSION_DIR, file), 'utf8'));
    return {
      name: file.replace(/\.json$/, ''), turns: saved.history.length, savedAt: saved.savedAt,
      supportLevel: saved.state.supportLevel, safetyCheck: saved.state.safetyCheck,
      lastMessageAt: new Date(saved.clock).toISOString(),
    };
  });
  if (flags.json) { console.log(JSON.stringify({ sessions: rows }, null, 2)); return 0; }
  if (!rows.length) { console.log(paint('dim', '还没有存档会话。用 ./lab chat --session <名字> 建一个。')); return 0; }
  for (const row of rows) {
    console.log(`${paint('bold', row.name.padEnd(16))} ${String(row.turns).padStart(3)} 条历史  ${paint(LEVEL_COLOR[row.supportLevel], row.supportLevel)}/${row.safetyCheck}  ${paint('dim', '存于 ' + row.savedAt)}`);
  }
  return 0;
}

const HELP = `对话 Harness 实验台 —— 直接驱动真实模型跑 Harness，绕开 wrangler / D1 / 加密层。

用法：./lab <命令> [参数]        （等价于 npm run lab -- <命令>）

命令
  chat        交互式对话。人用，找手感。默认命令。
  run         跑场景并校验断言。agent 和 CI 用，做回归。
  context     只打印这一轮会发给模型的 context 和 instructions，不调模型。
  bench       并发压测结构化输出稳定性与延迟。
  sessions    列出已存档的会话。

三种给上下文的方式，用途不同
  --turns "a" "b"        脚本化多轮：真实回复回灌进上下文。测对话质量。
  --given '<json>'       预置中局：手写状态和历史，一次调用测准一件事。测状态机。
  --session <名字>       持久会话：存盘、续跑、可分享复现。测跨时间的记忆。
  三者可叠加：--session 载入存档，--given 覆盖其上，--advance 再推进时钟。

常用
  ./lab                                          交互对话
  ./lab chat --session alice                     建立/续接名为 alice 的会话，每轮自动存盘
  ./lab chat --session alice --advance 1d        隔一天再回来说话
  ./lab context --session alice                  看模型此刻究竟看到什么
  ./lab context --session alice --json           同上，机器可读
  ./lab run                                      跑 test/scenarios/ 全部场景
  ./lab run 10-safety -v                         只跑一个场景文件，展开细节
  ./lab run --repeat 3 -q                        跑三遍查抖动（单次通过不算通过）
  ./lab run --json                               每轮的 state/tool/断言输出 JSON
  ./lab run --turns "第一句" "第二句"              临时多轮，不落文件，用于探索
  ./lab run --turns --given '{"state":{"supportLevel":"red","safetyCheck":"pending"}}' "我没事了"
  ./lab bench --n 20                             压测
  ./lab --model deepseek-v4-pro run --repeat 3   换模型对比

开关
  --session <名字>   载入并持续保存会话（存于 .lab-sessions/）
  --given '<json>'   预置 { "state": {...}, "history": [{"role","text"}] }
  --advance <时长>   推进会话时钟：30m / 6h / 2d
  --turns            把位置参数当作对话轮次，而不是场景文件名
  --repeat <n>       整批重复 n 遍，用于查抖动
  --model <id>       临时换模型（不改 wrangler.jsonc）
  --profile <标签>   设置 profileContext
  --channel <名字>   设置 channel：h5（默认）或 dingtalk。钉钉机器人走 dingtalk，行为可能不同
  --json             机器可读输出（run / context / bench / sessions 都支持）
  -v / --verbose     展开 evidence / topics / openLoops / 工具命中
  -q / --quiet       只报失败
  退出码：0 全通过，1 有断言失败或降级率超 5%

场景文件（test/scenarios/*.json）
  [{ "name": "...",
     "profileContext": "manager",
     "given": { "state": { "supportLevel": "red", "safetyCheck": "pending" },
                "history": [{ "role": "user", "text": "..." }] },
     "turns": [
       "纯字符串 = 只对话不断言",
       { "say": "...", "expect": { "level": "red", "activity": null } }
     ]}]

  断言键：level assessedLevel safetyStatus safetyCheck emotion activity tool
         replyMaxChars（回复不超过 N 字）replyMatch / replyNotMatch（正则）
  值可写成数组表示"任一满足即通过"，例如 "level": ["blue", "yellow"]
  replyMatch / replyNotMatch 的值是正则。写否定式断言时注意否定词未必紧邻：
  "建议你吃" 会误伤"我不能建议你吃药"这种正确回复。

工作流建议
  探索用 --turns / --session，发现值得守住的行为就固化成 test/scenarios/ 里的断言。
  探索是一次性的，场景文件才是会累积的资产。
  改完 Prompt 或 Harness 的标准动作：npm run check && ./lab run --repeat 2`;

function fail(message, hint) {
  console.error(paint('red', message));
  if (hint) console.error(paint('dim', hint));
  return 2;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) { console.log(HELP); return 0; }
  // 不带值的开关必须显式声明，否则 --turns "第一句" 会把第一句吃成 flag 的值。
  const BOOLEAN_FLAGS = new Set(['turns', 'json', 'verbose', 'quiet']);
  const ALIASES = { v: 'verbose', q: 'quiet' };
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (/^-[a-z]$/.test(arg)) {
      const name = ALIASES[arg.slice(1)];
      if (!name) return fail(`未知开关 ${arg}`, '用 ./lab --help 看全部开关。');
      flags[name] = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      const next = argv[i + 1];
      if (BOOLEAN_FLAGS.has(name) || next === undefined || next.startsWith('--')) flags[name] = true;
      else { flags[name] = next; i++; }
      continue;
    }
    positional.push(arg);
  }

  const name = COMMANDS[positional[0]] ? positional.shift() : 'chat';
  if (positional[0] && !COMMANDS[positional[0]] && !flags.turns && name === 'chat') {
    return fail(`未知命令 ${positional[0]}`, `可用命令：${Object.keys(COMMANDS).join(' / ')}。用 ./lab --help 看用法。`);
  }
  const command = COMMANDS[name];
  const allowed = new Set([...command.flags, 'help']);
  for (const flag of Object.keys(flags)) {
    if (!allowed.has(flag)) {
      return fail(`${name} 不接受开关 --${flag}`, `${name} 可用：${command.flags.map((f) => '--' + f).join(' ')}。用 ./lab --help 看全部。`);
    }
  }
  for (const [flag, value] of Object.entries(flags)) {
    if (!BOOLEAN_FLAGS.has(flag) && value === true) {
      return fail(`--${flag} 需要一个值`, '例如 --repeat 3、--session alice、--advance 1d。');
    }
  }
  if (flags.given) {
    try { JSON.parse(flags.given); }
    catch { return fail('--given 不是合法 JSON', `写法：--given '{"state":{"supportLevel":"red"}}'（外层用单引号）`); }
  }
  if (flags.advance) {
    try { parseDuration(flags.advance); } catch (error) { return fail(error.message); }
  }

  let env;
  try { env = loadEnv(); } catch (error) { return fail(error.message); }
  const lab = createLab(env, flags.model ? { MODEL_NAME: flags.model } : {});
  return command.run(lab, flags, positional);
}

process.exitCode = (await main()) || 0;
