// MindBridge 商业答辩方案（精简 12 页）· 温暖疗愈风格（lib.js）
const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const H = require("../工具库/helpers.js")(p);
const { sh, lead, dot, circleNum, numCard, dotCard, stat, label, imgCard, flow, page } = H;
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_商业答辩方案_12页.pptx";
const IMG = __dirname + "/../素材/";
let s;

// pill tag row under a card
function tags(s, x, y, w, items, color) {
  const gap = 0.12, tw = (w - gap * (items.length - 1)) / items.length;
  items.forEach((t, i) => {
    const tx = x + i * (tw + gap);
    s.addShape(p.ShapeType.roundRect, { x: tx, y, w: tw, h: 0.36, rectRadius: 0.18, fill: { color: C.MOSST } });
    s.addText(t, { x: tx, y, w: tw, h: 0.36, align: "center", valign: "middle", fontFace: HF, color: color || C.FOREST, fontSize: 10.5, bold: true });
  });
}
// three column card with colored header band
function bandCard(s, x, y, w, h, eyebrow, title, body, color, opt = {}) {
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color } });
  s.addShape(p.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color } });
  s.addText(eyebrow, { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: 0.32, fontFace: HF, color: C.CREAMTXT, fontSize: 10.5, charSpacing: 2 });
  s.addText(title, { x: x + 0.3, y: y + 0.38, w: w - 0.6, h: 0.5, fontFace: HF, color: C.WHITE, fontSize: opt.tfs || 18, bold: true, valign: "middle" });
  s.addText(body, { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: opt.bh || (h - 1.3), fontFace: HF, color: C.INK, fontSize: opt.fs || 12, valign: "top", lineSpacingMultiple: 1.25 });
}

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

