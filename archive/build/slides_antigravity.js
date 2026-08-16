const D = require("./design_antigravity.js");
const { C, F, PW, PH, MX } = D;

// Helper to add stars rating
function stars(n) { 
  return "★".repeat(n) + "☆".repeat(5 - n); 
}

// Helper to split a long line or add rich text formatting
function makeRuns(parts) {
  return parts.map(p => ({ text: p.text, options: p.opts || {} }));
}

// ─────────────────────────────────────────────────────────── COVER (p1)
function cover(pres) {
  const s = pres.addSlide();
  D.bg(s, C.ink);
  
  // Right panel background representing tech/AI
  s.addShape("rect", { x: PW / 2, y: 0, w: PW / 2, h: PH, fill: { color: C.deep }, line: { type: "none" } });
  
  // Custom abstract dual-track overlapping design (visual centerpiece)
  // AI track (left loop)
  s.addShape("ellipse", { 
    x: PW / 2 - 1.7, y: 2.1, w: 1.6, h: 1.6, 
    fill: { type: "none" }, 
    line: { color: C.heal, width: 7 } 
  });
  // Healing track (right loop)
  s.addShape("ellipse", { 
    x: PW / 2 + 0.1, y: 2.1, w: 1.6, h: 1.6, 
    fill: { type: "none" }, 
    line: { color: C.ai, width: 7 } 
  });
  // Connecting junction (overlap glowing point)
  s.addShape("ellipse", { 
    x: PW / 2 - 0.16, y: 2.68, w: 0.32, h: 0.32, 
    fill: { color: C.amber } 
  });
  s.addText("双轨交汇", {
    x: PW / 2 - 0.5, y: 3.1, w: 1.0, h: 0.3,
    fontFace: F.b, fontSize: 10, bold: true, color: C.white, align: "center", margin: 0
  });

  // Top header text
  s.addText("2026 企业疗愈力与 EAP 创新挑战赛", {
    x: 0, y: 0.8, w: PW, h: 0.36, fontFace: F.b, fontSize: 12.5, bold: true,
    color: C.amber, align: "center", charSpacing: 3, margin: 0,
  });
  
  // Project Title
  s.addText("MindBridge AI", {
    x: 0, y: 4.1, w: PW, h: 0.9, fontFace: F.h, fontSize: 54, bold: true,
    color: C.white, align: "center", margin: 0,
  });
  s.addText("+  疗 愈 轨 道", {
    x: 0, y: 5.0, w: PW, h: 0.5, fontFace: F.h, fontSize: 24, bold: true,
    color: C.heal, align: "center", margin: 0,
  });
  
  // Subtitle
  s.addText("企业员工心理安全与成长共生系统", {
    x: 0, y: 5.75, w: PW, h: 0.4, fontFace: F.b, fontSize: 16.5, bold: true,
    color: "9FB2C0", align: "center", charSpacing: 1.5, margin: 0,
  });
  
  // Bottom tagline
  s.addText("AI 不替代疗愈，而是让疗愈服务在关键时刻可及", {
    x: 0, y: 6.45, w: PW, h: 0.35, fontFace: F.b, fontSize: 13, italic: true,
    color: C.sage, align: "center", margin: 0,
  });
  
  D.footer(s, 1, true);
  s.addNotes("我们带来的不是单纯的AI工具，也不是传统的EAP服务，而是一个AI预警与推荐 + 疗愈师深度陪伴的双轨系统。AI不替代疗愈，而是让疗愈服务在关键时刻可及。");
}

