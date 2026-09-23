const L = require("../工具库/lib.js");
const { C, HF } = L;

const p = L.newDeck();
p.author = "MindBridge";
p.subject = "企业员工心理安全与成长共生系统";
p.title = "MindBridge AI + 疗愈轨道";
p.company = "MindBridge";
p.lang = "zh-CN";
p.theme = {
  headFontFace: HF,
  bodyFontFace: HF,
  lang: "zh-CN",
};

const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_新版路演_候选稿.pptx";
const SW = 13.333;

function title(slide, eyebrow, heading, dark = false) {
  L.header(p, slide, eyebrow, heading, dark);
}

function addPageNo(slide, n, dark = false) {
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.18, y: 7.02, w: 0.45, h: 0.22, fontFace: HF,
    fontSize: 9, color: dark ? C.MOSSL : C.MUTE, align: "right",
    margin: 0,
  });
}

function metric(slide, x, y, w, value, label, dark = false) {
  slide.addText(value, {
    x, y, w, h: 0.58, fontFace: HF, fontSize: 27, bold: true,
    color: dark ? C.AMBERL : C.FOREST, margin: 0, fit: "shrink",
  });
  slide.addText(label, {
    x, y: y + 0.62, w, h: 0.58, fontFace: HF, fontSize: 11.5,
    color: dark ? C.CREAMTXT : C.MUTE, margin: 0, valign: "top", fit: "shrink",
  });
}

function bulletList(slide, items, x, y, w, fs = 14, color = C.INK, gap = 0.66, accent = C.AMBER) {
  items.forEach((it, i) => {
    const yy = y + i * gap;
    slide.addShape(p.ShapeType.ellipse, { x, y: yy + 0.14, w: 0.12, h: 0.12, fill: { color: accent }, line: { color: accent } });
    slide.addText(it, { x: x + 0.28, y: yy, w: w - 0.28, h: gap - 0.06, fontFace: HF, fontSize: fs, color, margin: 0, valign: "mid", breakLine: false, fit: "shrink" });
  });
}

function sectionBand(slide, x, y, w, label, fill = C.FOREST) {
  slide.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.42, rectRadius: 0.08, fill: { color: fill }, line: { type: "none" } });
  slide.addText(label, { x: x + 0.18, y, w: w - 0.36, h: 0.42, fontFace: HF, fontSize: 11.5, bold: true, color: C.WHITE, valign: "mid", margin: 0 });
}

// 01 Cover
L.cover(p);
let s = p._slides[p._slides.length - 1];
addPageNo(s, 1, true);

// 02 Thesis and market window
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "EXECUTIVE THESIS", "传统 EAP 失效，窗口期在于“主动识别 + 深度陪伴”");
s.addText("企业已经买了 EAP，但员工仍不敢用，管理者仍看不清。MindBridge 用 AI 扩大触达，用疗愈师完成深度转化。", {
  x: 0.8, y: 1.82, w: 11.7, h: 0.68, fontFace: HF, fontSize: 18, bold: true, color: C.FOREST, margin: 0, fit: "shrink",
});
const stats = [
  ["88%", "企业已提供 EAP 服务"],
  ["<5%", "传统 EAP 常见员工使用率"],
  ["54.9%", "2025 调研中受焦虑困扰的职场人"],
  ["35%+", "数字化心理服务年度采纳增长"],
];
stats.forEach((v, i) => {
  const x = 0.8 + i * 3.0;
  L.card(p, s, x, 2.85, 2.72, 1.62, i === 1 ? C.FOREST : C.CARD, { shadow: L.shadow() });
  metric(s, x + 0.25, 3.08, 2.2, v[0], v[1], i === 1);
});
L.card(p, s, 0.8, 4.9, 11.72, 1.35, C.MOSST, { line: { color: C.MOSSL, width: 1 } });
s.addText("商业判断", { x: 1.08, y: 5.12, w: 1.4, h: 0.35, fontFace: HF, fontSize: 13, bold: true, color: C.AMBER, margin: 0 });
s.addText("真正的竞争不在“有没有咨询师”，而在能否降低开口门槛、提前发现风险，并证明干预效果。", { x: 2.35, y: 5.02, w: 9.75, h: 0.75, fontFace: HF, fontSize: 16, bold: true, color: C.INK, margin: 0, valign: "mid", fit: "shrink" });
addPageNo(s, 2);

