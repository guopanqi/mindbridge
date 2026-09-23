// MindBridge · 决赛完整版 · 第13–20页（8页）
// 一行业一方案 / 疗愈工具箱 / 三层数据 / 模块化采购 / 市场 / 为什么能做成 / ROI / 结尾
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
p.title = "MindBridge 决赛完整版 · 第13–20页";
p.author = "MindBridge";
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, label, flow, stat, page } = H;
const IMG = __dirname + "/../素材/";
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_决赛路演_完整版_第13-20页.pptx";
let s;

function darkBand(s, x, y, w, h, body, opt = {}) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  if (!body) return;
  s.addText(body, {
    x: x + 0.28, y, w: w - 0.56, h,
    fontFace: HF, color: C.WHITE, fontSize: opt.fs || 15, bold: true,
    valign: "middle", align: opt.align || "center", margin: 0,
  });
}

function railCard(s, x, y, w, h, rail, sub, body, color) {
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.72, h, rectRadius: 0.12, fill: { color } });
  s.addShape(p.ShapeType.rect, { x: x + 1.4, y, w: 0.32, h, fill: { color } });
  s.addText(rail, {
    x, y: sub ? y + 0.06 : y, w: 1.72, h: sub ? h * 0.58 : h,
    align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 15, bold: true, margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x, y: y + h * 0.52, w: 1.72, h: h * 0.36,
      align: "center", valign: "top", fontFace: HF, color: C.WHITE, fontSize: 11, margin: 0,
    });
  }
  s.addText(body, {
    x: x + 1.95, y, w: w - 2.15, h,
    fontFace: HF, color: C.INK, fontSize: 15, bold: true, valign: "middle", margin: 0,
  });
}

// ---------- 13 一行业，一方案 ----------
s = page("PART 03 · INDUSTRY FIT", "一行业，一方案");
s.addText("企业现有数据与员工真实倾诉共同定位行业痛点", {
  x: 0.8, y: 1.66, w: 11.75, h: 0.34,
  fontFace: HF, color: C.FOREST, fontSize: 15, bold: true, margin: 0,
});
flow(s, 0.8, 2.08, 11.75, ["HR 数据 + AI 试运行", "定位痛点", "匹配模块", "一行业一方案"]);
label(s, 0.8, 2.72, 6, "制造业示例推演");

railCard(s, 0.8, 3.12, 7.2, 0.82, "HR 数据", "示例", "离职率上升，病假率偏高", C.MOSS);

L.card(p, s, 0.8, 4.06, 7.2, 1.12, C.CARD, { shadow: sh() });
s.addShape(p.ShapeType.roundRect, { x: 0.8, y: 4.06, w: 1.72, h: 1.12, rectRadius: 0.12, fill: { color: C.AMBER } });
s.addShape(p.ShapeType.rect, { x: 2.2, y: 4.06, w: 0.32, h: 1.12, fill: { color: C.AMBER } });
s.addText("AI 树洞", {
  x: 0.8, y: 4.2, w: 1.72, h: 0.48,
  align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 15, bold: true, margin: 0,
});
s.addText("示例", {
  x: 0.8, y: 4.66, w: 1.72, h: 0.32,
  align: "center", valign: "top", fontFace: HF, color: C.CREAM, fontSize: 11, margin: 0,
});
[
  ["约 30%+", "轮班疲劳"],
  ["约 20%+", "安全压力"],
  ["约 15%+", "团队沟通"],
].forEach((m, i) => {
  const x = 2.72 + i * 1.72;
  s.addShape(p.ShapeType.roundRect, { x, y: 4.22, w: 1.6, h: 0.8, rectRadius: 0.1, fill: { color: C.MOSST } });
  s.addText(m[0], {
    x, y: 4.26, w: 1.6, h: 0.4,
    align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, margin: 0,
  });
  s.addText(m[1], {
    x, y: 4.62, w: 1.6, h: 0.32,
    align: "center", valign: "middle", fontFace: HF, color: C.INK, fontSize: 12, margin: 0,
  });
});

