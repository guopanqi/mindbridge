// MindBridge 商业答辩方案 · 20 页脚本版 · 温暖疗愈风格（lib.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, imgCard, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_商业答辩方案_20页.pptx";
const IMG = __dirname + "/../素材/";
const RED = "B5473A";
let s;

// dashed placeholder box for user-provided media
function placeholder(s, x, y, w, h, title, hint) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: C.MOSST }, line: { color: C.MOSS, width: 1.5, dashType: "dash" } });
  s.addText(title, { x: x + 0.3, y: y + h / 2 - 0.55, w: w - 0.6, h: 0.5, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });
  s.addText(hint, { x: x + 0.3, y: y + h / 2, w: w - 0.6, h: 0.6, align: "center", valign: "top", fontFace: HF, color: C.MUTE, fontSize: 10.5, lineSpacingMultiple: 1.15 });
}
function bandCard(s, x, y, w, h, eyebrow, title, body, color, opt = {}) {
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color } });
  s.addText(eyebrow, { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: 0.32, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(title, { x: x + 0.3, y: y + 0.38, w: w - 0.6, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: opt.tfs || 18, bold: true, valign: "middle" });
  s.addText(body, { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: opt.bh || (h - 1.3), fontFace: HF, color: C.INK, fontSize: opt.fs || 12, valign: "top", lineSpacingMultiple: 1.25 });
}
function sectionBar(s, x, y, w, txt, color) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.42, rectRadius: 0.21, fill: { color } });
  s.addText(txt, { x, y, w, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
}
function bullets(s, x, y, w, items, opt = {}) {
  const gap = opt.gap || 0.55;
  items.forEach((t, i) => {
    dot(s, x, y + i * gap + 0.12, opt.color || C.AMBER, 0.13);
    s.addText(t, { x: x + 0.3, y: y + i * gap, w: w - 0.3, h: gap, fontFace: HF, color: opt.textColor || C.INK, fontSize: opt.fs || 12, valign: "top", lineSpacingMultiple: 1.15 });
  });
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
s.addText("AI 负责广度 · 疗愈轨道负责深度 —— 重塑企业 EAP 服务范式", { x: 1.0, y: 4.6, w: 11, h: 0.6, fontFace: HF, color: C.CREAMTXT, fontSize: 20 });
L.card(p, s, 1.0, 5.55, 7.6, 0.9, C.WHITE);
s.addText("AI 预警与推荐 + 疗愈师深度陪伴 —— 让疗愈服务在关键时刻可及", { x: 1.2, y: 5.55, w: 7.2, h: 0.9, fontFace: HF, color: C.FOREST, fontSize: 14, valign: "middle" });
s.addText("2026 企业疗愈力与 EAP 创新挑战赛 · 决赛路演", { x: 1.0, y: 6.7, w: 9, h: 0.4, fontFace: HF, color: C.MOSSL, fontSize: 12.5 });

// ---------- P2 目录 ----------
s = page("CONTENTS", "目录");
[
  ["01", "市场痛点", "传统 EAP 的困局与职场心理危机", C.MOSS],
  ["02", "解决方案", "MindBridge「AI + 疗愈」双轨共生模型", C.FOREST],
  ["03", "核心创新", "隐私预警、行业定制与量化评估", C.AMBER],
  ["04", "商业价值", "商业模式、ROI 分析与竞争壁垒", C.MOSS],
  ["05", "实施愿景", "落地路径、团队保障与社会价值", C.FOREST],
].forEach((c, i) => {
  const y = 1.9 + i * 1.0;
  L.card(p, s, 0.8, y, 11.75, 0.85, i === 2 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i === 2;
  s.addText(c[0], { x: 1.1, y, w: 1.2, h: 0.85, fontFace: HF, color: dark ? C.AMBERL : C.AMBER, fontSize: 26, bold: true, valign: "middle" });
  s.addText(c[1], { x: 2.4, y, w: 2.6, h: 0.85, fontFace: HF, color: dark ? C.WHITE : C.FOREST, fontSize: 18, bold: true, valign: "middle" });
  s.addText(c[2], { x: 5.2, y, w: 7.0, h: 0.85, fontFace: HF, color: dark ? C.CREAMTXT : C.MUTE, fontSize: 13, valign: "middle" });
});

// ---------- P3 宏观背景 ----------
s = page("PART 01 · MARKET PAIN POINTS", "市场痛点：被忽视的「隐形成本」");
[
  ["54.9%", "受焦虑困扰的职场人比例", C.MOSS],
  ["<5%", "传统 EAP 的员工参与率", C.AMBER],
  ["ROI 模糊", "企业只见「人次」，不见「效果」", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 2.55, y = 1.9, w = 2.4, h = 1.6;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.75, fontFace: HF, color: c[2], fontSize: 26, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.2, y: y + 0.92, w: w - 0.4, h: 0.6, fontFace: HF, color: C.MUTE, fontSize: 10.5, valign: "top", lineSpacingMultiple: 1.15 });
});
dotCard(s, 0.8, 3.75, 3.6, 1.45, "危机常态化", "八大高内耗行业（IT、金融、医护等）抑郁与倦怠检出率居高不下。", { tfs: 14, fs: 11, accent: C.MOSS });
dotCard(s, 4.6, 3.75, 3.6, 1.45, "管理挑战", "心理健康问题已直接威胁员工效能与组织稳定性。", { tfs: 14, fs: 11, accent: C.AMBER });
L.card(p, s, 0.8, 5.4, 7.4, 1.4, C.FOREST, { shadow: sh() });
s.addText("心理耗竭不是「个别人的事」，而是一笔每天都在发生、却从未被计入报表的组织成本。", { x: 1.1, y: 5.4, w: 6.8, h: 1.4, fontFace: HF, color: C.WHITE, fontSize: 14, bold: true, valign: "middle", lineSpacingMultiple: 1.25 });
placeholder(s, 8.5, 1.9, 4.05, 4.9, "[ 此处可插入图表 ]", "各行业压力热力图\n或焦虑人群比例柱状图");

// ---------- P4 三大死穴 ----------
s = page("PART 01 · MARKET PAIN POINTS", "为什么传统 EAP 沦为「摆设」？");
lead(s, "员工不敢用、方案不对症、效果看不见——三个死穴叠加，让绝大多数企业的 EAP 预算变成了「橱窗工程」。", 1.7, 0.5);
[
  ["死穴一 · BARRIER", "使用壁垒高", ["员工需主动承认「我有病」，隐私顾虑重，病耻感强。"], "结果：不愿用、不敢用", C.MOSS],
  ["死穴二 · GENERIC", "方案一刀切", ["通用方案无法匹配行业差异（如程序员与护士的痛点完全不同）。"], "结果：服务流于形式，缺乏针对性", C.AMBER],
  ["死穴三 · BLACK HOLE", "效果黑洞", ["缺乏数据闭环，无法证明业务价值。"], "结果：企业预算浪费，采购决策难", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.4, w = 3.8, h = 3.6;
  bandCard(s, x, y, w, h, c[0], c[1], c[2][0], c[4], { tfs: 20, fs: 13.5, bh: 1.3 });
  L.card(p, s, x + 0.3, y + h - 1.1, w - 0.6, 0.8, C.MOSST);
  s.addText(c[3], { x: x + 0.45, y: y + h - 1.1, w: w - 0.9, h: 0.8, fontFace: HF, color: C.FOREST, fontSize: 12, bold: true, valign: "middle" });
});

// ---------- P5 供需错位 ----------
s = page("PART 01 · MARKET PAIN POINTS", "供需错位：企业想要 ROI，员工想要安全感");
[
  ["企业端需求", C.FOREST, ["需要量化数据", "需要降低离职率", "需要提升人效", "需要 ESG 合规"]],
  ["员工端需求", C.AMBER, ["需要绝对匿名", "需要即时响应", "需要无病耻感", "需要实际解决情绪问题"]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 1.9, w = 5.7, h = 3.75;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.8, rectRadius: 0.12, fill: { color: c[1] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.45, w, h: 0.35, fill: { color: c[1] } });
  s.addText(c[0], { x: x + 0.35, y, w: w - 0.7, h: 0.8, fontFace: HF, color: C.WHITE, fontSize: 19, bold: true, valign: "middle" });
  c[2].forEach((t, j) => {
    const cy = y + 1.05 + j * 0.65;
    circleNum(s, x + 0.35, cy + 0.08, String(j + 1), c[1], 0.36, 11);
    s.addText(t, { x: x + 0.85, y: cy, w: w - 1.2, h: 0.52, fontFace: HF, color: C.INK, fontSize: 14, bold: true, valign: "middle" });
  });
});
s.addShape(p.ShapeType.ellipse, { x: 6.2, y: 3.35, w: 0.95, h: 0.95, fill: { color: C.AMBER }, shadow: sh() });
s.addText("VS", { x: 6.2, y: 3.35, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 16, bold: true });
L.card(p, s, 0.8, 5.9, 11.75, 0.95, C.FOREST, { shadow: sh() });
s.addText("结论：市场亟需一种既能保护隐私、又能提供量化价值的颠覆性解决方案。", { x: 1.1, y: 5.9, w: 11.15, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 16, bold: true });