// ─────────────────────────────────────────────────────── DUAL TRACK (p2)
function dualTrack(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "核心创意 · 双轨定位", title: "双轨并行 —— AI 负责广度，疗愈负责深度" });

  // Problem statement callout box
  const pwWidth = PW - 2 * MX;
  D.card(s, MX, 1.45, pwWidth, 0.72, C.white, { r: 0.08, line: C.heal, lw: 1 });
  // Add accent warning vertical block
  s.addShape("rect", { x: MX, y: 1.45, w: 0.12, h: 0.72, fill: { color: C.heal } });
  
  s.addText([
    { text: "  痛点与痛处：", options: { bold: true, color: C.healDk, fontFace: F.h, fontSize: 13.5 } },
    { text: "员工要么不敢求助，要么求助后得到的只是「治标不治本」的话术。本方案创造性提出 ", options: { color: C.txt } },
    { text: "「AI 预警与推荐 + 疗愈师深度陪伴」", options: { bold: true, color: C.ink } },
    { text: " 双轨模型。", options: { color: C.txt } },
  ], { x: MX + 0.2, y: 1.45, w: pwWidth - 0.3, h: 0.72, fontFace: F.b, fontSize: 13, valign: "middle", margin: 0 });

  // Two track columns side-by-side
  const colW = (PW - 2 * MX - 0.4) / 2;
  const ty = 2.4, th = 3.2;
  
  // Left Column: AI Track
  D.card(s, MX, ty, colW, th, C.white, { r: 0.12, shadow: true });
  // Top header pill for AI card
  D.badge(s, MX + 0.3, ty + 0.28, 1.1, 0.36, "AI 轨道", C.aiLt, C.ai, 12);
  s.addText("倾听者 + 匹配师", { x: MX + 1.6, y: ty + 0.28, w: colW - 1.9, h: 0.36, fontFace: F.h, fontSize: 16, bold: true, color: C.ink, valign: "middle", margin: 0 });
  
  // Subtitle/Role
  s.addText("轻量级识别方式感知员工情绪，主动预警与智能推荐", { x: MX + 0.3, y: ty + 0.8, w: colW - 0.6, h: 0.45, fontFace: F.b, fontSize: 11, color: C.mut, valign: "top", margin: 0 });
  
  // List details
  s.addText([
    { text: "■ 核心任务：", options: { bold: true, color: C.aiDk } },
    { text: "AI 树洞情绪识别、预警、个性化推荐\n\n", options: { color: C.txt } },
    { text: "■ 赛事对齐：", options: { bold: true, color: C.aiDk } },
    { text: "数字疗愈与 AI 辅助支持 (赛题方向 4)\n\n", options: { color: C.txt } },
    { text: "■ 技术定位：", options: { bold: true, color: C.aiDk } },
    { text: "24小时在线、轻量部署、全面匿名、消除心理防线", options: { color: C.txt } }
  ], { x: MX + 0.3, y: ty + 1.35, w: colW - 0.6, h: 1.7, fontFace: F.b, fontSize: 12, lineSpacingMultiple: 1.15, valign: "top", margin: 0 });

  // Right Column: Healing Track
  const hx = MX + colW + 0.4;
  D.card(s, hx, ty, colW, th, C.white, { r: 0.12, shadow: true });
  // Top header pill for Healing card
  D.badge(s, hx + 0.3, ty + 0.28, 1.1, 0.36, "疗愈轨道", C.healLt, C.heal, 12);
  s.addText("转化师 + 陪伴者", { x: hx + 1.6, y: ty + 0.28, w: colW - 1.9, h: 0.36, fontFace: F.h, fontSize: 16, bold: true, color: C.ink, valign: "middle", margin: 0 });
  
  // Subtitle/Role
  s.addText("专业疗愈师主体介入，通过表达性治疗实现能量深层转化", { x: hx + 0.3, y: ty + 0.8, w: colW - 0.6, h: 0.45, fontFace: F.b, fontSize: 11, color: C.mut, valign: "top", margin: 0 });
  
  // List details
  s.addText([
    { text: "■ 核心任务：", options: { bold: true, color: C.healDk } },
    { text: "能量疗愈、情绪疏导、深层转化与长期成长\n\n", options: { color: C.txt } },
    { text: "■ 赛事对齐：", options: { bold: true, color: C.healDk } },
    { text: "疗愈师主体性与专业胜任力 (UNIHEAL持证)\n\n", options: { color: C.txt } },
    { text: "■ 落地交付：", options: { bold: true, color: C.healDk } },
    { text: "正念呼吸、巴林特小组、奥尔夫音乐、沙盘等定制工作坊", options: { color: C.txt } }
  ], { x: hx + 0.3, y: ty + 1.35, w: colW - 0.6, h: 1.7, fontFace: F.b, fontSize: 12, lineSpacingMultiple: 1.15, valign: "top", margin: 0 });

  // Core belief band at the bottom
  D.card(s, MX, 5.8, PW - 2 * MX, 0.72, C.ink, { r: 0.1 });
  s.addText([
    { text: "核心理念：", options: { bold: true, color: C.amber, fontFace: F.h } },
    { text: "AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由专业疗愈师人对人、心对心完成。", options: { color: C.white } },
  ], { x: MX + 0.3, y: 5.8, w: PW - 2 * MX - 0.6, h: 0.72, fontFace: F.b, fontSize: 14.5, bold: true, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("双轨并行：AI负责广度识别与推荐，疗愈师负责深度转化。AI不做诊断，只做读数和吹哨，真正的疗愈由疗愈师完成。");
}

// ─────────────────────────────────── SIX INDUSTRIES (deck1 p3)
const INDUSTRIES = [
  ["互联网 / IT", "65.4% 将「线上秒回」列为第二大负担", 5, "65.4%"],
  ["金融 / 银行", "42.9% 业绩压力为主要负担（全行业第一）", 5, "42.9%"],
  ["医护 / 护理", "护理人员抑郁率达 11%", 4, "11.0%"],
  ["教育", "部分教师抑郁检出率 ＞ 30%", 4, "＞30%"],
  ["客服 / 服务业", "餐饮服务员女性抑郁率 15%", 3, "15.0%"],
  ["制造 / 汽车业", "新车上市月均加班 140 小时", 3, "140h"],
];

function industries(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "市场靶向", title: "六大高内耗行业 —— 谁最急需？" });

  // 2 x 3 grid of industry cards
  const cols = 3, rows = 2, gx = 0.36, gy = 0.36;
  const gw = (PW - 2 * MX - (cols - 1) * gx) / cols;
  const gh = 1.76, y0 = 1.48;
  
  INDUSTRIES.forEach((it, i) => {
    const cx = MX + (i % cols) * (gw + gx);
    const cy = y0 + Math.floor(i / cols) * (gh + gy);
    
    // Background card with shadow
    D.card(s, cx, cy, gw, gh, C.white, { r: 0.1, shadow: true });
    
    // Index number badge
    D.badge(s, cx + 0.2, cy + 0.2, 0.44, 0.28, `0${i+1}`, C.aiLt, C.ai, 10.5);
    
    // Industry Title
    s.addText(it[0], { x: cx + 0.72, y: cy + 0.16, w: gw - 1.8, h: 0.36, fontFace: F.h, fontSize: 15.5, bold: true, color: C.ink, valign: "middle", margin: 0 });
    
    // Priority stars
    s.addText(stars(it[2]), { x: cx + gw - 1.1, y: cy + 0.16, w: 0.9, h: 0.36, fontFace: F.b, fontSize: 11.5, color: C.gold, align: "right", valign: "middle", margin: 0 });
    
    // Core statistic display (made prominent for professional visual design)
    s.addText(it[3], { x: cx + 0.2, y: cy + 0.58, w: gw - 0.4, h: 0.44, fontFace: F.h, fontSize: 24, bold: true, color: C.heal, valign: "middle", margin: 0 });
    
    // Detailed description text
    s.addText(it[1], { x: cx + 0.2, y: cy + 1.05, w: gw - 0.4, h: 0.55, fontFace: F.b, fontSize: 11, color: C.mut, valign: "top", margin: 0, lineSpacingMultiple: 1.1 });
  });

  // Market support strip
  const bty = 5.86;
  D.card(s, MX, bty, PW - 2 * MX, 0.72, C.sageLt, { r: 0.08, line: C.sage, lw: 0.75 });
  s.addText([
    { text: "市场支撑与需求真实性：", options: { bold: true, color: C.aiDk, fontFace: F.h } },
    { text: "2025 年南方电网数字集团、海南电网、长江电力等多家大型企业已公开采购员工心理关爱与疗愈服务，表明企业采购意向已进入实际采购期。", options: { color: C.txt } },
  ], { x: MX + 0.28, y: bty, w: PW - 2 * MX - 0.56, h: 0.72, fontFace: F.b, fontSize: 12, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("六大高内耗行业按采购优先级排序，互联网与金融为最高优先级。2025年已有大型企业公开采购员工心理关爱服务，市场真实存在。");
}

// ─────────────────────────────── SEVEN SCENARIOS (deck1 p4)
const SCENARIOS = [
  ["🌐 通用预防型", "AI 树洞 24 小时倾诉 + 自动推送情绪调节资源", "全员心理健康常态化教育 + 自助疗愈工具包"],
  ["💻 互联网 / IT", "AI 识别持续焦虑及「35岁被替代」关键词", "「情绪红绿灯」正念工作坊 + 叙事疗愈小组"],
  ["🏦 金融 / 银行", "AI 监控并监测 KPI 高压下的情绪枯竭与波动", "积极心理学培训 + 跨团队沟通疗愈小组"],
  ["🏥 医护 / 护理", "AI 树洞倾听护士情绪，识别共情疲劳与高压信号", "巴林特小组 (EAP专属) + 困境盲盒工作坊"],
  ["🏫 教育行业", "AI 追踪多重角色下的情绪耗竭与沟通焦虑", "奥尔夫音乐疗愈 + ABC 认知重构工作坊"],
  ["📞 客服 / 服务业", "AI 捕捉客户负面情绪污染带来的心理崩溃风险", "「心流插花」艺术疗愈 + 正念冥想与芳香疗愈"],
  ["🏭 制造 / 汽车业", "AI 识别流水线重复劳作带来的社交隔离与疲劳", "团队沙盘疗愈 + 情绪宣泄拳击课 + 心灵驿站"],
];

function scenarios(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "应用场景", title: "七大场景 —— 精真定义 AI 与疗愈的协同时刻" });
  D.trackLegend(s, PW - MX - 2.8, 0.72);

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.48, totalW,
    [ 
      { label: "场景类型 / 行业痛点", w: 2.5 }, 
      { label: "AI 轨道的角色 (智能识别与轻量推送)", w: (totalW - 2.5) / 2 }, 
      { label: "疗愈轨道的角色 (专业疗愈师深度干预与转化)", w: (totalW - 2.5) / 2 } 
    ],
    SCENARIOS, 
    { accent: C.deep, rowH: 0.54, headH: 0.44, fs: 11 }
  );
  
  D.footer(s, n);
  s.addNotes("七大应用场景覆盖通用预防及六大行业，每个场景都精准定义了AI轨道与疗愈轨道各自的角色与协同时刻。");
}