// 03 Pain points
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "PAIN POINT", "员工不敢用，企业看不清：传统 EAP 的双重断点");
const pains = [
  ["员工端", "求助被理解为“承认自己有问题”", ["病耻感与监控担忧", "额外登录、预约流程过重", "缺少即时获得感"]],
  ["管理端", "年底只得到咨询人次，无法解释效果", ["缺少团队趋势预警", "心理改善无法归因", "预算续约缺少证据"]],
];
pains.forEach((v, i) => {
  const x = 0.8 + i * 6.02;
  L.card(p, s, x, 1.95, 5.7, 4.35, i ? C.FOREST : C.CARD, { shadow: L.shadow() });
  s.addText(v[0], { x: x + 0.4, y: 2.28, w: 4.8, h: 0.45, fontFace: HF, fontSize: 22, bold: true, color: i ? C.AMBERL : C.FOREST, margin: 0 });
  s.addText(v[1], { x: x + 0.4, y: 2.92, w: 4.82, h: 0.88, fontFace: HF, fontSize: 16, bold: true, color: i ? C.WHITE : C.INK, margin: 0, fit: "shrink" });
  bulletList(s, v[2], x + 0.42, 4.15, 4.8, 13.5, i ? C.CREAMTXT : C.INK, 0.58, i ? C.AMBERL : C.AMBER);
});
s.addText("结果：服务在组织中存在，却没有在员工需要的时刻发生。", { x: 0.8, y: 6.65, w: 11.72, h: 0.42, fontFace: HF, fontSize: 14.5, italic: true, color: C.MUTE, align: "center", margin: 0 });
addPageNo(s, 3);

// 04 Industry table
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "INDUSTRY FOCUS", "八大高内耗行业，心理压力结构并不相同");
L.table(p, s, { x: 0.8, y: 1.82, w: 11.75, colFr: [2.0, 6.8, 2.1], headers: ["行业", "核心内耗", "采购优先级"], rows: [
  ["互联网 / IT", "注意力切割、赶工焦虑与 35+ 替代恐慌", "★★★★★"],
  ["金融 / 银行", "极致 KPI 与不可控结果造成意义感丧失", "★★★★★"],
  ["医护 / 护理", "长期面对生死，共情疲劳与情感透支", "★★★★★"],
  ["科技企业", "技术迭代焦虑叠加远程办公的社交隔离", "★★★★★"],
  ["教育", "家校沟通与教学双重角色导致耗竭", "★★★★☆"],
  ["公益组织", "使命感过载、资源焦虑与共情疲劳", "★★★★☆"],
  ["客服 / 服务业", "长期强撑笑脸，高强度情绪劳动", "★★★☆☆"],
  ["制造 / 汽车", "加班、重复劳动、人际孤独与安全压力", "★★★☆☆"],
], rowH: 0.54, headH: 0.53, fs: 11.5, headFs: 12.5, starCol: 2 });
L.foot(p, s, "通用方案只能提供心理科普；有效干预必须从行业压力结构出发。"); addPageNo(s, 4);

// 05 Dual track
L.dualTrack(p); s = p._slides[p._slides.length - 1]; addPageNo(s, 5);

