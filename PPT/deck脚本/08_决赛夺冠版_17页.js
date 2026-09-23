// MindBridge AI + 疗愈轨道 · 决赛路演 完整夺冠版 · 17 页 · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_决赛路演_完整夺冠版_17页.pptx";
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
  const x = 0.8 + i * 4.0, y = 1.9, w = 3.8, h = 3.55;
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
s.addShape(p.ShapeType.ellipse, { x: 4.2, y: 3.3, w: 0.8, h: 0.8, fill: { color: C.AMBER }, shadow: sh() });
s.addText("×", { x: 4.2, y: 3.3, w: 0.8, h: 0.8, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 24, bold: true });
// 为什么必须是双轨
L.card(p, s, 8.85, 1.9, 3.7, 3.55, C.FOREST, { shadow: sh() });
s.addText("为什么必须是双轨？", { x: 9.1, y: 2.05, w: 3.2, h: 0.4, fontFace: HF, color: C.AMBERL, fontSize: 14, bold: true });
[["AI-only", "工具而非伙伴，无法深层转化"], ["疗愈师-only", "少数人的奢侈品，无法全员覆盖"], ["双轨协同", "广度 × 深度 = 完整解决方案"]].forEach((c, j) => {
  const cy = 2.55 + j * 0.95;
  s.addText(c[0], { x: 9.1, y: cy, w: 3.2, h: 0.35, fontFace: HF, color: j === 2 ? C.AMBERL : C.MOSSL, fontSize: 12.5, bold: true });
  s.addText(c[1], { x: 9.1, y: cy + 0.33, w: 3.2, h: 0.55, fontFace: HF, color: C.WHITE, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.15 });
});
darkBand(s, 0.8, 5.7, 11.75, 1.15, "", "AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由疗愈师完成。", { fs: 18, align: "center" });

// ---------- P5 AI 树洞 ----------
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

// ---------- P6 六大疗愈模块 ----------
s = page("PART 02 · HEALING TRACK", "六大疗愈模块，精准匹配行业痛点");
[
  ["正念减压", "正念呼吸 · 身体扫描", "互联网 / IT", C.MOSS],
  ["积极心理学", "可控/不可控 · 三件好事", "金融 / 银行", C.AMBER],
  ["表达性艺术", "心流插花 · 情绪色彩", "客服 / 服务业", C.FOREST],
  ["音乐疗愈", "奥尔夫合奏 · 拍手律动", "教育", C.AMBER],
  ["巴林特小组", "案例呈报 · 多角色讨论", "医护 / 护理", C.FOREST],
  ["叙事 + 沙盘", "身份重塑 · 沙具摆放", "制造业 / 科技", C.MOSS],
].forEach((c, i) => {
  const x = 0.8 + (i % 3) * 3.98, y = 1.9 + Math.floor(i / 3) * 1.85, w = 3.8, h = 1.65;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.25, w: 0.1, h: h - 0.5, fill: { color: c[3] } });
  s.addText(c[0], { x: x + 0.35, y: y + 0.15, w: w - 0.6, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.35, y: y + 0.65, w: w - 0.6, h: 0.45, fontFace: HF, color: C.INK, fontSize: 12, valign: "middle" });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.35, y: y + 1.12, w: 1.9, h: 0.36, rectRadius: 0.18, fill: { color: C.MOSST } });
  s.addText("适配：" + c[2], { x: x + 0.35, y: y + 1.12, w: 1.9, h: 0.36, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 10, bold: true });
});
darkBand(s, 0.8, 5.75, 11.75, 1.1, "理论根基", "正念减压（MBSR）· 积极心理学（塞利格曼）· 表达性艺术治疗（IEATA）· 音乐治疗（WFMT）· 巴林特小组（Balint Society）· 叙事治疗", { fs: 13 });