// ───────────────── INDUSTRIES + SCENARIOS combined (deck2 p3)
function industriesAndScenarios(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "市场靶向 + 应用场景", title: "六大高内耗行业靶向 + 七大应用场景" });

  // Left: six industries as compact rows
  const lw = 4.8, lx = MX, ly = 1.48;
  s.addText("六大高内耗行业及痛点数据", { x: lx, y: ly, w: lw, h: 0.34, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  const rH = 0.55, r0 = ly + 0.4;
  
  INDUSTRIES.forEach((it, i) => {
    const ry = r0 + i * (rH + 0.08);
    // Compact card
    D.card(s, lx, ry, lw, rH, C.white, { r: 0.06 });
    // Left color bar
    s.addShape("rect", { x: lx, y: ry, w: 0.08, h: rH, fill: { color: C.ai } });
    
    s.addText(it[0], { x: lx + 0.16, y: ry, w: 1.7, h: rH, fontFace: F.b, fontSize: 11.5, bold: true, color: C.ink, valign: "middle", margin: 0 });
    s.addText(it[3], { x: lx + 1.8, y: ry, w: 1.6, h: rH, fontFace: F.h, fontSize: 12.5, bold: true, color: C.healDk, valign: "middle", margin: 0 });
    s.addText(stars(it[2]), { x: lx + lw - 1.2, y: ry, w: 1.1, h: rH, fontFace: F.b, fontSize: 10, color: C.gold, align: "right", valign: "middle", margin: 0 });
  });

  // Right: seven scenarios compact
  const rx = MX + lw + 0.4, rw = PW - MX - rx;
  s.addText("七大应用场景 (AI 轨道  ×  疗愈轨道协同)", { x: rx, y: ly, w: rw, h: 0.34, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  const sH = 0.55, s0 = ly + 0.4;
  
  SCENARIOS.forEach((it, i) => {
    const ry = s0 + i * (sH + 0.04);
    D.card(s, rx, ry, rw, sH, C.white, { r: 0.06 });
    // Left color bar
    s.addShape("rect", { x: rx, y: ry, w: 0.08, h: sH, fill: { color: C.deep } });
    
    // Industry Scenario Name
    s.addText(it[0], { x: rx + 0.18, y: ry, w: 1.8, h: sH, fontFace: F.b, fontSize: 11, bold: true, color: C.ink, valign: "middle", margin: 0 });
    
    // AI track icon & text
    s.addShape("ellipse", { x: rx + 2.05, y: ry + sH / 2 - 0.05, w: 0.09, h: 0.09, fill: { color: C.ai } });
    s.addText(it[1].substring(0, 19) + "...", { x: rx + 2.2, y: ry, w: (rw - 2.3) / 2 - 0.1, h: sH, fontFace: F.b, fontSize: 8.5, color: C.aiDk, valign: "middle", margin: 0 });
    
    // Healing track icon & text
    s.addShape("ellipse", { x: rx + 2.15 + (rw - 2.3) / 2, y: ry + sH / 2 - 0.05, w: 0.09, h: 0.09, fill: { color: C.heal } });
    s.addText(it[2].substring(0, 19) + "...", { x: rx + 2.3 + (rw - 2.3) / 2, y: ry, w: (rw - 2.3) / 2 - 0.1, h: sH, fontFace: F.b, fontSize: 8.5, color: C.healDk, valign: "middle", margin: 0 });
  });

  D.footer(s, n);
  s.addNotes("左侧六大高内耗行业按采购优先级排序，右侧七大应用场景对应AI轨道与疗愈轨道的协同角色。2025年已有大型企业公开采购员工心理关爱服务。");
}

// ─────────────────── ACTIVITIES general version
const ACT_GENERAL = [
  ["😰 焦虑紧张型", "项目赶工恐慌、心跳加速、思维反刍", "「止步当下」正念呼吸工作坊 (MBSR)", "90 分钟"],
  ["😫 耗竭疲惫型", "身心俱疲、情感冷漠、情绪麻木、亚健康", "「能量唤醒与音疗」恢复工作坊", "2 小时"],
  ["😔 情绪劳动型", "强撑笑脸、隐忍委屈、情感透支", "「色彩与面具」表达性艺术治疗工作坊", "2 小时"],
  ["🌀 孤独无意义型", "价值感丧失、存在性焦虑、社交隔离", "「生命的重构」叙事疗愈深度陪伴小组", "2h × 4 次"],
  ["⚡️ 躯体紧张型", "肩颈僵硬、压抑性头痛、易怒焦虑", "「身体觉知与释放」躯体疗法工作坊", "2 小时"],
  ["🤝 混合 / 预防型", "团队协作阻碍、心理安全感低、团队疏离", "「心理嘉年华与能量集市」游园会", "半天"],
];

function activitiesGeneral(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "疗愈交付 · 通用版", title: "按情绪类型快速匹配疗愈活动" });

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.48, totalW,
    [ 
      { label: "典型情绪类型", w: 2.3 }, 
      { label: "员工典型临床 / 身心表现", w: 3.8 }, 
      { label: "推荐疗愈活动与核心理论设计", w: 4.8 }, 
      { label: "单次时长", w: totalW - 10.9, align: "center" } 
    ],
    ACT_GENERAL, 
    { accent: C.heal, rowH: 0.55, headH: 0.44, fs: 11.5 }
  );
  
  // Highlight box at the bottom
  const bty = 5.95;
  D.card(s, MX, bty, totalW, 0.58, C.healLt, { r: 0.08, line: C.heal, lw: 0.75 });
  s.addText([
    { text: "核心交付优势：", options: { bold: true, color: C.healDk, fontFace: F.h } },
    { text: "所有疗愈活动均基于科学心理学与表达性艺术治疗理论 (如正念减压疗法MBSR、巴林特小组、叙事心理学等)，拒绝纯娱乐化团建，保证专业性与可评估性。", options: { color: C.txt } },
  ], { x: MX + 0.28, y: bty, w: totalW - 0.56, h: 0.58, fontFace: F.b, fontSize: 11.5, valign: "middle", margin: 0 });
  
  D.footer(s, n);
  s.addNotes("通用版按六种情绪类型快速匹配疗愈活动，每个活动都有明确的理论依据支撑，非随意拼凑。");
}