railCard(s, 0.8, 5.3, 7.2, 0.82, "定位痛点", "", "身体疲劳  +  人际孤独", C.FOREST);

L.card(p, s, 8.3, 3.12, 4.25, 3.0, C.FOREST, { shadow: sh() });
s.addText("匹配模块", {
  x: 8.55, y: 3.26, w: 3.8, h: 0.32,
  fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, margin: 0,
});
[
  ["沙盘疗愈", "团队共创"],
  ["解压拳击", "躯体释放"],
].forEach((m, i) => {
  const y = 3.7 + i * 1.12;
  L.card(p, s, 8.55, y, 3.75, 1.0, C.FOREST3);
  s.addText(m[0], { x: 8.78, y: y + 0.1, w: 3.35, h: 0.42, fontFace: HF, color: C.WHITE, fontSize: 18, bold: true, margin: 0 });
  s.addText(m[1], { x: 8.78, y: y + 0.52, w: 3.35, h: 0.34, fontFace: HF, color: C.MOSSL, fontSize: 13, margin: 0 });
});

darkBand(s, 0.8, 6.42, 11.75, 0.62, "通过数据识别痛点，减少对管理层访谈的依赖。", { fs: 16 });

// ---------- 14 疗愈工具箱 ----------
s = page("PART 03 · TOOLBOX", "疗愈工具箱");
s.addText([
  { text: "传统 EAP 只有心理咨询一把锤子。", options: { bold: true, color: C.FOREST, breakLine: false } },
  { text: "MindBridge 基于行业痛点，为每个行业匹配经过验证的高表现疗愈工具。", options: { color: C.MUTE } },
], {
  x: 0.8, y: 1.66, w: 11.75, h: 0.38,
  fontFace: HF, fontSize: 14, margin: 0, valign: "middle",
});
L.table(p, s, {
  x: 0.8, y: 2.14, w: 11.75,
  colFr: [2.15, 4.15, 5.2],
  headers: ["行业", "核心痛点", "推荐疗愈工具"],
  rows: [
    ["互联网 / IT", "赶工焦虑、注意力碎片化", "身份重塑叙事疗愈小组"],
    ["金融 / 银行", "业绩高压、意义感丧失", "跨团队疗愈小组"],
    ["客服 / 服务业", "情绪劳动、情感压抑", "「心流插花」艺术疗愈"],
    ["教育", "多重角色耗竭、情绪麻木", "奥尔夫音乐疗愈"],
    ["医护 / 护理", "共情疲劳、生死无意义感", "巴林特小组"],
    ["制造业 / 汽车", "人际孤独、意义感丧失", "沙盘疗愈 · 心声共鸣"],
    ["科技企业", "技术迭代焦虑、远程孤岛", "身份重塑叙事疗愈小组"],
    ["公益组织", "共情疲劳、使命感过载", "巴林特小组"],
  ],
  rowH: 0.42, headH: 0.44, fs: 13, headFs: 13,
});
darkBand(s, 0.8, 6.28, 11.75, 0.68, "不是我们凭空选工具，是行业痛点决定了哪个工具更适配。", { fs: 16 });

// ---------- 15 越用越准：三层数据 ----------
s = page("PART 03 · DATA FLYWHEEL", "越用越准：三层数据");
lead(s, "HR 已有数据  +  AI 树洞数据  +  跨企业行业常模  =  越用越准", 1.66, 0.34);

