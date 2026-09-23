// MindBridge · 完整版后8页（13-20 独立版） · 温暖疗愈风格（lib.js + helpers.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_后8页_13至20页_8页.pptx";
const IMG = __dirname + "/../素材/";
let s;

function darkBand(s, x, y, w, h, title, body, opt = {}) {
  L.card(p, s, x, y, w, h, C.FOREST, { shadow: sh() });
  if (title) s.addText(title, { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
  s.addText(body, { x: x + 0.3, y: title ? y + 0.45 : y, w: w - 0.6, h: title ? h - 0.55 : h, fontFace: HF, color: C.WHITE, fontSize: opt.fs || 15, bold: true, valign: "middle", align: opt.align || "left", lineSpacingMultiple: 1.25 });
}

// ---------- S13 · 一行业，一方案 ----------
s = page("PART 03 · INDUSTRY FIT", "一行业，一方案");
lead(s, "企业现有数据与员工真实倾诉共同定位行业痛点", 1.7, 0.4);
flow(s, 0.8, 2.15, 11.75, ["HR 数据 + AI 试运行", "定位痛点", "匹配模块", "一行业一方案"], C.FOREST);
label(s, 0.8, 2.85, 6, "制造业示例推演");
[
  ["HR 数据（示例）", "离职率上升，病假率偏高", C.MOSS],
  ["AI 树洞（示例）", "轮班疲劳约 30%+，安全压力约 20%+，团队沟通约 15%+", C.AMBER],
  ["定位痛点", "身体疲劳 + 人际孤独", C.FOREST],
].forEach((c, i) => {
  const y = 3.25 + i * 1.0, x = 0.8, w = 7.3, h = 0.9;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w: 1.9, h, rectRadius: 0.12, fill: { color: c[2] } });
  s.addShape(p.ShapeType.rect, { x: x + 1.6, y, w: 0.3, h, fill: { color: c[2] } });
  s.addText(c[0], { x, y, w: 1.9, h, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true, lineSpacingMultiple: 1.1 });
  s.addText(c[1], { x: x + 2.15, y, w: w - 2.4, h, fontFace: HF, color: C.INK, fontSize: i === 1 ? 11.5 : 12.5, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });
});
L.card(p, s, 8.4, 3.25, 4.15, 2.9, C.FOREST, { shadow: sh() });
s.addText("匹配模块", { x: 8.7, y: 3.4, w: 3.6, h: 0.35, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
[["沙盘疗愈", "团队共创"], ["解压拳击", "躯体释放"]].forEach((m, i) => {
  const y = 3.85 + i * 1.1;
  L.card(p, s, 8.7, y, 3.55, 0.95, C.FOREST3);
  s.addText(m[0], { x: 8.95, y: y + 0.1, w: 3.1, h: 0.4, fontFace: HF, color: C.WHITE, fontSize: 16, bold: true, valign: "middle" });
  s.addText(m[1], { x: 8.95, y: y + 0.5, w: 3.1, h: 0.35, fontFace: HF, color: C.MOSSL, fontSize: 12, valign: "middle" });
});
darkBand(s, 0.8, 6.3, 11.75, 0.6, "", "通过数据识别痛点，减少对管理层访谈的依赖。", { fs: 14, align: "center" });

// ---------- S14 · 疗愈工具箱 ----------
s = page("PART 03 · TOOLBOX", "疗愈工具箱");
lead(s, "传统 EAP 只有心理咨询一把锤子。MindBridge 基于行业痛点，为每个行业匹配经过验证的高表现疗愈工具。", 1.7, 0.6);
L.table(p, s, { x: 0.8, y: 2.42, w: 11.75, colFr: [2.1, 4.4, 5.25], headers: ["行业", "核心痛点", "推荐疗愈工具"],
  rows: [
    ["互联网 / IT", "赶工焦虑、注意力碎片化", "身份重塑叙事疗愈小组"],
    ["金融 / 银行", "业绩高压、意义感丧失", "跨团队疗愈小组"],
    ["客服 / 服务业", "情绪劳动、情感压抑", "「心流插花」艺术疗愈"],
    ["教育", "多重角色耗竭、情绪麻木", "奥尔夫音乐疗愈"],
    ["医护 / 护理", "共情疲劳、生死无意义感", "巴林特小组"],
    ["制造业 / 汽车", "人际孤独、意义感丧失", "沙盘疗愈 · 心声共鸣"],
    ["科技企业", "技术迭代焦虑、远程孤岛", "身份重塑叙事疗愈小组"],
    ["公益组织", "共情疲劳、使命感过载", "巴林特小组"],
  ], rowH: 0.44, headH: 0.5, fs: 11.5, headFs: 12.5 });
darkBand(s, 0.8, 6.5, 11.75, 0.6, "", "不是我们凭空选工具，是行业痛点决定了哪个工具更适配。", { fs: 13.5, align: "center" });

// ---------- S15 · 越用越准：三层数据 ----------
s = page("PART 03 · DATA FLYWHEEL", "越用越准：三层数据");
lead(s, "HR 已有数据 + AI 树洞数据 + 跨企业行业常模 = 越用越准", 1.7, 0.4);
[
  ["第一层 · HR 已有数据【企业提供】", "离职率、病假率、离职面谈记录，脱敏后由企业提供。", C.MOSS],
  ["第二层 · AI 树洞试运行【上线后实测】", "2–4 周采集本企业员工真实倾诉，生成情绪标签分布图。", C.AMBER],
  ["第三层 · 跨企业行业常模【持续积累】", "随着服务企业增加，逐步积累行业常模数据。", C.FOREST],
].forEach((c, i) => {
  const y = 2.2 + i * 1.18, x = 0.8, w = 4.6, h = 1.05;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.15, w: 0.1, h: h - 0.3, fill: { color: c[2] } });
  s.addText(c[0], { x: x + 0.3, y: y + 0.08, w: w - 0.5, h: 0.36, fontFace: HF, color: C.FOREST, fontSize: 12, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.3, y: y + 0.46, w: w - 0.5, h: 0.55, fontFace: HF, color: C.INK, fontSize: 10, valign: "top", lineSpacingMultiple: 1.2 });
});
L.card(p, s, 0.8, 5.8, 4.6, 1.0, C.MOSST);
s.addText("当前行业常模数据为模型测算，用于展示适配逻辑；实际数据随服务企业上线后持续更新。", { x: 1.0, y: 5.8, w: 4.2, h: 1.0, fontFace: HF, color: C.FOREST, fontSize: 10, valign: "middle", lineSpacingMultiple: 1.25 });
L.table(p, s, { x: 5.7, y: 2.2, w: 6.85, colFr: [2.0, 1.4, 1.6, 1.6], headers: ["行业", "企业样本", "月活区间", "完成率区间"],
  rows: [
    ["互联网 / IT", "约 18 家", "25%–35%", "60%–70%"], ["公益组织", "约 7 家", "35%–45%", "70%–75%"],
    ["制造业", "约 14 家", "20%–30%", "60%–70%"], ["医护 / 护理", "约 9 家", "30%–40%", "65%–75%"],
    ["客服 / 服务业", "约 15 家", "30%–40%", "65%–70%"], ["教育", "约 11 家", "25%–35%", "65%–70%"],
    ["科技企业", "约 10 家", "30%–35%", "65%–75%"], ["金融 / 银行", "约 12 家", "25%–30%", "60%–65%"],
  ], rowH: 0.44, headH: 0.5, fs: 11, headFs: 11.5 });
