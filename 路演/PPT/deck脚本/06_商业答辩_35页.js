// MindBridge 决赛商业答辩方案 · 35 页 · 温暖疗愈风格（lib.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_商业答辩方案_35页.pptx";
const IMG = __dirname + "/../素材/";

// ---------- helpers ----------
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
let s;

// ---------- P1 封面 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.5, y: 4.5, w: 4.4, h: 4.4, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: -1.4, y: 5.3, w: 3.8, h: 3.8, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 0.95, w: 0.9, h: 0.9 });
s.addText("企业员工心理安全与成长共生系统 · 商业答辩方案", { x: 1.0, y: 2.0, w: 9, h: 0.5, fontFace: HF, color: C.AMBERL, fontSize: 16, charSpacing: 2 });
s.addText([
  { text: "MindBridge AI", options: { fontSize: 56, bold: true, color: C.WHITE, breakLine: true } },
  { text: "+ 疗愈轨道", options: { fontSize: 38, bold: true, color: C.MOSSL } },
], { x: 1.0, y: 2.6, w: 11, h: 1.9, fontFace: HF });
s.addText("AI 负责广度 · 疗愈轨道负责深度", { x: 1.0, y: 4.6, w: 10, h: 0.6, fontFace: HF, color: C.CREAMTXT, fontSize: 22 });
L.card(p, s, 1.0, 5.55, 7.6, 0.9, C.WHITE);
s.addText("AI 预警与推荐 + 疗愈师深度陪伴 —— 重塑企业 EAP 服务范式", { x: 1.2, y: 5.55, w: 7.2, h: 0.9, fontFace: HF, color: C.FOREST, fontSize: 14, valign: "middle" });
s.addText("2026 企业疗愈力与 EAP 创新挑战赛 · 决赛路演", { x: 1.0, y: 6.7, w: 9, h: 0.4, fontFace: HF, color: C.MOSSL, fontSize: 12.5 });

// ---------- P2 目录 ----------
s = page("CONTENTS", "汇报目录");
lead(s, "MindBridge AI 企业员工心理安全与成长共生系统全案汇报", 1.75, 0.45);
[
  ["01", "市场洞察与需求分析", "项目概述、企业痛点分析、目标设定与底层理论依据"],
  ["02", "核心产品与创新设计", "双轨模型、AI 树洞引擎、三级干预体系与数据安全机制"],
  ["03", "落地实施与价值评估", "12 个月实施路径、企业应用场景与五维度 ROI 测算"],
  ["04", "商业模式与竞争壁垒", "模块化采购策略、SDGs 与 ESG 价值及数据飞轮效应"],
].forEach((c, i) => {
  const x = 0.8 + (i % 2) * 6.05, y = 2.4 + Math.floor(i / 2) * 2.2;
  L.card(p, s, x, y, 5.7, 1.95, i % 3 === 0 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i % 3 === 0;
  s.addText(c[0], { x: x + 0.35, y: y + 0.25, w: 1.4, h: 0.8, fontFace: HF, color: dark ? C.AMBERL : C.AMBER, fontSize: 34, bold: true });
  s.addText(c[1], { x: x + 1.7, y: y + 0.3, w: 3.8, h: 0.6, fontFace: HF, color: dark ? C.WHITE : C.FOREST, fontSize: 19, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 1.7, y: y + 0.95, w: 3.8, h: 0.8, fontFace: HF, color: dark ? C.CREAMTXT : C.MUTE, fontSize: 12, valign: "top", lineSpacingMultiple: 1.2 });
});

// ---------- P3 项目定位 ----------
s = page("CORE INNOVATION", "项目定位与核心创新点");
lead(s, "MindBridge 创造性提出「AI 预警与推荐 + 疗愈师深度陪伴」的双轨模型，重点覆盖互联网、金融、医护等八大高内耗行业，在识别、预警、介入、反馈四个环节形成完整数据闭环，彻底重塑企业 EAP 服务范式。");
[
  ["01", "双轨协同共生", "AI 负责广度覆盖与主动预警，疗愈师负责深度转化与长期陪伴，突破单轨模式的人力瓶颈与情感天花板。"],
  ["02", "AI 树洞引擎", "打造去标识化匿名倾诉通道，三级预警区分个人与组织两条链路，实现个人隐私保护与组织趋势洞察的双赢。"],
  ["03", "多维疗愈融合", "系统整合正念、艺术、音乐、叙事、沙盘、巴林特小组六种方式，精准匹配不同行业与岗位的差异化痛点。"],
  ["04", "行业精准对标", "摒弃通用方案，通过「HR 已有数据 + AI 树洞试运行 2–4 周」完成痛点定位，实现「一行业一方案」的精准滴灌。"],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 2.55 + Math.floor(i / 2) * 2.1, 5.7, 1.9, c[0], c[1], c[2]));
L.foot(p, s, "MindBridge · 科技与人文关怀融合的企业 EAP 服务");

// ---------- P4 行业背景 ----------
s = page("INDUSTRY INSIGHT", "行业背景与职场心理现状");
lead(s, "员工心理健康已成为全球性职场挑战，超半数职场人受焦虑与情绪低落困扰。尽管近九成企业已部署 EAP 服务，但传统模式因参与率极低而陷入失效困境。在市场刚需爆发与数字化技术成熟的双重驱动下，EAP 行业正迎来从「被动人工咨询」向「主动 AI 数字干预」的范式转移窗口期。", 1.75, 0.95);
[
  ["54.9%", "职场心理困境加剧", "2025 年调研显示职场人满意度仅 2.71 分，54.9% 受焦虑困扰，49.7% 情绪低落，国企青年倦怠检出率达 32.1%"],
  ["<5%", "传统 EAP 陷入失效泥潭", "88% 的企业已提供 EAP 服务，但员工参与率和使用率普遍低于 5%，沦为形式主义的「橱窗工程」"],
  ["560.1亿", "数字化转型拐点已至", "数字化心理健康服务年度采纳率增长超 35%，全球 EAP 市场预计 2031 年将达 560.1 亿元，AI 技术重塑行业格局"],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.9, w = 3.8, h = 3.7;
  L.card(p, s, x, y, w, h, i === 1 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i === 1;
  s.addText(c[0], { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: 0.9, fontFace: HF, color: dark ? C.AMBERL : C.AMBER, fontSize: 38, bold: true });
  s.addText(c[1], { x: x + 0.3, y: y + 1.25, w: w - 0.6, h: 0.5, fontFace: HF, color: dark ? C.WHITE : C.FOREST, fontSize: 16, bold: true });
  s.addText(c[2], { x: x + 0.3, y: y + 1.85, w: w - 0.6, h: 1.7, fontFace: HF, color: dark ? C.CREAMTXT : C.INK, fontSize: 12, valign: "top", lineSpacingMultiple: 1.25 });
});
L.foot(p, s, "职场人士压力与焦虑数据分析 · 2025 年调研数据");

// ---------- P5 八大行业痛点 ----------
s = page("INDUSTRY ANALYSIS", "八大高内耗行业核心痛点分析");
lead(s, "不同行业的心理内耗表现存在本质差异：互联网/IT 受制于注意力切割与替代恐慌，金融/银行承压于极致 KPI，医护/教育深陷共情疲劳与角色耗竭，制造业/科技企业则面临人际孤独与技术迭代焦虑。通用型 EAP 方案注定失效，精准对标成为破局唯一路径。", 1.7, 0.75);
L.table(p, s, { x: 0.8, y: 2.5, w: 11.75, colFr: [2.0, 7.4, 2.2], headers: ["目标行业", "核心内耗表现与数据支撑", "采购优先级"],
  rows: [
    ["互联网 / IT", "65.4% 背负「线上秒回」负担；35+ 群体深陷被替代恐慌与赶工焦虑", "★★★★★"],
    ["金融 / 银行", "42.9% 面临业绩高压（全行业第一），KPI 不可控导致意义感丧失", "★★★★★"],
    ["医护 / 护理", "抑郁率高达 11%；长期面对生死导致严重的共情疲劳与情感透支", "★★★★★"],
    ["教育行业", "职业倦怠检出率 >30%；家校沟通与教学双重角色导致严重耗竭", "★★★★☆"],
    ["科技企业", "技术迭代焦虑引发 55.7% 的行业倦怠感；远程办公加剧社交隔离", "★★★★★"],
    ["客服 / 服务业", "女性抑郁率 15%（全行业最高）；长期强撑笑脸导致情绪劳动疲劳", "★★★☆☆"],
    ["制造业 / 汽车", "月均加班 140h；产线重复劳动导致人际孤独、躯体化与安全重压", "★★★☆☆"],
    ["公益组织", "抑郁倾向高达 63.86%；使命感过载导致严重的共情疲劳与资源焦虑", "★★★★☆"],
  ], rowH: 0.47, headH: 0.5, fs: 12, starCol: 2 });
L.foot(p, s, "各行业痛点高度分化，传统「一刀切」EAP 方案无法触达深层需求，精准定制成为刚需");