// ---------- P2 市场痛点 ----------
s = page("MARKET PAIN POINTS", "市场痛点：传统 EAP 的「三大死穴」与职场心理危机");
lead(s, "当前职场心理健康问题严峻，超半数员工受焦虑困扰，但传统 EAP 服务面临员工参与率极低（<5%）、效果无法量化、方案缺乏行业针对性三大死穴，导致企业预算浪费，市场亟需颠覆性解决方案。", 1.7, 0.6);
[
  ["痛点一 · CRISIS", "职场心理危机常态化", "54.9%", "职场人受焦虑困扰", "超 54.9% 职场人受焦虑困扰，八大高内耗行业（如 IT、金融、医护）抑郁与倦怠检出率居高不下，心理健康已成为企业核心管理挑战。", "心理健康问题直接影响员工效能与组织稳定", C.MOSS],
  ["痛点二 · BARRIER", "员工参与率极低", "<5%", "传统 EAP 员工参与率", "传统 EAP 要求员工主动承认「我有心理问题」，心理门槛极高，且缺乏匿名信任机制，导致绝大多数员工「不愿用、不敢用」。", "隐私顾虑与病耻感形成天然使用壁垒", C.AMBER],
  ["痛点三 · BLACK HOLE", "效果黑洞与「一刀切」", "ROI 模糊", "只见人次，不见效果", "企业只能看到「咨询人次」却无法证明业务价值（ROI 模糊），且通用方案无法精准匹配不同行业的差异化痛点，导致服务流于形式。", "缺乏数据闭环与行业定制化能力", C.FOREST],
].forEach((c, i) => {
  const x = 0.8 + i * 3.98, y = 2.5, w = 3.8, h = 4.3;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  s.addText(c[0], { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.3, fontFace: HF, color: C.AMBER, fontSize: 10.5, bold: true, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.3, y: y + 0.5, w: w - 0.6, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.3, y: y + 1.05, w: w - 0.6, h: 0.7, fontFace: HF, color: c[6], fontSize: 30, bold: true, valign: "middle" });
  s.addText(c[3], { x: x + 0.3, y: y + 1.72, w: w - 0.6, h: 0.3, fontFace: HF, color: C.MUTE, fontSize: 10.5 });
  s.addText(c[4], { x: x + 0.3, y: y + 2.15, w: w - 0.6, h: 1.45, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  s.addShape(p.ShapeType.roundRect, { x: x + 0.3, y: y + h - 0.7, w: w - 0.6, h: 0.45, rectRadius: 0.12, fill: { color: C.MOSST } });
  s.addText(c[5], { x: x + 0.3, y: y + h - 0.7, w: w - 0.6, h: 0.45, align: "center", valign: "middle", fontFace: HF, color: C.FOREST, fontSize: 10.5, bold: true });
});

// ---------- P3 解决方案 双轨 ----------
s = page("SOLUTION", "解决方案：MindBridge「AI + 疗愈」双轨共生模型");
lead(s, "MindBridge 创造性提出「AI 负责广度 + 疗愈师负责深度」的双轨模型。AI 实现 7×24 小时匿名情绪感知与资源匹配，疗愈师提供深度陪伴与转化，两者在识别、预警、介入、反馈环节形成完整数据闭环，彻底击穿传统 EAP 的覆盖面与深度瓶颈。", 1.7, 0.75);
[
  ["TRACK 01", "AI 轨道 · 广度覆盖", "作为倾听者与匹配师，提供 24 小时在线匿名情绪感知、智能预警及个性化疗愈资源推荐，将心理支持门槛降至最低。", ["匿名感知", "智能预警", "资源匹配"], C.MOSS],
  ["TRACK 02", "疗愈轨道 · 深度转化", "作为转化师与陪伴者，提供一对一深度疏导、行业定制团体工作坊及长期成长陪伴，完成深层情绪转化与能量修复。", ["深度疏导", "团体工作坊", "成长陪伴"], C.FOREST],
  ["SYNERGY", "双轨协同 · 数据闭环", "AI 识别风险并推荐资源，疗愈师介入转化，干预结果反哺 AI 优化推荐逻辑，实现从「被动等待」到「主动支持」的范式转变。", ["风险识别", "结果反哺", "主动支持"], C.AMBER],
].forEach((t, i) => {
  const x = 0.8 + i * 3.98, y = 2.65, w = 3.8, h = 3.55;
  bandCard(s, x, y, w, h, t[0], t[1], t[2], t[4], { tfs: 17, fs: 12, bh: 1.7 });
  tags(s, x + 0.3, y + h - 0.7, w - 0.6, t[3]);
});
L.card(p, s, 0.8, 6.4, 11.75, 0.6, C.FOREST);
s.addText("AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由疗愈师完成。", { x: 1.0, y: 6.4, w: 11.35, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 14, bold: true });

// ---------- P4 AI 树洞与双链路 ----------
s = page("CORE INNOVATION 01", "AI 树洞引擎与「双链路」隐私预警机制");
lead(s, "通过去标识化匿名设计彻底打消员工隐私顾虑，首创「个人支持与组织预警」双链路隔离机制——个人风险仅向员工本人及专业疗愈师开放，组织风险经匿名聚合后向 HR 输出趋势预警。", 1.7, 0.6, 8.0);
[
  ["CHANNEL", "零门槛匿名倾诉通道", "员工通过企业 IM 一键进入，系统生成独立匿名 ID，真实身份与心理数据物理隔离，让倾诉像「说话」一样自然，打破求助羞耻感。", C.MOSS],
  ["PERSONAL RISK", "个人风险链路 · 保护隐私", "AI 识别到黄 / 红色风险信号后，仅向员工本人推送支持资源或建议连接人工服务，严重情况由疗愈师按危机协议处理，绝不向 HR 暴露个人标签。", C.AMBER],
  ["ORG RISK", "组织风险链路 · 赋能管理", "系统将大量去标识化数据进行聚合计算，向 HR 输出「某部门高压力比例连续上升」等组织趋势预警，让管理者从「猜人心」升级为「看数据」。", C.FOREST],
].forEach((c, i) => {
  const y = 2.45 + i * 1.3, x = 0.8, w = 8.05, h = 1.18;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.3, y + 0.3, c[3]);
  s.addText(c[0], { x: x + 0.58, y: y + 0.12, w: 3, h: 0.28, fontFace: HF, color: C.AMBER, fontSize: 10, bold: true, charSpacing: 2 });
  s.addText(c[1], { x: x + 0.58, y: y + 0.36, w: w - 0.9, h: 0.38, fontFace: HF, color: C.FOREST, fontSize: 14, bold: true, valign: "middle" });
  s.addText(c[2], { x: x + 0.58, y: y + 0.72, w: w - 0.9, h: 0.45, fontFace: HF, color: C.INK, fontSize: 10.5, valign: "top", lineSpacingMultiple: 1.15 });
});
L.card(p, s, 0.8, 6.35, 8.05, 0.6, C.FOREST);
s.addText("「在保护隐私的同时赋能组织管理——个人链路守护个体，组织链路洞察趋势。」", { x: 1.0, y: 6.35, w: 7.65, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true });
imgCard(s, "chat.jpg", 9.15, 1.85, 3.4, 4.75, { caption: "员工端：匿名代号下的树洞对话与活动推送" });

// ---------- P5 八大行业精准对标 ----------
s = page("CORE INNOVATION 02", "拒绝「一刀切」，八大行业精准对标与多维疗愈");
lead(s, "摒弃传统 EAP「一套方案打天下」的弊端，MindBridge 通过「HR 已有数据 + AI 树洞试运行」快速定位行业痛点，精准匹配正念、艺术、音乐、叙事等六种疗愈模块，为八大高内耗行业提供「一行业一方案」的定制化干预。", 1.7, 0.75);
[
  ["SECTOR 01", "互联网 / 科技行业", "针对「注意力碎片化与 35+ 被替代恐慌」，匹配正念减压与叙事疗愈，帮助员工从「被时间追着跑」转向掌控当下，重构职业身份认同。", ["正念减压", "叙事疗愈"], C.MOSS],
  ["SECTOR 02", "金融 / 客服服务业", "针对「业绩高压与情绪劳动疲劳」，引入积极心理学与表达性艺术疗愈，通过非语言媒介构建理性防御，缓解长期强撑笑脸导致的情感透支。", ["积极心理学", "表达性艺术"], C.AMBER],
  ["SECTOR 03", "医护 / 教育 / 制造业", "针对「共情疲劳、多重角色耗竭与产线孤独」，采用巴林特小组、奥尔夫音乐与沙盘疗愈，在不依赖语言表达的安全边界内，让员工被同行托住、释放压抑。", ["巴林特小组", "音乐", "沙盘"], C.FOREST],
].forEach((t, i) => {
  const x = 0.8 + i * 3.98, y = 2.65, w = 3.8, h = 3.55;
  bandCard(s, x, y, w, h, t[0], t[1], t[2], t[4], { tfs: 17, fs: 12, bh: 1.7 });
  tags(s, x + 0.3, y + h - 0.7, w - 0.6, t[3]);
});
flow(s, 0.8, 6.4, 11.75, ["HR 已有数据接入", "AI 树洞试运行 2–4 周", "双源合并出方案", "一行业一方案落地"], C.FOREST);

// ---------- P6 四级评估与对赌 ----------
s = page("EVALUATION & ACCOUNTABILITY", "核心创新三：四级量化评估与「效果对赌」机制");
lead(s, "彻底解决传统 EAP「效果黑洞」问题，建立从 L0 使用率到 L4 长期组织影响的全链路量化追踪体系。L1–L3 数据由 AI 自动采集，不增加 HR 负担；同时首创 PSI 指标效果对赌机制，将信任成本归零，让企业 ROI 清晰可见、可归因。", 1.7, 0.75);
label(s, 0.8, 2.55, 7, "MindBridge 四级量化评估体系");
L.table(p, s, { x: 0.8, y: 2.95, w: 7.3, colFr: [1.0, 2.3, 2.9, 1.8], headers: ["层级", "评估目标", "采集方式", "目标值"],
  rows: [
    ["L0", "使用率与覆盖面", "系统后台数据 + 签到", "使用率 ≥30%"],
    ["L1", "即时情绪反馈", "活动后情绪温度计", "改善 ≥2 分"],
    ["L2", "短期行为转化", "AI 自动简讯随访", "转化率 ≥60%"],
    ["L3", "中期心理状态改善", "PSI + PSS 量表追踪", "PSI 3.2 → ≥5.5"],
    ["L4", "长期组织指标影响", "HR 匿名数据 + AI 关联分析", "离职率 ↓ ≥30%"],
  ], rowH: 0.6, headH: 0.5, fs: 11, headFs: 12 });
[
  ["全链路自动化数据采集", "L0 至 L3 层级全部由 AI 树洞系统在日常交互中自动采集归集，HR 无需额外统计。", C.MOSS, false],
  ["长期组织影响 L4 量化", "结合企业 HR 提供的匿名离职率、病假率等数据，AI 进行关联分析，直观呈现心理干预对留任率和在岗产出的长期业务价值。", C.AMBER, false],
  ["首创「效果对赌」机制", "尾款 30% 与第三方独立评估的 PSI 提升值挂钩，未达标按比例退款或免费延期，用真金白银的承诺打破企业采购顾虑。", C.AMBERL, true],
].forEach((c, i) => {
  const x = 8.4, y = 2.55 + i * 1.5, w = 4.15, h = 1.35;
  L.card(p, s, x, y, w, h, c[3] ? C.FOREST : C.CARD, { shadow: sh() });
  dot(s, x + 0.25, y + 0.27, c[2], 0.14);
  s.addText(c[0], { x: x + 0.5, y: y + 0.12, w: w - 0.7, h: 0.4, fontFace: HF, color: c[3] ? C.AMBERL : C.FOREST, fontSize: 13, bold: true, valign: "middle" });
  s.addText(c[1], { x: x + 0.25, y: y + 0.52, w: w - 0.5, h: 0.8, fontFace: HF, color: c[3] ? C.WHITE : C.INK, fontSize: 10, valign: "top", lineSpacingMultiple: 1.15 });
});

// ---------- P7 商业模式 ----------
s = page("BUSINESS MODEL", "商业模式：模块化切入与高粘性增长飞轮");
lead(s, "中国 EAP 市场正以超 30% 的增速爆发，MindBridge 采用「模块化采购 + 分阶段切入」策略，以 15 万基础版降低试错门槛，通过「项目制试用 → 年度服务 → 战略合作」路径锁定客户。凭借数据飞轮效应与高切换成本，预期续约率超 70%，实现边际获客成本递减。", 1.7, 0.75);
[
  ["PRICING", "灵活的模块化定价", "提供 15–25 万基础版至 80–120 万旗舰版四档模块，按人头年费与项目制结合，精准适配从中小企业到万人集团的差异化预算与需求。", "¥15 万 — ¥120 万", C.MOSS],
  ["GO-TO-MARKET", "分阶段切入策略", "以 5–15 万单次项目制（如攻坚期压力疏导）快速破冰，体验效果后转化为 15–100 万年度服务，最终锁定 3–5 年战略合作，大幅缩短决策周期。", "项目制 → 年度 → 战略", C.FOREST],
  ["FLYWHEEL", "数据飞轮与高续约率", "每服务一个头部客户即沉淀行业情绪常模数据，新行业适配周期缩短至 2–4 周；历史数据积累的纵向对比能力形成极高切换成本，保障 ≥70% 续约率。", "续约率 ≥ 70%", C.AMBER],
].forEach((t, i) => {
  const x = 0.8 + i * 3.98, y = 2.65, w = 3.8, h = 4.1;
  bandCard(s, x, y, w, h, t[0], t[1], t[2], t[4], { tfs: 17, fs: 12, bh: 2.0 });
  L.card(p, s, x + 0.3, y + h - 0.95, w - 0.6, 0.7, C.FOREST);
  s.addText(t[3], { x: x + 0.3, y: y + h - 0.95, w: w - 0.6, h: 0.7, align: "center", valign: "middle", fontFace: HF, color: C.AMBERL, fontSize: 16, bold: true });
});

// ---------- P8 ROI ----------
s = page("ROI ANALYSIS", "企业价值与 ROI 分析：五维收益重塑组织健康资本");
lead(s, "MindBridge 不仅是一项员工福利，更是高回报的组织健康投资。以服务 500 人企业为例，年度投入约 63–88 万，通过降低离职成本、减少缺勤损失及提升在岗产出，可创造约 634 万有形收益，综合 ROI 高达 7–10 倍，投资回收期仅需 1–1.5 个月。", 1.7, 0.75);
[
  ["显性成本节约", "主动离职率预期下降 30%（节约替代成本 169 万），缺勤损失降低 20%（节约 90 万），直接挽回因心理耗竭导致的人才流失与工时损失。", C.MOSS],
  ["隐性绩效提升", "员工专注力恢复与情绪改善带来约 5% 的在岗产出提升（折算 375 万），AI 周报为管理者每周节省 2 小时「救火」时间，提升决策效率。", C.AMBER],
  ["雇主品牌与 ESG 溢价", "心理健康数据资产直接填补 ESG 评级中 S 维度的量化空白，助力企业提升 ESG 评级、优化绿色信贷条件，并大幅降低高端人才招聘成本。", C.FOREST],
].forEach((c, i) => {
  const y = 2.6 + i * 1.38;
  dotCard(s, 0.8, y, 4.6, 1.3, c[0], c[1], { tfs: 13, fs: 9.5, accent: c[2] });
});
label(s, 5.7, 2.6, 7, "500 人规模企业年度 ROI 测算（万元）");
L.table(p, s, { x: 5.7, y: 3.0, w: 6.85, colFr: [1.8, 1.8, 3.25], headers: ["项目", "金额", "测算逻辑"],
  rows: [
    ["年度总投入", "63 – 88", "系统 + 疗愈师 + 工作坊 + 评估等全模块"],
    ["离职成本节约", "169", "离职率降 30% × 15 万年薪 × 30% 替代成本"],
    ["缺勤损失降低", "90", "缺勤天数降 20% × 600 元 / 天"],
    ["在岗产出提升", "375", "15 万年薪 × 5% 专注力恢复带来的效率提升"],
    ["净收益 / ROI", "546 / 7–10倍", "有形收益 634 万 − 投入，回收期约 1–1.5 个月"],
  ], rowH: 0.55, headH: 0.5, fs: 10.5, headFs: 11.5, starCol: 1 });
L.foot(p, s, "人均投入仅 1,260–1,760 元 / 年，创造超 7 倍的高确定性业务回报");

// ---------- P9 竞争壁垒 ----------
s = page("COMPETITIVE MOAT", "竞争壁垒：四维护城河构筑商业防御纵深");
lead(s, "MindBridge 处于「AI 预警 + 疗愈师深度陪伴」的独家交叉点，构建了对手难以逾越的四维护城河。从系统级的双轨协同机制，到标准化的行业适配流程，再到效果对赌带来的信任壁垒与数据飞轮的先发优势，形成了极强的商业防御纵深。", 1.7, 0.75);
[
  ["系统协同与标准化", C.MOSS, [
    ["双轨全链路协同", "唯一打通「AI 识别—人工复核—效果反馈」全链路的玩家，对手无法复制三方长期磨合的系统效率"],
    ["行业适配标准化", "将依赖专家经验的「手艺」转化为「HR 数据 + AI 试运行」的标准化流程，2–4 周即可输出新行业方案"],
  ]],
  ["信任壁垒与数据飞轮", C.AMBER, [
    ["效果对赌信任壁垒", "尾款 30% 挂钩 PSI 指标的效果对赌机制，自动筛选掉缺乏实力的竞争者，将企业信任成本归零"],
    ["数据飞轮先发优势", "率先沉淀的八大行业情绪常模与标签库成为「预训练模型」，对手从零积累需 6 个月以上，先发优势呈指数级放大"],
  ]],
].forEach((c, i) => {
  const x = 0.8 + i * 6.05, y = 2.65, w = 5.7, h = 4.1;
  L.card(p, s, x, y, w, h, C.CARD, { shadow: sh() });
  dot(s, x + 0.35, y + 0.37, c[1]);
  s.addText(c[0], { x: x + 0.65, y: y + 0.2, w: w - 0.9, h: 0.5, fontFace: HF, color: C.FOREST, fontSize: 17, bold: true, valign: "middle" });
  c[2].forEach((pt, j) => {
    const py = y + 1.0 + j * 1.5;
    circleNum(s, x + 0.35, py + 0.02, "0" + (j + 1), c[1], 0.42, 11);
    s.addText(pt[0], { x: x + 0.92, y: py, w: w - 1.25, h: 0.4, fontFace: HF, color: C.FOREST, fontSize: 13.5, bold: true, valign: "middle" });
    s.addText(pt[1], { x: x + 0.92, y: py + 0.42, w: w - 1.25, h: 0.95, fontFace: HF, color: C.INK, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.2 });
  });
});

// ---------- P10 实施路径与团队 ----------
s = page("IMPLEMENTATION ROADMAP", "实施路径与团队保障：12 个月双轨落地");
lead(s, "项目采用 12 个月标准化实施周期，分为预备、融入、成长、嵌入四个阶段，确保 AI 系统与疗愈服务无缝融入企业日常，并建立完善的误判与伦理风险应对预案。", 1.7, 0.6);
flow(s, 0.8, 2.45, 11.75, ["预备期 · 第 1–2 周", "融入期 · 第 1–3 月", "成长期 · 第 4–6 月", "嵌入期 · 第 6 月后"], C.FOREST);
[
  ["01", "四阶段平滑融入", "从第 1–2 周的系统部署与基线采集，到 1–3 月的常态化运行与预警验证，再到中后期的深度小组与内部「疗愈大使」培养，确保服务从外部输入转化为内部能力。"],
  ["02", "复合型专业团队保障", "核心成员具备 5 年以上 EAP 管理经验及 IAOTH / 国家二级心理咨询师资质，辅以精神科医生顾问与危机干预专家作为外部支持资源，形成多维度专业保障体系。"],
  ["03", "全方位风险兜底预案", "针对 AI 误判保留人工复核与一键申诉通道，针对伦理风险制定《疗愈边界工作指引》，针对数据安全采用私有云部署与等保三级认证，确保项目稳健运行。"],
].forEach((c, i) => numCard(s, 0.8 + i * 3.98, 3.25, 3.8, 3.5, c[0], c[1], c[2], { tfs: 15, fs: 12, accent: [C.MOSS, C.AMBER, C.FOREST][i] }));

// ---------- P11 ESG & SDGs ----------
s = page("ESG & SDGs", "社会价值：深度对齐 SDGs 与赋能企业 ESG 战略");
lead(s, "MindBridge 不仅具备极高的商业回报，更深度对齐联合国可持续发展目标，并为企业 ESG 战略提供关键的量化数据支撑，实现商业价值与社会价值的统一。", 1.7, 0.6, 8.0);
[
  ["深度对齐联合国 SDGs", "直接贡献于 SDG3（良好健康与福祉）、SDG5（性别平等与女性返岗支持）、SDG8（体面工作与心理安全环境）及 SDG10（减少不平等与包容性支持）", C.MOSS],
  ["填补 ESG「S」维度量化空白", "系统自动输出的 PSI 指数、覆盖率、预警分布等数据，直接满足 GRI 403（职业健康与安全）及 GRI 401（雇佣与留任）等国际披露标准要求", C.AMBER],
  ["赋能企业绿色金融与评级", "完整的员工心理健康数据资产助力企业提升 ESG 评级，每提升一档可降低 15–25 个基点的综合融资成本，将心理关爱转化为财务优势", C.FOREST],
].forEach((c, i) => dotCard(s, 0.8, 2.45 + i * 1.32, 8.05, 1.22, c[0], c[1], { tfs: 14, fs: 10, accent: c[2] }));
L.card(p, s, 0.8, 6.35, 8.05, 0.6, C.FOREST);
s.addText("「填补社会责任维度的数据空白，助力企业提升评级、优化融资条件。」", { x: 1.0, y: 6.35, w: 7.65, h: 0.6, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 12, bold: true });
L.card(p, s, 9.15, 1.85, 3.4, 4.75, C.CARD, { shadow: sh() });
s.addText("对齐的 SDGs", { x: 9.4, y: 2.0, w: 3, h: 0.35, fontFace: HF, color: C.AMBER, fontSize: 11, bold: true, charSpacing: 2 });
[["SDG 3", "良好健康与福祉"], ["SDG 5", "性别平等"], ["SDG 8", "体面工作"], ["SDG 10", "减少不平等"]].forEach((g, i) => {
  const y = 2.45 + i * 0.95;
  s.addShape(p.ShapeType.roundRect, { x: 9.4, y, w: 1.1, h: 0.7, rectRadius: 0.1, fill: { color: [C.MOSS, C.AMBER, C.FOREST, C.MOSS][i] } });
  s.addText(g[0], { x: 9.4, y, w: 1.1, h: 0.7, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 13, bold: true });
  s.addText(g[1], { x: 10.65, y, w: 1.8, h: 0.7, fontFace: HF, color: C.INK, fontSize: 12.5, bold: true, valign: "middle" });
});
s.addText("GRI 403 · GRI 401 披露标准", { x: 9.4, y: 6.15, w: 3, h: 0.35, fontFace: HF, color: C.MUTE, fontSize: 10.5, italic: true });

// ---------- P12 结束 ----------
s = p.addSlide(); L.bg(s, C.FOREST);
s.addShape(p.ShapeType.ellipse, { x: -1.5, y: -1.6, w: 5, h: 5, fill: { color: C.FOREST2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 4.8, w: 4.2, h: 4.2, fill: { color: C.FOREST3 } });
s.addShape(p.ShapeType.ellipse, { x: 10.2, y: -1.7, w: 5.2, h: 5.2, fill: { color: C.FOREST2 } });
s.addImage({ path: IMG + "icon.png", x: 1.0, y: 1.5, w: 1.1, h: 1.1 });
s.addText([
  { text: "用科技拓展广度", options: { breakLine: true } },
  { text: "用专业深挖深度" },
], { x: 1.0, y: 2.9, w: 11.3, h: 2.1, fontFace: HF, color: C.WHITE, fontSize: 44, bold: true, lineSpacingMultiple: 1.15 });
s.addText("MindBridge AI + 疗愈轨道 · 感谢聆听与指导", { x: 1.0, y: 5.15, w: 11, h: 0.6, fontFace: HF, color: C.MOSSL, fontSize: 22 });
L.card(p, s, 1.0, 6.0, 8.6, 0.8, C.FOREST3);
s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变。", { x: 1.0, y: 6.0, w: 8.6, h: 0.8, align: "center", valign: "middle", fontFace: HF, color: C.WHITE, fontSize: 17, bold: true });

p.writeFile({ fileName: OUT }).then(f => console.log("saved", f));
