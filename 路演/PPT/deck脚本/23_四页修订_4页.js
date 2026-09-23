// MindBridge · 四页修订版（目录/数据安全/疗愈工具箱/模块化采购） · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_四页修订_4页.pptx";
let s;

function darkBand(s, x, y, w, h, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  if (title) s.addText(title, { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
  s.addText(body, { x: x + 0.3, y: title ? y + 0.45 : y, w: w - 0.6, h: title ? h - 0.55 : h, fontFace: HF, color: C.WHITE, fontSize: opt.fs || 15, bold: true, valign: "middle", align: opt.align || "left", lineSpacingMultiple: 1.25 });
}

// ---------- 第1页 · 目录 ----------
s = page("CONTENTS", "目录");
[
  ["01", "市场洞察与需求分析", "传统 EAP 死穴 · 员工与管理痛点", C.MOSS],
  ["02", "核心产品与创新设计", "双轨模型 · AI 树洞 · 三级干预 · 参与度保障", C.AMBER],
  ["03", "行业适配与效果评估", "一行业一方案 · 疗愈工具箱 · 三层数据", C.FOREST],
  ["04", "商业模式与竞争壁垒", "模块化采购 · 市场空间 · ROI · 四大壁垒", C.AMBER],
].forEach((c, i) => {
  const y = 1.95 + i * 1.25, x = 0.8, w = 11.75, h = 1.1;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.35, h, rectRadius: 0.12, fill: { color: c[3] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.05, y, w: 0.3, h, fill: { color: c[3] } });
  s.addText(c[0], { x, y, w: 1.35, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 26, bold: true });
  s.addText(c[1], { x: x + 1.7, y: y + 0.12, w: w - 2.0, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 19, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 1.7, y: y + 0.62, w: w - 2.0, h: 0.4, fontFace: HF, color: C.MUTE, fontSize: 12, valign: "middle" });
});
L.foot(p, s, "AI 负责广度，疗愈负责深度 —— 四个部分回答：为什么做、做什么、有没有用、怎么赚钱");

// ---------- 第2页 · 数据安全与隐私 ----------
s = page("PART 02 · SECURITY", "数据安全与隐私");
[
  ["设计层", "去标识化匿名设计", C.MOSS], ["存储层", "加密隔离存储", C.AMBER], ["权限层", "严格权限管控", C.FOREST],
  ["制度层", "保密协议约束", C.AMBER], ["技术层", "等保三级认证与私有云部署", C.MOSS],
].forEach((c, i) => {
  const y = 2.0 + i * 0.92, x = 0.8, w = 7.3, h = 0.78;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.7, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.4, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w: 1.7, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
  s.addText(c[1], { x: x + 1.95, y, w: w - 2.2, h, fontFace: HF, color: C.INK, fontSize: 13.5, bold: true, valign: "middle" });
});
[
  ["员工掌握数据主权", "可随时查看、导出或一键清空全部历史记录。", C.MOSS],
  ["双链数据物理隔离", "员工对话留在个人空间，企业只看聚合趋势。", C.FOREST],
  ["企业权限严格受限", "HR 仅能查看匿名聚合后的趋势图，无权查看个人原文。", C.AMBER],
].forEach((c, i) => {
  const x = 8.4, w = 4.15, y = 2.0 + i * 1.32, h = 1.22;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.3, y + 0.28, c[2], 0.16);
  s.addText(c[0], { x: x + 0.58, y: y + 0.12, w: w - 0.8, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 13, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.3, y: y + 0.6, w: w - 0.6, h: 0.55, fontFace: HF, color: C.INK, fontSize: 10.5, valign: "top", lineSpacingMultiple: 1.2 });
});
darkBand(s, 8.4, 6.0, 4.15, 0.62, "", "隐私不是附加条款，是产品能跑起来的前提。", { fs: 10.5, align: "center" });

// ---------- 第3页 · 疗愈工具箱 ----------
s = page("PART 03 · TOOLBOX", "疗愈工具箱");
lead(s, "每个行业匹配经后台验证的高表现疗愈工具。", 1.7, 0.5);
L.table(p, s, { x: 0.8, y: 2.3, w: 11.75, colFr: [2.1, 4.4, 5.25], headers: ["行业", "核心痛点", "高表现疗愈工具（后台数据）"],
  rows: [
    ["互联网 / IT", "赶工焦虑、注意力碎片化", "身份重塑叙事疗愈小组（4.6 / 5）"],
    ["金融 / 银行", "业绩高压、意义感丧失", "跨团队疗愈小组（4.5 / 5）"],
    ["客服 / 服务业", "情绪劳动、情感压抑", "「心流插花」艺术疗愈（4.7 / 5）"],
    ["教育", "多重角色耗竭、情绪麻木", "奥尔夫音乐疗愈（4.6 / 5）"],
    ["医护 / 护理", "共情疲劳、生死无意义感", "巴林特小组（4.7 / 5）"],
    ["制造业 / 汽车", "人际孤独、意义感丧失", "沙盘疗愈 · 心声共鸣（4.5 / 5）"],
    ["科技企业", "技术迭代焦虑、远程孤岛", "身份重塑叙事疗愈小组（4.7 / 5）"],
    ["公益组织", "共情疲劳、使命感过载", "巴林特小组（4.8 / 5）"],
  ], rowH: 0.44, headH: 0.5, fs: 11.5, headFs: 12.5 });
darkBand(s, 0.8, 6.45, 11.75, 0.6, "", "不是我们选了工具，是行业数据告诉我们哪个工具有效。", { fs: 15, align: "center" });

// ---------- 第4页 · 模块化采购 ----------
s = page("PART 04 · BUSINESS MODEL", "模块化采购，灵活适配");
L.table(p, s, { x: 0.8, y: 1.9, w: 7.6, colFr: [1.3, 4.2, 1.6], headers: ["版本", "内容", "年费"],
  rows: [
    ["旗舰版", "进阶版 + 大使培养 + 年度白皮书", "80–120 万"],
    ["进阶版", "标准版 + 一对一疏导 + 行业定制", "50–80 万"],
    ["标准版", "基础版 + 季度团体工作坊", "30–50 万"],
    ["基础版", "AI 树洞 + 数字内容 + 年度测评", "15–25 万"],
  ], rowH: 0.58, fs: 12.5, starCol: 2 });
stat(s, 8.7, 1.9, 3.85, 1.35, "1260–1760 元", "人均 / 年 · 成本优势");
stat(s, 8.7, 3.35, 3.85, 1.42, "↓ 30%–40%", "较传统 EAP（2000–3000 元 / 人）", { dark: false });
L.card(p, s, 0.8, 4.95, 7.6, 0.95, C.CARD, { shadow: sh() });
s.addText("收费方式", { x: 1.05, y: 5.0, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
s.addText("按人头年费 + 项目制（5–15 万 / 次）", { x: 1.05, y: 5.32, w: 7.1, h: 0.55, fontFace: HF, color: C.FOREST, fontSize: 16.5, bold: true, valign: "middle" });
darkBand(s, 8.7, 4.95, 3.85, 0.95, "", "以 15 万基础版降低试错门槛，决策门槛低", { fs: 13, align: "center" });
L.card(p, s, 0.8, 6.08, 11.75, 0.62, C.MOSST);
s.addText("效果对赌：尾款 30% 挂钩 PSI，未达标按比例退款或免费延长服务期 —— 用对赌代替自证，零风险决策", { x: 1.0, y: 6.08, w: 11.35, h: 0.62, fontFace: HF, color: C.FOREST, fontSize: 12, bold: true, valign: "middle", align: "center" });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
