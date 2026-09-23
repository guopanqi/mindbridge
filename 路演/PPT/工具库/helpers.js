const L = require("./lib.js");
const { C, HF } = L;
const IMG = __dirname + "/../素材/";
module.exports = function(p){

const sh = () => L.shadow();
function lead(s, txt, y = 1.75, h = 0.7, w = 11.75) {
  s.addText(txt, { x: 0.8, y, w, h, fontFace: HF, color: C.MUTE, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.15 });
}
function dot(s, x, y, color, d = 0.16) { s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color } }); }
function circleNum(s, x, y, n, color, d = 0.5, fs = 14) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color } });
  s.addText(n, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: fs, bold: true });
}
// numbered card: circle number + title + body
function numCard(s, x, y, w, h, n, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, opt.fill || C.CARD, { shadow: sh() });
  circleNum(s, x + 0.28, y + 0.28, n, opt.accent || C.AMBER, 0.46, 13);
  s.addText(title, { x: x + 0.88, y: y + 0.22, w: w - 1.1, h: 0.58, fontFace: HF, color: opt.dark ? C.WHITE : C.FOREST, fontSize: opt.tfs || 15, bold: true, valign: "middle" });
  s.addText(body, { x: x + 0.3, y: y + 0.9, w: w - 0.6, h: h - 1.05, fontFace: HF, color: opt.dark ? C.CREAMTXT : C.INK, fontSize: opt.fs || 12, valign: "top", lineSpacingMultiple: 1.2 });
}
// titled card with small dot + optional label
function dotCard(s, x, y, w, h, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, opt.fill || C.CARD, { shadow: sh() });
  dot(s, x + 0.3, y + 0.35, opt.accent || C.AMBER);
  s.addText(title, { x: x + 0.58, y: y + 0.18, w: w - 0.8, h: 0.5, fontFace: HF, color: opt.dark ? C.AMBERL : C.FOREST, fontSize: opt.tfs || 15, bold: true, valign: "middle" });
  s.addText(body, { x: x + 0.3, y: y + 0.75, w: w - 0.6, h: h - 0.9, fontFace: HF, color: opt.dark ? C.WHITE : C.INK, fontSize: opt.fs || 12, valign: "top", lineSpacingMultiple: 1.2 });
}
// big-number stat card
function stat(s, x, y, w, h, big, label, opt = {}) {
  const dark = opt.dark !== false;
  L.card(p, s, x, y, w, h, dark ? C.FOREST : C.CARD, { shadow: sh() });
  s.addText(big, { x: x + 0.25, y: y + 0.12, w: w - 0.5, h: h * 0.5, fontFace: HF, color: dark ? C.AMBERL : C.FOREST, fontSize: opt.bfs || 26, bold: true, valign: "middle" });
  s.addText(label, { x: x + 0.25, y: y + h * 0.55, w: w - 0.5, h: h * 0.42, fontFace: HF, color: dark ? C.CREAMTXT : C.MUTE, fontSize: opt.lfs || 11.5, valign: "top", lineSpacingMultiple: 1.1 });
}
// section label (bold forest line)
function label(s, x, y, w, txt, fs = 14) {
  s.addText(txt, { x, y, w, h: 0.35, fontFace: HF, color: C.FOREST, fontSize: fs, bold: true });
}
// image in a rounded card (dark frame for phone/desktop screenshots)
function imgCard(s, file, x, y, w, h, opt = {}) {
  L.card(p, s, x, y, w, h, opt.frame || C.FOREST2, { shadow: sh() });
  s.addImage({ path: IMG + file, x: x + 0.15, y: y + 0.15, w: w - 0.3, h: h - 0.3, sizing: { type: "contain", w: w - 0.3, h: h - 0.3 } });
  if (opt.caption) s.addText(opt.caption, { x, y: y + h + 0.05, w, h: 0.35, fontFace: HF, color: C.MUTE, fontSize: 10.5, italic: true, align: "center" });
}
// flow pill row: ["A","B","C"] joined with arrows
function flow(s, x, y, w, items, color = C.FOREST) {
  const n = items.length, gap = 0.45, pw = (w - gap * (n - 1)) / n;
  items.forEach((t, i) => {
    const px = x + i * (pw + gap);
    s.addShape(p.ShapeType.roundRect, { x: px, y, w: pw, h: 0.5, rectRadius: 0.25, fill: { color } });
    s.addText(t, { x: px, y, w: pw, h: 0.5, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true });
    if (i < n - 1) s.addText("→", { x: px + pw, y, w: gap, h: 0.5, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 18, bold: true });
  });
}
function darkSlide() {
  const s = p.addSlide(); L.bg(s, C.FOREST);
  s.addShape(p.ShapeType.ellipse, { x: -1.5, y: -1.6, w: 5, h: 5, fill: { color: C.FOREST2 } });
  s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 4.8, w: 4.2, h: 4.2, fill: { color: C.FOREST3 } });
  return s;
}
function page(eyebrow, title) { const s = p.addSlide(); L.bg(s, C.CREAM); L.header(p, s, eyebrow, title); return s; }

return { sh, lead, dot, circleNum, numCard, dotCard, stat, label, imgCard, flow, darkSlide, page };
};