// 06 AI engine and boundaries
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "AI ENGINE", "AI 树洞的任务：倾听、分层、匹配，不做诊断");
const aiSteps = [
  ["01", "无感接入", "企微 / 钉钉一键进入，匿名服务 ID 与企业身份隔离"],
  ["02", "共情倾听", "用去医疗化语言承接情绪，让开口本身成为第一步"],
  ["03", "风险分层", "识别绿、黄、红信号，高风险必须由专业人员复核"],
  ["04", "资源匹配", "结合情绪标签、岗位与行业画像，推荐自助或人工服务"],
];
aiSteps.forEach((v, i) => {
  const y = 1.85 + i * 1.18;
  s.addText(v[0], { x: 0.8, y, w: 0.62, h: 0.62, fontFace: HF, fontSize: 15, bold: true, color: C.WHITE, fill: { color: i === 2 ? C.AMBER : C.FOREST }, margin: 0, align: "center", valign: "mid", shape: p.ShapeType.ellipse });
  s.addText(v[1], { x: 1.65, y: y - 0.02, w: 2.0, h: 0.34, fontFace: HF, fontSize: 16, bold: true, color: C.FOREST, margin: 0 });
  s.addText(v[2], { x: 1.65, y: y + 0.38, w: 5.1, h: 0.54, fontFace: HF, fontSize: 12.5, color: C.INK, margin: 0, fit: "shrink" });
});
L.card(p, s, 7.25, 1.86, 5.28, 4.9, C.FOREST, { shadow: L.shadow() });
s.addText("双轨数据隔离", { x: 7.65, y: 2.2, w: 4.4, h: 0.42, fontFace: HF, fontSize: 20, bold: true, color: C.AMBERL, margin: 0 });
sectionBand(s, 7.65, 2.92, 4.4, "个人轨道", C.MOSS);
bulletList(s, ["原始对话只留在心理服务空间", "绿 / 黄风险不向 HR 披露个人信息", "红色风险按危机协议由疗愈师接管"], 7.72, 3.48, 4.2, 12, C.CREAMTXT, 0.55, C.AMBERL);
sectionBand(s, 7.65, 5.18, 4.4, "组织轨道", C.AMBER);
s.addText("只输出达到匿名聚合门槛的团队趋势，HR 无法反查个人倾诉。", { x: 7.72, y: 5.76, w: 4.2, h: 0.62, fontFace: HF, fontSize: 12.5, color: C.WHITE, margin: 0, fit: "shrink" });
addPageNo(s, 6);

// 07 Triage
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "TRIAGE", "红绿灯分层：把情绪信号转化为明确行动");
const triage = [
  ["绿色", "日常倾诉", "“压力大、睡不着”", "正念音频、呼吸练习、情绪打卡", C.MOSS],
  ["黄色", "风险预警", "“快撑不住、想辞职”", "建议人工服务，连接疗愈师，不惊动 HR", C.AMBER],
  ["红色", "危机响应", "极端词汇或明确高风险信号", "专业人员即时复核，按正式危机协议处理", C.FOREST2],
];
triage.forEach((v, i) => {
  const x = 0.8 + i * 4.0;
  L.card(p, s, x, 2.0, 3.72, 4.35, i === 2 ? C.FOREST : C.CARD, { shadow: L.shadow() });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.32, y: 2.35, w: 0.28, h: 0.28, fill: { color: v[4] }, line: { color: v[4] } });
  s.addText(v[0], { x: x + 0.75, y: 2.26, w: 1.0, h: 0.42, fontFace: HF, fontSize: 16, bold: true, color: i === 2 ? C.AMBERL : C.FOREST, margin: 0 });
  s.addText(v[1], { x: x + 0.32, y: 2.98, w: 3.05, h: 0.44, fontFace: HF, fontSize: 20, bold: true, color: i === 2 ? C.WHITE : C.INK, margin: 0 });
  s.addText("触发示例", { x: x + 0.32, y: 3.65, w: 1.2, h: 0.3, fontFace: HF, fontSize: 11, bold: true, color: C.AMBER, margin: 0 });
  s.addText(v[2], { x: x + 0.32, y: 3.99, w: 3.08, h: 0.63, fontFace: HF, fontSize: 13, color: i === 2 ? C.CREAMTXT : C.INK, margin: 0, fit: "shrink" });
  s.addText("系统行动", { x: x + 0.32, y: 4.86, w: 1.2, h: 0.3, fontFace: HF, fontSize: 11, bold: true, color: C.AMBER, margin: 0 });
  s.addText(v[3], { x: x + 0.32, y: 5.2, w: 3.08, h: 0.75, fontFace: HF, fontSize: 12.5, color: i === 2 ? C.WHITE : C.INK, margin: 0, fit: "shrink" });
});
addPageNo(s, 7);

