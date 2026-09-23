// MindBridge AI + 疗愈轨道 · 决赛路演 PPT9 精简版 · 17 页 · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_决赛路演_PPT9_精简版_17页.pptx";
const IMG = __dirname + "/../素材/";
const RED = "B5473A", YEL = "D9A441", GRN = "5E9A4E";
let s;

function bullets(s, x, y, w, items, opt = {}) {
  const gap = opt.gap || 0.55;
  items.forEach((t, i) => {
    dot(s, x, y + i * gap + 0.13, opt.color || C.AMBER, 0.13);
    s.addText(t, { x: x + 0.3, y: y + i * gap, w: w - 0.3, h: gap, fontFace: HF, color: opt.textColor || C.INK, fontSize: opt.fs || 12.5, valign: "top", lineSpacingMultiple: 1.15 });
  });
}
function bandCard(s, x, y, w, h, eyebrow, title, color) {
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color } });
  s.addText(eyebrow, { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: 0.32, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(title, { x: x + 0.3, y: y + 0.38, w: w - 0.6, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 18, bold: true, valign: "middle" });
}
function darkBand(s, x, y, w, h, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  if (title) s.addText(title, { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
  s.addText(body, { x: x + 0.3, y: title ? y + 0.45 : y, w: w - 0.6, h: title ? h - 0.55 : h, fontFace: HF, color: C.WHITE, fontSize: opt.fs || 15, bold: true, valign: "middle", align: opt.align || "left", lineSpacingMultiple: 1.25 });
}


// 虚线占位框（后期替换为截图）
function placeholder(s, x, y, w, h, title, hint) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: C.MOSST }, line: { color: C.MOSS, width: 1.5, dashType: "dash" } });
  s.addText(title, { x: x + 0.2, y: y + h / 2 - 0.5, w: w - 0.4, h: 0.45, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 12.5, bold: true });
  s.addText(hint, { x: x + 0.2, y: y + h / 2, w: w - 0.4, h: 0.8, align: "center", valign: "top", fontFace: HF, color: C.MUTE, fontSize: 10, lineSpacingMultiple: 1.15 });
}
// ---------- P1 封面 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.5, y: 4.5, w: 4.4, h: 4.4, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: -1.4, y: 5.3, w: 3.8, h: 3.8, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 0.95, w: 0.9, h: 0.9 });
s.addText("企业员工心理安全与成长共生系统", { x: 1.0, y: 2.0, w: 9, h: 0.5, fontFace: HF, color: C.AMBERL, fontSize: 16, charSpacing: 2 });
s.addText([
  { text: "MindBridge AI", options: { fontSize: 56, bold: true, color: C.WHITE, breakLine: true } },
  { text: "+ 疗愈轨道", options: { fontSize: 38, bold: true, color: C.MOSSL } },
], { x: 1.0, y: 2.6, w: 11, h: 1.9, fontFace: HF });
s.addText("AI 负责广度 · 疗愈负责深度", { x: 1.0, y: 4.6, w: 11, h: 0.6, fontFace: HF, color: C.CREAMTXT, fontSize: 22 });
L.card(p, s, 1.0, 5.55, 7.6, 0.9, C.WHITE);
s.addText("双轨模型击穿传统 EAP 两大死穴：员工不愿用、企业看不清", { x: 1.2, y: 5.55, w: 7.2, h: 0.9, fontFace: HF, color: C.FOREST, fontSize: 14, valign: "middle" });
s.addText("项目团队 · 决赛路演 · 2026", { x: 1.0, y: 6.7, w: 9, h: 0.4, fontFace: HF, color: C.MOSSL, fontSize: 12.5 });

// ---------- P2 一个真实场景 ----------
s = page("OPENING · A REAL MOMENT", "凌晨 1 点，一位研发工程师打开企业微信");
L.card(p, s, 0.8, 1.9, 7.2, 2.9, C.CARD, { shadow: sh() });
s.addShape(p.ShapeType.rect, { x: 0.8, y: 1.9, w: 0.12, h: 2.9, fill: { color: C.AMBER } });
s.addText("“今天又没做完，明天还要早起……”", { x: 1.3, y: 2.15, w: 6.4, h: 1.0, fontFace: HF, color: C.FOREST, fontSize: 24, bold: true, valign: "middle" });
s.addText("—— 他没有打给任何人\n      也没有预约心理咨询", { x: 1.3, y: 3.3, w: 6.4, h: 1.2, fontFace: HF, color: C.MUTE, fontSize: 15, italic: true, valign: "top", lineSpacingMultiple: 1.35 });
L.card(p, s, 8.3, 1.9, 4.25, 2.9, C.FOREST2, { shadow: sh() });
s.addText("01:03", { x: 8.3, y: 2.15, w: 4.25, h: 1.1, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 48, bold: true });
s.addText("此刻，没有任何一条求助通道是打开的", { x: 8.55, y: 3.35, w: 3.75, h: 1.2, align: "center", fontFace: HF, color: C.MOSSL, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.25 });
label(s, 0.8, 5.05, 8, "传统 EAP 在这个时刻是失效的");
[["热线已下班", "咨询热线 9–18 点，夜里无人接听", C.MOSS], ["预约等 3–5 天", "情绪最汹涌的窗口早已过去", C.AMBER], ["门槛太高", "承认「我需要帮助」本身就是负担", RED]].forEach((c, i) => {
  const x = 0.8 + i * 2.6, y = 5.45, w = 2.45, h = 1.4;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.25, y + 0.3, c[2]);
  s.addText(c[0], { x: x + 0.5, y: y + 0.15, w: w - 0.7, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.25, y: y + 0.65, w: w - 0.5, h: 0.7, fontFace: HF, color: C.INK, fontSize: 10.5, valign: "top", lineSpacingMultiple: 1.15 });
});
darkBand(s, 8.75, 5.45, 3.8, 1.4, "", "这个时刻，正是 MindBridge 存在的意义", { fs: 15, align: "center" });

