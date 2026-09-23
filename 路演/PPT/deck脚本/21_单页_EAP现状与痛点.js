// MindBridge · 单页：传统 EAP 现状与员工 / 管理痛点（左右双栏嵌套卡）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, dot, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_单页_EAP现状与痛点.pptx";
const RED = "B5473A";

const s = page("PART 01 · STATUS & PAIN POINTS", "传统 EAP 现状与员工 / 管理痛点");

// 两个大栏容器
[["传统 EAP 的两大死穴", 0.8, C.FOREST], ["员工端与管理端痛点", 6.85, C.FOREST]].forEach(c => {
  L.card(p, s, c[1], 1.82, 5.7, 3.62, C.MOSST);
  s.addText(c[0], { x: c[1] + 0.3, y: 1.9, w: 5.1, h: 0.42, fontFace: HF, color: c[2], fontSize: 14.5, bold: true, valign: "middle" });
});

// 左栏：两张死穴卡
[
  ["死穴一 · 员工端", "员工不愿用", "<5%", "参与率", "预算花了，人没来。", C.MOSS],
  ["死穴二 · 企业端", "企业看不清", "只有人次", "无法证明效果", "不知道有没有用。", C.AMBER],
].forEach((c, i) => {
  const x = 1.05, y = 2.42 + i * 1.5, w = 5.2, h = 1.35;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.16, w: 0.1, h: h - 0.32, fill: { color: c[5] } });
  s.addText(c[0], { x: x + 0.32, y: y + 0.08, w: 2.6, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 10, charSpacing: 1.5, valign: "middle" });
  s.addText(c[1], { x: x + 0.32, y: y + 0.36, w: 2.3, h: 0.42, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  s.addText(c[4], { x: x + 0.32, y: y + 0.82, w: 2.6, h: 0.4, fontFace: HF, color: C.MUTE, fontSize: 11, valign: "middle" });
  s.addText(c[2], { x: x + 2.95, y: y + 0.18, w: 2.1, h: 0.62, align: "center", fontFace: HF, color: c[5], fontSize: 26, bold: true, valign: "middle" });
  s.addText(c[3], { x: x + 2.95, y: y + 0.82, w: 2.1, h: 0.4, align: "center", fontFace: HF, color: C.FOREST, fontSize: 12.5, bold: true, valign: "middle" });
});

// 右栏：员工端 / 管理端
[
  ["员工端", C.MOSS, ["承认「我有问题」本身就是负担", "注册预约太麻烦", "用了也看不到反馈"]],
  ["管理端", C.AMBER, ["年底只有「咨询人次」", "证明不了有没有用", "员工崩溃或离职才知道出事了"]],
].forEach((c, i) => {
  const x = 7.1, y = 2.42 + i * 1.5, w = 5.2, h = 1.35;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.15, h, rectRadius: 0.12, fill: { color: c[1] } });
  s.addShape(p.ShapeType.rect, { x: x + 0.85, y, w: 0.3, h, fill: { color: c[1] } });
  s.addText(c[0], { x, y, w: 1.15, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 15, bold: true });
  c[2].forEach((t, j) => {
    const ty = y + 0.18 + j * 0.34;
    dot(s, x + 1.38, ty + 0.1, c[1], 0.12);
    s.addText(t, { x: x + 1.62, y: ty, w: w - 1.8, h: 0.32, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "middle" });
  });
});

// 恶性循环
L.card(p, s, 0.8, 5.62, 11.75, 0.92, C.FOREST, { shadow: sh() });
s.addText("恶性循环", { x: 1.1, y: 5.62, w: 1.5, h: 0.92, fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, valign: "middle" });
["越没人用", "越没数据", "越没人买", "回到起点"].forEach((t, i) => {
  const x = 2.85 + i * 2.48;
  s.addShape(p.ShapeType.roundRect, { x, y: 5.87, w: 2.08, h: 0.42, rectRadius: 0.21, fill: { color: i === 3 ? C.FOREST2 : C.FOREST3 } });
  s.addText(t, { x, y: 5.87, w: 2.08, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: i === 3 ? C.MOSSL : C.WHITE, fontSize: 12.5, bold: true });
  if (i < 3) s.addText(i === 2 ? "↺" : "→", { x: x + 2.08, y: 5.87, w: 0.4, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 13, bold: true });
});

// 数据行
[["54.9%", "焦虑烦躁", C.MOSS], ["49.7%", "情绪低落", C.AMBER], ["89%", "纳入战略", C.FOREST], ["<5%", "参与率", RED]].forEach((c, i) => {
  const x = 0.8 + i * 2.98, y = 6.68, w = 2.8, h = 0.66;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.25, y, w: 1.35, h, fontFace: HF, color: c[2], fontSize: 20, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 1.6, y, w: w - 1.85, h, fontFace: HF, color: C.MUTE, fontSize: 11, valign: "middle" });
});

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