// 08 Intervention matrix
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "INTERVENTION MATRIX", "六类心理困扰，对应六类循证干预");
L.table(p, s, { x: 0.8, y: 1.82, w: 11.75, colFr: [2.15, 5.0, 4.0], headers: ["心理困扰", "理论机制", "落地活动"], rows: [
  ["焦虑紧张", "正念减压 + 4-7-8 呼吸，中断自动应激", "正念呼吸工作坊、压力四象限"],
  ["耗竭疲惫", "身体觉知 + 心流，释放僵硬并重启动力", "能量唤醒、渐进式肌肉放松"],
  ["情绪劳动", "表达性艺术 + 音乐，绕过语言防御", "艺术疗愈、情绪色彩联想"],
  ["孤独无意义", "叙事疗愈 + 积极心理，重构成长叙事", "叙事深度小组、三件好事"],
  ["躯体紧张", "身体觉知 + 情绪释放，让压力回到身体", "身体觉知、解压拳击"],
  ["混合 / 预防", "团体音乐与艺术，建立同步体验与求助认知", "心理嘉年华、奥尔夫合奏"],
], rowH: 0.7, headH: 0.56, fs: 12, headFs: 13 });
addPageNo(s, 8);

// 09 Industry solution matrix
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "SOLUTION PORTFOLIO", "一行业一方案，把理论变成可交付的模块");
L.table(p, s, { x: 0.8, y: 1.82, w: 11.75, colFr: [1.8, 4.7, 4.4], headers: ["行业", "首选组合", "核心转变"], rows: [
  ["互联网 / IT", "正念工作坊 + 叙事疗愈", "从被时间追赶，到恢复掌控感"],
  ["金融 / 银行", "积极心理 + 跨团队疗愈", "从独自硬扛，到被看见与被支持"],
  ["医护 / 护理", "巴林特小组 + 困境盲盒", "从共情透支，到被同行托住"],
  ["教育", "奥尔夫音乐 + ABC 理论", "从角色耗竭，到重新建立情绪连接"],
  ["客服 / 服务", "心流插花 + 正念 + 芳香", "从持续付出情绪，到先照顾自己"],
  ["制造 / 汽车", "沙盘 + 拳击 + 心灵驿站", "从人际孤独，到团队共创与释放"],
  ["科技企业", "叙事 + 正念 + 跨团队疗愈", "从被替代恐慌，到持续学习者身份"],
  ["公益组织", "巴林特 + 艺术疗愈", "从使命过载，到共同承担与恢复"],
], rowH: 0.54, headH: 0.53, fs: 11.3, headFs: 12.5 });
addPageNo(s, 9);

// 10 Engagement
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "ENGAGEMENT", "参与率不靠强制，靠信任、获得感与运营节奏");
const drivers = [
  ["信任基础", "匿名、身份隔离、可随时清空历史", C.FOREST],
  ["认知转化", "启动会展示脱敏案例，现场演示入口", C.MOSS],
  ["非货币激励", "音频包、培训学时、心理健康假", C.AMBER],
];
drivers.forEach((v, i) => {
  const x = 0.8 + i * 4.0;
  L.card(p, s, x, 2.0, 3.72, 1.82, C.CARD, { shadow: L.shadow() });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.3, y: 2.3, w: 0.18, h: 0.18, fill: { color: v[2] }, line: { color: v[2] } });
  s.addText(v[0], { x: x + 0.62, y: 2.18, w: 2.65, h: 0.4, fontFace: HF, fontSize: 17, bold: true, color: C.FOREST, margin: 0 });
  s.addText(v[1], { x: x + 0.3, y: 2.85, w: 3.1, h: 0.62, fontFace: HF, fontSize: 12.5, color: C.INK, margin: 0, fit: "shrink" });
});
L.card(p, s, 0.8, 4.25, 11.72, 1.78, C.FOREST, { shadow: L.shadow() });
metric(s, 1.25, 4.58, 2.65, "≥30%", "年主动使用率目标", true);
metric(s, 5.32, 4.58, 2.65, "≥20%", "连续两周以上的重复使用率", true);
metric(s, 9.35, 4.58, 2.65, "≥50%", "受邀员工活动参与率", true);
s.addText("衡量长期陪伴价值，而不是单次活动的热闹程度。", { x: 0.8, y: 6.48, w: 11.72, h: 0.42, fontFace: HF, fontSize: 14, color: C.MUTE, italic: true, align: "center", margin: 0 });
addPageNo(s, 10);