s.addText("8 行业适配框架（模型测算，非真实企业实测）", { x: 5.7, y: 6.3, w: 6.85, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 9.5, italic: true, align: "right" });

// ---------- S16 · 模块化采购 ----------
s = page("PART 04 · BUSINESS MODEL", "模块化采购，灵活适配");
L.table(p, s, { x: 0.8, y: 1.9, w: 7.6, colFr: [1.3, 4.2, 1.6], headers: ["版本", "内容", "年费"],
  rows: [
    ["旗舰版", "进阶版 + 大使培养 + 年度白皮书", "80–120 万"],
    ["进阶版", "标准版 + 一对一疏导 + 行业定制", "50–80 万"],
    ["标准版", "基础版 + 季度团体工作坊", "30–50 万"],
    ["基础版", "AI 树洞 + 数字内容 + 年度测评", "15–25 万"],
  ], rowH: 0.58, fs: 12.5, starCol: 2 });
stat(s, 8.7, 1.9, 3.85, 1.35, "1200–1800 元", "人均 / 年");
stat(s, 8.7, 3.35, 3.85, 1.42, "↓ 30%–40%", "较传统 EAP（2000–3000 元 / 人）", { dark: false });
L.card(p, s, 0.8, 4.95, 7.6, 0.95, C.CARD, { shadow: sh() });
s.addText("收费方式", { x: 1.05, y: 5.0, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
s.addText("按人头年费 + 项目制（5–15 万 / 次）", { x: 1.05, y: 5.32, w: 7.1, h: 0.55, fontFace: HF, color: C.FOREST, fontSize: 16.5, bold: true, valign: "middle" });
darkBand(s, 8.7, 4.95, 3.85, 0.95, "", "以 15 万基础版降低试错门槛\n决策门槛低", { fs: 13, align: "center" });
L.card(p, s, 0.8, 6.08, 11.75, 0.7, C.MOSST);
s.addText("效果对赌：尾款 30% 挂钩 PSI，未达标按比例退款或免费延长服务期 —— 用对赌代替自证，零风险决策", { x: 1.0, y: 6.08, w: 11.35, h: 0.7, fontFace: HF, color: C.FOREST, fontSize: 11.5, bold: true, valign: "middle", align: "center", lineSpacingMultiple: 1.2 });

// ---------- S17 · 53亿市场 ----------
s = page("PART 04 · MARKET", "53 亿市场，头部客户已进场");
stat(s, 0.8, 1.9, 3.7, 1.6, "53 亿", "中国 EAP 市场 · 2024 年【行业数据】");
stat(s, 4.7, 1.9, 3.7, 1.6, "34.6%", "年增长率【行业数据】", { dark: false });
stat(s, 8.6, 1.9, 3.95, 1.6, "84.9 亿美元", "全球 EAP 市场 · 2032 年【行业预测】", { dark: false });
L.card(p, s, 0.8, 3.65, 3.7, 1.55, C.CARD, { shadow: sh() });
s.addText("≥70%", { x: 1.05, y: 3.75, w: 3.2, h: 0.7, fontFace: HF, color: C.AMBER, fontSize: 30, bold: true, valign: "middle" });
s.addText("续约率目标（传统 50%–60%）【目标值】", { x: 1.05, y: 4.45, w: 3.2, h: 0.65, fontFace: HF, color: C.MUTE, fontSize: 11, valign: "top", lineSpacingMultiple: 1.2 });
L.card(p, s, 4.7, 3.65, 7.85, 1.55, C.CARD, { shadow: sh() });
s.addText("增长飞轮", { x: 4.95, y: 3.75, w: 3, h: 0.35, fontFace: HF, color: C.FOREST, fontSize: 13, bold: true });
flow(s, 4.95, 4.2, 7.35, ["标杆案例", "行业白皮书", "同行业裂变", "获客成本递减"], C.FOREST);
s.addText("↺ 数据资产强化 → 回到标杆案例", { x: 4.95, y: 4.8, w: 7.35, h: 0.35, align: "center", fontFace: HF, color: C.MUTE, fontSize: 11, italic: true });
L.card(p, s, 0.8, 5.35, 11.75, 1.3, C.FOREST, { shadow: sh() });
s.addText("已公开采购客户", { x: 1.1, y: 5.35, w: 2.6, h: 1.3, fontFace: HF, color: C.AMBERL, fontSize: 13, bold: true, valign: "middle" });
["南网数字集团", "海南电网", "中国电信"].forEach((t, i) => {
  const x = 3.9 + i * 2.85;
  s.addShape(p.ShapeType.roundRect, { x, y: 5.7, w: 2.6, h: 0.6, rectRadius: 0.3, fill: { color: C.FOREST3 } });
  s.addText(t, { x, y: 5.7, w: 2.6, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });
});

// ---------- S18 · 为什么我们能做成 ----------
s = page("PART 04 · WHY US", "为什么我们能做成");
[
  ["01", "方向判断", "EAP 市场 53 亿，年增 34.6%。传统 EAP 失效，AI + 疗愈是正确方向。", C.MOSS],
  ["02", "产品完整度", "双轨模型、AI 树洞、三盏灯、行业适配、效果对赌 —— 产品逻辑完整，不是单点概念。", C.AMBER],
  ["03", "团队执行力", "跨学科团队：技术 + 疗愈 + 运营。项目总监 5 年 + EAP 经验，疗愈师持 IAOTH 认证。", C.FOREST],
  ["04", "早期验证", "已设计 8 个行业方案，具备服务多家企业的能力。行业常模数据随服务企业增加持续积累。", C.AMBER],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 1.9 + Math.floor(i / 2) * 2.5, 5.7, 2.3, c[0], c[1], c[2], { tfs: 17, fs: 12.5, accent: c[3] }));

// ---------- S19 · ROI与增长 ----------
s = page("PART 04 · ROI & GROWTH", "ROI 与增长");
L.table(p, s, { x: 0.8, y: 1.9, w: 4.6, colFr: [2.2, 1.8], headers: ["500 人企业 / 年", "数值"],
  rows: [["年度投入", "63–88 万"], ["年度收益测算", "约 600–650 万"], ["ROI 测算", "约 7–10 倍"], ["投资回收期测算", "约 1–1.5 个月"]],
  rowH: 0.48, headH: 0.5, fs: 12, starCol: 1 });
L.table(p, s, { x: 5.65, y: 1.9, w: 6.9, colFr: [1.55, 1.15, 1.55, 1.15, 1.55, 1.15], headers: ["收益构成", "万元", "收益构成", "万元", "收益构成", "万元"],
  rows: [["离职成本节约", "169", "缺勤损失降低", "90", "在岗产出提升", "375"], ["管理收益", "25–33", "品牌收益", "35–88", "ESG 收益", "85–280"]],
  rowH: 0.62, headH: 0.5, fs: 9, headFs: 9 });
s.addText("测算口径：人均 1200–1800 元 / 年；离职率降 30%、缺勤降 20%、专注力恢复 5% —— 均为模型目标值，非实测", { x: 5.65, y: 3.72, w: 6.9, h: 0.55, fontFace: HF, color: C.MUTE, fontSize: 9.5, italic: true, valign: "top", lineSpacingMultiple: 1.2 });
label(s, 0.8, 4.35, 5, "增长路径");
flow(s, 0.8, 4.7, 11.75, ["3–5 年覆盖 1000 家企业", "营收 3–5 亿", "净利率 20%–30%"], C.FOREST);
L.card(p, s, 0.8, 5.4, 7.0, 1.25, C.CARD, { shadow: sh() });
s.addText("融资用途", { x: 1.05, y: 5.45, w: 3, h: 0.32, fontFace: HF, color: C.AMBER, fontSize: 12, bold: true });
["行业拓展", "AI 模型迭代", "标杆案例规模化"].forEach((t, i) => {
  const x = 1.05 + i * 2.2;
  s.addShape(p.ShapeType.roundRect, { x, y: 5.85, w: 2.05, h: 0.6, rectRadius: 0.1, fill: { color: C.MOSST } });
  s.addText(t, { x, y: 5.85, w: 2.05, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 12.5, bold: true });
});
L.card(p, s, 8.05, 5.4, 4.5, 1.25, C.FOREST, { shadow: sh() });
s.addText("退出逻辑", { x: 8.3, y: 5.45, w: 3, h: 0.32, fontFace: HF, color: C.AMBERL, fontSize: 12, bold: true });
s.addText("传统咨询 / 大健康平台 / HR SaaS", { x: 8.3, y: 5.85, w: 4.0, h: 0.6, fontFace: HF, color: C.WHITE, fontSize: 13.5, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });

// ---------- S20 · 结尾 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: -1.5, y: -1.6, w: 5, h: 5, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 4.8, w: 4.2, h: 4.2, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 1.1, w: 1.0, h: 1.0 });
s.addText("MindBridge AI + 疗愈轨道", { x: 1.0, y: 2.25, w: 9, h: 0.5, fontFace: HF, color: C.AMBERL, fontSize: 16, charSpacing: 2 });
s.addText("让每一个员工都被听见\n让每一份压力都有出口", { x: 1.0, y: 2.8, w: 10, h: 1.7, fontFace: HF, color: C.WHITE, fontSize: 32, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });
L.card(p, s, 1.0, 4.75, 8.6, 1.1, C.FOREST3);
s.addText("“我们不是在做一个心理产品，我们是在重建人与组织之间的信任。”", { x: 1.3, y: 4.75, w: 8.0, h: 1.1, fontFace: HF, color: C.WHITE, fontSize: 15, bold: true, valign: "middle", lineSpacingMultiple: 1.25 });
s.addText("项目负责人 · 电话 · 邮箱", { x: 1.0, y: 6.3, w: 8, h: 0.5, fontFace: HF, color: C.CREAMTXT, fontSize: 14 });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