// ---------- P3 两大死穴 ----------
s = page("PART 01 · PAIN POINTS", "传统 EAP 的两大死穴");
[
  ["死穴一 · EMPLOYEE", "员工不愿用", "<5%", "参与率", "预算花了，人没来。", C.MOSS],
  ["死穴二 · ENTERPRISE", "企业看不清", "只有人次", "无法证明效果", "只知道咨询了几次，不知道有没有用。", C.AMBER],
].forEach((c, i) => {
  const x = 0.8 + i * 4.0, y = 1.9, w = 3.8, h = 3.1;
  bandCard(s, x, y, w, h, c[0], c[1], c[5]);
  s.addText(c[2], { x: x + 0.3, y: y + 1.1, w: w - 0.6, h: 0.8, fontFace: HF, color: c[5], fontSize: 32, bold: true, valign: "middle" });
  s.addText(c[3], { x: x + 0.3, y: y + 1.9, w: w - 0.6, h: 0.4, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });
  s.addText(c[4], { x: x + 0.3, y: y + 2.3, w: w - 0.6, h: 0.7, fontFace: HF, color: C.MUTE, fontSize: 11.5, valign: "top" });
});
// 恶性循环
L.card(p, s, 8.85, 1.9, 3.7, 3.1, C.FOREST, { shadow: sh() });
s.addText("恶性循环", { x: 9.1, y: 2.05, w: 3.2, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
["越没人用", "越没数据", "越没人买"].forEach((t, j) => {
  const cy = 2.5 + j * 0.78;
  s.addShape(p.ShapeType.roundRect, { x: 9.1, y: cy, w: 3.2, h: 0.55, rectRadius: 0.27, fill: { color: C.FOREST3 } });
  s.addText(t, { x: 9.1, y: cy, w: 3.2, h: 0.55, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
  if (j < 2) s.addText("↓", { x: 10.5, y: cy + 0.5, w: 0.4, h: 0.3, align: "center", fontFace: HF, color: C.AMBER, fontSize: 13, bold: true });
});
s.addText("↺ 回到起点", { x: 9.1, y: 4.55, w: 3.2, h: 0.35, align: "center", fontFace: HF, color: C.MOSSL, fontSize: 11, italic: true });
label(s, 0.8, 5.25, 6, "数据支撑");
[["54.9%", "职场人受焦虑烦躁困扰", C.MOSS], ["49.7%", "有情绪低落问题", C.AMBER], ["89%", "企业已将心理健康纳入战略", C.FOREST], ["<5%", "但传统 EAP 参与率仍然", RED]].forEach((c, i) => {
  const x = 0.8 + i * 2.98, y = 5.65, w = 2.8, h = 1.2;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.6, fontFace: HF, color: c[2], fontSize: 24, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.2, y: y + 0.7, w: w - 0.4, h: 0.45, fontFace: HF, color: C.MUTE, fontSize: 10.5, valign: "top" });
});

// ---------- P4 双轨模型 ----------
s = page("PART 02 · SOLUTION", "解决方案：AI + 疗愈双轨模型");
[
  ["AI 轨道 · 广度覆盖", "倾听者 + 匹配师", ["24h 情绪感知", "智能预警", "个性化疗愈推荐"], C.MOSS],
  ["疗愈轨道 · 深度转化", "转化师 + 陪伴者", ["一对一疏导", "团体工作坊", "长期成长陪伴"], C.FOREST],
].forEach((t, i) => {
  const x = 0.8 + i * 6.05, y = 1.9, w = 5.7, h = 3.55;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color: t[3] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color: t[3] } });
  s.addText(t[0], { x: x + 0.3, y: y + 0.05, w: w - 0.6, h: 0.55, fontFace: HF, color: C.WHITE, fontSize: 18, bold: true, valign: "middle" });
  s.addText(t[1], { x: x + 0.3, y: y + 0.55, w: w - 0.6, h: 0.35, fontFace: HF, color: C.CREAMTXT, fontSize: 11.5 });
  t[2].forEach((st, j) => {
    const sy = y + 1.2 + j * 0.78;
    s.addShape(p.ShapeType.roundRect, { x: x + 0.3, y: sy, w: w - 0.6, h: 0.62, rectRadius: 0.1, fill: { color: C.MOSST } });
    circleNum(s, x + 0.42, sy + 0.12, String(j + 1), t[3], 0.38, 11);
    s.addText(st, { x: x + 0.95, y: sy, w: w - 1.3, h: 0.62, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
  });
});
s.addShape(p.ShapeType.ellipse, { x: 6.27, y: 3.3, w: 0.8, h: 0.8, fill: { color: C.AMBER }, shadow: sh() });
s.addText("×", { x: 6.27, y: 3.3, w: 0.8, h: 0.8, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 24, bold: true });
darkBand(s, 0.8, 5.7, 11.75, 1.15, "", "AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由疗愈师完成。", { fs: 18, align: "center" });

// ---------- P5 双轨怎么跑：一次干预的完整运转 ----------
s = page("PART 02 · HOW IT RUNS", "双轨怎么跑：一次干预的完整运转");
s.addShape(p.ShapeType.roundRect, { x: 0.8, y: 1.9, w: 7.6, h: 0.55, rectRadius: 0.27, fill: { color: C.MOSST } });
s.addText("员工在树洞倾诉", { x: 0.8, y: 1.9, w: 7.6, h: 0.55, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });
[
  ["AI 识别情绪信号", "输出情绪标签 + 预警等级", C.MOSS],
  ["分级响应", "绿：自动推送资源 / 黄：建议人工服务 / 红：危机协议", C.AMBER],
  ["员工授权后，疗愈师介入", "深度疏导", C.FOREST],
  ["疗愈结果反馈给 AI", "优化下一次推荐", C.AMBER],
].forEach((c, i) => {
  const y = 2.7 + i * 1.05, x = 0.8, w = 7.6, h = 0.82;
  s.addText("↓", { x: x + w / 2 - 0.2, y: y - 0.3, w: 0.4, h: 0.3, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 16, bold: true });
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  circleNum(s, x + 0.22, y + 0.19, String(i + 1), c[2], 0.44, 12);
  s.addText(c[0], { x: x + 0.85, y: y + 0.05, w: w - 1.1, h: 0.4, fontFace: HF, color: C.FOREST, fontSize: 14.5, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.85, y: y + 0.42, w: w - 1.1, h: 0.36, fontFace: HF, color: C.MUTE, fontSize: 11.5, valign: "middle" });
});
s.addText("↺ 下一次倾诉，推荐更准", { x: 0.8, y: 6.65, w: 7.6, h: 0.3, align: "center", fontFace: HF, color: C.MUTE, fontSize: 10.5, italic: true });
L.card(p, s, 8.7, 1.9, 3.85, 4.95, C.FOREST, { shadow: sh() });
[["AI", "负责发现"], ["疗愈师", "负责转化"], ["数据", "让下一次更准"]].forEach((c, j) => {
  const cy = 2.25 + j * 1.5;
  s.addText(c[0], { x: 9.0, y: cy, w: 3.3, h: 0.55, fontFace: HF, color: C.AMBERL, fontSize: 22, bold: true, valign: "middle" });
  s.addText(c[1], { x: 9.0, y: cy + 0.55, w: 3.3, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 15, valign: "top" });
  if (j < 2) s.addShape(p.ShapeType.rect, { x: 9.0, y: cy + 1.25, w: 3.3, h: 0.02, fill: { color: C.FOREST3 } });
});

// ---------- P6 AI 树洞 ----------
s = page("PART 02 · AI ENGINE", "AI 树洞 —— 让倾诉不像「求助」，而像「说话」");
[
  ["共情倾听", "AI 承接情绪\n倾诉即疗愈", C.MOSS],
  ["三级预警", "绿 / 黄 / 红\n差异触发", C.AMBER],
  ["智能匹配", "三维动态\n精准推荐", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 2.35, y = 1.9, w = 2.2, h = 1.75;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.25, y + 0.32, c[2]);
  s.addText(c[0], { x: x + 0.5, y: y + 0.15, w: w - 0.7, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 15, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.9, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.25 });
});
L.table(p, s, { x: 0.8, y: 3.9, w: 6.9, colFr: [1.2, 2.6, 3.1], headers: ["等级", "关键词", "触发动作"],
  rows: [["🟢 绿", "「好累」「压力大」", "自动推送疗愈资源"], ["🟡 黄", "「快撑不住了」", "建议连接人工服务"], ["🔴 红", "极端词汇", "危机协议处理"]],
  rowH: 0.62, fs: 12, headFs: 12 });