// 11 Roadmap
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "IMPLEMENTATION", "12 个月双轨实施：从上线、融入到能力内化");
L.table(p, s, { x: 0.8, y: 1.9, w: 11.75, colFr: [1.7, 1.5, 4.1, 4.1], headers: ["阶段", "周期", "AI 轨道", "疗愈轨道"], rows: [
  ["预备期", "1–2 周", "系统部署、基线采集、使用引导", "团队培训、方案定制、启动会"],
  ["融入期", "1–3 月", "24h 运行、周报、预警识别", "一对一疏导、团体工作坊、人工复核"],
  ["成长期", "4–6 月", "轨迹追踪、个人成长报告", "深度小组、工具包引导、中期评估"],
  ["嵌入期", "6 月后", "流程标准化、行业常模建立", "内部大使培养、年度全面评估"],
], rowH: 0.92, headH: 0.58, fs: 12.5, headFs: 13 });
L.card(p, s, 0.8, 6.28, 11.75, 0.72, C.MOSST, { line: { color: C.MOSSL, width: 1 } });
s.addText("企业配合成本：HR 月均额外工作量 ≤ 8 小时；预备期一次性完成企微 / 钉钉嵌入。", { x: 1.05, y: 6.42, w: 11.2, h: 0.4, fontFace: HF, fontSize: 13, bold: true, color: C.FOREST, margin: 0, align: "center" });
addPageNo(s, 11);

// 12 Evaluation
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "MEASUREMENT", "从活跃度到组织结果，建立可归因的评估链");
L.table(p, s, { x: 0.8, y: 1.84, w: 7.45, colFr: [1.35, 2.5, 2.6, 2.2], headers: ["层级", "评估目标", "采集方式", "目标 / 产出"], rows: [
  ["L0", "系统活跃度", "后台实时数据", "使用率 ≥30%"],
  ["L1", "单次即时改善", "活动后情绪温度计", "改善 ≥2 分"],
  ["L2", "短期行为转化", "第 3 / 7 天 AI 随访", "转化率 ≥60%"],
  ["L3", "中期心理改善", "月度 PSI / PSS 精简量表", "PSI 提升至 ≥5.5"],
  ["L4", "长期组织影响", "离职、病假匿名数据", "年度白皮书 / ESG"],
], rowH: 0.68, headH: 0.55, fs: 11.2, headFs: 12 });
L.card(p, s, 8.62, 1.84, 3.9, 4.55, C.FOREST, { shadow: L.shadow() });
s.addText("评估原则", { x: 9.0, y: 2.18, w: 3.1, h: 0.42, fontFace: HF, fontSize: 20, bold: true, color: C.AMBERL, margin: 0 });
bulletList(s, ["L1–L3 由 AI 自动采集，不增加 HR 统计工作", "个人轨迹与组织趋势分开存储", "优先选择可追踪、可归因的 PSI 指标", "年度输出可直接用于 GRI 披露的数据包"], 9.0, 2.92, 3.15, 12.2, C.CREAMTXT, 0.7, C.AMBERL);
L.foot(p, s, "核心变化：从“今年咨询了多少人”，转向“员工和组织改变了什么”。"); addPageNo(s, 12);

// 13 Security
s = p.addSlide(); L.bg(s, C.FOREST); title(s, "SECURITY & ETHICS", "隐私不是合规附件，而是员工愿意开口的前提", true);
const secs = [
  ["去标识化", "真实企业身份与心理服务 ID 隔离"],
  ["加密隔离存储", "个人服务空间与 HR 组织后台分链"],
  ["最小权限", "HR 只查看匿名聚合后的部门趋势"],
  ["员工数据主权", "可查看、导出或一键清空历史记录"],
  ["人工复核底线", "AI 只识别与推荐，高风险不自动定性"],
];
secs.forEach((v, i) => {
  const x = 0.8 + (i % 3) * 4.0, y = 2.0 + Math.floor(i / 3) * 2.0;
  const w = i >= 3 ? 5.72 : 3.72;
  const xx = i === 4 ? 6.82 : x;
  L.card(p, s, xx, y, w, 1.55, i === 4 ? C.AMBER : C.CARD, { shadow: L.shadow() });
  s.addText(String(i + 1).padStart(2, "0"), { x: xx + 0.28, y: y + 0.22, w: 0.48, h: 0.32, fontFace: HF, fontSize: 12, bold: true, color: i === 4 ? C.FOREST : C.AMBER, margin: 0 });
  s.addText(v[0], { x: xx + 0.85, y: y + 0.18, w: w - 1.15, h: 0.38, fontFace: HF, fontSize: 16, bold: true, color: C.FOREST, margin: 0 });
  s.addText(v[1], { x: xx + 0.3, y: y + 0.78, w: w - 0.6, h: 0.52, fontFace: HF, fontSize: 12, color: C.INK, margin: 0, fit: "shrink" });
});
s.addText("建议部署：等保三级 + 私有云 + 明确的数据生命周期策略", { x: 0.8, y: 6.38, w: 11.72, h: 0.5, fontFace: HF, fontSize: 15, color: C.MOSSL, bold: true, align: "center", margin: 0 });
addPageNo(s, 13, true);

