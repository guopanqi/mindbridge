// 路演录制专用：一个假的模型网关（OpenAI Responses API 形状）。
// 每一轮回复按剧本写死，让录出来的视频逐句可控、每次一致。
// 只在本地录制时由 launch.json 启动，永远不部署。
// 三段剧本见 docs/路演视频剧本.md：绿灯篇 / 黄灯篇 / 红灯篇。
import http from 'node:http';

const PORT = Number(process.env.PORT) || 8799;

const base = (level, safetyStatus, emotion, evidence) => ({
  level, confidence: 0.86, safetyStatus, evidence: evidence || [],
  patch: { setEmotion: emotion || null },
});

// 用 currentMessage 的子串匹配剧本行。toolReply 是拿到活动检索结果后的第二轮措辞。
const SCRIPT = [
  // ---------- 视频 2 · 幕布后面的「这几天里的其它对话」（不出现在画面操作中）----------
  {
    match: '回家路上听了会歌',
    reply: '能给自己留十分钟不被打扰，已经算是件好事了。',
    ...base('blue', 'not_indicated', null, ['自我照顾']),
    toolCall: null,
  },
  {
    match: '明天要交初稿',
    reply: '慌是因为你在乎。今晚别再改了，睡前把要点记三条，明天照着走。',
    ...base('blue', 'not_indicated', '焦虑', ['交付压力']),
    toolCall: null,
  },
  {
    match: '这两天又开始醒得早',
    reply: '刚松一点又绷回去，很常见，不代表白做了。',
    ...base('yellow', 'not_indicated', '疲惫', ['睡眠反复']),
    toolCall: null,
  },
  {
    match: '接了个新活',
    reply: '先别提前把自己吓到。真扛不住的时候，记得这里随时可以说一句。',
    ...base('yellow', 'not_indicated', '焦虑', ['新任务压力']),
    toolCall: null,
  },

  // ---------- 视频 1 · 陪伴式对话（不推活动卡）----------
  {
    match: '说不出来的闷',
    reply: '闷是因为没出口，不是因为不够坚强。说不上来也没关系，你可以就这么随便说，不用先想清楚。',
    ...base('blue', 'not_indicated', '疲惫', ['情绪淤积', '难以命名感受']),
    toolCall: null,
  },
  {
    match: '好像确实松一点',
    reply: '那就先按这个节奏来。我一直在这儿，随时可以说一句，哪怕只是一句「今天有点累」。',
    ...base('blue', 'not_indicated', null, ['表达后缓解']),
    toolCall: null,
  },

  // ---------- 绿灯篇 · 日常倾诉 → 三分钟呼吸着陆法 ----------
  {
    match: '方案改到第三版',
    reply: '改到第三版，脑子还在空转，刹不住车——这种停不下来最熬人。你现在还在工位上吧？',
    ...base('blue', 'not_indicated', '疲惫', ['连续返工', '难以从工作状态抽离']),
    toolCall: null,
  },
  {
    match: '还在等一版反馈',
    reply: '那更别硬逼自己放松了。',
    ...base('blue', 'not_indicated', '焦虑', ['被动等待', '持续紧绷']),
    toolCall: { name: 'search_activities', arguments: { query: '紧绷 停不下来 呼吸', limit: 1 } },
    toolReply: '那更别硬逼自己放松了。等消息的这几分钟，跟着屏幕吸两口气，让绷着的那根弦先松一点——三分钟呼吸着陆法坐着就能做，不用站起来。',
  },
  {
    match: '等下还要等一版反馈',
    reply: '那更别硬逼自己放松了。',
    // 情绪走 intervention_matrix：焦虑 + L1 → breathing（三分钟呼吸着陆法）。
    ...base('blue', 'not_indicated', '焦虑', ['被动等待', '持续紧绷']),
    toolCall: { name: 'search_activities', arguments: { query: '紧绷 停不下来 呼吸', limit: 1 } },
    toolReply: '那更别硬逼自己放松了。等消息的这几分钟，跟着屏幕吸两口气，让绷着的那根弦先松一点——三分钟呼吸着陆法坐着就能做，不用站起来。',
  },
  {
    match: '可以收工了',
    reply: '那就关电脑吧。路上听点不费脑子的，今晚别再想第四版了，明天的事明天说。到家了睡个整觉。',
    ...base('blue', 'not_indicated', null),
    toolCall: null,
  },

  // ---------- 黄灯篇 · 持续失眠 → 线下午间正念工作坊 ----------
  {
    // 视频 2 黄灯段：睡眠 + 离职念头合成一句，AI 一轮内给出线下工作坊。
    match: '干脆换个地方算了',
    reply: '连着两周睡不好，「换个地方」这个念头多半不是真烦这份工作，是想找个出口喘口气。',
    ...base('yellow', 'not_indicated', '低落', ['持续两周睡眠问题', '意义感下降', '离职念头']),
    toolCall: { name: 'search_activities', arguments: { query: '失眠 提不起劲 正念', limit: 1 } },
    toolReply: '连着两周睡不好，「换个地方」这个念头多半不是真烦这份工作，是想找个出口喘口气。\n光靠自己调作息太吃力了。这周五中午有个线下的午间正念工作坊，不用自我介绍，也不用聊工作，去闭着眼坐一会儿也行，要不要去看看？',
  },
  {
    match: '连着两周没睡好',
    reply: '连着两周，那不只是身体累了，心里也快见底了。白天在工位上是硬撑着还能干，还是干什么都没劲？',
    ...base('yellow', 'not_indicated', '疲惫', ['持续两周睡眠问题', '晨起回避上班']),
    toolCall: null,
  },
  {
    match: '换个地方算了',
    reply: '「换个地方」这个念头，多半不是真烦这份工作，是想找个出口喘口气。',
    ...base('yellow', 'not_indicated', '低落', ['意义感下降', '离职念头']),
    toolCall: null,
  },
  {
    // 员工自己问隐私，AI 才答——不主动辩白，答得干脆。
    match: '公司那边看得到吗',
    reply: '看不到。你在这儿打的字只存在你自己的记录里，HR 和主管那边一个字都拿不到，他们只看得到匿名的整体趋势。',
    // 低落 + yellow → L2 的线下「午间正念工作坊」。
    ...base('yellow', 'not_indicated', '低落', ['隐私顾虑']),
    toolCall: { name: 'search_activities', arguments: { query: '失眠 提不起劲 正念', limit: 1 } },
    toolReply: '看不到。你在这儿打的字只存在你自己的记录里，HR 和主管那边一个字都拿不到，他们只看得到匿名的整体趋势。\n光靠自己调作息太吃力了。这周五中午有个线下的午间正念工作坊，不用自我介绍，也不用聊工作，去闭着眼坐一会儿也行，要不要去看看？',
  },
  {
    match: '我已经报名了',
    reply: '位置留好了。周五吃完饭过去坐一小时，什么都不用准备。',
    ...base('yellow', 'not_indicated', '低落', ['已接受线下支持']),
    toolCall: null,
  },
  {
    match: '睡得比之前好',
    reply: '那就先按这个节奏慢慢来。两周后还有一场，要我到时候提前招呼你一声吗？',
    ...base('blue', 'not_indicated', null, ['状态回升']),
    toolCall: null,
  },

  // ---------- 红灯篇 · 危机识别 → 疗愈师转接 ----------
  {
    match: '少我一个也没差',
    reply: '看到这句我很担心你。有件事我得先问清楚：你现在身边安全吗？有没有在想伤害自己的事？',
    ...base('red', 'immediate_risk', '低落', ['表达自身存在无意义', '深夜求助']),
    toolCall: null,
  },
  {
    // 员工推开了「安排疗愈师」那张卡：不劝、不催，这一轮才补上热线。
    match: '说了也没用',
    reply: '这么难受还能把这几个字打出来，已经很不容易了。你觉得说了也没用，我不劝你，也不催你点上面那张卡。',
    ...base('red', 'immediate_risk', '低落', ['无望感', '回避求助']),
    toolCall: null,
  },
  {
    // 不再发任何卡片，只陪着，把决定权留回去。
    match: '不想再这样下去',
    reply: '嗯，我知道。今晚太长了，你先别一个人扛到天亮。上面那个安排疗愈师的按钮一直在那儿，哪怕只有半秒钟想让人拉你一把，随时点它。',
    ...base('red', 'immediate_risk', '低落', ['持续痛苦', '尚未决定是否求助']),
    toolCall: null,
  },
];