// ─────────────────── ACTIVITIES industry version
const ACT_IND = [
  ["💻 互联网 / IT", "「怕被替代、怕赶不上技术迭代」", "情绪红绿灯正念工作坊", "可控与不可控要素矩阵拆解"],
  ["🏦 金融 / 银行", "「业绩指标及决策压得喘不过气」", "积极心理与压力管理效能培训", "「情绪暂停法」心理安全策略"],
  ["🏥 医护 / 护理", "「长期面对病患痛苦掏空了自己」", "医护专属巴林特小组", "不评判、不打断、不指导的安全空间"],
  ["🏫 教育行业", "「教师、家长、行政多重角色耗竭」", "奥尔夫音乐协作疗愈工作坊", "双人及团队简易乐器敲击合奏"],
  ["📞 客服 / 服务业", "「强撑笑脸和情绪劳动耗尽了我」", "「心流插花」专注艺术疗愈", "花材触觉选择、自主命名与意义投射"],
  ["🏭 制造 / 汽车业", "「流水线枯燥、孤独扛着双重压力」", "团队合作性心理沙盘疗愈", "无声沙盘共创与团队能量图谱绘制"],
];

function activitiesIndustry(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "疗愈交付 · 行业版", title: "六大行业精准痛点对标" });

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.48, totalW,
    [ 
      { label: "典型行业", w: 2.2 }, 
      { label: "行业员工最核心痛点", w: 3.5 }, 
      { label: "首选推荐活动", w: 3.8 }, 
      { label: "干预关键步骤与精细设计", w: totalW - 9.5 } 
    ],
    ACT_IND.map(r => [r[0], "「" + r[1].replace(/[「」]/g, "") + "」", r[2], r[3]]),
    { accent: C.deep, rowH: 0.58, headH: 0.44, fs: 11.5 }
  );
  
  D.footer(s, n);
  s.addNotes("行业版针对六大行业各自最核心的痛点，配置差异化首选活动与关键环节设计，体现非模板化。");
}

// ─────────────────── TREEHOLE combined (deck1 p7)
const WARN3 = [
  ["绿色安全", "「好累」「压力大」「睡不着」", "AI 自动推送针对性的正念呼吸音频或工间减压指导", C.green, C.greenLt],
  ["黄色预警", "「快撑不住了」「想辞职」「天天失眠」", "AI 触发资源推送，并系统静默通知 HRBP 关怀其所在团队", C.amber, C.amberLt],
  ["红色警告", "极端词汇、自残或绝望表述", "AI 立即转接 7×24 专业人工心理咨询师，并通知 EAP 专员", C.heal, C.healLt],
];