// 14 ROI
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "ROI", "500 人企业测算：年度净收益约 546–571 万元");
L.table(p, s, { x: 0.8, y: 1.84, w: 7.75, colFr: [2.6, 5.0, 1.9], headers: ["项目", "测算逻辑", "金额（万元 / 年）"], rows: [
  ["年度总投入", "AI 平台 + 疗愈师 + 工作坊 + 评估", "63–88"],
  ["离职成本节约", "主动离职率下降 30% 与替代成本节约", "169"],
  ["缺勤损失降低", "病假 / 缺勤天数下降 20%", "90"],
  ["在岗产出提升", "专注力恢复带来 5% 效率改善", "375"],
  ["年度净收益", "有形收益 634 万减去年度投入", "546–571"],
], rowH: 0.7, headH: 0.56, fs: 11.8, headFs: 12.2 });
L.card(p, s, 8.9, 1.84, 3.62, 4.55, C.FOREST, { shadow: L.shadow() });
metric(s, 9.25, 2.28, 2.9, "7–10倍", "综合 ROI", true);
metric(s, 9.25, 3.68, 2.9, "1–1.5月", "投资回收期", true);
metric(s, 9.25, 5.08, 2.9, "1,260–1,760元", "人均年度成本", true);
L.foot(p, s, "此页为方案测算模型，实际结果取决于企业薪酬、离职基线与部署范围。"); addPageNo(s, 14);

// 15 Pricing and GTM
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "BUSINESS MODEL", "四档模块化采购，用短周期项目降低首次决策门槛");
L.table(p, s, { x: 0.8, y: 1.8, w: 7.8, colFr: [1.55, 4.5, 1.8], headers: ["版本", "核心服务", "年费（万元）"], rows: [
  ["基础版", "AI 树洞 + 数字内容 + 年度测评", "15–25"],
  ["标准版", "基础版 + 季度行业定制工作坊", "30–50"],
  ["进阶版", "标准版 + 一对一疏导 + 深度定制", "50–80"],
  ["旗舰版", "进阶版 + 内部大使 + 白皮书 / ESG", "80–120"],
], rowH: 0.73, headH: 0.55, fs: 11.7, headFs: 12.5 });
L.card(p, s, 8.95, 1.8, 3.58, 4.65, C.FOREST, { shadow: L.shadow() });
s.addText("切入路径", { x: 9.3, y: 2.15, w: 2.8, h: 0.42, fontFace: HF, fontSize: 19, bold: true, color: C.AMBERL, margin: 0 });
const gtms = [["1", "5–15 万项目制", "2–4 周验证价值"], ["2", "15–120 万年度服务", "建立基线与干预闭环"], ["3", "长期战略合作", "用历史序列支撑续约"]];
gtms.forEach((v, i) => {
  const y = 2.92 + i * 1.0;
  s.addText(v[0], { x: 9.28, y, w: 0.44, h: 0.44, fontFace: HF, fontSize: 13, bold: true, color: C.FOREST, fill: { color: C.AMBERL }, margin: 0, align: "center", valign: "mid", shape: p.ShapeType.ellipse });
  s.addText(v[1], { x: 9.9, y: y - 0.02, w: 2.1, h: 0.32, fontFace: HF, fontSize: 13, bold: true, color: C.WHITE, margin: 0 });
  s.addText(v[2], { x: 9.9, y: y + 0.34, w: 2.1, h: 0.4, fontFace: HF, fontSize: 10.8, color: C.MOSSL, margin: 0, fit: "shrink" });
});
s.addText("目标续约率 ≥70%  |  客户生命周期 3–5 年", { x: 0.8, y: 6.63, w: 11.72, h: 0.38, fontFace: HF, fontSize: 14, bold: true, color: C.FOREST, align: "center", margin: 0 });
addPageNo(s, 15);