// ---------- P6 传统 EAP 痛点 ----------
s = page("PAIN POINTS", "传统 EAP 现状与员工 / 管理痛点");
lead(s, "传统 EAP 模式深陷「员工不敢用、企业看不清」的双重死穴。员工端受制于极高的心理防御与操作门槛，参与率常年低于 5%；管理端则因缺乏量化数据与过程追踪，陷入「只知人次、不见效果」的黑盒困境。供需两端的严重错位，为数字化、低门槛、可量化的新型 EAP 留下了巨大的市场空白。", 1.7, 0.95);
[
  ["员工端：三道门槛阻断求助", [
    ["心理门槛极高", "传统模式要求员工主动承认「我有心理问题」，严重的求助羞耻与病耻感让绝大多数人望而却步"],
    ["操作与价值门槛", "需单独登录陌生平台注册预约，且缺乏即时获得感，导致员工产生「用了也没用」的消极预期"],
  ], "<5%", "传统 EAP 员工参与率"],
  ["管理端：黑盒效应导致预算流失", [
    ["效果无法量化", "年底仅能提供「咨询人次」等表层数据，无法证明心理健康改善与组织绩效提升的因果关系"],
    ["被动响应无预警", "HR 只能等员工崩溃或离职后才被动介入，缺乏对团队情绪趋势的提前感知与科学干预抓手"],
  ], "0", "可量化的效果归因数据"],
].forEach((col, i) => {
  const x = 0.8 + i * 6.05, y = 2.85, w = 5.7;
  label(s, x, y, w, col[0], 15);
  col[1].forEach((it, j) => {
    const cy = y + 0.5 + j * 1.35;
    L.card(p, s, x, cy, w, 1.2, C.CARD, { shadow: sh() });
    circleNum(s, x + 0.25, cy + 0.2, "0" + (j + 1), i === 0 ? C.MOSS : C.AMBER, 0.42, 11);
    s.addText(it[0], { x: x + 0.8, y: cy + 0.15, w: w - 1.0, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 13.5, bold: true, valign: "middle" });
    s.addText(it[1], { x: x + 0.8, y: cy + 0.58, w: w - 1.0, h: 0.6, fontFace: HF, color: C.INK, fontSize: 11, valign: "top", lineSpacingMultiple: 1.15 });
  });
  const sy = y + 0.5 + 2 * 1.35;
  L.card(p, s, x, sy, w, 1.0, C.FOREST, { shadow: sh() });
  s.addText(col[2], { x: x + 0.3, y: sy, w: 1.8, h: 1.0, fontFace: HF, color: C.AMBERL, fontSize: 30, bold: true, valign: "middle" });
  s.addText(col[3], { x: x + 2.2, y: sy, w: w - 2.4, h: 1.0, fontFace: HF, color: C.CREAMTXT, fontSize: 13, valign: "middle" });
});

// ---------- P7 三层目标 & 数据采集 ----------
s = page("DATA ARCHITECTURE · 数据采集架构", "三层目标体系与无感数据采集机制");
lead(s, "MindBridge 构建了从员工心理改善到组织 ESG 价值创造的三层目标体系。依托 AI 树洞引擎，将数据采集无缝嵌入员工日常倾诉与活动反馈场景中，实现 L1 至 L4 数据的自动化归集——既保证评估的科学性与连续性，又彻底免除 HR 的额外统计负担。", 1.7, 0.75);
label(s, 0.8, 2.55, 8, "AI 树洞无感数据采集与四级评估机制");
L.table(p, s, { x: 0.8, y: 2.95, w: 11.75, colFr: [1.5, 3.4, 1.9, 3.6], headers: ["数据层级", "采集方式与场景", "采集频次", "AI 自动产出成果"],
  rows: [
    ["L1 即时反馈", "活动后「情绪温度计」无感打分", "每场活动后", "即时情绪改善幅度与活动满意度"],
    ["L2 短期效果", "AI 自动简讯随访与行为追踪", "活动后第 3、7 天", "行为转化率与短期干预有效性分析"],
    ["L3 月度追踪", "精简版量表（PSI / PSS）弹窗推送", "每月 1 次", "个人情绪轨迹图与团队心理热力图"],
    ["L4 年度评估", "系统数据 + HR 匿名离职 / 病假数据", "年度", "年度效果白皮书与 ESG 披露数据包"],
  ], rowH: 0.72, fs: 12.5 });
L.foot(p, s, "AI 自动完成数据归集与报告生成，员工无需额外填答长问卷，HR 零额外统计工作量");

// ---------- P8 六类困扰 ----------
s = page("EVIDENCE-BASED INTERVENTION MATRIX", "通用企业心理困扰与理论精准匹配");
lead(s, "摒弃泛泛而谈的心理科普，针对职场最常见的六类心理困扰，精准匹配循证心理学理论，将抽象机制转化为员工可感知、易参与的具象化疗愈活动。", 1.7, 0.6);
L.table(p, s, { x: 0.8, y: 2.4, w: 11.75, colFr: [1.8, 6.0, 3.6], headers: ["心理困扰类型", "匹配核心理论与机制", "对应落地活动与工具"],
  rows: [
    ["焦虑紧张型", "正念减压：锚定当下打破自动应激；4-7-8 呼吸法直接调节自主神经系统", "「正念呼吸」工作坊、压力拆解四象限"],
    ["耗竭疲惫型", "身体觉知疗法：逐部位释放肌肉僵硬；心流理论：轻度创作重新激活内在动力", "「能量唤醒」工作坊、渐进式肌肉放松"],
    ["情绪劳动型", "表达性艺术疗愈：绕过语言防御让情绪流出；音乐疗愈：非语言载体直达深层情感", "「艺术疗愈」工作坊、情绪色彩联想"],
    ["孤独无意义型", "叙事疗愈：回溯高光时刻重构人生故事；积极心理学：训练大脑捕捉正面信号", "「叙事疗愈」深度小组、三件好事打卡"],
    ["躯体紧张型", "身体觉知疗法：将身体从应激拉回放松；情绪释放技术：将压抑愤怒转化为物理力量", "「身体觉知」工作坊、「拳力以赴」解压拳击"],
    ["混合型 / 预防型", "团体音乐 / 艺术疗愈：非语言层面重建同步体验；心理教育：降低病耻感提升求助意识", "心理嘉年华游园会、奥尔夫音乐合奏"],
  ], rowH: 0.7, fs: 11.5 });

