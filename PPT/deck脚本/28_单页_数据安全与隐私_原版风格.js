// 与「四页修订版」第 2 页保持同一版式、字体和配色。
const L = require('../工具库/lib.js');
const { C, HF } = L;
const p = L.newDeck();
const H = require('../工具库/helpers.js')(p);
const { sh, dot, page } = H;
const OUT = process.argv[2] || __dirname + '/../成品/MindBridge_单页_数据安全与隐私_原版风格.pptx';
const s = page('PART 02 · SECURITY', '数据安全与隐私');

[
  ['设计层', '去标识化匿名设计', C.MOSS],
  ['存储层', '加密隔离存储', C.AMBER],
  ['权限层', '严格权限管控', C.FOREST],
  ['制度层', '保密协议约束', C.AMBER],
  ['技术层', '等保三级认证与私有云部署', C.MOSS],
].forEach((c, i) => {
  const y = 2.0 + i * 0.92, x = 0.8, w = 7.3, h = 0.78;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.7, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.4, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w: 1.7, h, align: 'center', valign: 'middle', fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
  s.addText(c[1], { x: x + 1.95, y, w: w - 2.2, h, fontFace: HF, color: C.INK, fontSize: 13.5, bold: true, valign: 'middle' });
});

const groups = [
  { title: '技术保障', color: C.FOREST, y: 2.0, items: ['等保三级认证', '数据加密传输与存储', '企业私有云部署'] },
  { title: '制度保障', color: C.AMBER, y: 4.05, items: ['保密协议约束', '权限最小化原则', '员工数据可随时删除'] },
];
groups.forEach((g) => {
  const x = 8.4, w = 4.15, h = 1.88;
  L.card(p, s, x, g.y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.30, g.y + 0.28, g.color, 0.16);
  s.addText(g.title, { x: x + 0.58, y: g.y + 0.12, w: w - 0.88, h: 0.42, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: 'middle' });
  g.items.forEach((item, i) => {
    const iy = g.y + 0.64 + i * 0.39;
    dot(s, x + 0.32, iy + 0.13, C.MOSS, 0.09);
    s.addText(item, { x: x + 0.57, y: iy, w: w - 0.85, h: 0.32, fontFace: HF, color: C.INK, fontSize: 11.6, valign: 'middle' });
  });
});

L.card(p, s, 8.4, 6.08, 4.15, 0.64, C.FOREST, { shadow: sh() });
s.addText('隐私不是附加条款，是产品能跑起来的前提。', {
  x: 8.58, y: 6.08, w: 3.79, h: 0.64, fontFace: HF, color: C.WHITE,
  fontSize: 10.8, bold: true, valign: 'middle', align: 'center', margin: 0,
});

p.writeFile({ fileName: OUT }).then(f => console.log('saved', f));