// ---------- P7 双轨协同闭环 ----------
s = page("PART 02 · CLOSED LOOP", "四环节数据闭环");
lead(s, "识别 → 预警 → 反馈 → 迭代，四个环节首尾相接；每一次疗愈的结果都回流到 AI，推荐越用越准。", 1.7, 0.5);
const loop = [
  ["识别", "AI 情绪感知 + 匹配推荐", C.MOSS],
  ["预警", "三级触发 + 员工授权后介入", C.AMBER],
  ["反馈", "疗愈师记录效果", C.FOREST],
  ["迭代", "模型更新，推荐更精准", C.AMBER],
];
loop.forEach((c, i) => {
  const row = i < 2 ? 0 : 1, col = i < 2 ? i : 3 - i;
  const x = 0.8 + col * 4.35, y = 2.35 + row * 1.6, w = 3.9, h = 1.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  circleNum(s, x + 0.25, y + 0.22, String(i + 1), c[2], 0.44, 12);
  s.addText(c[0], { x: x + 0.8, y: y + 0.15, w: w - 1.0, h: 0.55, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.45, fontFace: HF, color: C.MUTE, fontSize: 12 });
});
// 环形箭头：1→2（右）、2→3（下）、3→4（左）、4→1（上）
s.addText("→", { x: 4.68, y: 2.65, w: 0.5, h: 0.7, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 22, bold: true });
s.addText("↓", { x: 6.9, y: 3.63, w: 0.4, h: 0.34, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 22, bold: true });
s.addText("←", { x: 4.68, y: 4.25, w: 0.5, h: 0.7, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 22, bold: true });
s.addText("↑", { x: 2.55, y: 3.63, w: 0.4, h: 0.34, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 22, bold: true });
L.card(p, s, 9.35, 2.35, 3.2, 2.9, C.FOREST, { shadow: sh() });
s.addText("闭环价值", { x: 9.6, y: 2.5, w: 2.8, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12.5, bold: true });
bullets(s, 9.6, 2.95, 2.8, ["每次疗愈的结果都反馈给 AI 系统", "推荐引擎随使用越来越精准", "疗愈师专注深度转化，不被行政工作消耗"], { color: C.AMBERL, textColor: C.WHITE, fs: 11.5, gap: 0.72 });
darkBand(s, 0.8, 5.65, 11.75, 1.15, "", "AI 发现信号，AI 推荐方案，疗愈创造改变。", { fs: 18, align: "center" });

// ---------- P8 行业对标 ----------
s = page("PART 03 · INDUSTRY FIT", "八大行业，一行业一方案");
L.table(p, s, { x: 0.8, y: 1.9, w: 7.6, colFr: [1.7, 2.6, 3.0], headers: ["行业", "核心痛点数据", "匹配方案"],
  rows: [
    ["互联网 / IT", "65.4% 秒回负担", "正念 + 叙事疗愈"],
    ["金融 / 银行", "42.9% 业绩压力", "积极心理 + 跨团队"],
    ["客服 / 服务业", "15% 女性抑郁率", "心流插花 + 正念"],
    ["教育", ">30% 职业倦怠", "奥尔夫音乐 + ABC"],
    ["医护 / 护理", "11% 抑郁率", "巴林特 + 困境盲盒"],
    ["制造业", "140h 月均加班", "沙盘 + 拳击 + 驿站"],
    ["科技企业", "55.7% 行业倦怠感", "叙事疗愈 + 正念"],
    ["公益组织", "63.86% 抑郁倾向", "巴林特 + 艺术疗愈"],
  ], rowH: 0.52, headH: 0.5, fs: 11.5, headFs: 12 });
L.card(p, s, 8.7, 1.9, 3.85, 3.55, C.CARD, { shadow: sh() });
s.addText("对标路径", { x: 8.95, y: 2.05, w: 3.4, h: 0.35, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });
[["HR 提供已有数据", "离职率 / 病假率 / 面谈记录"], ["AI 树洞试运行", "2–4 周"], ["两步数据合并", "直接出方案"]].forEach((c, j) => {
  const cy = 2.5 + j * 0.95;
  circleNum(s, 8.95, cy + 0.05, String(j + 1), [C.MOSS, C.AMBER, C.FOREST][j], 0.42, 12);
  s.addText(c[0], { x: 9.5, y: cy, w: 2.9, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 13.5, bold: true, valign: "middle" });
  s.addText(c[1], { x: 9.5, y: cy + 0.42, w: 2.9, h: 0.4, fontFace: HF, color: C.MUTE, fontSize: 11 });
});
darkBand(s, 8.7, 5.65, 3.85, 1.2, "", "不依赖管理层访谈\n靠数据识别真实痛点", { fs: 14, align: "center" });