// 16 ESG
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "ESG & SOCIAL IMPACT", "把心理安全转化为企业可披露、可追踪的社会价值");
const sdgs = [["SDG 3", "良好健康", "降低心理健康风险"], ["SDG 5", "性别平等", "女性返岗与 DEI 支持"], ["SDG 8", "体面工作", "建立安全的职场环境"], ["SDG 10", "减少不平等", "全员平等获得支持"], ["SDG 17", "伙伴关系", "企业、疗愈师与平台协同"]];
sdgs.forEach((v, i) => {
  const x = 0.8 + i * 2.38;
  L.card(p, s, x, 2.0, 2.14, 2.1, i % 2 ? C.MOSST : C.CARD, { shadow: L.shadow() });
  s.addText(v[0], { x: x + 0.22, y: 2.25, w: 1.7, h: 0.38, fontFace: HF, fontSize: 16, bold: true, color: C.AMBER, margin: 0 });
  s.addText(v[1], { x: x + 0.22, y: 2.76, w: 1.7, h: 0.38, fontFace: HF, fontSize: 14, bold: true, color: C.FOREST, margin: 0 });
  s.addText(v[2], { x: x + 0.22, y: 3.22, w: 1.7, h: 0.54, fontFace: HF, fontSize: 10.8, color: C.INK, margin: 0, fit: "shrink" });
});
L.card(p, s, 0.8, 4.55, 11.75, 1.58, C.FOREST, { shadow: L.shadow() });
s.addText("GRI 403 / 401 / 404 / 405", { x: 1.18, y: 4.92, w: 3.2, h: 0.48, fontFace: HF, fontSize: 21, bold: true, color: C.AMBERL, margin: 0 });
s.addText("自动输出 PSI 指数、服务覆盖率、预警分布和群体差异，弥补 ESG 中 S 维度长期缺少量化证据的问题。", { x: 4.2, y: 4.82, w: 7.75, h: 0.76, fontFace: HF, fontSize: 14.5, bold: true, color: C.WHITE, margin: 0, fit: "shrink" });
addPageNo(s, 16);

// 17 Moat and risks
s = p.addSlide(); L.bg(s, C.CREAM); title(s, "MOAT & RISK", "壁垒来自数据与交付闭环，风险控制必须先于规模化");
s.addText("核心壁垒", { x: 0.8, y: 1.78, w: 5.6, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: C.FOREST, margin: 0 });
L.card(p, s, 0.8, 2.2, 5.65, 3.95, C.FOREST, { shadow: L.shadow() });
bulletList(s, ["双轨闭环：识别、复核、干预和反馈彼此连通", "行业标准化：新行业用 HR 数据与 2–4 周试运行快速定位", "数据飞轮：跨行业情绪常模缩短适配周期", "信任机制：尾款 30% 与 PSI 效果指标挂钩"], 1.18, 2.65, 4.85, 13, C.CREAMTXT, 0.72, C.AMBERL);
s.addText("五类风险底线", { x: 6.9, y: 1.78, w: 5.6, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: C.FOREST, margin: 0 });
L.table(p, s, { x: 6.9, y: 2.2, w: 5.62, colFr: [2.0, 4.2], headers: ["风险", "底线"], rows: [
  ["接受度", "先试后买，效果指标写入合同"],
  ["参与率", "匿名知情书，未达标启动专项运营"],
  ["AI 误判", "高风险必须人工复核，保留自助预约"],
  ["专业伦理", "明确保密边界，资深督导月度会诊"],
  ["数据安全", "等保三级、私有云、权限最小化"],
], rowH: 0.66, headH: 0.52, fs: 11.2, headFs: 12 });
addPageNo(s, 17);

// 18 Closing
L.valueSummary(p, "AI 发现信号，疗愈完成改变");
s = p._slides[p._slides.length - 1];
s.addText("MindBridge 希望重塑千万职场人的心理安全网", { x: 1.2, y: 1.55, w: 10.9, h: 0.45, fontFace: HF, fontSize: 14, color: C.MOSSL, align: "center", margin: 0 });
addPageNo(s, 18, true);

p.writeFile({ fileName: OUT }).then(() => console.log(OUT));