// ---------- P6 双轨模型 ----------
s = page("PART 02 · SOLUTION", "MindBridge 解决方案：AI + 疗愈双轨模型");
lead(s, "AI 负责广度（7×24 小时感知），疗愈师负责深度（深度陪伴转化）。", 1.7, 0.45);
[
  ["AI 轨道 · 广度", "倾听者与匹配师", ["匿名情绪感知", "智能预警", "资源匹配"], C.MOSS],
  ["疗愈轨道 · 深度", "转化师与陪伴者", ["一对一疏导", "团体工作坊", "成长陪伴"], C.FOREST],
].forEach((t, i) => {
  const x = 0.8 + i * 4.0, y = 2.3, w = 3.8, h = 4.45;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color: t[3] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color: t[3] } });
  s.addText(t[0], { x: x + 0.3, y: y + 0.05, w: w - 0.6, h: 0.55, fontFace: HF, color: C.WHITE, fontSize: 19, bold: true, valign: "middle" });
  s.addText(t[1], { x: x + 0.3, y: y + 0.55, w: w - 0.6, h: 0.35, fontFace: HF, color: C.CREAMTXT, fontSize: 11.5 });
  t[2].forEach((st, j) => {
    const sy = y + 1.25 + j * 1.05;
    s.addShape(p.ShapeType.roundRect, { x: x + 0.3, y: sy, w: w - 0.6, h: 0.75, rectRadius: 0.1, fill: { color: C.MOSST } });
    circleNum(s, x + 0.45, sy + 0.17, String(j + 1), t[3], 0.4, 11);
    s.addText(st, { x: x + 1.0, y: sy, w: w - 1.4, h: 0.75, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
    if (j < 2) s.addText("↓", { x: x + w / 2 - 0.2, y: sy + 0.72, w: 0.4, h: 0.35, align: "center", fontFace: HF, color: t[3], fontSize: 14, bold: true });
  });
});
s.addShape(p.ShapeType.ellipse, { x: 4.2, y: 4.1, w: 0.8, h: 0.8, fill: { color: C.AMBER }, shadow: sh() });
s.addText("复核", { x: 4.2, y: 4.1, w: 0.8, h: 0.8, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
placeholder(s, 8.85, 2.3, 3.7, 4.45, "[ 此处可插入示意图 ]", "双螺旋结构图：\nAI 与人工如何交织互补");

// ---------- P7 运作闭环 ----------
s = page("PART 02 · SOLUTION", "重塑范式：从「被动等待」到「主动支持」");
lead(s, "识别、预警、介入、反馈四个环节首尾相接，AI 与疗愈师在同一条数据链上协作，每一次干预都能被验证、被优化。", 1.7, 0.6);
[
  ["01", "识别", "AI 实时捕捉情绪信号", C.MOSS],
  ["02", "预警", "发现风险自动吹哨", C.AMBER],
  ["03", "介入", "疗愈师精准介入转化", C.FOREST],
  ["04", "反馈", "干预结果反哺 AI 优化逻辑", C.MOSS],
].forEach((c, i) => {
  const x = 0.8 + i * 2.98, y = 2.5, w = 2.65, h = 2.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  circleNum(s, x + 0.3, y + 0.3, c[0], c[3], 0.6, 15);
  s.addText(c[1], { x: x + 1.05, y: y + 0.3, w: w - 1.3, h: 0.6, fontFace: HF, color: C.FOREST, fontSize: 22, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: 1.2, fontFace: HF, color: C.INK, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.2 });
  if (i < 3) s.addText("→", { x: x + w - 0.02, y: y + 0.9, w: 0.3, h: 0.7, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 20, bold: true });
});
s.addText("↺ 反馈回流至识别，形成闭环", { x: 0.8, y: 5.1, w: 11.75, h: 0.35, align: "center", fontFace: HF, color: C.MUTE, fontSize: 11.5, italic: true });
L.card(p, s, 0.8, 5.65, 11.75, 1.15, C.FOREST, { shadow: sh() });
s.addText("关键原则", { x: 1.1, y: 5.75, w: 3, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
s.addText("AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由人完成。", { x: 1.1, y: 6.1, w: 11.15, h: 0.6, fontFace: HF, color: C.WHITE, fontSize: 18, bold: true });

// ---------- P8 视频演示页 ----------
s = page("PART 02 · LIVE DEMO", "系统演示：企业情绪气象站");
// video placeholder 16:9
const vx = 0.8, vy = 1.85, vw = 7.9, vh = vw * 9 / 16;
s.addShape(p.ShapeType.roundRect, { x: vx, y: vy, w: vw, h: vh, rectRadius: 0.12, fill: { color: C.FOREST2 }, line: { color: C.AMBER, width: 2, dashType: "dash" } });
s.addShape(p.ShapeType.ellipse, { x: vx + vw / 2 - 0.5, y: vy + vh / 2 - 0.85, w: 1.0, h: 1.0, fill: { color: C.AMBER } });
s.addText("▶", { x: vx + vw / 2 - 0.5, y: vy + vh / 2 - 0.85, w: 1.0, h: 1.0, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 22, bold: true });
s.addText("[ 此处插入红黄绿灯动态演示视频 ]", { x: vx + 0.4, y: vy + vh / 2 + 0.3, w: vw - 0.8, h: 0.45, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
s.addText("展示后台实时跳动数据：绿灯代表平稳，黄灯代表某部门压力飙升，红灯代表触发危机干预", { x: vx + 0.4, y: vy + vh / 2 + 0.75, w: vw - 0.8, h: 0.6, align: "center", valign: "top", fontFace: HF, color: C.MOSSL, fontSize: 11, lineSpacingMultiple: 1.15 });
// traffic light legend
[["绿灯", "情绪稳定，团队状态良好", C.MOSS], ["黄灯", "压力预警，特定部门或项目组出现焦虑苗头", C.AMBER], ["红灯", "危机干预，检测到高风险个案并自动触发疗愈师介入", RED]].forEach((c, i) => {
  const x = vx + i * 2.7, y = vy + vh + 0.25, w = 2.5;
  L.card(p, s, x, y, w, 0.95, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.2, y: y + 0.2, w: 0.3, h: 0.3, fill: { color: c[2] } });
  s.addText(c[0], { x: x + 0.6, y: y + 0.12, w: w - 0.7, h: 0.4, fontFace: HF, color: C.FOREST, fontSize: 13, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: 0.45, fontFace: HF, color: C.INK, fontSize: 9.5, valign: "top", lineSpacingMultiple: 1.1 });
});
// right text
dotCard(s, 9.0, 1.85, 3.55, 2.15, "实时感知", "7×24 小时匿名监测组织情绪温度。", { tfs: 15, fs: 12.5, accent: C.MOSS });
dotCard(s, 9.0, 4.2, 3.55, 2.6, "分级预警", "绿 / 黄 / 红三级响应机制，让管理从「猜人心」变为「看数据」。", { tfs: 15, fs: 12.5, accent: C.AMBER });

// ---------- P9 创新一 隐私预警 ----------
s = page("PART 03 · CORE INNOVATION 01", "核心创新 01：双链路隐私预警机制");
lead(s, "核心痛点解决：彻底打消员工「被监控」的顾虑。", 1.7, 0.45);
[
  ["个人链路 · 保护隐私", "PERSONAL", ["去标识化匿名 ID", "风险仅向员工本人及疗愈师开放", "绝不向 HR 暴露个人标签"], C.AMBER],
  ["组织链路 · 赋能管理", "ORGANIZATION", ["聚合计算去标识化数据", "向 HR 输出「部门压力趋势」", "输出趋势，而非个人名单"], C.FOREST],
].forEach((c, i) => {
  const x = 0.8, y = 2.3 + i * 2.3, w = 7.7, h = 2.1;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 2.4, h, rectRadius: 0.12, fill: { color: c[3] } });
  s.addShape(p.ShapeType.rect, { x: x + 2.0, y, w: 0.4, h, fill: { color: c[3] } });
  s.addText(c[1], { x: x + 0.25, y: y + 0.3, w: 2.0, h: 0.3, fontFace: HF, color: C.CREAMTXT, fontSize: 10, charSpacing: 2 });
  s.addText(c[0], { x: x + 0.25, y: y + 0.65, w: 2.0, h: 1.2, fontFace: HF, color: C.WHITE, fontSize: 17, bold: true, valign: "top", lineSpacingMultiple: 1.2 });
  bullets(s, x + 2.75, y + 0.3, w - 3.0, c[2], { color: c[3], fs: 13, gap: 0.55 });
});
placeholder(s, 8.8, 2.3, 3.75, 4.4, "[ 此处可插入示意图 ]", "双通道隔离示意：\n一边是锁住的个人信息\n一边是流动的趋势数据");

// ---------- P10 员工端体验 ----------
s = page("PART 03 · EMPLOYEE EXPERIENCE", "员工体验：像说话一样自然的倾诉");
[
  ["入口便捷", "企业 IM 一键进入，无需下载 App。", C.MOSS],
  ["交互自然", "AI 树洞对话，引导式呼吸练习，即时情绪安抚。", C.AMBER],
].forEach((c, i) => dotCard(s, 0.8, 1.9 + i * 1.4, 5.3, 1.25, c[0], c[1], { tfs: 15, fs: 12, accent: c[2] }));
L.card(p, s, 0.8, 4.75, 5.3, 1.05, C.MOSST);
s.addText("案例", { x: 1.05, y: 4.85, w: 2, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true });
s.addText("「最近一直心里烦……」→「试试三分钟呼吸着陆法」→「好多了，谢谢你。」", { x: 1.05, y: 5.15, w: 4.85, h: 0.6, fontFace: HF, color: C.INK, fontSize: 11.5, italic: true, valign: "top", lineSpacingMultiple: 1.15 });
L.card(p, s, 0.8, 6.0, 5.3, 0.8, C.FOREST, { shadow: sh() });
s.addText("价值：打破求助羞耻感，让心理支持触手可及。", { x: 1.05, y: 6.0, w: 4.85, h: 0.8, fontFace: HF, color: C.WHITE, fontSize: 13.5, bold: true, valign: "middle" });
imgCard(s, "chat.jpg", 6.5, 1.85, 2.9, 4.95, { caption: "树洞对话与活动推送" });
imgCard(s, "breath.jpg", 9.65, 1.85, 2.9, 4.95, { caption: "三分钟呼吸着陆法" });

// ---------- P11 创新二 行业对标 ----------
s = page("PART 03 · CORE INNOVATION 02", "核心创新 02：拒绝「一刀切」，一行业一方案");
flow(s, 0.8, 1.85, 11.75, ["HR 数据 + AI 试运行", "定位痛点", "匹配模块", "一行业一方案"], C.FOREST);
[
  ["SECTOR 01", "互联网 / 科技", "针对「35 岁恐慌 / 碎片化」", "正念减压 + 叙事疗愈", C.MOSS],
  ["SECTOR 02", "金融 / 客服", "针对「情绪劳动 / 业绩高压」", "积极心理学 + 艺术疗愈", C.AMBER],
  ["SECTOR 03", "医护 / 制造", "针对「共情疲劳 / 产线孤独」", "巴林特小组 + 音乐沙盘", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.7, w = 3.8, h = 4.1;
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

// ---------- P12 创新三 量化评估 ----------
s = page("PART 03 · CORE INNOVATION 03", "核心创新 03：四级量化评估与效果对赌");
lead(s, "从使用率到组织影响，L0–L4 五个层级全部有目标值、有采集方式；L0–L3 由 AI 自动采集，不增加 HR 负担。", 1.7, 0.6);
L.table(p, s, { x: 0.8, y: 2.5, w: 11.75, colFr: [1.6, 3.0, 3.0, 4.15], headers: ["层级", "评估内容", "目标值", "采集方式"],
  rows: [
    ["L0 使用率", "系统活跃度与覆盖面", "≥30%", "系统后台自动采集"],
    ["L1 情绪反馈", "活动即时情绪改善", "改善 ≥2 分", "活动后情绪温度计"],
    ["L2 行为转化", "短期行为跟进", "转化率 ≥60%", "AI 自动随访"],
    ["L3 心理状态", "心理安全感（PSI）", "PSI 指数提升", "量表追踪"],
    ["L4 组织影响", "长期组织指标", "离职率降低 ≥30%", "关联 HR 匿名数据"],
  ], rowH: 0.66, fs: 12.5, starCol: 2 });
L.foot(p, s, "全链路量化追踪：L0–L3 由 AI 自动归集，L4 结合 HR 匿名数据做关联分析");

// ---------- P13 效果对赌 ----------
s = page("PART 03 · TRUST MECHANISM", "信任重构：首创「效果对赌」机制");
lead(s, "把「效果」写进合同：用真金白银的承诺，替企业承担采购心理风险。", 1.7, 0.45);
[
  ["30%", "尾款挂钩", "30% 尾款与第三方独立评估的 PSI 提升值挂钩，数据实时透明可查。", C.AMBER],
  ["0 风险", "未达标退款", "若指标未达标，按比例退款或免费延长服务期至达标为止。", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 2.3, w = 5.7, h = 3.0;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.35, y: y + 0.25, w: w - 0.7, h: 0.9, fontFace: HF, color: c[3], fontSize: 40, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.35, y: y + 1.2, w: w - 0.7, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
  s.addText(c[2], { x: x + 0.35, y: y + 1.75, w: w - 0.7, h: 1.1, fontFace: HF, color: C.INK, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.25 });
});
L.card(p, s, 0.8, 5.55, 11.75, 1.25, C.FOREST, { shadow: sh() });
s.addText("价值", { x: 1.1, y: 5.65, w: 3, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
s.addText("将企业采购的信任成本归零，让 ROI 清晰可见。", { x: 1.1, y: 6.0, w: 11.15, h: 0.7, fontFace: HF, color: C.WHITE, fontSize: 20, bold: true });

// ---------- P14 商业模式 ----------
s = page("PART 04 · BUSINESS MODEL", "商业模式：模块化切入与增长飞轮");
label(s, 0.8, 1.85, 5, "定价策略");
[["基础版", "15–25 万", "中小企业", C.MOSS], ["旗舰版", "80–120 万", "万人集团", C.FOREST]].forEach((c, i) => {
  const x = 0.8 + i * 2.9, y = 2.25, w = 2.75, h = 1.9;
  L.card(p, s, x, y, w, h, c[3], { shadow: sh() });
  s.addText(c[0], { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.4, fontFace: HF, color: C.CREAMTXT, fontSize: 12.5, bold: true });
  s.addText(c[1], { x: x + 0.25, y: y + 0.55, w: w - 0.5, h: 0.7, fontFace: HF, color: C.AMBERL, fontSize: 24, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.25, y: y + 1.3, w: w - 0.5, h: 0.4, fontFace: HF, color: C.WHITE, fontSize: 12 });
});
label(s, 0.8, 4.45, 5, "切入路径");
flow(s, 0.8, 4.85, 5.65, ["项目制试用", "年度服务", "战略合作"], C.FOREST);
label(s, 6.85, 1.85, 5, "飞轮效应");
L.card(p, s, 6.85, 2.25, 5.7, 3.1, C.CARD, { shadow: sh() });
["数据积累越多", "适配越快", "切换成本越高", "续约率 ≥70%"].forEach((t, i) => {
  const y = 2.45 + i * 0.7;
  circleNum(s, 7.15, y + 0.1, String(i + 1), [C.MOSS, C.AMBER, C.FOREST, C.AMBER][i], 0.4, 11);
  s.addText(t, { x: 7.7, y, w: 4.6, h: 0.6, fontFace: HF, color: C.INK, fontSize: 15, bold: true, valign: "middle" });
  if (i < 3) s.addText("↓", { x: 7.15, y: y + 0.42, w: 0.4, h: 0.3, align: "center", fontFace: HF, color: C.MUTE, fontSize: 11 });
});
L.card(p, s, 0.8, 5.65, 11.75, 1.15, C.FOREST, { shadow: sh() });
s.addText("以 15 万基础版降低试错门槛，通过「项目制 → 年度 → 战略」路径锁定客户；数据飞轮带来高切换成本与 ≥70% 续约率。", { x: 1.1, y: 5.65, w: 11.15, h: 1.15, fontFace: HF, color: C.WHITE, fontSize: 14, bold: true, valign: "middle", lineSpacingMultiple: 1.25 });

// ---------- P15 ROI ----------
s = page("PART 04 · ROI ANALYSIS", "投资回报分析：500 人企业年度测算");
L.table(p, s, { x: 0.8, y: 1.9, w: 7.6, colFr: [1.4, 2.1, 1.6, 2.5], headers: ["类别", "项目", "金额 (万元)", "测算依据"],
  rows: [
    ["投入成本", "年度总投入", "63 – 88", "人均 1,260–1,760 元 / 年"],
    ["显性收益", "离职成本节约", "169", "离职率降 30%"],
    ["显性收益", "缺勤损失降低", "90", "缺勤降 20%"],
    ["隐性收益", "在岗产出提升", "375", "专注力恢复 5%"],
    ["结论", "年度净收益", "≈ 546", "有形收益 634 − 投入"],
  ], rowH: 0.66, fs: 12, starCol: 2 });
stat(s, 8.7, 1.9, 3.85, 1.45, "7–10 倍", "综合 ROI");
stat(s, 8.7, 3.5, 3.85, 1.45, "1–1.5 月", "投资回收期");
stat(s, 8.7, 5.1, 3.85, 1.45, "546 万", "年度净收益", { dark: false });
L.foot(p, s, "结论：净收益 546 万，综合 ROI 高达 7–10 倍，回收期仅 1–1.5 个月");

// ---------- P16 竞争壁垒 ----------
s = page("PART 04 · COMPETITIVE MOAT", "竞争壁垒：四维护城河");
[
  ["01", "系统协同", "唯一打通「AI－人工－反馈」全链路。", C.MOSS],
  ["02", "信任壁垒", "效果对赌机制筛选掉低质竞品。", C.AMBER],
  ["03", "行业适配", "标准化流程，2–4 周快速输出方案。", C.FOREST],
  ["04", "数据飞轮", "八大行业情绪常模，对手需 6 个月积累。", C.AMBER],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 1.9 + Math.floor(i / 2) * 2.5, 5.7, 2.3, c[0], c[1], c[2], { tfs: 18, fs: 13.5, accent: c[3] }));
s.addShape(p.ShapeType.ellipse, { x: 6.2, y: 3.85, w: 0.95, h: 0.95, fill: { color: C.FOREST }, shadow: sh() });
s.addText("MOAT", { x: 6.2, y: 3.85, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 11, bold: true });

// ---------- P17 ESG ----------
s = page("PART 05 · SOCIAL IMPACT", "社会价值：赋能企业 ESG 战略");
label(s, 0.8, 1.85, 5, "对标联合国 SDGs");
[["SDG 3", "良好健康与福祉", C.MOSS], ["SDG 8", "体面工作与经济增长", C.FOREST]].forEach((g, i) => {
  const y = 2.3 + i * 1.5;
  L.card(p, s, 0.8, y, 5.7, 1.3, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x: 1.05, y: y + 0.25, w: 1.4, h: 0.8, rectRadius: 0.1, fill: { color: g[2] } });
  s.addText(g[0], { x: 1.05, y: y + 0.25, w: 1.4, h: 0.8, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 16, bold: true });
  s.addText(g[1], { x: 2.7, y: y + 0.25, w: 3.6, h: 0.8, fontFace: HF, color: C.FOREST, fontSize: 16, bold: true, valign: "middle" });
});
label(s, 6.85, 1.85, 5, "ESG 赋能");
dotCard(s, 6.85, 2.3, 5.7, 1.3, "填补 GRI 403 数据空白", "系统自动输出的心理安全指标，直接满足职业健康与安全披露要求。", { tfs: 14, fs: 11.5, accent: C.AMBER });
dotCard(s, 6.85, 3.8, 5.7, 1.3, "降低融资成本 15–25 个基点", "助力 ESG 评级提升，将心理关爱转化为财务优势。", { tfs: 14, fs: 11.5, accent: C.FOREST });
L.card(p, s, 0.8, 5.5, 11.75, 1.3, C.FOREST, { shadow: sh() });
s.addText("「填补社会责任维度的数据空白，助力企业提升评级、优化融资条件。」", { x: 1.1, y: 5.5, w: 11.15, h: 1.3, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 16, bold: true });

// ---------- P18 实施路径 ----------
s = page("PART 05 · IMPLEMENTATION ROADMAP", "实施路径：12 个月双轨落地");
flow(s, 0.8, 1.9, 11.75, ["预备期 · 1–2 周", "融入期 · 1–3 月", "成长期 · 4–6 月", "嵌入期 · 6 月后"], C.FOREST);
[
  ["系统部署，基线采集", C.MOSS],
  ["常态化运行，预警验证", C.AMBER],
  ["深度小组，疗愈大使培养", C.FOREST],
  ["内部能力转化，数据资产沉淀", C.MOSS],
].forEach((c, i) => {
  const x = 0.8 + i * 3.05, y = 2.6, w = 2.6, h = 1.7;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.25, y + 0.3, c[1]);
  s.addText(c[0], { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 1.0, fontFace: HF, color: C.INK, fontSize: 13, bold: true, valign: "top", lineSpacingMultiple: 1.25 });
});
label(s, 0.8, 4.6, 5, "风险兜底");
[["AI 误判", "人工复核 + 一键申诉通道", C.MOSS], ["伦理风险", "《疗愈边界工作指引》", C.AMBER], ["数据安全", "私有云部署 + 等保三级", C.FOREST]].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 5.0, w = 3.8, h = 1.8;
  L.card(p, s, x, y, w, h, i === 1 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i === 1;
  s.addText(c[0], { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.45, fontFace: HF, color: dark ? C.AMBERL : C.AMBER, fontSize: 12.5, bold: true });
  s.addText(c[1], { x: x + 0.3, y: y + 0.7, w: w - 0.6, h: 0.9, fontFace: HF, color: dark ? C.WHITE : C.FOREST, fontSize: 15, bold: true, valign: "top", lineSpacingMultiple: 1.2 });
});

// ---------- P19 团队 ----------
s = page("PART 05 · TEAM", "团队保障：复合型专业阵容");
lead(s, "疗愈专业 × 医学兜底 × AI 技术，三类能力在一支团队里闭环。", 1.7, 0.45);
[
  ["核心成员", "5 年以上 EAP 管理经验，IAOTH 认证。", C.MOSS],
  ["专业资质", "国家二级心理咨询师，精神科医生顾问。", C.AMBER],
  ["技术支持", "AI 算法专家，数据安全防护专家。", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.4, w = 3.8, h = 4.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.ellipse, { x: x + w / 2 - 0.55, y: y + 0.4, w: 1.1, h: 1.1, fill: { color: c[2] } });
  s.addText(c[0].slice(0, 2), { x: x + w / 2 - 0.55, y: y + 0.4, w: 1.1, h: 1.1, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 18, bold: true });
  s.addText(c[0], { x: x + 0.3, y: y + 1.7, w: w - 0.6, h: 0.5, align: "center", fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
  s.addText(c[1], { x: x + 0.4, y: y + 2.3, w: w - 0.8, h: 1.2, align: "center", fontFace: HF, color: C.INK, fontSize: 13, valign: "top", lineSpacingMultiple: 1.3 });
  s.addText("[ 可插入成员照片 ]", { x: x + 0.3, y: y + h - 0.6, w: w - 0.6, h: 0.35, align: "center", fontFace: HF, color: C.MUTE, fontSize: 9.5, italic: true });
});

// ---------- P20 结语 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: -1.5, y: -1.6, w: 5, h: 5, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 4.8, w: 4.2, h: 4.2, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 1.4, w: 1.0, h: 1.0 });
s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变", { x: 1.0, y: 2.7, w: 9.2, h: 1.3, fontFace: HF, color: C.WHITE, fontSize: 32, bold: true, valign: "middle" });
s.addText("用科技拓展广度，用专业深挖深度", { x: 1.0, y: 4.05, w: 9, h: 0.6, fontFace: HF, color: C.MOSSL, fontSize: 22 });
s.addText("MindBridge AI + 疗愈轨道 · 感谢聆听与指导", { x: 1.0, y: 6.3, w: 8, h: 0.5, fontFace: HF, color: C.CREAMTXT, fontSize: 14 });
s.addShape(p.ShapeType.roundRect, { x: 10.3, y: 4.5, w: 2.2, h: 2.2, rectRadius: 0.12, fill: { color: C.FOREST3 }, line: { color: C.MOSSL, width: 1.5, dashType: "dash" } });
s.addText("[ 二维码 / 联系方式 ]", { x: 10.3, y: 4.5, w: 2.2, h: 2.2, align: "center", valign: "middle", fontFace: HF, color: C.MOSSL, fontSize: 11 });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
