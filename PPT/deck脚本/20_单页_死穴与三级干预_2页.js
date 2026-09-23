// MindBridge · 单独两页：传统 EAP 两大死穴 / 三级干预体系（表格版）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, label, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_单页_死穴与三级干预_2页.pptx";
const RED = "B5473A";

function darkBand(s, x, y, w, h, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  if (title) s.addText(title, { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
  s.addText(body, { x: x + 0.3, y: title ? y + 0.45 : y, w: w - 0.6, h: title ? h - 0.55 : h, fontFace: HF, color: C.WHITE, fontSize: opt.fs || 15, bold: true, valign: "middle", align: opt.align || "left", lineSpacingMultiple: 1.25 });
}

// ---------- 页 1 · 传统 EAP 的两大死穴 ----------
let s = page("PART 01 · PAIN POINTS", "传统 EAP 的两大死穴");
[
  ["死穴一 · 员工端", "员工不愿用", "<5%", "参与率", "预算花了，人没来。", C.MOSS],
  ["死穴二 · 企业端", "企业看不清", "只有人次", "无法证明效果", "不知道有没有用。", C.AMBER],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 1.82, w = 5.7, h = 1.85;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.88, rectRadius: 0.12, fill: { color: c[5] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.55, w, h: 0.33, fill: { color: c[5] } });
  s.addText(c[0], { x: x + 0.3, y: y + 0.06, w: w - 0.6, h: 0.3, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.3, y: y + 0.34, w: w - 0.6, h: 0.48, fontFace: HF, color: C.WHITE, fontSize: 18, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.3, y: y + 0.98, w: 2.6, h: 0.75, fontFace: HF, color: c[5], fontSize: 30, bold: true, valign: "middle" });
  s.addText(c[3], { x: x + 3.0, y: y + 1.0, w: w - 3.3, h: 0.38, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
  s.addText(c[4], { x: x + 3.0, y: y + 1.36, w: w - 3.3, h: 0.38, fontFace: HF, color: C.MUTE, fontSize: 11.5, valign: "middle" });
});
// 恶性循环
L.card(p, s, 0.8, 3.82, 11.75, 0.72, C.FOREST, { shadow: sh() });
s.addText("恶性循环", { x: 1.05, y: 3.82, w: 1.5, h: 0.72, fontFace: HF, color: C.AMBERL, fontSize: 12.5, bold: true, valign: "middle" });
["越没人用", "越没数据", "越没人买", "回到起点"].forEach((t, i) => {
  const x = 2.75 + i * 2.5;
  s.addShape(p.ShapeType.roundRect, { x, y: 3.97, w: 2.1, h: 0.42, rectRadius: 0.21, fill: { color: i === 3 ? C.FOREST2 : C.FOREST3 } });
  s.addText(t, { x, y: 3.97, w: 2.1, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: i === 3 ? C.MOSSL : C.WHITE, fontSize: 12.5, bold: true });
  if (i < 3) s.addText(i === 2 ? "↺" : "→", { x: x + 2.1, y: 3.97, w: 0.4, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 13, bold: true });
});
// 员工端 / 管理端
[
  ["员工端", C.MOSS, [["承认「我有问题」本身就是负担", ""], ["注册预约太麻烦", ""], ["用了也看不到反馈", ""]]],
  ["管理端", C.AMBER, [["年底只有「咨询人次」", ""], ["证明不了有没有用", ""], ["员工崩溃或离职才知道出事了", ""]]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 4.72, w = 5.7, h = 1.62;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.18, w: 0.1, h: h - 0.36, fill: { color: c[1] } });
  s.addText(c[0], { x: x + 0.32, y: y + 0.1, w: 2, h: 0.38, fontFace: HF, color: C.FOREST, fontSize: 14.5, bold: true, valign: "middle" });
  c[2].forEach((t, j) => {
    const ty = y + 0.55 + j * 0.36;
    dot(s, x + 0.35, ty + 0.1, c[1], 0.12);
    s.addText(t[0], { x: x + 0.62, y: ty, w: w - 0.9, h: 0.34, fontFace: HF, color: C.INK, fontSize: 12, valign: "middle" });
  });
});
// 数据条
[["54.9%", "职场人受焦虑烦躁困扰", C.MOSS], ["49.7%", "有情绪低落问题", C.AMBER], ["89%", "企业已将心理健康纳入战略", C.FOREST], ["<5%", "但传统 EAP 参与率仍然", RED]].forEach((c, i) => {
  const x = 0.8 + i * 2.98, y = 6.52, w = 2.8, h = 0.82;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.2, y: y + 0.04, w: w - 0.4, h: 0.44, fontFace: HF, color: c[2], fontSize: 21, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.2, y: y + 0.48, w: w - 0.4, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 10, valign: "middle" });
});

// ---------- 页 2 · 三级干预体系（表格版） ----------
s = page("PART 02 · INTERVENTION", "三级干预体系：谁来回，怎么回");
L.table(p, s, {
  x: 0.8, y: 1.85, w: 11.75, colFr: [1.5, 2.6, 3.6, 3.1],
  headers: ["干预层级", "干预对象与触发条件", "干预方式与实施主体", "数据流向与隐私控制"],
  rows: [
    ["一级\n全员预防", "全体员工 / 日常状态", "AI 树洞 24h 倾诉、自助工具包、心理嘉年华\n（AI 系统 + 企业 HR）", "仅产出匿名聚合趋势，不涉及个人标识"],
    ["二级\n专业支持", "主动求助，或 AI 识别黄色风险员工", "疗愈师一对一疏导、行业定制团体工作坊\n（持证疗愈师团队）", "个人服务数据留在专业系统，绝不进入 HR 后台"],
    ["三级\n危机处理", "AI 识别红色风险 + 疗愈师研判确认", "专业心理咨询转介、危机干预流程\n（疗愈师 + 精神科顾问）", "按正式危机协议执行，必要时启动紧急联系人机制"],
  ],
  rowH: 1.0, headH: 0.6, fs: 12, headFs: 12, boldCol0: true,
});
label(s, 0.8, 5.6, 8, "AI 分级可靠性");
[
  ["多轮上下文风险评估", "非简单关键词匹配，结合意图、程度与变化趋势判级", C.MOSS],
  ["高风险信号人工复核", "红色信号由疗愈师研判确认后才进入危机流程", RED],
  ["黄色风险保留自助通道", "不强制介入，员工可继续自助疗愈", C.AMBER],
  ["月度 PSI 简评补充筛查", "重复场景测试 + 误判迭代，持续验证漏报误报", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + (i % 2) * 6.05, y = 5.95 + Math.floor(i / 2) * 0.7, w = 5.7, h = 0.62;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  circleNum(s, x + 0.18, y + 0.11, String(i + 1), c[2], 0.4, 11);
  s.addText(c[0], { x: x + 0.7, y: y + 0.0, w: w - 0.85, h: 0.32, fontFace: HF, color: C.FOREST, fontSize: 12.5, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.7, y: y + 0.31, w: w - 0.85, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 10.5, valign: "middle" });
});

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