[
  ["01", "第一层 · HR 已有数据", "企业提供", "离职率、病假率、离职面谈记录，脱敏后由企业提供。", C.MOSS],
  ["02", "第二层 · AI 树洞试运行", "企业上线后实测", "2–4 周采集本企业员工真实倾诉，生成情绪标签分布图。", C.AMBER],
  ["03", "第三层 · 跨企业行业常模", "持续积累", "随着服务企业增加，逐步积累行业常模数据。", C.FOREST],
].forEach((c, i) => {
  const y = 2.12 + i * 1.32;
  L.card(p, s, 0.8, y, 4.55, 1.2, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.ellipse, { x: 1.02, y: y + 0.16, w: 0.38, h: 0.38, fill: { color: c[4] } });
  s.addText(c[0], {
    x: 1.02, y: y + 0.16, w: 0.38, h: 0.38,
    align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 11, bold: true, margin: 0,
  });
  s.addText(c[1], {
    x: 1.52, y: y + 0.14, w: 3.6, h: 0.4,
    fontFace: HF, color: C.FOREST, fontSize: 13, bold: true, margin: 0, valign: "middle",
  });
  s.addText(c[2], {
    x: 1.02, y: y + 0.58, w: 4.1, h: 0.22,
    fontFace: HF, color: C.AMBER, fontSize: 12, bold: true, margin: 0,
  });
  s.addText(c[3], {
    x: 1.02, y: y + 0.8, w: 4.1, h: 0.34,
    fontFace: HF, color: C.INK, fontSize: 11, margin: 0, valign: "middle",
  });
});

s.addText("8 行业适配框架", {
  x: 5.6, y: 2.08, w: 4.3, h: 0.32,
  fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, margin: 0, valign: "middle",
});
s.addShape(p.ShapeType.roundRect, { x: 9.95, y: 2.1, w: 2.55, h: 0.3, rectRadius: 0.08, fill: { color: C.AMBERL } });
s.addText("模型测算 · 非实测", {
  x: 9.95, y: 2.1, w: 2.55, h: 0.3,
  align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 11, bold: true, margin: 0,
});
L.table(p, s, {
  x: 5.6, y: 2.52, w: 6.95,
  colFr: [2.35, 1.45, 1.55, 1.6],
  headers: ["行业", "企业样本", "月活区间", "完成率区间"],
  rows: [
    ["互联网 / IT", "约 18 家", "25%–35%", "60%–70%"],
    ["公益组织", "约 7 家", "35%–45%", "70%–75%"],
    ["制造业", "约 14 家", "20%–30%", "60%–70%"],
    ["医护 / 护理", "约 9 家", "30%–40%", "65%–75%"],
    ["客服 / 服务业", "约 15 家", "30%–40%", "65%–70%"],
    ["教育", "约 11 家", "25%–35%", "65%–70%"],
    ["科技企业", "约 10 家", "30%–35%", "65%–75%"],
    ["金融 / 银行", "约 12 家", "25%–30%", "60%–65%"],
  ],
  rowH: 0.385, headH: 0.4, fs: 12, headFs: 12,
});

L.card(p, s, 0.8, 6.28, 11.75, 0.74, C.CARD, { shadow: sh() });
s.addShape(p.ShapeType.rect, { x: 0.8, y: 6.42, w: 0.1, h: 0.46, fill: { color: C.AMBER } });
s.addText("当前行业常模数据为模型测算，用于展示适配逻辑；实际数据随服务企业上线后持续更新。", {
  x: 1.15, y: 6.28, w: 11.15, h: 0.74,
  fontFace: HF, color: C.INK, fontSize: 13, valign: "middle", margin: 0,
});

// ---------- 16 模块化采购 ----------
s = page("PART 04 · BUSINESS MODEL", "模块化采购，灵活适配");
L.table(p, s, {
  x: 0.8, y: 1.82, w: 7.55,
  colFr: [1.35, 4.15, 1.7],
  headers: ["版本", "包含内容", "年费"],
  rows: [
    ["旗舰版", "进阶版 + 大使培养 + 年度白皮书", "80–120 万"],
    ["进阶版", "标准版 + 一对一疏导 + 行业定制", "50–80 万"],
    ["标准版", "基础版 + 季度团体工作坊", "30–50 万"],
    ["基础版", "AI 树洞 + 数字内容 + 年度测评", "15–25 万"],
  ],
  rowH: 0.54, headH: 0.48, fs: 13, headFs: 13, starCol: 2,
});
stat(s, 8.6, 1.82, 3.95, 1.28, "1,200–1,800", "元 / 人 · 年", { bfs: 26, lfs: 14 });
stat(s, 8.6, 3.24, 3.95, 1.38, "↓ 30%–40%", "较传统 EAP\n市场参考价 2,000–3,000 元 / 人", { dark: false, bfs: 26, lfs: 12 });