L.card(p, s, 8.0, 1.9, 4.55, 4.95, C.FOREST, { shadow: sh() });
s.addText("核心设计原则", { x: 8.3, y: 2.1, w: 4, h: 0.4, fontFace: HF, color: C.AMBERL, fontSize: 14, bold: true });
[["个人风险不通知 HR", "仅向员工本人提供支持"], ["组织风险匿名聚合", "达到聚合条件后输出趋势预警"], ["员工授权后才介入", "疗愈师不越界，信任是前提"]].forEach((c, j) => {
  const cy = 2.7 + j * 1.35;
  circleNum(s, 8.3, cy + 0.05, String(j + 1), C.AMBER, 0.42, 12);
  s.addText(c[0], { x: 8.9, y: cy, w: 3.5, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 14.5, bold: true, valign: "middle" });
  s.addText(c[1], { x: 8.9, y: cy + 0.5, w: 3.5, h: 0.6, fontFace: HF, color: C.CREAMTXT, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.15 });
});

// ---------- P7 三级预警 ----------
s = page("PART 02 · THREE LIGHTS", "三盏灯：绿、黄、红");
lead(s, "把抽象的情绪状态变成三种具体动作。", 1.7, 0.45);
[
  ["绿色：日常倾诉 · 自助疗愈", "7BA05B", "「压力大」「睡不着」等轻度困扰", "自动推送正念音频、呼吸练习，员工自助完成", "自助疗愈 · 隐私保护 · 无感陪伴"],
  ["黄色：风险预警 · 人工介入", "E1943B", "「快撑不住」「想辞职」等中度风险", "推送资源 + 建议连接人工服务；不惊动 HR", "人工介入 · 隐私优先 · 主动关怀"],
  ["红色：危机识别 · 紧急响应", "B5473A", "极端词汇", "疗愈师按危机协议接管，紧急通道直连", "危机响应 · 专业接管 · 生命至上"],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.45, w = 3.8, h = 4.35;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.7, rectRadius: 0.12, fill: { color: c[1] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.4, w, h: 0.3, fill: { color: c[1] } });
  s.addText(c[0], { x: x + 0.25, y, w: w - 0.5, h: 0.7, fontFace: HF, color: C.WHITE, fontSize: 14.5, bold: true, valign: "middle" });
  s.addText("触发", { x: x + 0.25, y: y + 0.85, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
  s.addText(c[2], { x: x + 0.25, y: y + 1.15, w: w - 0.5, h: 1.15, fontFace: HF, color: C.INK, fontSize: 13, valign: "top", lineSpacingMultiple: 1.25 });
  s.addText("动作", { x: x + 0.25, y: y + 2.3, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
  s.addText(c[3], { x: x + 0.25, y: y + 2.6, w: w - 0.5, h: 1.15, fontFace: HF, color: C.INK, fontSize: 13, valign: "top", lineSpacingMultiple: 1.25 });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.25, y: y + 3.75, w: w - 0.5, h: 0.42, rectRadius: 0.21, fill: { color: C.MOSST } });
  s.addText(c[4], { x: x + 0.25, y: y + 3.75, w: w - 0.5, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 11, bold: true });
});

