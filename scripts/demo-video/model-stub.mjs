// 路演录制专用：一个假的模型网关（OpenAI Responses API 形状）。
// 每一轮回复按剧本写死，让录出来的视频逐句可控、每次一致。
// 只在本地录制时由 launch.json 启动，永远不部署。
import http from 'node:http';

const PORT = Number(process.env.PORT) || 8799;

const base = (level, safetyStatus, emotion, evidence) => ({
  level, confidence: 0.86, safetyStatus, evidence: evidence || [],
  patch: { setEmotion: emotion || null },
});

// 用 currentMessage 的子串匹配剧本行。toolReply 是拿到活动检索结果后的第二轮措辞。
const SCRIPT = [
  {
    match: '客户扯皮',
    reply: '跟客户来回拉锯、对方一直拖，那种憋着的火确实挺磨人的。是今天这一单特别难缠，还是最近这类事一直没断过？',
    ...base('blue', 'not_indicated', '烦躁', ['客户拖延', '烦躁']),
    toolCall: null,
  },
  {
    match: '每天都说过两天',
    reply: '天天被吊着，心里那股烦劲儿很难自己消掉。',
    ...base('blue', 'not_indicated', '焦虑', ['持续性烦躁', '被动等待']),
    toolCall: { name: 'search_activities', arguments: { query: '烦躁 紧张 呼吸', limit: 3 } },
    toolReply: '天天被吊着，心里那股烦劲儿很难自己消掉。试试那个三分钟呼吸着陆法吧——它不要求你做别的，就跟着屏幕上的圆慢慢吸、慢慢呼，先把紧着的身体从赶进度的状态里放下来几分钟。',
  },
  {
    match: '好多了',
    reply: '真好，能松下来一点就够了。之后再被拖着的时候，随时回来，我都在。',
    ...base('blue', 'not_indicated', null),
    toolCall: null,
  },
  {
    match: '好想死',
    reply: '听到你说这句，我有点担心。听起来今天不只是被客户拖得烦，而是整个人都被压得很重。你愿意跟我说说，现在是那种喘不上气的累，还是心里真的有什么过不去的念头吗？你现在安全吗？',
    ...base('red', 'immediate_risk', '低落', ['明确表达死亡念头']),
    toolCall: null,
  },
  {
    match: '撑不下去',
    reply: '谢谢你愿意告诉我。这样的重量不该一个人扛。上面那张卡片里，持证疗愈师可以在 30 分钟内联系你，全程只用一个个案编号，他不会知道你是谁。要不要这样做，由你决定；不管你选哪个，我都在这儿。',
    ...base('red', 'immediate_risk', '低落', ['持续求助意愿']),
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