L.card(p, s, 0.8, 4.78, 7.55, 0.92, C.CARD, { shadow: sh() });
s.addText("收费方式", {
  x: 1.05, y: 4.86, w: 7.1, h: 0.26,
  fontFace: HF, color: C.AMBER, fontSize: 12, bold: true, margin: 0,
});
s.addText("按人头年费  +  项目制（5–15 万 / 次）", {
  x: 1.05, y: 5.14, w: 7.1, h: 0.42,
  fontFace: HF, color: C.FOREST, fontSize: 18, bold: true, margin: 0, valign: "middle",
});
darkBand(s, 8.6, 4.78, 3.95, 0.92, "15 万基础版\n降低试错门槛", { fs: 15 });

darkBand(s, 0.8, 5.92, 11.75, 1.12, "", { fs: 15 });
s.addText("效果对赌", {
  x: 1.1, y: 6.04, w: 11.15, h: 0.3,
  fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, margin: 0,
});
s.addText("尾款 30% 挂钩 PSI，未达标按比例退款或免费延长服务期 —— 用对赌代替自证，零风险决策", {
  x: 1.1, y: 6.36, w: 11.15, h: 0.5,
  fontFace: HF, color: C.WHITE, fontSize: 15, bold: true, margin: 0, valign: "middle",
});

// ---------- 17 53亿市场 ----------
s = page("PART 04 · MARKET", "53 亿市场，头部客户已进场");
stat(s, 0.8, 1.82, 3.85, 1.55, "53 亿", "中国 EAP 市场 · 2024 年\n【行业数据】", { bfs: 32, lfs: 13 });
stat(s, 4.85, 1.82, 3.7, 1.55, "34.6%", "年增长率\n【行业数据】", { dark: false, bfs: 32, lfs: 13 });
stat(s, 8.75, 1.82, 3.8, 1.55, "84.9 亿美元", "全球 EAP · 2032 年预计\n【行业预测】", { dark: false, bfs: 26, lfs: 13 });

L.card(p, s, 0.8, 3.58, 3.85, 1.72, C.CARD, { shadow: sh() });
s.addText("≥ 70%", {
  x: 1.02, y: 3.7, w: 3.45, h: 0.7,
  fontFace: HF, color: C.AMBER, fontSize: 32, bold: true, margin: 0, valign: "middle",
});
s.addText("续约率目标【目标值】\n传统 EAP 市场参考 50%–60%", {
  x: 1.02, y: 4.42, w: 3.45, h: 0.72,
  fontFace: HF, color: C.MUTE, fontSize: 13, margin: 0,
});

L.card(p, s, 4.85, 3.58, 7.7, 1.72, C.CARD, { shadow: sh() });
s.addText("增长飞轮", {
  x: 5.1, y: 3.7, w: 3, h: 0.3,
  fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, margin: 0,
});
flow(s, 5.1, 4.1, 7.2, ["标杆案例", "行业白皮书", "同行业裂变", "获客成本递减"]);
s.addText("↺   数据资产持续强化，回到标杆案例", {
  x: 5.1, y: 4.72, w: 7.2, h: 0.38,
  align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 13, italic: true, margin: 0,
});