// ---------- P8 三级干预体系 ----------
s = page("PART 02 · INTERVENTION", "三级干预体系：谁来回，怎么回");
L.table(p, s, { x: 0.8, y: 1.9, w: 11.75, colFr: [1.7, 2.7, 3.9, 3.4], headers: ["干预层级", "干预对象与触发条件", "干预方式与实施主体", "数据流向与隐私控制"],
  rows: [
    ["一级：全员预防", "全体员工 / 日常状态", "AI 树洞 24h 倾诉、自助工具包、心理嘉年华（AI 系统 + 企业 HR）", "仅产出匿名聚合趋势，不涉及个人标识"],
    ["二级：专业支持", "主动求助或 AI 识别黄色风险员工", "疗愈师一对一疏导、行业定制团体工作坊（持证疗愈师团队）", "个人服务数据留在专业系统，绝不进入 HR 后台"],
    ["三级：危机处理", "AI 识别红色风险 + 疗愈师研判确认", "专业心理咨询转介、危机干预流程（疗愈师 + 精神科顾问）", "按正式危机协议执行，必要时启动紧急联系人机制"],
  ], rowH: 0.85, fs: 12 });
L.card(p, s, 0.8, 5.05, 11.75, 1.75, C.FOREST, { shadow: sh() });
s.addText("MindBridge 建立了分层分级、精准对标的三级干预机制，实现心理支持资源的最优配置。一级全员预防依托 AI 实现低成本广覆盖，二级专业支持聚焦中高风险个体的深度转化，三级危机处理构筑生命安全底线。各级干预的数据流向严格遵循隐私隔离原则，确保在提供无缝支持的同时，守住员工个人隐私与企业合规的双重底线。",
  { x: 1.1, y: 5.15, w: 11.15, h: 1.55, fontFace: HF, color: C.WHITE, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.25 });

