// MindBridge · 单页 · 为什么我们能做成 · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, circleNum, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_单页_为什么我们能做成.pptx";
let s;

s = page("PART 04 · WHY US", "为什么我们能做成");
[
  ["01", "方向判断", "EAP 市场 53 亿，年增 34.6%。传统 EAP 失效，AI + 疗愈是正确方向。", C.MOSS],
  ["02", "产品完整度", "双轨模型、AI 树洞、三盏灯、行业适配、效果对赌 —— 产品逻辑完整。", C.AMBER],
  ["03", "团队执行力", "跨学科团队：技术 + 疗愈 + 运营。项目总监 5 年 + EAP 经验，疗愈师持 IAOTH 认证。", C.FOREST],
  ["04", "早期验证", "已设计 8 个行业方案，具备服务多家企业的能力。行业常模数据随服务企业增加。", C.AMBER],
].forEach((c, i) => {
  const x = 0.8 + i * 2.98, w = 2.8, y = 1.9, h = 3.4;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  circleNum(s, x + 0.28, y + 0.28, c[0], c[3], 0.46, 12);
  s.addText(c[1], { x: x + 0.88, y: y + 0.22, w: w - 1.1, h: 0.58, fontFace: HF, color: C.FOREST, fontSize: 15, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.3, y: y + 1.0, w: w - 0.6, h: h - 1.2, fontFace: HF, color: C.INK, fontSize: 12, valign: "top", lineSpacingMultiple: 1.3 });
});

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
