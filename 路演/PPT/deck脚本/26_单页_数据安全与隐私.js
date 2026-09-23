// MindBridge · 单页 · 数据安全与隐私 · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_单页_数据安全与隐私.pptx";
let s;

s = page("PART 02 · SECURITY", "数据安全与隐私");

// ---------- 左栏：五层 ----------
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

// ---------- 右栏：技术保障 + 制度保障 ----------
L.card(p, s, 6.85, 2.0, 5.7, 4.38, C.CARD, { shadow: sh() });
[
  ["技术保障", C.FOREST, ["等保三级认证", "数据加密传输与存储", "企业私有云部署"]],
  ["制度保障", C.AMBER, ["保密协议约束", "权限最小化原则", "员工数据可随时删除"]],
].forEach((sec, si) => {
  const y0 = 2.2 + si * 2.05;
  dot(s, 7.15, y0 + 0.1, sec[1], 0.16);
  s.addText(sec[0], { x: 7.43, y: y0 - 0.02, w: 4.7, h: 0.4, fontFace: HF, color: sec[1], fontSize: 15, bold: true, valign: "middle" });
  sec[2].forEach((t, j) => {
    const y = y0 + 0.5 + j * 0.5;
    dot(s, 7.15, y + 0.16, C.MOSS, 0.11);
    s.addText(t, { x: 7.43, y, w: 4.7, h: 0.45, fontFace: HF, color: C.INK, fontSize: 12.5, valign: "middle" });
  });
});

// ---------- 底部断言 ----------
L.card(p, s, 0.8, 6.55, 11.75, 0.65, C.FOREST, { shadow: sh() });
s.addText("隐私不是附加条款，是产品能跑起来的前提。", { x: 1.0, y: 6.55, w: 11.35, h: 0.65, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