L.card(p, s, 0.8, 5.52, 11.75, 1.28, C.FOREST, { shadow: sh() });
s.addText("已公开采购客户", {
  x: 1.05, y: 5.68, w: 11.25, h: 0.28,
  fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, margin: 0,
});
["南网数字集团", "海南电网", "中国电信"].forEach((t, i) => {
  const x = 1.05 + i * 3.75;
  s.addShape(p.ShapeType.roundRect, { x, y: 6.08, w: 3.5, h: 0.52, rectRadius: 0.26, fill: { color: C.FOREST3 } });
  s.addText(t, {
    x, y: 6.08, w: 3.5, h: 0.52,
    align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 16, bold: true, margin: 0,
  });
});

// ---------- 18 为什么我们能做成 ----------
s = page("PART 04 · WHY US", "为什么我们能做成");
[
  ["01", "方向判断", "EAP 市场 53 亿，年增 34.6%。传统 EAP 失效，AI + 疗愈是正确方向。", C.MOSS],
  ["02", "产品完整度", "双轨模型、AI 树洞、三盏灯、行业适配、效果对赌 —— 产品逻辑完整，不是单点概念。", C.AMBER],
  ["03", "团队执行力", "跨学科团队：技术 + 疗愈 + 运营。项目总监 5 年+ EAP 经验，疗愈师持 IAOTH 认证。", C.FOREST],
  ["04", "早期验证", "已设计 8 个行业方案，具备服务多家企业的能力。行业常模数据随服务企业增加持续积累。", C.AMBER],
].forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.8 + col * 6.2, y = 1.82 + row * 2.55, w = 5.9, h = 2.28;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.28, y: y + 0.28, w: 0.58, h: 0.58, fill: { color: c[3] } });
  s.addText(c[0], {
    x: x + 0.28, y: y + 0.28, w: 0.58, h: 0.58,
    align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true, margin: 0,
  });
  s.addText(c[1], {
    x: x + 1.05, y: y + 0.28, w: w - 1.35, h: 0.58,
    fontFace: HF, color: C.FOREST, fontSize: 22, bold: true, margin: 0, valign: "middle",
  });
  s.addText(c[2], {
    x: x + 0.32, y: y + 1.08, w: w - 0.64, h: 1.05,
    fontFace: HF, color: C.INK, fontSize: 15, margin: 0, valign: "top",
  });
});

// ---------- 19 ROI 与增长 ----------
s = page("PART 04 · ROI & GROWTH", "ROI 与增长");
L.card(p, s, 0.8, 1.78, 11.75, 1.48, C.FOREST, { shadow: sh() });
s.addText("500 人企业 / 年", {
  x: 1.05, y: 1.88, w: 4, h: 0.26,
  fontFace: HF, color: C.CREAMTXT, fontSize: 13, bold: true, margin: 0,
});
[
  ["63–88 万", "年度投入"],
  ["600–650 万", "年度收益测算"],
  ["7–10 倍", "ROI 测算"],
  ["1–1.5 个月", "投资回收期测算"],
].forEach((c, i) => {
  const x = 0.95 + i * 2.9;
  if (i > 0) s.addShape(p.ShapeType.rect, { x: x - 0.12, y: 2.28, w: 0.015, h: 0.72, fill: { color: C.FOREST3 } });
  s.addText(c[0], {
    x, y: 2.16, w: 2.7, h: 0.58,
    fontFace: HF, color: C.AMBERL, fontSize: 22, bold: true, margin: 0, valign: "middle",
  });
  s.addText(c[1], {
    x, y: 2.74, w: 2.7, h: 0.36,
    fontFace: HF, color: C.CREAMTXT, fontSize: 13, margin: 0,
  });
});

label(s, 0.8, 3.42, 6, "收益构成（万元）");
[
  ["169", "离职成本节约"],
  ["90", "缺勤损失降低"],
  ["375", "在岗产出提升"],
  ["25–33", "管理收益"],
  ["35–88", "品牌收益"],
  ["85–280", "ESG 收益"],
].forEach((c, i) => {
  const x = 0.8 + (i % 6) * 1.98;
  L.card(p, s, x, 3.78, 1.88, 0.92, C.CARD, { shadow: sh() });
  s.addText(c[0], {
    x: x + 0.1, y: 3.82, w: 1.68, h: 0.46,
    fontFace: HF, color: C.FOREST, fontSize: 18, bold: true, margin: 0, valign: "middle",
  });
  s.addText(c[1], {
    x: x + 0.1, y: 4.26, w: 1.68, h: 0.34,
    fontFace: HF, color: C.MUTE, fontSize: 12, margin: 0,
  });
});