// ---------- P9 行业理论匹配 3x3 ----------
s = page("THEORY-INDUSTRY MAPPING", "八大高内耗行业专属理论匹配逻辑");
lead(s, "摒弃「万金油」式心理干预，为每个行业精准锁定最具解释力与干预效力的核心理论——从正念减压到巴林特小组，从积极心理学到叙事沙盘，实现从「泛泛安抚」到「精准手术」的专业跃升。", 1.65, 0.6);
const groups = [
  ["高压与焦虑驱动型", C.MOSS, [
    ["互联网 / IT", "正念减压理论", "锚定呼吸让大脑从「灾难预演」回到当下，直接切断注意力碎片化引发的焦虑循环，帮助从业者建立稳定的内在锚点。"],
    ["金融 / 银行", "积极心理学", "当外部 KPI 不可控时，通过主动构建积极情绪实现不依赖环境改变的内在意义重构，在高压环境中保持职业效能感。"],
    ["科技企业", "认知行为与叙事疗愈", "识别「技术迭代→我被淘汰」的自动化思维链条，重构职业身份认同，将成长叙事转向持续学习者的主动建构。"],
  ]],
  ["情感透支与耗竭型", C.AMBER, [
    ["医护 / 护理", "巴林特小组理论", "在不评判、不打断的安全边界内，让付出共情疲劳的医护被同行倾听与托住，通过小组动力实现情感净化与意义重塑。"],
    ["客服 / 服务业", "表达性艺术疗愈", "通过非语言媒介解决长期强抑笑脸导致的情感透支与抑郁，绘画、音乐等艺术形式成为情绪的安全出口。"],
    ["公益组织", "艺术疗愈与巴林特小组", "绕过语言防御减轻使命感过载带来的情感耗竭，整合个体表达与群体共鸣的双重疗愈路径。"],
  ]],
  ["角色冲突与孤独型", C.FOREST, [
    ["教育行业", "音乐疗愈理论", "不从道理层面进入，直接从情绪层面缓解多重角色耗竭带来的麻木，旋律与节奏成为唤醒情感共鸣、重建连接的桥梁。"],
    ["制造业 / 汽车", "叙事与沙盘疗愈", "不依赖语言表达，通过沙具呈现内心图景，重构职业身份并打破产线人际孤独，帮助工人重新讲述自我故事。"],
    ["法律 / 咨询", "存在主义心理疗法", "直面职业角色与真实自我的张力，在价值冲突中寻找意义锚点，整合理性分析与情感体验的双重维度。"],
  ]],
];
groups.forEach((g, gi) => {
  const x = 0.8 + gi * 3.98, w = 3.8;
  s.addShape(p.ShapeType.roundRect, { x, y: 2.35, w, h: 0.42, rectRadius: 0.21, fill: { color: g[1] } });
  s.addText(g[0], { x, y: 2.35, w, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
  g[2].forEach((c, i) => {
    const y = 2.92 + i * 1.38;
    L.card(p, s, x, y, w, 1.26, C.CARD, { shadow: sh() });
    s.addText([
      { text: c[0] + " · ", options: { color: C.FOREST, bold: true } },
      { text: c[1], options: { color: g[1], bold: true } },
    ], { x: x + 0.22, y: y + 0.08, w: w - 0.44, h: 0.36, fontFace: HF, fontSize: 12.5, valign: "middle" });
    s.addText(c[2], { x: x + 0.22, y: y + 0.44, w: w - 0.44, h: 0.8, fontFace: HF, color: C.INK, fontSize: 9.5, valign: "top", lineSpacingMultiple: 1.15 });
  });
});

// ---------- P10 双轨模型 ----------
s = page("CORE MODEL", "双轨模型创新：AI 负责广度，疗愈负责深度");
lead(s, "MindBridge 从底层逻辑上构建「AI + 疗愈师」双轨并行模型，彻底击穿传统单轨模式的单点局限。AI 轨道以极低边际成本实现全员 7×24 小时情绪感知与资源匹配，疗愈轨道聚焦高价值的情感转化与危机干预。两者通过「识别－预警－介入－反馈」机制形成完整数据闭环，实现技术效率与人文关怀的平衡。", 1.7, 0.95);
[
  ["Track 01", "AI 轨道", "广度覆盖", C.MOSS, ["角色定位为「倾听者与匹配师」，提供 24 小时在线匿名情绪感知、智能预警与个性化疗愈资源推荐", "突破人力瓶颈，以极低的边际成本实现全员心理健康状态的持续监测，将服务门槛降至零"]],
  ["Track 02", "疗愈轨道", "深度转化", C.FOREST, ["角色定位为「转化师与陪伴者」，提供一对一深度疏导、行业定制团体工作坊与长期成长陪伴", "处理 AI 无法解决的深层情绪转化与复杂心理危机，提供真实的人际联结与专业的情感托底"]],
  ["Synergy", "双轨协同闭环", "数据驱动", C.AMBER, ["AI 识别的预警信号无缝流转至疗愈师进行专业复核，疗愈结果再反馈给 AI 优化推荐算法", "实现从「被动等待求助」到「主动识别支持」的范式跃迁，确保每一次干预都精准且有效"]],
].forEach((t, i) => {
  const x = 0.8 + i * 3.98, y = 2.85, w = 3.8, h = 3.95;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color: t[3] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color: t[3] } });
  s.addText(t[0], { x: x + 0.3, y: y + 0.08, w: 2.5, h: 0.32, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(t[1], { x: x + 0.3, y: y + 0.38, w: 2.3, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 20, bold: true, valign: "middle" });
  s.addText(t[2], { x: x + 2.3, y: y + 0.38, w: w - 2.6, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: 13, valign: "middle", align: "right" });
  t[4].forEach((pt, j) => {
    const py = y + 1.2 + j * 1.35;
    circleNum(s, x + 0.28, py + 0.02, "0" + (j + 1), t[3], 0.4, 11);
    s.addText(pt, { x: x + 0.8, y: py, w: w - 1.05, h: 1.25, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  });
});

// ---------- P11 AI 树洞引擎 ----------
s = page("CORE ARCHITECTURE", "AI 树洞引擎：去标识化设计与多维数据感知");
lead(s, "核心设计逻辑是「让倾诉本身不像是求助，而像是说话」。通过企业 IM 无感接入与去标识化匿名设计，彻底消除员工「被公司监控」的防备心理，在不侵犯隐私的前提下构建全景情绪画像。", 1.7, 0.6, 8.0);
[
  ["极简接入与身份隔离", "通过企业微信 / 钉钉一键进入，系统生成独立匿名服务 ID，真实企业身份与心理服务数据物理隔离，HR 无权反查。"],
  ["四类数据源协同感知", "整合员工主动表达、工作上下文（如待办截图）、经授权的非内容型工作节奏元数据及组织匿名指标。"],
  ["坚守隐私安全边界", "系统不会默认后台持续监听或分析员工私人通讯内容，所有数据获取均基于员工主动操作或显式授权。"],
  ["共情式对话降低门槛", "基于国内成熟大模型提供拟人化共情回应，让「有人听见」成为疗愈的第一步，将传统 EAP 的心理门槛降至零。"],
].forEach((c, i) => {
  const x = 0.8 + (i % 2) * 4.1, y = 2.5 + Math.floor(i / 2) * 2.05;
  dotCard(s, x, y, 3.9, 1.85, c[0], c[1], { tfs: 14, fs: 11.5 });
});
imgCard(s, "chat.jpg", 9.35, 1.85, 3.2, 4.85, { caption: "AI 树洞在企业 IM 中的无感接入与共情对话" });

// ---------- P12 三重能力 ----------
s = page("CORE CAPABILITIES", "AI 树洞三重能力与双轨数据隔离机制");
lead(s, "AI 树洞不仅是倾诉通道，更是智能预警与资源调度中枢。通过共情倾听承接情绪，通过三级关键词预警实现风险分层，通过智能匹配实现去医疗化的资源推送。其「双轨数据隔离」机制：个人风险信号仅在专业体系内流转，组织风险经匿名聚合后向 HR 输出趋势预警，彻底打消员工隐私顾虑。", 1.7, 0.95);
L.card(p, s, 0.8, 2.85, 5.7, 3.9, C.CARD, { shadow: sh() });
s.addText("能力一", { x: 1.1, y: 3.05, w: 2, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 12, bold: true, charSpacing: 2 });
s.addText("共情倾听与智能匹配", { x: 1.1, y: 3.35, w: 5.2, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
s.addText("以共情式回应承接情绪，让倾诉本身成为疗愈的第一步；根据情绪标签与岗位画像动态推荐资源，采用「去医疗化」表达降低防御心理。", { x: 1.1, y: 3.95, w: 5.1, h: 1.5, fontFace: HF, color: C.INK, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.25 });
flow(s, 1.1, 5.95, 5.1, ["共情回应", "情绪标签", "资源匹配"], C.MOSS);
L.card(p, s, 6.85, 2.85, 5.7, 3.9, C.CARD, { shadow: sh() });
s.addText("能力二 · 三", { x: 7.15, y: 3.05, w: 2.5, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 12, bold: true, charSpacing: 2 });
s.addText("三级预警与双轨隔离", { x: 7.15, y: 3.35, w: 5.2, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
s.addText([
  { text: "绿色 / 黄色风险仅向员工本人提供支持或建议人工服务，绝不向 HR 推送个人预警；红色极端风险由疗愈师按危机协议独立接管。", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "组织级趋势预警：系统将去标识化匿名状态进行聚合计算，向 HR 输出部门 / 团队异常趋势（如某业务线疲惫度增加），而非个人标签。" },
], { x: 7.15, y: 3.95, w: 5.1, h: 1.9, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
flow(s, 7.15, 5.95, 5.1, ["个人轨道隔离", "组织轨道匿名聚合"], C.FOREST);

// ---------- P13 红绿灯 ----------
s = page("MindBridge · 预警干预机制", "APP 端「红绿灯」三级预警与干预流转");
lead(s, "通过「绿、黄、红」三级可视化预警机制，将抽象的情绪状态转化为具象的干预策略。界面设计刻意留白，旨在降低用户的视觉压迫感与心理防御，让不同风险等级的员工都能在最适合的交互环境中获得支持。", 1.7, 0.6);
[
  ["绿色：日常倾诉与自助疗愈", "7BA05B", "员工表达「压力大、睡不着」等轻度困扰，系统自动推送正念音频与呼吸练习，轻推一把即可缓解日常焦虑。", "以大面积留白和柔和色调为主，展示「情绪温度计」与「每日打卡」，营造无压力、轻量化的日常陪伴感。", "自助疗愈 · 隐私保护 · 无感陪伴"],
  ["黄色：风险预警与人工介入", "E1943B", "识别到「快撑不住、想辞职」等中度风险，系统推送资源并建议连接人工服务，引起关注但不惊动 HR，保护隐私。", "增加温暖的橙黄色点缀，留白区域用于展示「疗愈师一键呼叫」与「匿名信箱」，体现专业支持的随时可达。", "人工介入 · 隐私优先 · 主动关怀"],
  ["红色：危机识别与紧急响应", "B5473A", "捕捉到极端词汇时立即进入危机识别流程，由专业疗愈师按正式危机协议接管处理，确保生命安全底线不被突破。", "采用克制的深色模式与红色警示，留白区域仅保留「紧急干预通道」与「直连热线」，体现高效、专业的危机兜底。", "危机响应 · 专业接管 · 生命至上"],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.45, w = 3.8, h = 4.35;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.7, rectRadius: 0.12, fill: { color: c[1] } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.4, w, h: 0.3, fill: { color: c[1] } });
  s.addText(c[0], { x: x + 0.25, y, w: w - 0.5, h: 0.7, fontFace: HF, color: C.WHITE, fontSize: 14.5, bold: true, valign: "middle" });
  s.addText("触发条件", { x: x + 0.25, y: y + 0.85, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
  s.addText(c[2], { x: x + 0.25, y: y + 1.15, w: w - 0.5, h: 1.15, fontFace: HF, color: C.INK, fontSize: 11, valign: "top", lineSpacingMultiple: 1.2 });
  s.addText("界面留白策略", { x: x + 0.25, y: y + 2.3, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11.5, bold: true });
  s.addText(c[3], { x: x + 0.25, y: y + 2.6, w: w - 0.5, h: 1.15, fontFace: HF, color: C.INK, fontSize: 11, valign: "top", lineSpacingMultiple: 1.2 });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.25, y: y + 3.75, w: w - 0.5, h: 0.42, rectRadius: 0.21, fill: { color: C.MOSST } });
  s.addText(c[4], { x: x + 0.25, y: y + 3.75, w: w - 0.5, h: 0.42, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 11, bold: true });
});

// ---------- P14 三级干预体系 ----------
s = page("INTERVENTION FRAMEWORK", "三级干预体系：精准分层与资源最优配置");
L.table(p, s, { x: 0.8, y: 1.9, w: 11.75, colFr: [1.7, 2.7, 3.9, 3.4], headers: ["干预层级", "干预对象与触发条件", "干预方式与实施主体", "数据流向与隐私控制"],
  rows: [
    ["一级：全员预防", "全体员工 / 日常状态", "AI 树洞 24h 倾诉、自助工具包、心理嘉年华（AI 系统 + 企业 HR）", "仅产出匿名聚合趋势，不涉及个人标识"],
    ["二级：专业支持", "主动求助或 AI 识别黄色风险员工", "疗愈师一对一疏导、行业定制团体工作坊（持证疗愈师团队）", "个人服务数据留在专业系统，绝不进入 HR 后台"],
    ["三级：危机处理", "AI 识别红色风险 + 疗愈师研判确认", "专业心理咨询转介、危机干预流程（疗愈师 + 精神科顾问）", "按正式危机协议执行，必要时启动紧急联系人机制"],
  ], rowH: 0.85, fs: 12 });
L.card(p, s, 0.8, 5.05, 11.75, 1.75, C.FOREST, { shadow: sh() });
s.addText("MindBridge 建立了分层分级、精准对标的三级干预机制，实现心理支持资源的最优配置。一级全员预防依托 AI 实现低成本广覆盖，二级专业支持聚焦中高风险个体的深度转化，三级危机处理构筑生命安全底线。各级干预的数据流向严格遵循隐私隔离原则，确保在提供无缝支持的同时，守住员工个人隐私与企业合规的双重底线。",
  { x: 1.1, y: 5.15, w: 11.15, h: 1.55, fontFace: HF, color: C.WHITE, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.25 });

// ---------- P15 行业精准对标 ----------
s = page("METHODOLOGY", "行业精准对标：数据驱动的痛点定位路径");
lead(s, "MindBridge 摒弃依赖管理层访谈的传统调研模式，融合 HR 客观组织数据与 AI 树洞主观情绪数据，在 2–4 周内精准锁定行业核心痛点并匹配专属疗愈模块，将项目启动周期从数月压缩至数周。", 1.7, 0.6);
[
  ["01", "HR 已有数据接入", "直接复用企业近一年离职率、病假率、离职面谈记录等脱敏数据，无需额外开会或增加管理层访谈负担"],
  ["02", "AI 树洞敏捷试运行", "部署 2–4 周采集首批员工真实倾诉内容，自动生成该行业的情绪标签分布图与部门压力热力图"],
  ["03", "双源数据合并出方案", "将组织层客观指标与个体层主观情绪交叉验证，快速匹配 1–2 种最适配的疗愈模块，直接落地执行"],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98;
  numCard(s, x, 2.5, 3.6, 2.35, c[0], c[1], c[2], { tfs: 14.5, fs: 11.5 });
  if (i < 2) s.addText("→", { x: x + 3.58, y: 3.3, w: 0.35, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.AMBER, fontSize: 22, bold: true });
});
L.card(p, s, 0.8, 5.1, 11.75, 1.55, C.FOREST, { shadow: sh() });
s.addText("04  核心逻辑优势", { x: 1.1, y: 5.25, w: 5, h: 0.4, fontFace: HF, color: C.AMBERL, fontSize: 14, bold: true });
s.addText("摆脱对单一专家经验的依赖，用「离职率数据 + AI 倾诉数据」双轨定位，确保痛点画像比传统访谈更真实、更敏锐", { x: 1.1, y: 5.65, w: 11.15, h: 0.9, fontFace: HF, color: C.WHITE, fontSize: 14, valign: "top", lineSpacingMultiple: 1.2 });
L.foot(p, s, "数据驱动的行业痛点定位与方案匹配过程");

// ---------- P16 八大行业方案总览 ----------
s = page("SOLUTION MATRIX", "八大行业精准匹配方案总览");
lead(s, "一行业一方案，精准匹配差异化痛点，形成可快速复制的标准化疗愈资产库", 1.7, 0.4);
L.table(p, s, { x: 0.8, y: 2.2, w: 11.75, colFr: [1.6, 3.2, 4.2, 2.9], headers: ["目标行业", "精准匹配疗愈方案", "核心疗愈目标转变", "关键落地环节"],
  rows: [
    ["互联网 / IT", "正念工作坊 + 叙事疗愈小组", "从「被时间追着跑」到掌控时间；从「被淘汰」到「曾创造过」", "压力四象限拆解；职业身份变迁图"],
    ["金融 / 银行", "积极心理培训 + 跨团队疗愈小组", "从「被 KPI 压垮」到重新掌控；从「独自硬扛」到被看见", "可控 / 不可控拆解；匿名心声共情"],
    ["客服 / 服务业", "心流插花 + 正念冥想 + 芳香疗愈", "从「付出情绪」到被滋养；建立情绪屏障", "花材选择专注当下；「情绪像云飘过」"],
    ["教育行业", "奥尔夫音乐疗愈 + ABC 理论工作坊", "从「被掏空」到「被音乐灌注」；重新解读事件", "简易乐器合奏；匿名痛点 ABC 重构"],
    ["医护 / 护理", "巴林特小组 + 困境盲盒团体", "从「被掏空」到「被同行托住」；共同面对生死困惑", "案例呈报多角色讨论；匿名集体讨论"],
    ["制造业 / 汽车", "沙盘疗愈 + 拳击课 + 心灵驿站", "从「我一个人」到「我们一起」；从压抑到释放", "团队沙盘共创；打击释放物理力量"],
    ["科技企业", "叙事疗愈 + 正念 + 跨团队疗愈", "从「被替代」到「适应变化」；打破远程孤岛", "职业身份重构；匿名心声 + 集体共情"],
    ["公益组织", "巴林特小组 + 艺术疗愈 + 嘉年华", "从「被掏空」到「被托住」；大家一起扛", "案例呈报讨论；情绪色彩联想"],
  ], rowH: 0.55, headH: 0.5, fs: 10.5, headFs: 12 });

// ---------- P17 六大模块 ----------
s = page("SYSTEMATIC INTEGRATION", "多维疗愈方式系统融合：从单一咨询到多元工具箱");
lead(s, "MindBridge 突破传统 EAP 仅依赖心理咨询的单一模式，系统整合正念、积极心理、表达性艺术、音乐、巴林特及叙事沙盘六大科学疗愈模块，精准应对焦虑、压抑、麻木、共情疲劳等多样化职场心理困扰。", 1.7, 0.6);
label(s, 0.8, 2.4, 8, "六大科学疗愈模块与核心痛点匹配矩阵");
L.table(p, s, { x: 0.8, y: 2.8, w: 11.75, colFr: [1.6, 2.9, 4.0, 3.3], headers: ["疗愈模块", "核心干预方法", "对应核心行业痛点", "关键数据支撑"],
  rows: [
    ["正念减压", "正念呼吸、身体扫描冥想", "互联网 / IT：赶工焦虑、注意力碎片化", "65.4% 将「线上秒回」列为核心负担"],
    ["积极心理学", "可控 / 不可控拆解、三件好事", "金融 / 银行：业绩高压、意义感丧失", "42.9% 认为业绩压力是主要负担"],
    ["表达性艺术", "心流插花、情绪色彩联想", "客服 / 服务业：情绪劳动、情感压抑", "女性抑郁率 15%（全行业最高）"],
    ["音乐疗愈", "奥尔夫合奏、拍手律动", "教育：多重角色耗竭、情绪麻木", "倦怠检出率超 30%，p<0.001"],
    ["巴林特小组", "案例呈报、多角色深度讨论", "医护 / 护理：共情疲劳、生死无意义感", "护理人员抑郁率高达 11%"],
    ["叙事 + 沙盘", "身份重塑、沙具投射摆放", "制造业：意义感丧失、人际孤独", "月均加班 140 小时引发躯体化"],
  ], rowH: 0.56, fs: 11.5 });
L.foot(p, s, "六大模块覆盖全场景心理困扰，以多元化体验替代单一咨询，显著提升干预接受度");

// ---------- P18 参与度 ----------
s = page("ENGAGEMENT STRATEGY", "员工参与度保障：从无人问津到全员参与");
lead(s, "针对传统 EAP 参与率低于 5% 的行业顽疾，MindBridge 构建了「信任基础—认知转化—非货币激励」三层驱动机制，将员工参与从「被动要求」转化为「主动需求」，确保项目的高频活跃与持续留存。", 1.7, 0.6);
label(s, 0.8, 2.45, 7, "01  三层驱动机制设计");
[
  ["信任基础", "去标识化匿名与身份物理隔离，HR 无法反查个人记录，员工可随时清空历史，构筑敢于开口的安全底线。"],
  ["认知转化", "启动会展示脱敏真实改善案例，传递「有人跟你一样且有效」的认知，现场演示无感入口，不强制表态。"],
  ["非货币激励", "倾诉解锁定制音频包，参与工作坊计入年度培训学时，年度达标奖励「心理健康假」，全部利用 HR 现有资源调配。"],
].forEach((c, i) => {
  const y = 2.9 + i * 1.3;
  L.card(p, s, 0.8, y, 7.3, 1.15, C.CARD, { shadow: sh() });
  dot(s, 1.08, y + 0.3, [C.MOSS, C.AMBER, C.FOREST][i]);
  s.addText(c[0], { x: 1.35, y: y + 0.12, w: 3, h: 0.45, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
  s.addText(c[1], { x: 1.35, y: y + 0.52, w: 6.5, h: 0.6, fontFace: HF, color: C.INK, fontSize: 11, valign: "top", lineSpacingMultiple: 1.15 });
});
label(s, 8.45, 2.45, 4.2, "02  预期参与率目标跃升");
[
  ["≥30%", "年主动使用率", "从传统 EAP 的不足 5% 提升，实现全员广覆盖"],
  ["≥20%", "重复使用率", "连续 2 周以上使用，验证产品的长期陪伴价值"],
  ["≥50%", "活动参与率", "受邀员工中实际参与，打破线下活动冷场魔咒"],
].forEach((c, i) => {
  const y = 2.9 + i * 1.3;
  L.card(p, s, 8.45, y, 4.1, 1.15, C.FOREST, { shadow: sh() });
  s.addText(c[0], { x: 8.7, y: y + 0.1, w: 1.7, h: 0.95, fontFace: HF, color: C.AMBERL, fontSize: 26, bold: true, valign: "middle" });
  s.addText(c[1], { x: 10.35, y: y + 0.15, w: 2.1, h: 0.4, fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
  s.addText(c[2], { x: 10.35, y: y + 0.52, w: 2.1, h: 0.6, fontFace: HF, color: C.CREAMTXT, fontSize: 9.5, valign: "top", lineSpacingMultiple: 1.1 });
});

// ---------- P19 数据安全 ----------
s = page("SECURITY ARCHITECTURE", "数据安全与隐私保护：五重保障与双链隔离");
lead(s, "心理数据的敏感性是 EAP 落地的最大阻碍。MindBridge 建立从设计层到技术层的五重安全保障体系，并严格实施员工心理服务数据与企业组织数据的双链物理隔离。员工拥有完整的数据主权与管理权限，HR 仅能访问匿名聚合后的趋势指标。", 1.7, 0.8, 7.7);
[
  ["五重安全保障体系", "涵盖去标识化匿名设计、加密隔离存储、严格权限管控、保密协议约束及等保三级认证与私有云部署"],
  ["双链数据物理隔离", "员工原始对话与情绪记录保存在个人心理服务空间，企业组织趋势指标保存在 HR 后台，两者绝不直接联通"],
  ["员工掌握数据主权", "员工拥有完整管理权限，可随时查看、导出或一键清空全部历史记录，系统按既定生命周期策略自动清理"],
  ["企业权限严格受限", "HR 仅能查看达到匿名聚合条件后的部门 / 团队情绪趋势图，无权访问任何个人倾诉原文或红色个案详情"],
].forEach((c, i) => {
  const x = 0.8 + (i % 2) * 3.9, y = 2.7 + Math.floor(i / 2) * 2.0;
  dotCard(s, x, y, 3.7, 1.8, c[0], c[1], { tfs: 13.5, fs: 11 });
});
imgCard(s, "healer.jpg", 8.75, 1.85, 3.8, 3.05, { frame: C.CARD, caption: "疗愈师工作台：只见个案编号与风险级，不见身份" });
imgCard(s, "hr-bars.jpg", 8.75, 5.4, 3.8, 1.4, { frame: C.CARD });

// ---------- P20 四级评估 ----------
s = page("EVALUATION FRAMEWORK", "四级量化评估体系：让 ROI 可见，赋能 ESG 披露");
lead(s, "MindBridge 彻底终结传统 EAP「只算人次、不看效果」的粗放模式，建立从即时反馈到长期组织影响的四级量化评估体系。L1–L3 数据由 AI 无感自动采集，实现干预效果的可验证与可归因；L4 结合 HR 匿名数据输出年度白皮书，直接生成符合 GRI 标准的 ESG 数据包。", 1.7, 0.8);
L.table(p, s, { x: 0.8, y: 2.65, w: 11.75, colFr: [1.7, 3.3, 3.0, 3.75], headers: ["评估层级", "评估目标与工具", "采集方式与频次", "核心目标值与产出"],
  rows: [
    ["L0 使用率", "系统活跃度 / 后台签到数据", "AI 自动采集 / 实时周度", "使用率 ≥30%，验证产品吸引力"],
    ["L1 即时反馈", "活动即时改善 / 情绪温度计", "AI 自动采集 / 每场活动后", "情绪改善 ≥2 分，验证单次有效性"],
    ["L2 短期效果", "行为转化 / AI 自动简讯随访", "AI 自动采集 / 第 3、7 天", "转化率 ≥60%，验证行为干预力"],
    ["L3 中期改善", "心理状态 / PSI + PSS 精简量表", "AI 自动采集 / 月度季度", "PSI 从 3.2 提升至 ≥5.5，输出热力图"],
    ["L4 长期影响", "组织指标 / 离职率 + 病假率", "HR 匿名数据 / 半年度年度", "离职率下降 ≥30%，输出 ESG 数据包"],
  ], rowH: 0.66, fs: 12 });
L.foot(p, s, "全链路量化追踪，AI 自动归集数据，直接满足 GRI 403 等 ESG 披露要求");

// ---------- P21 持续运营 ----------
s = page("SUSTAINABILITY & SCALABILITY", "持续运营与可复制机制：打造企业内生心理免疫力");
lead(s, "MindBridge 采用「一套 AI 系统 + 六种疗愈模块 + 四级评估」的模块化架构，确保跨行业拓展的敏捷性与低成本。通过常态化活动、数字化触达与年度健康周期管理，维持项目的长期活跃度。更为核心的是「内部疗愈大使」培养机制，将外部专业服务转化为企业内生能力，确保项目退出后企业仍具备基础心理支持网络，构建极高的客户粘性与信任壁垒。", 1.7, 1.1);
[
  ["SECTION 01", "模块化架构与采购矩阵", ["新行业拓展仅需「痛点调研 + 模块匹配 + 细节定制」，AI 系统与评估体系直接复用，实现敏捷复制", "提供基础版（15–25 万）至旗舰版（50–100 万）四档采购模块，灵活适配中小企业至集团型企业的差异化预算"]],
  ["SECTION 02", "长期运营与内生能力转化", ["建立「每月线下工作坊 + 每日 AI 数字触达 + 年度测评干预闭环」的常态化运营节奏，维持项目长期生命力", "第 6 个月起选拔企业内部 HR / 工会干部进行 IAOTH 认证培训，培养「内部疗愈大使」，将外部服务转化为企业内生免疫力"]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 3.0, w = 5.7, h = 3.75;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.35, y: y + 0.2, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.35, y: y + 0.5, w: w - 0.7, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
  c[2].forEach((pt, j) => {
    const py = y + 1.2 + j * 1.2;
    dot(s, x + 0.38, py + 0.12, i === 0 ? C.MOSS : C.AMBER, 0.14);
    s.addText(pt, { x: x + 0.68, y: py, w: w - 1.0, h: 1.1, fontFace: HF, color: C.INK, fontSize: 12, valign: "top", lineSpacingMultiple: 1.2 });
  });
});

// ---------- P22 12 个月路径 ----------
s = page("IMPLEMENTATION ROADMAP", "12 个月双轨实施路径：从系统上线到能力内化");
lead(s, "MindBridge 规划了为期 12 个月的双轨实施路径，分为预备、融入、成长、嵌入四个递进阶段。AI 轨道与疗愈轨道在每个阶段均有明确的任务分工与产出里程碑，确保系统部署、数据基线、深度干预与能力内化有序推进。", 1.7, 0.6);
flow(s, 0.8, 2.45, 11.75, ["预备期 · 第 1–2 周", "融入期 · 第 1–3 月", "成长期 · 第 4–6 月", "嵌入期 · 第 6 月后"], C.FOREST);
label(s, 0.8, 3.15, 8, "MindBridge 12 个月双轨实施阶段与任务对照表");
L.table(p, s, { x: 0.8, y: 3.55, w: 11.75, colFr: [1.5, 1.6, 4.3, 4.3], headers: ["实施阶段", "周期", "AI 轨道核心任务", "疗愈轨道核心任务"],
  rows: [
    ["预备期", "第 1–2 周", "系统部署、基线采集、使用引导", "团队培训、方案定制、启动会"],
    ["融入期", "第 1–3 月", "24h 运行、周度报告、预警识别", "一对一疏导、团体工作坊、人工复核"],
    ["成长期", "第 4–6 月", "轨迹追踪、个人成长报告", "深度小组、工具包引导、中期评估"],
    ["嵌入期", "第 6 月后", "流程标准化、行业常模建立", "内部大使培养、年度全面评估"],
  ], rowH: 0.62, fs: 12.5 });
L.foot(p, s, "双轨并行推进，确保技术工具与人文关怀在每个阶段深度融合，保障高质量交付");

// ---------- P23 团队 ----------
s = page("TEAM & DELIVERY", "专业团队配置与企业极简配合机制");
lead(s, "MindBridge 组建跨学科专业团队，通过高度自动化的 AI 系统与标准化 SOP，将企业 HR 月均额外工作量压缩至 8 小时以内，以「重交付、轻配合」模式彻底扫清 EAP 落地阻力。", 1.7, 0.6);
[
  ["SECTION 01", "跨学科专业团队配置", C.MOSS, [
    ["核心团队", "5 年以上经验项目总监统筹，2–3 名 IAOTH 认证 / 国家二级疗愈师主导干预，正念 / 艺术导师及 IT 运维协同支持，形成完整服务闭环"],
    ["外部兜底资源", "配备精神科医生顾问负责红色预警医疗转介评估，危机干预专家应对重大突发事件，确保专业底线与合规安全"],
  ]],
  ["SECTION 02", "企业极简配合与零阻力落地", C.AMBER, [
    ["HR 工作量极小化", "月均额外工作量 ≤8 小时，仅需在预备期、第 6 月、第 12 月提供脱敏数据，及每月 30 分钟复盘会，实现「轻配合」目标"],
    ["IT 与行政轻量化配合", "预备期一次性完成企微 / 钉钉工作台嵌入，行政每两周提供一次工作坊场地，全程提供标准化操作手册，降低学习成本"],
  ]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 2.5, w = 5.7, h = 4.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.35, y: y + 0.2, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.35, y: y + 0.5, w: w - 0.7, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
  c[3].forEach((pt, j) => {
    const py = y + 1.2 + j * 1.5;
    dot(s, x + 0.38, py + 0.12, c[2], 0.14);
    s.addText(pt[0], { x: x + 0.68, y: py, w: w - 1.0, h: 0.35, fontFace: HF, color: C.FOREST, fontSize: 13.5, bold: true });
    s.addText(pt[1], { x: x + 0.68, y: py + 0.38, w: w - 1.0, h: 1.0, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  });
});

// ---------- P24 重点员工群体 ----------
s = page("TARGET GROUPS · 精准定位", "行业定位与重点员工群体精准匹配");
lead(s, "MindBridge 在八大行业精准覆盖的基础上，进一步细分出六类高优重点员工群体。通过识别不同群体的特定压力源与行为特征，匹配差异化的干预路径与疗愈模块，实现从「大水漫灌」到「精准滴灌」的场景化落地。", 1.7, 0.6);
L.table(p, s, { x: 0.8, y: 2.45, w: 11.75, colFr: [2.4, 4.2, 5.15], headers: ["重点员工群体", "核心痛点与早期信号", "精准匹配干预路径"],
  rows: [
    ["高强度岗位员工", "迟到增多、易怒或过度沉默、躯体化反应", "AI 树洞预警 → 行业定制团体工作坊 → 一对一疏导"],
    ["中基层管理者", "深夜回消息、决策犹豫、回避沟通、身体疲惫", "心理健康领导力培训 → 跨团队疗愈 → AI 周报辅助"],
    ["新入职员工", "独自吃饭、发言极少、过分小心、试用期表现低", "心理嘉年华融入 → 正念音频包自助 → 自愿预约通道"],
    ["女性返岗员工", "精力不济、注意力分散、自我怀疑、回避挑战", "能量唤醒工作坊 → 一对一能量疏导 → 芳香疗愈"],
    ["技术焦虑 / 转型员工", "职业迷茫、学习动力下降、频繁提及「老了」", "身份重塑叙事疗愈小组（4 周）→ 积极心理培训"],
    ["跨文化 / 国际员工", "例会沉默、不参与非正式讨论、孤独感强", "跨文化团队工作坊 → 沙盘疗愈 → AI 树洞 24h"],
  ], rowH: 0.64, fs: 12 });

// ---------- P25 心理雷达 ----------
s = page("心理雷达 · EARLY SIGNALS", "员工心理耗竭早期信号与主动干预触发");
lead(s, "管理者往往难以察觉员工心理防线的崩溃前兆。MindBridge 提炼出六类心理资源耗竭的早期可观察信号，为企业管理者提供了一套实用的「心理雷达」。当这些信号出现时，意味着员工已从「正常压力」滑向「硬扛」状态。系统将这些行为特征与 AI 预警机制打通，实现从管理者敏锐察觉、到系统主动介入的无缝衔接。", 1.7, 0.95, 8.0);
[
  ["高强度岗位信号", "迟到增多、请假频繁、工作质量波动、团队氛围沉闷、易怒或过度沉默，提示躯体化与情绪耗竭风险"],
  ["中基层管理者信号", "深夜回消息、频繁叹气、决策犹豫、回避团队沟通，提示管理压力过载与心理资本枯竭"],
  ["新入职与女性返岗信号", "独自吃饭、过分小心、精力不济、自我怀疑表达，提示角色适应障碍与职场融入困境"],
  ["转型与跨文化员工信号", "职业迷茫、消极观望、例会沉默、孤独感强，提示技术迭代焦虑与远程社交隔离危机"],
].forEach((c, i) => {
  const x = 0.8 + (i % 2) * 4.1, y = 2.85 + Math.floor(i / 2) * 1.95;
  dotCard(s, x, y, 3.9, 1.75, c[0], c[1], { tfs: 13.5, fs: 11, accent: [C.MOSS, C.AMBER, C.FOREST, C.AMBER][i] });
});
imgCard(s, "breath.jpg", 9.35, 1.85, 3.2, 4.85, { caption: "信号触发后：系统主动推送呼吸着陆练习" });

// ---------- P26 ROI ----------
s = page("ROI ANALYSIS", "成本投入与有形收益测算：7–10 倍 ROI 的确定性投资");
lead(s, "以 500 人规模企业为例，MindBridge 通过 AI 自动化与团体工作坊替代，将人均年度成本压缩至 1,260–1,760 元，较传统 EAP 降低 30%–40%。在收益端，通过降低主动离职率、减少病假缺勤及恢复在岗专注力，每年可为企业创造约 634 万元有形经济收益，投资回收期仅 1–1.5 个月。", 1.7, 0.8, 8.2);
label(s, 0.8, 2.6, 8, "500 人企业年度投入产出与 ROI 测算模型（单位：万元）");
L.table(p, s, { x: 0.8, y: 3.0, w: 8.3, colFr: [1.7, 4.6, 1.6], headers: ["收益 / 成本项目", "估算逻辑与数据支撑", "金额 (万元)"],
  rows: [
    ["年度总投入", "AI 平台 + 疗愈师 + 工作坊 + 评估（人均 1,260–1,760 元）", "63 – 88"],
    ["离职成本节约", "主动离职率下降 30% × 替代成本节约（15 万年薪 × 30%）", "169"],
    ["缺勤损失降低", "病假 / 缺勤天数下降 20% × 日均产值（600 元 / 天）", "90"],
    ["在岗产出提升", "专注力恢复带来 5% 的效率提升 × 薪酬基数", "375"],
    ["年度净收益", "有形收益合计（634 万）− 年度总投入（63–88 万）", "≈ 546 – 571"],
  ], rowH: 0.6, fs: 11, headFs: 11.5 });
stat(s, 9.4, 1.85, 3.15, 1.5, "7–10 倍", "综合投资回报率（ROI）");
stat(s, 9.4, 3.5, 3.15, 1.5, "1–1.5 月", "投资回收期");
stat(s, 9.4, 5.15, 3.15, 1.5, "634 万", "每年有形经济收益（500 人企业）", { dark: false });
L.foot(p, s, "综合 ROI 约 7–10 倍，投资回收期约 1–1.5 个月，远超传统 EAP 投入产出比");

// ---------- P27 五维度价值 + 对赌 ----------
s = page("VALUE & TRUST MECHANISM", "五维度价值总览与效果对赌信任机制");
lead(s, "MindBridge 为企业创造涵盖财务、员工、管理、品牌及 ESG 的五维度综合价值，年度隐性收益超百万。首创「效果对赌机制」，将尾款与第三方独立评估的 PSI 得分直接挂钩，未达标即退款或延期，彻底击穿 B 端采购的信任壁垒。", 1.7, 0.6);
[
  ["五维度综合价值矩阵", C.MOSS, [
    ["企业 · 员工 · 管理", "节约离职缺勤成本 634 万，员工获数千元免费疗愈，管理者减少救火时间节约 25–33 万"],
    ["品牌 · ESG", "雇主溢价降低招聘成本 35–88 万，填补 S 维度量化空白，ESG 评级提升优化融资成本 85–280 万"],
  ], "年度综合隐性收益超百万，投资回报率显著"],
  ["效果对赌与风险兜底机制", C.AMBER, [
    ["核心承诺", "12 个月后第三方独立评估 PSI 得分，未达标按比例退还年度服务费，或免费延长服务期至达标为止"],
    ["费用挂钩", "尾款 30% 与效果直接挂钩，数据实时透明可查；不选无法归因的离职率，而选 AI 每月追踪的 PSI 指标"],
  ], "彻底击穿 B 端采购信任壁垒，零风险决策保障"],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 2.5, w = 5.7, h = 4.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.35, y + 0.35, c[1]);
  s.addText(c[0], { x: x + 0.65, y: y + 0.18, w: w - 0.9, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  c[2].forEach((pt, j) => {
    const py = y + 0.95 + j * 1.3;
    s.addText(pt[0], { x: x + 0.35, y: py, w: w - 0.7, h: 0.35, fontFace: HF, color: C.AMBER, fontSize: 12.5, bold: true });
    s.addText(pt[1], { x: x + 0.35, y: py + 0.36, w: w - 0.7, h: 0.9, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.35, y: y + h - 0.85, w: w - 0.7, h: 0.55, rectRadius: 0.12, fill: { color: C.FOREST } });
  s.addText(c[3], { x: x + 0.35, y: y + h - 0.85, w: w - 0.7, h: 0.55, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true });
});

// ---------- P28 评估矩阵 ----------
s = page("DATA ARCHITECTURE", "评估体系设计与后台无感数据采集矩阵");
lead(s, "MindBridge 的四级评估体系依托强大的后台自动化采集能力，涵盖组织概览、活动效果、分群体表现及情绪监测等八大维度。所有过程指标与量表结果均由 AI 无感采集、自动评分并生成可视化仪表盘。这种「数据自动跑路、HR 零负担」的评估设计，确保了效果验证的客观性与连续性，为年度白皮书与 ESG 披露提供坚实的数据底座。", 1.7, 0.95);
L.table(p, s, { x: 0.8, y: 2.8, w: 7.6, colFr: [1.7, 3.0, 2.9], headers: ["数据类别", "具体采集指标", "采集方式与产出"],
  rows: [
    ["组织与活动概览", "全员情绪温度、预警占比、综合参与率 / 满意度", "AI 自动采集 + 签到，实时生成仪表盘"],
    ["分群体与行业对标", "按身份标签 / 行业维度的参与率、情绪温度聚合对比", "AI 去标识化聚合，匹配行业常模库基准"],
    ["组织情绪监测", "组织议题热度（加班 / 晋升 / 协作）、情绪分布", "AI 树洞内容聚合，输出部门情绪趋势图"],
    ["中期结果指标", "GAD-7 焦虑 / PHQ-9 抑郁 / PSI 心理安全感得分", "AI 自动推送量表、自动评分、生成轨迹图"],
    ["长期结果指标", "主动离职率、因心理原因病假率变化", "HR 提供匿名数据，AI 做关联分析输出白皮书"],
  ], rowH: 0.66, headH: 0.5, fs: 10.5, headFs: 11.5 });
imgCard(s, "hr-trend.jpg", 8.7, 2.8, 3.85, 2.45, { frame: C.CARD });
imgCard(s, "hr-bars.jpg", 8.7, 5.55, 3.85, 1.25, { frame: C.CARD });
s.addText("HR 匿名看板：组织情绪节律与干预效果", { x: 8.7, y: 5.27, w: 3.85, h: 0.25, fontFace: HF, color: C.MUTE, fontSize: 9.5, italic: true, align: "center" });
L.foot(p, s, "八大维度数据自动归集，AI 自动评分与趋势分析，HR 零额外统计负担");

// ---------- P29 定价 ----------
s = page("PRICING STRATEGY", "市场背景与模块化采购策略");
lead(s, "中国 EAP 市场正以超 30% 的年复合增长率高速扩张，从「外企专属」全面演变为「大厂标配」。MindBridge 顺应市场趋势，推出涵盖基础版至旗舰版的四档模块化采购矩阵，年费区间覆盖 15 万至 120 万。通过「AI 预警 + 行业定制 + 量化评估」的深度服务组合，在保持市场中位定价的同时，实现对传统单一咨询模式的降维打击。", 1.7, 0.95);
label(s, 0.8, 2.7, 8, "MindBridge 模块化产品矩阵与定价策略");
L.table(p, s, { x: 0.8, y: 3.1, w: 11.75, colFr: [1.3, 4.6, 4.0, 1.85], headers: ["采购模块", "核心服务内容", "适用企业画像", "年费 (万元)"],
  rows: [
    ["基础版", "AI 树洞平台 + 数字化内容平台 + 年度全员测评", "预算有限的中小企业、非高内耗行业首次采购", "15 – 25"],
    ["标准版", "基础版 + 行业定制团体疗愈工作坊（季度）", "中型企业、已有 EAP 预算但希望升级体验式服务", "30 – 50"],
    ["进阶版", "标准版 + 一对一疗愈疏导（预警员工）+ 行业深度定制", "大型企业、高内耗行业、对深度干预有明确要求", "50 – 80"],
    ["旗舰版", "进阶版 + 内部疗愈大使培养 + 年度白皮书与 ESG 数据资产", "集团型企业、上市公司、有 ESG 披露与评级需求", "80 – 120"],
  ], rowH: 0.74, fs: 12, starCol: 3 });
L.foot(p, s, "四档模块灵活适配，以市场中位定价提供远超传统 EAP 的深度服务价值");

// ---------- P30 GTM ----------
s = page("GO-TO-MARKET STRATEGY", "分阶段切入策略与数据驱动的高续约飞轮");
lead(s, "MindBridge 采用「项目制试用 → 年度服务 → 战略合作」的分阶段切入策略，将传统 3–6 个月的采购决策周期压缩至 2–4 周。通过年初建基线、年末出白皮书的闭环设计，形成强大的数据锁定效应。企业一旦进入第二年即拥有历史参照系，切换成本极高，预期续约率可达 70% 以上，构建起极具确定性的长期现金流模型。", 1.7, 0.95);
[
  ["分阶段切入与收费模式", C.MOSS, [
    "第一阶段：5–15 万项目制切入（如攻坚期单次疏导），2–4 周见效，大幅降低企业首次尝试的决策门槛与试错成本",
    "第二阶段：升级为 15–120 万年度服务，按人头年费或项目制灵活收费，建立全链路数据基线与长期干预闭环",
  ]],
  ["数据锁定与高续约驱动力", C.AMBER, [
    "数据锁定效应：年初建基线、年末出白皮书，企业进入第二年即拥有历史参照系，切换供应商等于失去纵向对比能力",
    "决策效率跃升：续约谈判从「重新评审」简化为「数据回顾会」，预期续约率 ≥70%，客户生命周期锁定 3–5 年",
  ]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 2.85, w = 5.7, h = 3.9;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.35, y + 0.37, c[1]);
  s.addText(c[0], { x: x + 0.65, y: y + 0.2, w: w - 0.9, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  c[2].forEach((pt, j) => {
    const py = y + 1.0 + j * 1.4;
    circleNum(s, x + 0.35, py + 0.02, "0" + (j + 1), c[1], 0.42, 11);
    s.addText(pt, { x: x + 0.92, y: py, w: w - 1.25, h: 1.3, fontFace: HF, color: C.INK, fontSize: 12, valign: "top", lineSpacingMultiple: 1.2 });
  });
});

// ---------- P31 SDGs / ESG ----------
s = page("SOCIAL IMPACT · ESG", "SDGs 对齐与 ESG 数据资产赋能");
lead(s, "MindBridge 深度对齐联合国五项核心可持续发展目标（SDGs），并直接支撑企业在社会（S）维度的 ESG 实践。系统自动生成的心理安全感得分、服务覆盖率及预警分布等硬核数据，彻底填补了 ESG 评级中 S 维度长期缺乏量化支撑的空白。这些数据资产不仅满足 GRI 403/401 等披露要求，更能实质性地优化企业绿色信贷评分与综合融资成本，实现社会价值与商业溢价的双赢。", 1.7, 1.1);
[
  ["SECTION 01", "联合国 SDGs 深度对齐", C.MOSS, [
    "SDG3 良好健康：系统化心理健康服务降低疾病风险；SDG8 体面工作：提升敬业度创造安全职场环境",
    "SDG5 性别平等：女性返岗支持与 DEI 文化建设；SDG10 减少不平等：全员平等覆盖；SDG17 伙伴关系：多方协同推进",
  ], "覆盖联合国 17 项 SDGs 中的 5 项核心目标"],
  ["SECTION 02", "ESG 数据资产与评级赋能", C.AMBER, [
    "填补 S 维度量化空白：自动输出 PSI 指数、覆盖率、预警占比等数据，直接满足 GRI 403/401/404/405 披露要求",
    "优化融资成本：ESG 评级每提升一档，综合融资成本降低 15–25 个基点，年化融资节约可达 75–250 万元",
  ], "数据资产可量化追踪，持续优化 ESG 评级表现"],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 3.0, w = 5.7, h = 3.8;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.35, y: y + 0.18, w: 3, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.35, y: y + 0.46, w: w - 0.7, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 18, bold: true });
  c[3].forEach((pt, j) => {
    const py = y + 1.1 + j * 1.05;
    dot(s, x + 0.38, py + 0.12, c[2], 0.14);
    s.addText(pt, { x: x + 0.68, y: py, w: w - 1.0, h: 1.0, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.35, y: y + h - 0.8, w: w - 0.7, h: 0.5, rectRadius: 0.12, fill: { color: C.FOREST } });
  s.addText(c[4], { x: x + 0.35, y: y + h - 0.8, w: w - 0.7, h: 0.5, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true });
});

// ---------- P32 风险 ----------
s = page("RISK MANAGEMENT FRAMEWORK", "核心风险识别与全方位应对策略");
lead(s, "MindBridge 针对 B 端 EAP 项目落地过程中的接受度、实施、伦理、数据及预算五大核心风险，构建了全方位的风控预案。坚持「AI 只做识别推荐、高风险必须人工复核」的底线原则，辅以去标识化匿名、等保三级认证及效果对赌机制，确保项目在快速扩张的同时，严守专业伦理与数据安全边界。", 1.7, 0.8);
L.table(p, s, { x: 0.8, y: 2.65, w: 11.75, colFr: [2.4, 9.35], headers: ["风险类型", "核心应对措施与底线原则"],
  rows: [
    ["企业接受度风险", "模块化低门槛切入（15 万起）；效果对赌（PSI 未达标退款）；分阶段试用见效后升级"],
    ["实施与参与率风险", "启动会脱敏案例展示；首周小额激励；匿名设计写入知情书；未达标启动专项推广周"],
    ["AI 误判 / 漏判风险", "高风险信号必须由专业人员复核；保留自助预约通道；月度 PSI 简评补充筛查"],
    ["专业伦理风险", "首次会谈明确保密边界；配备资深督导每月会诊；严守疗愈师资质，必要时启动医疗转介"],
    ["数据安全与预算风险", "等保三级 + 私有云部署 + 权限最小化；模块化先试后买；用历史数据证明 ROI 锁定续约"],
  ], rowH: 0.66, fs: 12.5 });
L.foot(p, s, "坚守 AI 辅助定位与人工复核底线，五重风控体系保障项目稳健落地与规模化扩张");

// ---------- P33 竞争壁垒 ----------
s = page("COMPETITIVE MOAT", "核心竞争壁垒与数据驱动的增长飞轮");
lead(s, "MindBridge 凭借「AI + 疗愈」双轨协同机制、行业适配标准化流程及「效果对赌」信任机制，构建了难以复制的系统性壁垒。随着覆盖行业扩展，沉淀的跨行业情绪常模数据将形成强大的数据飞轮效应——先发优势转化为数据资产，数据资产加速新行业适配，实现边际获客成本递减与适配效率的指数级提升。", 1.7, 0.95);
[
  ["01", "双轨协同与对赌壁垒", "打通「发现－转化－反馈」完整链路形成系统壁垒；尾款 30% 挂钩 PSI 得分的对赌机制，在企业主心中自动完成供应商分层。"],
  ["02", "行业适配标准化流程", "八大行业专属方案已标准化，新行业进入仅需「HR 数据 + AI 试运行 2–4 周」即可输出方案，摆脱对单一专家经验的依赖。"],
  ["03", "数据飞轮放大先发优势", "每服务一个头部客户即沉淀一套情绪常模数据，覆盖行业扩展至 30+ 时，数据资产成为「预训练模型」，对手从零追赶需 6 个月以上。"],
  ["04", "增长飞轮闭环", "标杆案例 → 行业白皮书 → 同行业裂变 → 获客成本递减 → 数据资产持续强化 → 竞争壁垒越转越高。"],
].forEach((c, i) => numCard(s, 0.8 + (i % 2) * 6.05, 2.85 + Math.floor(i / 2) * 1.95, 5.7, 1.8, c[0], c[1], c[2], { tfs: 14.5, fs: 11.5, accent: i === 3 ? C.FOREST : C.AMBER }));
L.foot(p, s, "数据飞轮效应：跨行业情绪常模数据沉淀驱动边际成本递减");

// ---------- P34 商业模式 ----------
s = page("BUSINESS MODEL & CAPITAL STRATEGY", "商业模式总结与未来资本路径展望");
lead(s, "MindBridge 凭借 AI 平台的极低边际成本与高续约率，构建了毛利率 50%–60%、净利率 20%–30% 的优质财务模型。本轮融资将聚焦行业拓展、AI 模型迭代与标杆案例规模化三大战略方向，加速数据飞轮运转。项目对传统咨询公司、大健康平台及 HR SaaS 厂商均具有极高的战略协同价值。", 1.7, 0.8);
label(s, 0.8, 2.6, 6, "核心财务指标与融资用途");
L.card(p, s, 0.8, 3.0, 6.3, 2.35, C.CARD, { shadow: sh() });
[
  "客单价 30–50 万 / 年，毛利率 50%–60%，AI 边际成本极低；续约率 ≥70%，客户生命周期 3–5 年，形成稳健的经常性收入基础。",
  "融资聚焦三大方向：行业拓展覆盖 30+ 行业、AI 模型迭代优化推荐引擎、标杆案例规模化通过白皮书裂变获客。",
].forEach((pt, j) => {
  const py = 3.2 + j * 1.05;
  circleNum(s, 1.08, py + 0.02, "0" + (j + 1), C.AMBER, 0.4, 11);
  s.addText(pt, { x: 1.62, y: py, w: 5.3, h: 1.0, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
});
[["50–60%", "毛利率"], ["≥70%", "续约率"], ["30+", "目标行业"]].forEach((m, i) => stat(s, 0.8 + i * 2.15, 5.55, 2.0, 1.2, m[0], m[1], { bfs: 22, lfs: 11 }));
label(s, 7.4, 2.6, 5, "退出逻辑与战略并购价值");
[
  ["传统咨询公司", "急需 AI 数字化能力补齐产品矩阵，通过并购快速获取技术壁垒与客户数据资产。"],
  ["大健康平台", "渴求高粘性 B 端企业入口与员工健康数据，完善从诊断到干预的全链路闭环。"],
  ["HR SaaS 厂商", "需完善员工心理健康模块，提升整体解决方案客单价与竞争壁垒，三类买家均有明确收购逻辑。"],
].forEach((c, i) => {
  const y = 3.0 + i * 1.28;
  L.card(p, s, 7.4, y, 5.15, 1.13, i === 2 ? C.FOREST : C.CARD, { shadow: sh() });
  const dark = i === 2;
  s.addText(c[0], { x: 7.7, y: y + 0.1, w: 4.6, h: 0.35, fontFace: HF, color: dark ? C.AMBERL : C.FOREST, fontSize: 13.5, bold: true });
  s.addText(c[1], { x: 7.7, y: y + 0.45, w: 4.6, h: 0.65, fontFace: HF, color: dark ? C.WHITE : C.INK, fontSize: 10.5, valign: "top", lineSpacingMultiple: 1.15 });
});
L.foot(p, s, "兼具确定性现金流与爆发式增长潜力的优质赛道");

// ---------- P35 结束 ----------
s = darkSlide();
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 1.6, w: 1.1, h: 1.1 });
s.addText("重塑千万职场人的心理安全网", { x: 1.0, y: 3.0, w: 11.3, h: 1.2, fontFace: HF, color: C.WHITE, fontSize: 44, bold: true });
s.addText("MindBridge AI + 疗愈轨道 · 期待与您携手共赢", { x: 1.0, y: 4.25, w: 11, h: 0.6, fontFace: HF, color: C.MOSSL, fontSize: 22 });
L.card(p, s, 1.0, 5.5, 8.6, 0.9, C.FOREST3);
s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变。", { x: 1.0, y: 5.5, w: 8.6, h: 0.9, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 18, bold: true });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
