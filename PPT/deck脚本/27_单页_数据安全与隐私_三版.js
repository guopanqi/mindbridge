// MindBridge · 单页 · 数据安全与隐私 · 三版对比（A深色对比 / B右卡拆分 / C横向五层）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, dot, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_单页_数据安全与隐私_三版对比.pptx";
let s;

function tag(s, t) {
  s.addShape(p.ShapeType.roundRect, { x: 11.0, y: 1.0, w: 1.55, h: 0.5, rectRadius: 0.25, fill: { color: C.AMBER } });
  s.addText(t, { x: 11.0, y: 1.0, w: 1.55, h: 0.5, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
}
function darkBandC(s, x, y, w, h, body, fs) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  s.addText(body, { x: x + 0.3, y, w: w - 0.6, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: fs || 14, bold: true });
}

// ================= 方案A：深色对比 =================
s = page("PART 02 · SECURITY", "数据安全与隐私"); tag(s, "方案 A");
[
  ["设计层", "去标识化匿名设计", C.MOSS],
  ["存储层", "加密隔离存储", C.AMBER],
  ["权限层", "严格权限管控", C.FOREST],
  ["制度层", "保密协议约束", C.AMBER],
  ["技术层", "等保三级认证与私有云部署", C.MOSS],
].forEach((c, i) => {
  const y = 2.0 + i * 0.9, x = 0.8, w = 5.7, h = 0.78;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.6, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.3, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w: 1.6, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
  s.addText(c[1], { x: x + 1.85, y, w: w - 2.1, h, fontFace: HF, color: C.INK, fontSize: 12.5, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });
});
L.card(p, s, 6.85, 2.0, 5.7, 4.38, C.FOREST, { shadow: sh() });
[
  ["技术保障", ["等保三级认证", "数据加密传输与存储", "企业私有云部署"]],
  ["制度保障", ["保密协议约束", "权限最小化原则", "员工数据可随时删除"]],
].forEach((sec, si) => {
  const y0 = 2.25 + si * 2.0;
  dot(s, 7.15, y0 + 0.12, C.AMBER, 0.16);
  s.addText(sec[0], { x: 7.43, y: y0, w: 4.7, h: 0.4, fontFace: HF, color: C.AMBERL, fontSize: 15, bold: true, valign: "middle" });
  sec[1].forEach((t, j) => {
    const y = y0 + 0.52 + j * 0.48;
    dot(s, 7.15, y + 0.15, C.MOSS, 0.11);
    s.addText(t, { x: 7.43, y, w: 4.7, h: 0.45, fontFace: HF, color: C.WHITE, fontSize: 12.5, valign: "middle" });
  });
});
L.card(p, s, 0.8, 6.55, 11.75, 0.65, C.MOSST);
s.addText("隐私不是附加条款，是产品能跑起来的前提。", { x: 1.0, y: 6.55, w: 11.35, h: 0.65, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 14, bold: true });

// ================= 方案B：右卡拆分 =================
s = page("PART 02 · SECURITY", "数据安全与隐私"); tag(s, "方案 B");
[
  ["设计层", "去标识化匿名设计", C.MOSS],
  ["存储层", "加密隔离存储", C.AMBER],
  ["权限层", "严格权限管控", C.FOREST],
  ["制度层", "保密协议约束", C.AMBER],
  ["技术层", "等保三级认证与私有云部署", C.MOSS],
].forEach((c, i) => {
  const y = 2.0 + i * 0.9, x = 0.8, w = 5.7, h = 0.78;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.6, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.3, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w: 1.6, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
  s.addText(c[1], { x: x + 1.85, y, w: w - 2.1, h, fontFace: HF, color: C.INK, fontSize: 12.5, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });
});
[
  ["技术保障", C.FOREST, ["等保三级认证", "数据加密传输与存储", "企业私有云部署"]],
  ["制度保障", C.AMBER, ["保密协议约束", "权限最小化原则", "员工数据可随时删除"]],
].forEach((sec, si) => {
  const x = 6.85, w = 5.7, y = 2.0 + si * 2.24, h = 2.14;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.62, rectRadius: 0.12, fill: { color: sec[1] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.32, w, h: 0.3, fill: { color: sec[1] } });
  s.addText(sec[0], { x: x + 0.3, y, w: w - 0.6, h: 0.62, fontFace: HF, color: C.WHITE, fontSize: 15, bold: true, valign: "middle" });
  sec[2].forEach((t, j) => {
    const by = y + 0.78 + j * 0.44;
    dot(s, x + 0.3, by + 0.14, sec[1], 0.12);
    s.addText(t, { x: x + 0.58, y: by, w: w - 0.85, h: 0.42, fontFace: HF, color: C.INK, fontSize: 12, valign: "middle" });
  });
});
darkBandC(s, 0.8, 6.55, 11.75, 0.65, "隐私不是附加条款，是产品能跑起来的前提。", 14);

// ================= 方案C：横向五层 =================
s = page("PART 02 · SECURITY", "数据安全与隐私"); tag(s, "方案 C");
[
  ["设计层", "去标识化\n匿名设计", C.MOSS],
  ["存储层", "加密隔离\n存储", C.AMBER],
  ["权限层", "严格权限\n管控", C.FOREST],
  ["制度层", "保密协议\n约束", C.AMBER],
  ["技术层", "等保三级\n私有云部署", C.MOSS],
].forEach((c, i) => {
  const x = 0.8 + i * 2.385, w = 2.21, y = 2.0, h = 1.6;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.55, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.3, w, h: 0.25, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w, h: 0.55, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13.5, bold: true });
  s.addText(c[1], { x: x + 0.15, y: y + 0.62, w: w - 0.3, h: 0.92, align: "center", valign: "middle", fontFace: HF, color: C.INK, fontSize: 11.5, bold: true, lineSpacingMultiple: 1.25 });
});
[
  ["技术保障", C.FOREST, ["等保三级认证", "数据加密传输与存储", "企业私有云部署"]],
  ["制度保障", C.AMBER, ["保密协议约束", "权限最小化原则", "员工数据可随时删除"]],
].forEach((sec, si) => {
  const x = 0.8 + si * 6.05, w = 5.7, y = 3.75, h = 1.95;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.3, y + 0.24, sec[1], 0.16);
  s.addText(sec[0], { x: x + 0.58, y: y + 0.08, w: w - 0.8, h: 0.45, fontFace: HF, color: sec[1], fontSize: 15, bold: true, valign: "middle" });
  sec[2].forEach((t, j) => {
    const by = y + 0.68 + j * 0.42;
    dot(s, x + 0.3, by + 0.13, C.MOSS, 0.11);
    s.addText(t, { x: x + 0.58, y: by, w: w - 0.85, h: 0.4, fontFace: HF, color: C.INK, fontSize: 12, valign: "middle" });
  });
});
darkBandC(s, 0.8, 5.85, 11.75, 0.7, "隐私不是附加条款，是产品能跑起来的前提。", 14);

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
