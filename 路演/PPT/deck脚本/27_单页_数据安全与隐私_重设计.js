const pptxgen = require('pptxgenjs');

const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = 'MindBridge';
p.subject = '数据安全与隐私';
p.title = '数据安全与隐私';
p.lang = 'zh-CN';

const s = p.addSlide();
const W = 13.333, H = 7.5;
const c = {
  dark: '183C34', deep: '102C27', green: '9BC8A5', mint: 'D8E9D5',
  cream: 'F6F3EA', ink: '16352F', muted: '65736B', line: 'DCE5DA', amber: 'E8B873', white: 'FFFFFF'
};
const font = 'PingFang SC';
const T = (txt, x, y, w, h, opt = {}) => s.addText(txt, {
  x, y, w, h, fontFace: font, fontSize: 16, color: c.ink,
  margin: 0, breakLine: false, valign: 'mid', ...opt
});
const R = (x, y, w, h, fill, radius = 0) => s.addShape(radius ? p.ShapeType.roundRect : p.ShapeType.rect, {
  x, y, w, h, rectRadius: radius, line: { color: fill, transparency: 100 }, fill: { color: fill }
});
const L = (x1, y1, x2, y2, color, width = 1) => s.addShape(p.ShapeType.line, {
  x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width }
});

s.background = { color: c.cream };
R(0, 0, W, 0.12, c.dark);
T('数据安全与隐私', 0.72, 0.42, 8.8, 0.62, { fontSize: 31, bold: true, color: c.dark });
T('从设计到治理，建立完整的数据保护链路', 0.74, 1.12, 8.6, 0.34,
  { fontSize: 12.5, color: c.muted });

// Five-layer model: a single timeline, separated by rules rather than cards.
R(0.72, 1.76, 6.47, 4.57, c.white, 0.18);
T('五层防护', 1.05, 1.99, 4.1, 0.36, { fontSize: 18, bold: true, color: c.dark });
T('01—05', 5.72, 2.02, 1.1, 0.28, { fontSize: 10, color: c.muted, align: 'right', charSpacing: 1 });
L(1.05, 2.49, 6.84, 2.49, c.line, 1.2);

const layers = [
  ['01', '设计层', '去标识化匿名设计'],
  ['02', '存储层', '加密隔离存储'],
  ['03', '权限层', '严格权限管控'],
  ['04', '制度层', '保密协议约束'],
  ['05', '技术层', '等保三级认证与私有云部署']
];
layers.forEach((v, i) => {
  const y = 2.61 + i * 0.70;
  R(1.05, y + 0.06, 0.43, 0.43, i === 4 ? c.dark : c.mint, 0.11);
  T(v[0], 1.05, y + 0.06, 0.43, 0.43,
    { fontSize: 10, bold: true, color: i === 4 ? c.white : c.dark, align: 'center' });
  T(v[1], 1.72, y, 1.18, 0.55, { fontSize: 15.5, bold: true });
  T(v[2], 3.03, y, 3.76, 0.55, { fontSize: 13.5, color: c.muted });
  if (i < 4) L(1.72, y + 0.64, 6.84, y + 0.64, c.line, 0.8);
});

// Supporting measures on one dark plane, with two clear groups.
R(7.43, 1.76, 5.18, 4.57, c.dark, 0.18);
T('保障措施', 7.81, 2.00, 3.6, 0.38, { fontSize: 18, bold: true, color: c.white });
L(7.81, 2.49, 12.23, 2.49, '628376', 1.1);

T('技术保障', 7.81, 2.70, 2.5, 0.35, { fontSize: 15, bold: true, color: c.green });
const technical = ['等保三级认证', '数据加密传输与存储', '企业私有云部署'];
technical.forEach((v, i) => {
  const y = 3.16 + i * 0.42;
  R(7.82, y + 0.13, 0.07, 0.07, c.amber, 0.03);
  T(v, 8.05, y, 4.02, 0.33, { fontSize: 12.5, color: c.white });
});
L(7.81, 4.48, 12.23, 4.48, '628376', 0.8);
T('制度保障', 7.81, 4.66, 2.5, 0.35, { fontSize: 15, bold: true, color: c.green });
const governance = ['保密协议约束', '权限最小化原则', '员工数据可随时删除'];
governance.forEach((v, i) => {
  const y = 5.10 + i * 0.37;
  R(7.82, y + 0.12, 0.07, 0.07, c.amber, 0.03);
  T(v, 8.05, y, 4.02, 0.31, { fontSize: 12.5, color: c.white });
});

// Statement is a typographic close, rather than another filled panel.
R(0.72, 6.57, 0.08, 0.43, c.amber);
T('隐私不是附加条款，是产品能跑起来的前提。', 1.02, 6.55, 11.55, 0.48,
  { fontSize: 19.5, bold: true, color: c.dark });

const out = process.argv[2] || __dirname + '/../成品/MindBridge_单页_数据安全与隐私_重设计.pptx';
p.writeFile({ fileName: out }).then(() => console.log(out));