// ---------- P9 数据安全 ----------
s = page("PART 03 · PRIVACY & SECURITY", "五重保障，让员工敢开口");
[
  ["设计层", "去标识化匿名，身份与心理服务数据隔离", C.MOSS],
  ["存储层", "加密隔离，员工可随时删除个人历史记录", C.AMBER],
  ["权限层", "HR 仅见聚合趋势，无法查看任何个人原文", C.FOREST],
  ["制度层", "保密协议，明确数据使用边界", C.AMBER],
  ["技术层", "等保三级认证，加密传输与存储", C.MOSS],
].forEach((c, i) => {
  const y = 1.9 + i * 0.78, x = 0.8, w = 7.5, h = 0.68;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.6, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.3, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText("🛡 " + c[0], { x: x + 0.15, y, w: 1.4, h, fontFace: HF, color: C.WHITE, fontSize: 13, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 1.85, y, w: w - 2.0, h, fontFace: HF, color: C.INK, fontSize: 13, valign: "middle" });
});
L.card(p, s, 8.7, 1.9, 3.85, 3.7, C.FOREST, { shadow: sh() });
s.addText("核心原则", { x: 8.95, y: 2.05, w: 3.4, h: 0.4, fontFace: HF, color: C.AMBERL, fontSize: 14, bold: true });
s.addText("员工个人心理风险\n默认不作为 HR 个案管理信息", { x: 8.95, y: 2.55, w: 3.4, h: 1.2, fontFace: HF, color: C.WHITE, fontSize: 14, bold: true, valign: "top", lineSpacingMultiple: 1.3 });
s.addShape(p.ShapeType.rect, { x: 8.95, y: 3.85, w: 3.4, h: 0.02, fill: { color: C.FOREST3 } });
s.addText("HR 获得的是达到匿名聚合条件后的组织风险信息", { x: 8.95, y: 4.0, w: 3.4, h: 1.4, fontFace: HF, color: C.CREAMTXT, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.3 });
darkBand(s, 0.8, 5.85, 11.75, 1.0, "", "个人链路保护隐私 · 组织链路赋能管理 —— 两条链路物理隔离", { fs: 16, align: "center" });

// ---------- P10 四级量化评估 ----------
s = page("PART 03 · MEASUREMENT", "让效果从「我感觉有用」变成「数据证明有用」");
const lv = [
  ["L4", "长期影响", "离职率 ↓≥30% · 敬业度 ↑≥10%", C.FOREST],
  ["L3", "中期改善", "PSI ≥5.5 · PSS ↓≥25%", C.FOREST3],
  ["L2", "行为转化", "转化率 ≥60%", C.MOSS],
  ["L1", "即时反应", "改善 ≥2 分", C.AMBER],
  ["L0", "使用率", "≥30%", YEL],
];
lv.forEach((c, i) => {
  const w = 2.0 + i * 0.6, x = 2.6 - i * 0.3, y = 1.9 + i * 0.78, h = 0.68;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: c[3] }, shape: "roundRect" });
  s.addText(c[0] + "  " + c[1], { x, y, w, h, align: "center", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true, valign: "middle" });
  s.addText(c[2], { x: 5.7, y, w: 2.85, h, fontFace: HF, color: c[3] === YEL ? C.AMBER : c[3], fontSize: 12.5, bold: true, valign: "middle" });
});
s.addShape(p.ShapeType.rect, { x: 5.55, y: 1.9, w: 0.02, h: 3.8, fill: { color: C.MOSSL } });
L.card(p, s, 8.7, 1.9, 3.85, 3.7, C.CARD, { shadow: sh() });
s.addText("数据采集方式", { x: 8.95, y: 2.05, w: 3.4, h: 0.4, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });
[["L0–L3", "AI 系统自动采集，不增加 HR 工作量", C.MOSS], ["L4", "HR 仅需提供病假率与离职率两项匿名数据", C.AMBER], ["输出", "年度 ESG 数据包，直接满足 GRI 403 披露", C.FOREST]].forEach((c, j) => {
  const cy = 2.55 + j * 1.0;
  s.addShape(p.ShapeType.roundRect, { x: 8.95, y: cy, w: 1.0, h: 0.36, rectRadius: 0.18, fill: { color: c[2] } });
  s.addText(c[0], { x: 8.95, y: cy, w: 1.0, h: 0.36, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 10.5, bold: true });
  s.addText(c[1], { x: 8.95, y: cy + 0.4, w: 3.4, h: 0.55, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.15 });
});
darkBand(s, 0.8, 5.85, 11.75, 1.0, "", "五个层级全部有目标值、有采集方式 —— 效果可验证，尾款可对赌", { fs: 16, align: "center" });

// ---------- P11 商业模式 ----------
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

// ---------- P12 市场验证 ----------
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

// ---------- P13 竞争壁垒 ----------
s = page("PART 04 · COMPETITIVE MOAT", "四大壁垒，先发即锁定");
[
  ["01", "AI + 疗愈协同", "完整链路需三方长期磨合。对手只能复制单一功能，无法复制协同效率。", C.MOSS],
  ["02", "行业适配标准化", "八大行业流程化，2–4 周完成新行业适配。对手依赖咨询师个体经验，无法规模化。", C.AMBER],
  ["03", "效果对赌", "尾款 30% 挂钩 PSI，敢做对赌者自动分层。信任成本归零的获客壁垒。", C.FOREST],
  ["04", "数据飞轮", "每服务一个行业沉淀一套常模数据。先发优势持续放大，对手永远在追赶。", C.AMBER],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 1.9 + Math.floor(i / 2) * 2.5, 5.7, 2.3, c[0], c[1], c[2], { tfs: 18, fs: 13, accent: c[3] }));