const FALLBACK = {
  reply: '我在听。你想从哪里说起都可以。',
  ...base('blue', 'not_indicated', null),
  toolCall: null,
};

function decisionFor(input) {
  let parsed;
  try { parsed = JSON.parse(input); } catch { parsed = {}; }
  const current = String(parsed?.context?.currentMessage || '');
  const toolPhase = Boolean(parsed?.toolResult);
  const line = SCRIPT.find((item) => current.includes(item.match)) || FALLBACK;
  return {
    reply: { text: toolPhase && line.toolReply ? line.toolReply : line.reply },
    supportAssessment: { level: line.level, confidence: line.confidence, safetyStatus: line.safetyStatus, evidence: line.evidence },
    statePatch: { addTopics: [], removeTopics: [], setEmotion: line.patch.setEmotion, addOpenLoops: [], closeOpenLoops: [] },
    toolCall: toolPhase ? null : line.toolCall,
  };
}

http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    let payload = {};
    try { payload = JSON.parse(body || '{}'); } catch { /* 空请求也给一个回复 */ }
    const decision = decisionFor(payload.input || '');
    // 留一点真实的思考延时，让「正在听」呼吸态在视频里出现。
    setTimeout(() => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        status: 'completed',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(decision) }] }],
        usage: { input_tokens: 0, output_tokens: 0 },
      }));
    }, 1200);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`model stub on http://127.0.0.1:${PORT}/v1`));