// ---------- P9 行业精准对标 ----------
s = page("PART 03 · INDUSTRY FIT", "一行业，一方案");
flow(s, 0.8, 1.85, 11.75, ["HR 数据 + AI 试运行", "定位痛点", "匹配模块", "一行业一方案"], C.FOREST);
[
  ["SECTOR 01", "互联网 / 科技", "针对「35 岁恐慌 / 碎片化」", "正念减压 + 叙事疗愈", C.MOSS],
  ["SECTOR 02", "金融 / 客服", "针对「情绪劳动 / 业绩高压」", "积极心理学 + 艺术疗愈", C.AMBER],
  ["SECTOR 03", "医护 / 制造", "针对「共情疲劳 / 产线孤独」", "巴林特小组 + 音乐沙盘", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.6, w = 3.8, h = 3.6;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color: c[4] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color: c[4] } });
  s.addText(c[0], { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: 0.32, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.3, y: y + 0.38, w: w - 0.6, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 19, bold: true, valign: "middle" });
  s.addText("核心痛点", { x: x + 0.3, y: y + 1.2, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true });
  s.addText(c[2], { x: x + 0.3, y: y + 1.5, w: w - 0.6, h: 0.7, fontFace: HF, color: C.INK, fontSize: 13.5, valign: "top", lineSpacingMultiple: 1.2 });
  s.addText("匹配模块", { x: x + 0.3, y: y + 2.35, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true });
  L.card(p, s, x + 0.3, y + 2.7, w - 0.6, 1.05, C.MOSST);
  s.addText(c[3], { x: x + 0.45, y: y + 2.7, w: w - 0.9, h: 1.05, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
});
L.foot(p, s, "后台已沉淀 8 行业 Benchmark 数据，支撑每组匹配逻辑（见下页）");

// ---------- P10 行业数据沉淀 ----------
s = page("PART 03 · DATA FLYWHEEL", "越用越准：三层数据");
lead(s, "HR 已有数据 + AI 树洞数据 + 跨企业行业常模 = 越用越准的精准适配", 1.7, 0.4);
[
  ["第一层 · HR 已有数据", "离职率、病假率、离职面谈记录，脱敏后直接复用。", C.MOSS],
  ["第二层 · AI 树洞试运行", "2–4 周采集真实倾诉，生成情绪标签分布与部门压力热力图。", C.AMBER],
  ["第三层 · 跨企业行业常模（飞轮层）", "同行业匿名聚合数据，自动比对本企业与行业基准的差异。", C.FOREST],
].forEach((c, i) => {
  const y = 2.2 + i * 1.15;
  L.card(p, s, 0.8, y, 4.1, 1.0, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.rect, { x: 0.8, y: y + 0.18, w: 0.1, h: 0.64, fill: { color: c[2] } });
  s.addText(c[0], { x: 1.1, y: y + 0.08, w: 3.7, h: 0.36, fontFace: HF, color: C.FOREST, fontSize: 12.5, bold: true });
  s.addText(c[1], { x: 1.1, y: y + 0.44, w: 3.7, h: 0.55, fontFace: HF, color: C.INK, fontSize: 10, valign: "top", lineSpacingMultiple: 1.15 });
});
L.card(p, s, 0.8, 5.65, 4.1, 1.2, C.CARD, { shadow: sh() });
dot(s, 1.0, 5.8, C.AMBER, 0.13);
s.addText("数据边界", { x: 1.22, y: 5.7, w: 2.8, h: 0.32, fontFace: HF, color: C.FOREST, fontSize: 11, bold: true, valign: "middle" });
s.addText("不披露企业名称与单家明细，不进入员工个人数据；样本不足不生成 Benchmark；仅用于同行参照与效果分析。", { x: 1.0, y: 6.02, w: 3.75, h: 0.8, fontFace: HF, color: C.INK, fontSize: 9.5, valign: "top", lineSpacingMultiple: 1.15 });
L.table(p, s, { x: 5.2, y: 2.2, w: 7.35, colFr: [1.7, 0.9, 1.1, 0.9, 0.9, 0.9], headers: ["行业", "企业数", "员工样本", "月活", "完成率", "满意度"],
  rows: [
    ["互联网 / IT", "18 家", "8,420", "31%", "66%", "4.3"], ["公益组织", "7 家", "1,840", "41%", "73%", "4.6"],
    ["制造业", "14 家", "9,630", "24%", "65%", "4.2"], ["医护 / 护理", "9 家", "5,270", "34%", "71%", "4.5"],
    ["客服 / 服务业", "15 家", "7,020", "37%", "67%", "4.4"], ["教育", "11 家", "3,890", "29%", "69%", "4.4"],
    ["科技企业", "10 家", "4,560", "33%", "70%", "4.5"], ["金融 / 银行", "12 家", "6,110", "26%", "63%", "4.2"],
  ], rowH: 0.44, headH: 0.5, fs: 11, headFs: 11.5 });