function treeholeCombined(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "AI 识别引擎", title: "AI 树洞 —— 轻量级情绪识别与三级预警" });

  // Left column: What is Treehole + Abilities
  const lw = 5.8, lx = MX, ly = 1.48;
  
  // What is Treehole
  D.card(s, lx, ly, lw, 1.15, C.aiLt, { r: 0.1, line: C.ai, lw: 0.75 });
  s.addText("什么是 AI 树洞？", { x: lx + 0.25, y: ly + 0.12, w: lw - 0.5, h: 0.28, fontFace: F.h, fontSize: 14.5, bold: true, color: C.aiDk, margin: 0 });
  s.addText("企业微信/钉钉/小程序的24h在线匿名倾诉工具。不记名、不留痕、彻底消除防备心。郑州高新区总工会AI树洞上线后已成功响应职工诉求超1300次。", {
    x: lx + 0.25, y: ly + 0.42, w: lw - 0.5, h: 0.65, fontFace: F.b, fontSize: 11, color: C.txt, margin: 0, lineSpacingMultiple: 1.15, valign: "top" });

  // 3 Abilities list
  const abilities = [
    ["共情式倾听与暖心回应", "通过大模型情商框架承接员工的负面情绪宣泄"],
    ["情绪倾向分析与实时分级", "智能分词与情绪建模，敏锐判定心理红线"],
    ["疗愈方案自动且精准推送", "根据识别的情绪标签与层级实时推送适配资源"],
  ];
  
  let ay = ly + 1.3;
  abilities.forEach((a, i) => {
    D.card(s, lx, ay, lw, 0.82, C.white, { r: 0.08, shadow: true });
    
    // Ability index icon
    D.badge(s, lx + 0.22, ay + 0.21, 0.4, 0.4, String(i + 1), C.aiDk, C.white, 12);
    
    s.addText(a[0], { x: lx + 0.78, y: ay + 0.12, w: lw - 0.95, h: 0.28, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(a[1], { x: lx + 0.78, y: ay + 0.42, w: lw - 0.95, h: 0.32, fontFace: F.b, fontSize: 10.5, color: C.mut, margin: 0, valign: "top" });
    ay += 0.92;
  });

  // Right column: 3-level warning cards
  const rx = MX + lw + 0.34, rw = PW - MX - rx;
  s.addText("三级预警分类处置机制", { x: rx, y: ly, w: rw, h: 0.3, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  
  let wy = ly + 0.36;
  WARN3.forEach((w) => {
    D.card(s, rx, wy, rw, 1.05, C.white, { r: 0.08, shadow: true });
    
    // Left boundary stripe (identifying warning level)
    s.addShape("rect", { x: rx, y: wy, w: 0.12, h: 1.05, fill: { color: w[3] } });
    
    // Level Badge
    D.badge(s, rx + 0.3, wy + 0.15, 0.9, 0.28, w[0], w[4], w[3], 10);
    
    // Keyword examples
    s.addText([
      { text: "识别特征：", options: { bold: true, color: C.mut, fontSize: 10.5 } },
      { text: w[1], options: { color: C.txt, fontSize: 10.5 } }
    ], { x: rx + 1.35, y: wy + 0.12, w: rw - 1.5, h: 0.3, fontFace: F.b, margin: 0, valign: "middle" });
    
    // Action details
    s.addText([
      { text: "干预动作：", options: { bold: true, color: w[3], fontFace: F.h } },
      { text: w[2], options: { color: C.txt } }
    ], { x: rx + 0.3, y: wy + 0.48, w: rw - 0.5, h: 0.5, fontFace: F.b, fontSize: 11, lineSpacingMultiple: 1.1, margin: 0, valign: "top" });
    
    wy += 1.15;
  });

  // Closed loop system band at the bottom
  const bty = 5.92;
  D.card(s, MX, bty, PW - 2 * MX, 0.62, C.ink, { r: 0.08 });
  s.addText([
    { text: "安全闭环原则：", options: { bold: true, color: C.amber, fontFace: F.h } },
    { text: "采用「AI预警 + 人工复核」的协同模式 —— AI 负责实时敏感识别，但绝不自动给员工定性。所有的降级、干预方案均由疗愈师或 HRBP 复核后实施，切实保障员工隐私与尊严。", options: { color: C.white } },
  ], { x: MX + 0.28, y: bty, w: PW - 2 * MX - 0.56, h: 0.62, fontFace: F.b, fontSize: 11.5, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("AI树洞是24小时匿名倾诉平台。AI做三件事：倾听共情、关键词识别预警、资源自动推送。三级预警配合人工复核闭环，AI不自动定性任何员工。");
}

// ─────────────────── TREEHOLE tech (deck2 p6)
const TECH_LAYERS = [
  ["前端应用层", "H5 / 微端 / 企业微信 / 钉钉小程序", "即开即用、全面免登录、实现最大程度的匿名隐私保护"],
  ["AI 对话引擎", "融合情绪共情的大语言模型 (如 DeepSeek / 通义)", "扮演温暖、非评判的倾听角色，通过多轮共情完成初步宣泄"],
  ["规则研判层", "本地高性能心理词库 + CBT 规则触发器", "实时扫描焦虑、耗竭、抑郁等情绪指标及心理危机红线"],
  ["匿名数据层", "双向哈希去标识化 + 情感标签摘要数据库", "去除员工ID及原始文本，仅保留团队脱敏情绪指标用于大盘洞察"],
];

function treeholeTech(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "AI 树洞识别（一）", title: "以 AI 树洞为核心的轻量级识别方式" });

  const ly = 1.48, lw = 5.4;
  
  // Left: Product intro & principles
  // 1. Definition
  D.card(s, lx = MX, ly, lw, 1.4, C.aiLt, { r: 0.1, line: C.ai, lw: 0.75 });
  s.addText("AI 树洞 —— 什么是匿名倾听？", { x: lx + 0.25, y: ly + 0.15, w: lw - 0.5, h: 0.3, fontFace: F.h, fontSize: 15, bold: true, color: C.aiDk, margin: 0 });
  s.addText("它是 24 小时随时在线的纯匿名的员工表达性树洞。通过日常高内耗工作的倾诉记录分析心理安全度，不记录个人IP、不获取系统实名，提供极致的心理避风港。", {
    x: lx + 0.25, y: ly + 0.48, w: lw - 0.5, h: 0.8, fontFace: F.b, fontSize: 11.5, color: C.txt, margin: 0, lineSpacingMultiple: 1.25, valign: "top" });

  // 2. Case study
  D.card(s, lx, ly + 1.55, lw, 1.05, C.sageLt, { r: 0.1, line: C.sage, lw: 0.75 });
  s.addText([
    { text: "典型成功案例：", options: { bold: true, color: C.sage, fontFace: F.h } },
    { text: "郑州高新区总工会智慧心理服务系统接入 AI 情绪对话模型，上线即引爆职工圈，短时间服务次数超 1300+ 次，是目前工会和大型国企的首选数字服务方案。", options: { color: C.txt } },
  ], { x: lx + 0.25, y: ly + 1.55, w: lw - 0.5, h: 1.05, fontFace: F.b, fontSize: 11, valign: "middle", margin: 0, lineSpacingMultiple: 1.2 });

  // 3. Design Principles
  D.card(s, lx, ly + 2.75, lw, 1.55, C.ink, { r: 0.1 });
  s.addText("核心隐私保护原则 (对齐伦理)", { x: lx + 0.3, y: ly + 2.9, w: lw - 0.6, h: 0.28, fontFace: F.h, fontSize: 13, bold: true, color: C.amber, margin: 0 });
  s.addText([
    { text: "🛡️ 数据端脱敏：", options: { bold: true, color: C.amber } },
    { text: "不留存聊天原始文本，只存储情绪分析标签。\n", options: { color: "D5E0E8" } },
    { text: "🛡️ 身份去关联：", options: { bold: true, color: C.amber } },
    { text: "严禁任何从系统关联个人员工 ID 的漏洞设计。\n", options: { color: "D5E0E8" } },
    { text: "🛡️ 自主归零权：", options: { bold: true, color: C.amber } },
    { text: "员工有权随时一键将树洞历史会话记录彻底焚毁。\n", options: { color: "D5E0E8" } }
  ], { x: lx + 0.3, y: ly + 3.25, w: lw - 0.6, h: 0.95, fontFace: F.b, fontSize: 11, lineSpacingMultiple: 1.25, valign: "top", margin: 0 });

  // Right: 4-layer tech stack
  const rx = MX + lw + 0.45, rw = PW - MX - rx;
  s.addText("轻量级技术实现四层架构", { x: rx, y: ly, w: rw, h: 0.3, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  
  const layerColors = [C.ai, C.aiDk, C.sage, C.deep];
  let yy = ly + 0.4;
  TECH_LAYERS.forEach((L, i) => {
    D.card(s, rx, yy, rw, 0.88, C.white, { r: 0.08, shadow: true });
    
    // Left shape representing the layer
    D.badge(s, rx + 0.18, yy + 0.19, 1.2, 0.5, L[0], layerColors[i], C.white, 11.5);
    
    s.addText(L[1], { x: rx + 1.55, y: yy + 0.12, w: rw - 1.7, h: 0.32, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(L[2], { x: rx + 1.55, y: yy + 0.44, w: rw - 1.7, h: 0.36, fontFace: F.b, fontSize: 10, color: C.mut, margin: 0, valign: "top" });
    
    yy += 0.98;
  });

  D.footer(s, n);
  s.addNotes("AI树洞采用轻量级四层架构：前端小程序、对话引擎、规则引擎、匿名化数据层。核心设计原则是隐私优先，不存储身份信息，仅提取情绪标签。");
}

// ─────────────────── TREEHOLE warning (deck2 p7)
const WARN3_FULL = [
  ["绿色安全", "「好累」「压力大」「睡不着」", "AI 自动匹配并推送针对性的正念音频 / 工间呼吸练习链接", "系统内自助服务，无需人工惊动或打扰", C.green, C.greenLt],
  ["黄色预警", "「快撑不住了」「想辞职」「天天失眠」", "AI 触发自助疗愈包推送，且在管理后台生成团队高压预警", "HRBP 查看其团队近期整体加班/高压倾向", C.amber, C.amberLt],
  ["红色警告", "极端负面、自毁或绝望等敏感红线词汇", "AI 系统秒级弹窗转接 7×24 小时专业心理咨询热线", "EAP 专员及心理辅导员在 2 小时内跟进确认", C.heal, C.healLt],
];

function treeholeWarning(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "AI 树洞识别（二）", title: "AI 核心能力与三级预警联动" });

  // Top: 3 abilities as 3 columns
  const abilities = [
    ["温暖倾听与共情回应", "让员工倾诉成为疗愈的起点", "🗣️"],
    ["关键词智能识别预警", "扫描语言特征，科学自动定级", "🔍"],
    ["疗愈资源精准实时推送", "千人千面的情绪精细化匹配", "⚡"],
  ];
  
  const aw = (PW - 2 * MX - 2 * 0.3) / 3;
  abilities.forEach((a, i) => {
    const ax = MX + i * (aw + 0.3);
    D.card(s, ax, 1.48, aw, 0.95, C.aiLt, { r: 0.1, line: C.ai, lw: 0.75 });
    
    // Emoji/Abilities icon
    s.addText(a[2], { x: ax + 0.16, y: 1.6, w: 0.44, h: 0.44, fontFace: F.h, fontSize: 18, align: "center", valign: "middle", margin: 0 });
    
    s.addText(a[0], { x: ax + 0.7, y: 1.55, w: aw - 0.85, h: 0.32, fontFace: F.h, fontSize: 13, bold: true, color: C.aiDk, margin: 0, valign: "middle" });
    s.addText(a[1], { x: ax + 0.7, y: 1.88, w: aw - 0.85, h: 0.44, fontFace: F.b, fontSize: 10, color: C.mut, margin: 0, valign: "top" });
  });

  // 3-level warning table (reformatted using dataTable but custom logic)
  const totalW = PW - 2 * MX;
  const cols = [ 
    { label: "预警等级", w: 1.2, align: "center" }, 
    { label: "树洞典型输入特征", w: 2.8 }, 
    { label: "AI 引擎自动触发响应", w: 4.4 }, 
    { label: "人工闭环介入节点与时效", w: totalW - 8.4 } 
  ];
  
  // Custom draw table rows for beautiful styling with borders
  const hy = 2.65;
  s.addShape("roundRect", { x: MX, y: hy, w: totalW, h: 0.42, rectRadius: 0.05, fill: { color: C.deep } });
  
  let cx = MX;
  cols.forEach((c) => { 
    s.addText(c.label, { x: cx + 0.14, y: hy, w: c.w - 0.24, h: 0.42, fontFace: F.b, fontSize: 11.5, bold: true, color: C.white, align: c.align || "left", valign: "middle", margin: 0 }); 
    cx += c.w; 
  });
  
  let ry = hy + 0.48;
  WARN3_FULL.forEach((w) => {
    const rowH = 0.86;
    D.card(s, MX, ry, totalW, rowH, C.white, { r: 0.06 });
    
    // Left status border stripe
    s.addShape("rect", { x: MX, y: ry, w: 0.08, h: rowH, fill: { color: w[4] } });
    
    // Level Badge center aligned
    D.badge(s, MX + 0.2, ry + 0.28, 0.85, 0.3, w[0], w[5], w[4], 10);
    
    let xx = MX + cols[0].w;
    [w[1], w[2], w[3]].forEach((cell, ci) => {
      const c = cols[ci + 1];
      s.addText(cell, { x: xx + 0.14, y: ry, w: c.w - 0.26, h: rowH, fontFace: F.b, fontSize: 10.5, color: C.txt, valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });
      xx += c.w;
    });
    ry += rowH + 0.05;
  });

  // Closed loop system band at the bottom
  const bty = 5.92;
  D.card(s, MX, bty, totalW, 0.58, C.ink, { r: 0.08 });
  s.addText([
    { text: "核心闭环逻辑：", options: { bold: true, color: C.amber, fontFace: F.h } },
    { text: "AI 预警仅作为敏感情绪感知输入，后台处置必须经过专业心理咨询师或 HRBP 确认核实后方可启动。严防数据自动给员工贴标签、打分甚至定性，切实保护员工隐私。", options: { color: C.white } },
  ], { x: MX + 0.28, y: bty, w: totalW - 0.56, h: 0.58, fontFace: F.b, fontSize: 11, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("AI在树洞中做三件事，配合绿黄红三级预警。每级都有明确的AI自动动作和人工介入节点，红色预警EAP专员2小时内电话确认。核心是AI预警加人工复核的闭环。");
}

// ─────────────────── RECOMMEND engine (p8)
const MAP3 = [
  ["😰 焦虑紧张", "三分钟呼吸着陆法 (CBT自主音频)", "正念呼吸与压力释放团体工作坊", "疗愈师一对一深度焦虑压力疏导"],
  ["😫 耗竭疲惫", "工间身体扫描音频与深度冥想引导", "能量唤醒与音疗修复团体工作坊", "疗愈师一对一能量与情绪危机修复"],
  ["😔 抑郁低落", "每日「三件好事」积极打卡小程序", "叙事疗愈与生命重构深度陪伴小组", "疗愈师一对一意义追寻与重构陪伴"],
];

const PERSONA = [
  ["🎯 员工画像匹配", "岗位部门与职级数据对标", "IT研发人员优先推送线上音频和正念引导；车间产线员工优先推荐线下大型团体活动与心灵释压体验。"],
  ["📈 情绪轨迹追踪", "近30天持续多维情绪波幅", "针对在树洞中表现出持续身心疲惫的用户，推送「能量唤醒」课程；突发项目压力则针对性推荐即时「正念呼吸」。"],
  ["🔄 参与历史循环", "过往疗愈项目好评率与交互", "对于正念工作坊给予优质评价的用户，优先推荐高阶的表达性叙事小组；对于静息活动排斥者推荐趣味游园。"],
];

function recommend(pres, n, withPersona) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "AI 推荐引擎", title: "把情绪信号翻译成可执行的疗愈方案" });

  // 3-step transform flow cards
  const steps = [
    ["1", "情绪信号识别", "AI 树洞捕捉用户倾诉与情绪信号", "情绪标签 + 预警等级", C.ai],
    ["2", "智能方案匹配", "按情绪、行业与员工画像算法匹配", "个性化推荐清单", C.sage],
    ["3", "闭环触达执行", "企业IM静默推送与人工二次复核", "落实干预交付", C.heal],
  ];
  
  const sw = (PW - 2 * MX - 2 * 0.5) / 3;
  const syy = 1.48;
  
  steps.forEach((st, i) => {
    const sx = MX + i * (sw + 0.5);
    D.card(s, sx, syy, sw, 1.25, C.white, { r: 0.1, shadow: true });
    
    // Icon badge
    D.badge(s, sx + 0.22, syy + 0.2, 0.44, 0.44, st[0], st[4], C.white, 13);
    
    s.addText(st[1], { x: sx + 0.78, y: syy + 0.22, w: sw - 0.9, h: 0.4, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(st[2], { x: sx + 0.25, y: syy + 0.72, w: sw - 0.5, h: 0.32, fontFace: F.b, fontSize: 10, color: C.mut, margin: 0, valign: "top" });
    
    s.addText("→ " + st[3], { x: sx + 0.25, y: syy + 0.98, w: sw - 0.5, h: 0.24, fontFace: F.b, fontSize: 10, bold: true, color: st[4], margin: 0, valign: "top" });
    
    // Connective chevron arrow
    if (i < 2) {
      s.addText("▶", { x: sx + sw + 0.08, y: syy, w: 0.34, h: 1.25, fontFace: F.b, fontSize: 16, color: C.mutLt, align: "center", valign: "middle", margin: 0 });
    }
  });

  // Mapping table
  const totalW = PW - 2 * MX;
  const mapY = 2.92;
  s.addText("情绪标签 → 三级活动资源映射示例", { x: MX, y: mapY, w: totalW, h: 0.3, fontFace: F.h, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  
  const bottomY = D.dataTable(s, MX, mapY + 0.36, totalW,
    [ 
      { label: "情绪标签", w: 1.5, align: "center" }, 
      { label: "绿色推送（全自助手册/冥想音频）", w: (totalW - 1.5) / 3 }, 
      { label: "黄色推荐（小组团体工作坊）", w: (totalW - 1.5) / 3 }, 
      { label: "红色介入（专业一对一心理疏导）", w: (totalW - 1.5) / 3 } 
    ],
    MAP3, 
    { accent: C.deep, rowH: withPersona ? 0.44 : 0.55, headH: 0.4, fs: withPersona ? 10.5 : 11.5 }
  );

  // Persona personalized recommendation logic (Deck 2 only)
  if (withPersona) {
    const py = bottomY + 0.08;
    s.addText("多维算法：个性化推荐逻辑", { x: MX, y: py, w: totalW, h: 0.3, fontFace: F.h, fontSize: 14, bold: true, color: C.ink, margin: 0 });
    
    const pw = (totalW - 2 * 0.3) / 3;
    PERSONA.forEach((p, i) => {
      const px = MX + i * (pw + 0.3);
      D.card(s, px, py + 0.34, pw, 1.05, C.aiLt, { r: 0.08, line: C.ai, lw: 0.5 });
      
      s.addText(p[0], { x: px + 0.18, y: py + 0.4, w: pw - 0.36, h: 0.24, fontFace: F.h, fontSize: 11, bold: true, color: C.aiDk, margin: 0 });
      s.addText([
        { text: p[1] + "\n", options: { color: C.mut, italic: true, fontSize: 8.8 } },
        { text: p[2], options: { color: C.txt, fontSize: 9.3 } },
      ], { x: px + 0.18, y: py + 0.65, w: pw - 0.36, h: 0.7, fontFace: F.b, margin: 0, lineSpacingMultiple: 1.1, valign: "top" });
    });
  }

  D.footer(s, n);
  s.addNotes("推荐引擎三步转化：信号识别、方案匹配、触达执行。情绪标签按绿黄红三级映射到自助、团体、一对一活动" + (withPersona ? "。个性化推荐结合员工画像、情绪轨迹、参与历史三个维度。" : "，形成完整闭环。"));
}

// ─────────────────── RESULTS (p9)
const KPI = [
  ["心理安全感评分", "组织心理安全指数 (PSI) 量表", "基线 3.2 – 3.8", "目标 ≥ 5.5", "5.5"],
  ["人才留存率", "核心骨干主动离职率", "基线 35.0%", "目标 ≤ 15.0%", "15%"],
  ["疗愈服务覆盖率", "AI 树洞月活与覆盖深度", "基线 0.0%", "目标 ≥ 40.0%", "40%"],
  ["情绪即时改善比例", "活动后情绪改善问卷反馈", "基线 0.0%", "目标 ≥ 60.0%", "60%"],
];

const EVAL = [
  ["L0 使用率", "监测日常 AI 树洞使用率与情绪资源点击量", "数据后台实时自动导出", C.ai],
  ["L1 满意度", "活动现场情绪温度计与即时五星满意度评价", "现场纸质/二维码快捷反馈", C.aiDk],
  ["L2 行为改善", "跟进疗愈活动后第3天及第7天的情绪随访", "IM 自动推送随访问卷", C.sage],
  ["L3 心理指标", "应用 PSI 心理安全感简明量表测量心智改变", "每季度全员抽样问卷", C.amber],
  ["L4 组织影响", "考核高危流失率、病假率以及团队产出绩效", "半年/年度组织综合报表", C.heal],
];

function results(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.bgLight);
  D.header(s, { kicker: "预期效果 · 评估方式", title: "效果可衡量、可验证" });

  const lw = 6.4, lx = MX, ly = 1.48;
  s.addText("四大核心预期效果 (对齐挑战赛指标)", { x: lx, y: ly, w: lw, h: 0.3, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  
  // KPI Widgets Layout (2x2 Dashboard-style widgets)
  const kw = (lw - 0.3) / 2, kh = 1.8;
  const ky0 = ly + 0.38;
  
  KPI.forEach((k, i) => {
    const kx = lx + (i % 2) * (kw + 0.3);
    const kyy = ky0 + Math.floor(i / 2) * (kh + 0.2);
    
    // Shadowed widget card
    D.card(s, kx, kyy, kw, kh, C.white, { r: 0.1, shadow: true });
    
    // Left indicator line
    s.addShape("rect", { x: kx, y: kyy, w: 0.08, h: kh, fill: { color: C.heal } });
    
    // KPI title
    s.addText(k[0], { x: kx + 0.22, y: kyy + 0.16, w: kw - 0.4, h: 0.3, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0 });
    // KPI description
    s.addText(k[1], { x: kx + 0.22, y: kyy + 0.44, w: kw - 0.4, h: 0.24, fontFace: F.b, fontSize: 9.5, color: C.mut, margin: 0 });
    
    // Major KPI target number
    s.addText(k[3], { x: kx + 0.22, y: kyy + 0.72, w: kw - 0.4, h: 0.54, fontFace: F.h, fontSize: 26, bold: true, color: C.heal, margin: 0, valign: "middle" });
    // Baseline note
    s.addText(k[2], { x: kx + 0.22, y: kyy + kh - 0.32, w: kw - 0.4, h: 0.22, fontFace: F.b, fontSize: 9.3, color: C.mutLt, margin: 0 });
  });

  // Right: 5-level Kirkpatrick evaluation model
  const rx = MX + lw + 0.4, rw = PW - MX - rx;
  s.addText("柯氏评估模型在心理健康的应用", { x: rx, y: ly, w: rw, h: 0.3, fontFace: F.h, fontSize: 14.5, bold: true, color: C.ink, margin: 0 });
  
  let yy = ly + 0.38;
  const eh = 0.86;
  EVAL.forEach((e, i) => {
    // Beautiful tapered cards that suggest a pyramid structure
    const taper = i * 0.14; 
    const curW = rw - 2 * taper;
    const curX = rx + taper;
    
    D.card(s, curX, yy, curW, eh, C.white, { r: 0.08, shadow: true });
    
    // Colored Badge representing level
    D.badge(s, curX + 0.14, yy + 0.18, 0.95, 0.5, e[0], e[3], C.white, 10.5);
    
    // Text description of the evaluation level
    s.addText(e[1], { x: curX + 1.25, y: yy + 0.1, w: curW - 2.5, h: 0.32, fontFace: F.h, fontSize: 12, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(e[2], { x: curX + 1.25, y: yy + 0.42, w: curW - 1.45, h: 0.36, fontFace: F.b, fontSize: 9.5, color: C.mut, margin: 0, valign: "top" });
    
    yy += eh + 0.05;
  });

  D.footer(s, n);
  s.addNotes("预期效果覆盖心理安全、留任意向、疗愈覆盖、疗愈效果四大维度，均有明确基线与目标。五层评估体系从使用率到长期影响，工具与频次清晰，效果可衡量可验证。");
}

// ─────────────────── SUMMARY (p10)
function summary(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.ink);
  // Split visual layout
  s.addShape("rect", { x: PW / 2, y: 0, w: PW / 2, h: PH, fill: { color: C.deep }, line: { type: "none" } });

  s.addText("商业价值与社会效益双赢", { x: 0, y: 0.65, w: PW, h: 0.36, fontFace: F.b, fontSize: 13, bold: true, color: C.amber, align: "center", charSpacing: 3, margin: 0 });
  s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变", {
    x: 0, y: 1.05, w: PW, h: 0.65, fontFace: F.h, fontSize: 28, bold: true, color: C.white, align: "center", margin: 0 });

  const colW = (PW - 2 * MX - 0.5) / 2;
  const cy = 2.1, ch = 3.9;
  
  // Left: AI value card
  D.card(s, MX, cy, colW, ch, "1B2A3A", { r: 0.12, noBorder: true });
  s.addShape("rect", { x: MX, y: cy, w: colW, h: 0.08, fill: { color: C.ai } });
  
  D.badge(s, MX + 0.35, cy + 0.3, 0.6, 0.44, "AI", C.ai, C.white, 13);
  s.addText("对 AI/SaaS 赛道评委的交付价值", { x: MX + 1.1, y: cy + 0.3, w: colW - 1.3, h: 0.44, fontFace: F.h, fontSize: 16.5, bold: true, color: C.white, valign: "middle", margin: 0 });
  
  const aiVals = [
    "「AI 树洞」技术架构极其轻量，极易通过企业微信等落地部署，具备卓越的商业复制性",
    "针对隐私提供一整套脱敏哈希、无痕聊天与一键销毁等严密制度，彻底跨越合规红线",
    "AI 边界明确，严格定位为「倾听与预警吹哨人」，绝不越俎代庖替代专业的心理干预"
  ];
  
  let ay = cy + 1.05;
  aiVals.forEach((v) => {
    s.addText("✓", { x: MX + 0.38, y: ay, w: 0.32, h: 0.6, fontFace: F.b, fontSize: 15, bold: true, color: C.sage, margin: 0 });
    s.addText(v, { x: MX + 0.72, y: ay, w: colW - 1.0, h: 0.75, fontFace: F.b, fontSize: 12.5, color: "D5E2EC", margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
    ay += 0.88;
  });

  // Right: Healing value card
  const hx = MX + colW + 0.5;
  D.card(s, hx, cy, colW, ch, "322622", { r: 0.12, noBorder: true });
  s.addShape("rect", { x: hx, y: cy, w: colW, h: 0.08, fill: { color: C.heal } });
  
  D.badge(s, hx + 0.35, cy + 0.3, 0.6, 0.44, "疗愈", C.heal, C.white, 13);
  s.addText("对疗愈与 EAP 赛道评委的专业价值", { x: hx + 1.1, y: cy + 0.3, w: colW - 1.3, h: 0.44, fontFace: F.h, fontSize: 16.5, bold: true, color: C.white, valign: "middle", margin: 0 });
  
  const healVals = [
    "正念减压、表达性艺术治疗、巴林特小组及叙事学理论基础夯实，拒绝纯娱乐化团建",
    "明确凸显疗愈师在情绪深层转化及一对一陪伴中的主体地位，AI 不削弱疗愈师重要性",
    "首创针对高内耗行业的差异化定制疗愈课程，避免一刀切，极大提升组织干预效果",
    "数据指标及处置路径严格遵循 IAOTH 国际伦理规范，保证全周期学术级严谨度"
  ];
  
  let hy = cy + 1.05;
  healVals.forEach((v) => {
    s.addText("✓", { x: hx + 0.38, y: hy, w: 0.32, h: 0.6, fontFace: F.b, fontSize: 15, bold: true, color: C.amber, margin: 0 });
    s.addText(v, { x: hx + 0.72, y: hy, w: colW - 1.0, h: 0.62, fontFace: F.b, fontSize: 12.5, color: "EAD9D0", margin: 0, valign: "top", lineSpacingMultiple: 1.12 });
    hy += 0.68;
  });

  s.addText("MindBridge AI + 疗愈轨道　·　用数字科技温情守护职场心灵", {
    x: 0, y: PH - 0.95, w: PW, h: 0.4, fontFace: F.b, fontSize: 13, italic: true, color: C.sage, align: "center", margin: 0 });

  D.footer(s, n, true);
  s.addNotes("双赢价值总结：对AI评委，方案真实可落地、隐私伦理严谨、AI定位清晰；对疗愈评委，理论基础扎实、疗愈师主体性明确、行业差异化、与IAOTH对齐。");
}

module.exports = {
  cover, dualTrack, industries, scenarios, industriesAndScenarios,
  activitiesGeneral, activitiesIndustry, treeholeCombined, treeholeTech,
  treeholeWarning, recommend, results, summary,
};