s.addShape(p.ShapeType.ellipse, { x: 6.2, y: 3.85, w: 0.95, h: 0.95, fill: { color: C.FOREST }, shadow: sh() });
s.addText("MOAT", { x: 6.2, y: 3.85, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 11, bold: true });

// ---------- P14 财务预测 ----------
s = page("PART 04 · FINANCIALS & ROI", "ROI 7–10 倍，3–5 年营收 3–5 亿");
L.table(p, s, { x: 0.8, y: 1.9, w: 5.4, colFr: [2.2, 1.8], headers: ["500 人企业 / 年", "数值"],
  rows: [["年度投入", "63–88 万"], ["年度收益", "约 634 万"], ["ROI", "约 7–10 倍"], ["投资回收期", "约 1–1.5 个月"]],
  rowH: 0.62, fs: 12.5, starCol: 1 });
L.table(p, s, { x: 6.5, y: 1.9, w: 6.05, colFr: [2.4, 1.6], headers: ["收益构成", "万元"],
  rows: [["离职成本节约", "169"], ["缺勤损失降低", "90"], ["在岗产出提升", "375"], ["管理收益", "25–33"], ["品牌收益", "35–88"], ["ESG 收益", "85–280"]],
  rowH: 0.44, headH: 0.5, fs: 11.5, headFs: 12, starCol: 1 });
label(s, 0.8, 5.15, 5, "增长路径");
flow(s, 0.8, 5.55, 11.75, ["3–5 年覆盖 1000 家企业", "营收 3–5 亿", "净利率 20%–30%"], C.FOREST);
L.foot(p, s, "测算口径：人均 1,260–1,760 元 / 年；离职率降 30%、缺勤降 20%、专注力恢复 5%");

// ---------- P15 团队 ----------
s = page("PART 05 · TEAM", "核心团队");
[
  ["项目总监", "5 年+ EAP 项目管理", C.MOSS],
  ["疗愈师团队", "IAOTH 认证 · 国家二级心理咨询师", C.FOREST],
  ["技术负责人", "3 年+ AI / IT 运维经验", C.AMBER],
  ["正念导师", "MBSR / MBCT 认证导师", C.AMBER],
  ["艺术 / 音乐疗愈师", "表达性艺术治疗背景", C.MOSS],
  ["外部支持", "精神科医生 · 危机干预专家", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + (i % 3) * 3.98, y = 1.9 + Math.floor(i / 3) * 1.85, w = 3.8, h = 1.65;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.3, y: y + 0.35, w: 0.95, h: 0.95, fill: { color: c[2] } });
  s.addText(c[0].slice(0, 2), { x: x + 0.3, y: y + 0.35, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 15, bold: true });
  s.addText(c[0], { x: x + 1.45, y: y + 0.3, w: w - 1.65, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 16, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 1.45, y: y + 0.8, w: w - 1.65, h: 0.7, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
});
darkBand(s, 0.8, 5.75, 11.75, 1.1, "团队理念", "AI 是工具，疗愈师是核心，技术服务于人", { fs: 17 });

// ---------- P16 融资需求 ----------
s = page("PART 05 · FUNDRAISING", "融资用途");
[
  ["01", "行业拓展", "8 个 → 30+ 个行业\n建立跨行业常模数据库", C.MOSS],
  ["02", "AI 模型迭代", "优化关键词规则库和推荐引擎精度\n让数据飞轮转速越来越快", C.AMBER],
  ["03", "标杆案例规模化", "复制已验证的增长飞轮\n从 8 个行业头部客户向全行业辐射", C.FOREST],
].forEach((c, i) => numCard(s, 0.8 + i * 3.98, 1.9, 3.8, 2.75, c[0], c[1], c[2], { tfs: 18, fs: 13, accent: c[3] }));
label(s, 0.8, 4.95, 5, "退出逻辑");
[["传统咨询公司", "需要 AI 能力"], ["大健康平台", "需要企业端入口"], ["HR SaaS", "需要员工心理健康模块"]].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 5.35, w = 3.8, h = 1.5;
  L.card(p, s, x, y, w, h, i === 1 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i === 1;
  s.addText(c[0], { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.5, fontFace: HF, color: dark ? C.AMBERL : C.AMBER, fontSize: 13, bold: true });
  s.addText(c[1], { x: x + 0.3, y: y + 0.7, w: w - 0.6, h: 0.65, fontFace: HF, color: dark ? C.WHITE : C.FOREST, fontSize: 16, bold: true, valign: "top" });
});

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