s.addText("8 行业 Benchmark 总览（跨企业匿名统计）", { x: 5.2, y: 6.27, w: 7.35, h: 0.25, fontFace: HF, color: C.MUTE, fontSize: 9, italic: true, align: "right" });
L.foot(p, s, "每服务一个行业头部客户，沉淀一套行业常模 —— 服务企业越多，新客户方案越准，适配周期从数月压缩至 2–4 周");

// ---------- P11 参与度保障（敢用 + 愿意用） ----------
s = page("PART 03 · ENGAGEMENT", "参与度保障");
lead(s, "参与率 <5% 的根源不是没需求，而是不敢开口。先让员工敢用，再让员工愿意用。", 1.7, 0.5);
[
  ["敢用", "一键进入 · 匿名隔离 · 像说话一样", "企业微信直接打开，HR 看不到，AI 共情回应，不像求助", C.MOSS],
  ["愿意用", "信任基础 · 认知转化 · 非货币激励", "匿名隔离与身份物理隔离、启动会展示脱敏案例、解锁音频包 + 培训学时 + 心理健康假", C.AMBER],
].forEach((c, i) => {
  const y = 2.35 + i * 1.6, x = 0.8, w = 7.0, h = 1.4;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.5, h, rectRadius: 0.12, fill: { color: c[3] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.2, y, w: 0.3, h, fill: { color: c[3] } });
  s.addText(c[0], { x, y, w: 1.5, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 22, bold: true });
  s.addText(c[1], { x: x + 1.75, y: y + 0.15, w: w - 2.0, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 15, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 1.75, y: y + 0.62, w: w - 2.0, h: 0.7, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
});
[["≥30%", "年主动使用率", "从 <5% 提升"], ["≥20%", "重复使用率", "连续 2 周+"], ["≥50%", "活动参与率", "受邀者中"]].forEach((c, i) => {
  const x = 8.1 + i * 1.5, y = 2.35, w = 1.4, h = 3.2;
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  s.addText(c[0], { x: x + 0.1, y: y + 0.3, w: w - 0.2, h: 0.7, align: "center", fontFace: HF, color: C.AMBERL, fontSize: 22, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.1, y: y + 1.15, w: w - 0.2, h: 0.8, align: "center", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true, valign: "top", lineSpacingMultiple: 1.15 });
  s.addText(c[2], { x: x + 0.1, y: y + 2.1, w: w - 0.2, h: 0.8, align: "center", fontFace: HF, color: C.CREAMTXT, fontSize: 10, valign: "top", lineSpacingMultiple: 1.15 });
});
darkBand(s, 0.8, 5.8, 11.75, 1.05, "", "让参与从「被动要求」变成「主动需求」。", { fs: 17, align: "center" });

// ---------- P12 数据安全 ----------
s = page("PART 03 · SECURITY", "数据安全与隐私");
[
  ["设计层", "去标识化匿名设计", C.MOSS], ["存储层", "加密隔离存储", C.AMBER], ["权限层", "严格权限管控", C.FOREST],
  ["制度层", "保密协议约束", C.AMBER], ["技术层", "等保三级认证与私有云部署", C.MOSS],
].forEach((c, i) => {
  const y = 1.9 + i * 0.68, x = 0.8, w = 4.6, h = 0.58;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.3, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.0, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText("🛡 " + c[0], { x: x + 0.12, y, w: 1.15, h, fontFace: HF, color: C.WHITE, fontSize: 11.5, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 1.5, y, w: w - 1.6, h, fontFace: HF, color: C.INK, fontSize: 12, valign: "middle" });
});
[
  ["双链数据物理隔离", "员工对话留在个人空间，企业只看聚合趋势"],
  ["员工掌握数据主权", "可随时查看、导出或一键清空全部历史记录"],
  ["企业权限严格受限", "HR 仅能查看匿名聚合后的趋势图，无权查看个人原文"],
].forEach((c, i) => dotCard(s, 5.65, 1.9 + i * 1.2, 6.9, 1.15, c[0], c[1], { tfs: 13.5, fs: 11.5, accent: [C.MOSS, C.AMBER, C.FOREST][i] }));
placeholder(s, 0.8, 5.6, 5.75, 1.25, "[ 疗愈师工作台截图 ]", "只见个案编号与风险级，不见身份");
placeholder(s, 6.8, 5.6, 5.75, 1.25, "[ HR 匿名看板截图 ]", "组织情绪节律与干预效果");

// ---------- P13 商业模式 ----------
s = page("PART 04 · BUSINESS MODEL", "模块化采购，灵活适配");
L.table(p, s, { x: 0.8, y: 1.9, w: 7.6, colFr: [1.3, 4.2, 1.6], headers: ["版本", "内容", "年费"],
  rows: [
    ["旗舰版", "进阶版 + 大使培养 + 年度白皮书", "80–120 万"],
    ["进阶版", "标准版 + 一对一疏导 + 行业定制", "50–80 万"],
    ["标准版", "基础版 + 季度团体工作坊", "30–50 万"],
    ["基础版", "AI 树洞 + 数字内容 + 年度测评", "15–25 万"],
  ], rowH: 0.7, fs: 12.5, starCol: 2 });
stat(s, 8.7, 1.9, 3.85, 1.55, "1260–1760 元", "人均 / 年 · 成本优势");
stat(s, 8.7, 3.6, 3.85, 1.55, "↓ 30%–40%", "较传统 EAP（2000–3000 元 / 人）", { dark: false });
L.card(p, s, 0.8, 5.35, 7.6, 1.5, C.CARD, { shadow: sh() });
s.addText("收费方式", { x: 1.05, y: 5.45, w: 3, h: 0.35, fontFace: HF, color: C.AMBER, fontSize: 12, bold: true });
s.addText("按人头年费 + 项目制（5–15 万 / 次）", { x: 1.05, y: 5.85, w: 7.1, h: 0.8, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true, valign: "middle" });
darkBand(s, 8.7, 5.35, 3.85, 1.5, "", "以 15 万基础版降低试错门槛\n决策门槛低", { fs: 14, align: "center" });

// ---------- P14 市场验证 ----------
s = page("PART 04 · MARKET", "53 亿市场，头部客户已进场");
stat(s, 0.8, 1.9, 3.7, 1.7, "53 亿", "中国 EAP 市场 · 2024 年");
stat(s, 4.7, 1.9, 3.7, 1.7, "34.6%", "年增长率", { dark: false });
stat(s, 8.6, 1.9, 3.95, 1.7, "84.9 亿美元", "全球 EAP 市场 · 2032 年", { dark: false });
L.card(p, s, 0.8, 3.8, 3.7, 1.7, C.CARD, { shadow: sh() });
s.addText("≥70%", { x: 1.05, y: 3.95, w: 3.2, h: 0.75, fontFace: HF, color: C.AMBER, fontSize: 30, bold: true, valign: "middle" });
s.addText("续约率预估（传统 EAP 仅 50%–60%）", { x: 1.05, y: 4.7, w: 3.2, h: 0.7, fontFace: HF, color: C.MUTE, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.15 });
// 飞轮
L.card(p, s, 4.7, 3.8, 7.85, 1.7, C.CARD, { shadow: sh() });
s.addText("增长飞轮", { x: 4.95, y: 3.9, w: 3, h: 0.35, fontFace: HF, color: C.FOREST, fontSize: 13, bold: true });
flow(s, 4.95, 4.35, 7.35, ["标杆案例", "行业白皮书", "同行业裂变", "获客成本递减"], C.FOREST);
s.addText("↺ 数据资产强化 → 回到标杆案例", { x: 4.95, y: 4.95, w: 7.35, h: 0.4, align: "center", fontFace: HF, color: C.MUTE, fontSize: 11, italic: true });
L.card(p, s, 0.8, 5.75, 11.75, 1.1, C.FOREST, { shadow: sh() });
s.addText("已公开采购客户", { x: 1.1, y: 5.75, w: 2.6, h: 1.1, fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, valign: "middle" });
["南网数字集团", "海南电网", "中国电信"].forEach((t, i) => {
  const x = 3.9 + i * 2.85;
  s.addShape(p.ShapeType.roundRect, { x, y: 6.0, w: 2.6, h: 0.6, rectRadius: 0.3, fill: { color: C.FOREST3 } });
  s.addText(t, { x, y: 6.0, w: 2.6, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
});

// ---------- P15 竞争壁垒 ----------
s = page("PART 04 · COMPETITIVE MOAT", "四大壁垒，先发即锁定");
[
  ["01", "AI + 疗愈协同", "已跑通 8 个行业、服务多家企业。对手只能复制单一功能，无法复制协同效率。", C.MOSS],
  ["02", "行业适配标准化", "八大行业流程化，2–4 周完成新行业适配。对手依赖咨询师个体经验，无法规模化。", C.AMBER],
  ["03", "效果对赌", "尾款 30% 挂钩 PSI，敢做对赌者自动分层。信任成本归零的获客壁垒。", C.FOREST],
  ["04", "数据飞轮", "已沉淀 8 行业常模数据，服务企业越多方案越准。对手从零追赶需 6 个月以上。", C.AMBER],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 1.9 + Math.floor(i / 2) * 2.5, 5.7, 2.3, c[0], c[1], c[2], { tfs: 18, fs: 13, accent: c[3] }));
s.addShape(p.ShapeType.ellipse, { x: 6.2, y: 3.85, w: 0.95, h: 0.95, fill: { color: C.FOREST }, shadow: sh() });
s.addText("MOAT", { x: 6.2, y: 3.85, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 11, bold: true });

// ---------- P16 ROI 与增长 ----------
s = page("PART 04 · ROI & GROWTH", "ROI 与增长");
L.table(p, s, { x: 0.8, y: 1.9, w: 4.6, colFr: [2.2, 1.8], headers: ["500 人企业 / 年", "数值"],
  rows: [["年度投入", "63–88 万"], ["年度收益", "约 634 万"], ["ROI", "约 7–10 倍"], ["投资回收期", "约 1–1.5 个月"]],
  rowH: 0.48, headH: 0.5, fs: 12, starCol: 1 });
L.table(p, s, { x: 5.65, y: 1.9, w: 6.9, colFr: [1.45, 1.0, 1.45, 1.0, 1.25, 1.1], headers: ["收益构成", "万元", "收益构成", "万元", "收益构成", "万元"],
  rows: [["离职成本节约", "169", "缺勤损失降低", "90", "在岗产出提升", "375"], ["管理收益", "25–33", "品牌收益", "35–88", "ESG 收益", "85–280"]],
  rowH: 0.56, headH: 0.5, fs: 10.5, headFs: 10.5 });
s.addText("测算口径：人均 1,260–1,760 元 / 年；离职率降 30%、缺勤降 20%、专注力恢复 5%", { x: 5.65, y: 3.55, w: 6.9, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 9.5, italic: true });
label(s, 0.8, 4.5, 5, "增长路径");
flow(s, 0.8, 4.88, 11.75, ["3–5 年覆盖 1000 家企业", "营收 3–5 亿", "净利率 20%–30%"], C.FOREST);
L.card(p, s, 0.8, 5.5, 7.0, 1.35, C.CARD, { shadow: sh() });
s.addText("融资用途", { x: 1.05, y: 5.58, w: 3, h: 0.32, fontFace: HF, color: C.AMBER, fontSize: 12, bold: true });
["行业拓展", "AI 模型迭代", "标杆案例规模化"].forEach((t, i) => {
  const x = 1.05 + i * 2.2;
  s.addShape(p.ShapeType.roundRect, { x, y: 6.0, w: 2.05, h: 0.62, rectRadius: 0.1, fill: { color: C.MOSST } });
  s.addText(t, { x, y: 6.0, w: 2.05, h: 0.62, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 13, bold: true });
});
L.card(p, s, 8.05, 5.5, 4.5, 1.35, C.FOREST, { shadow: sh() });
s.addText("退出逻辑", { x: 8.3, y: 5.58, w: 3, h: 0.32, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
s.addText("传统咨询 · 大健康平台 · HR SaaS", { x: 8.3, y: 5.95, w: 4.0, h: 0.7, fontFace: HF, color: C.WHITE, fontSize: 14.5, bold: true, valign: "middle" });

// ---------- P17 结尾 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: -1.5, y: -1.6, w: 5, h: 5, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 4.8, w: 4.2, h: 4.2, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 1.1, w: 1.0, h: 1.0 });
s.addText("MindBridge AI + 疗愈轨道", { x: 1.0, y: 2.25, w: 9, h: 0.5, fontFace: HF, color: C.AMBERL, fontSize: 16, charSpacing: 2 });
s.addText("让每一个员工都被听见\n让每一份压力都有出口", { x: 1.0, y: 2.8, w: 10, h: 1.7, fontFace: HF, color: C.WHITE, fontSize: 32, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });
L.card(p, s, 1.0, 4.75, 8.6, 1.1, C.FOREST3);
s.addText("“我们不是在做一个心理产品，我们是在重建人与组织之间的信任。”", { x: 1.3, y: 4.75, w: 8.0, h: 1.1, fontFace: HF, color: C.WHITE, fontSize: 16, bold: true, valign: "middle" });
s.addText("项目负责人 · 电话 · 邮箱", { x: 1.0, y: 6.3, w: 8, h: 0.5, fontFace: HF, color: C.CREAMTXT, fontSize: 14 });
s.addShape(p.ShapeType.roundRect, { x: 10.3, y: 4.5, w: 2.2, h: 2.2, rectRadius: 0.12, fill: { color: C.FOREST3 }, line: { color: C.MOSSL, width: 1.5, dashType: "dash" } });
s.addText("[ 二维码 / 联系方式 ]", { x: 10.3, y: 4.5, w: 2.2, h: 2.2, align: "center", valign: "middle", fontFace: HF, color: C.MOSSL, fontSize: 11 });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