s.addText("测算口径：人均 1,200–1,800 元 / 年；离职率降 30%、缺勤降 20%、专注力恢复 5% —— 均为模型目标值，非实测。", {
  x: 0.8, y: 4.82, w: 11.75, h: 0.32,
  fontFace: HF, color: C.MUTE, fontSize: 12, italic: true, margin: 0,
});

label(s, 0.8, 5.22, 4, "增长路径");
flow(s, 0.8, 5.54, 11.75, ["3–5 年覆盖 1000 家企业", "营收 3–5 亿", "净利率 20%–30%"]);

L.card(p, s, 0.8, 6.2, 7.35, 0.95, C.CARD, { shadow: sh() });
s.addText("融资用途", {
  x: 1.0, y: 6.28, w: 6.95, h: 0.24,
  fontFace: HF, color: C.AMBER, fontSize: 12, bold: true, margin: 0,
});
["行业拓展", "AI 模型迭代", "标杆案例规模化"].forEach((t, i) => {
  const x = 1.0 + i * 2.35;
  s.addShape(p.ShapeType.roundRect, { x, y: 6.58, w: 2.22, h: 0.44, rectRadius: 0.08, fill: { color: C.MOSST } });
  s.addText(t, {
    x, y: 6.58, w: 2.22, h: 0.44,
    align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 13, bold: true, margin: 0,
  });
});
L.card(p, s, 8.35, 6.2, 4.2, 0.95, C.FOREST, { shadow: sh() });
s.addText("退出逻辑", {
  x: 8.55, y: 6.28, w: 3.85, h: 0.24,
  fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true, margin: 0,
});
s.addText("传统咨询 · 大健康平台 · HR SaaS", {
  x: 8.55, y: 6.54, w: 3.85, h: 0.46,
  fontFace: HF, color: C.WHITE, fontSize: 13, bold: true, margin: 0, valign: "middle",
});

// ---------- 20 结尾 ----------
s = p.addSlide();
L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: -2.1, y: -2.3, w: 4.4, h: 4.4, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: -2.1, w: 4.2, h: 4.2, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.5, y: 5.5, w: 3.2, h: 3.2, fill: { color: C.FOREST3 } });
s.addImage({ path: IMG + "icon.png", x: 0.95, y: 1.2, w: 0.72, h: 0.72 });
s.addText("MindBridge AI  +  疗愈轨道", {
  x: 1.85, y: 1.33, w: 9.5, h: 0.46,
  fontFace: HF, color: C.AMBERL, fontSize: 18, bold: true, margin: 0, valign: "middle",
});
s.addText("让每一个员工都被听见\n让每一份压力都有出口", {
  x: 0.95, y: 2.25, w: 11.4, h: 1.55,
  fontFace: HF, color: C.WHITE, fontSize: 36, bold: true, margin: 0,
});
L.card(p, s, 0.95, 4.15, 11.4, 1.4, C.WHITE);
s.addText("“我们不是在做一个心理产品，\n我们是在重建人与组织之间的信任。”", {
  x: 1.25, y: 4.15, w: 10.8, h: 1.4,
  fontFace: HF, color: C.FOREST, fontSize: 20, margin: 0, valign: "middle",
});
s.addText("项目负责人    ·    电话    ·    邮箱", {
  x: 0.95, y: 5.85, w: 11.4, h: 0.42,
  align: "center", fontFace: HF, color: C.CREAMTXT, fontSize: 16, margin: 0,
});

p.writeFile({ fileName: OUT }).then((f) => console.log("saved", f));
