const D = require("./design.js");
const { C, F, PW, PH, MX } = D;

// ─────────────────────────────────────────────────────────── COVER (p1)
function cover(pres) {
  const s = pres.addSlide();
  D.bg(s, C.ink);
  // subtle deep panel band on right for the "AI" side
  s.addShape("rect", { x: PW / 2, y: 0, w: PW / 2, h: PH, fill: { color: C.deep } });
  // large infinity dual-rail motif center
  s.addShape("ellipse", { x: PW / 2 - 1.55, y: 2.35, w: 1.5, h: 1.5, fill: { type: "none" }, line: { color: C.heal, width: 6 } });
  s.addShape("ellipse", { x: PW / 2 + 0.05, y: 2.35, w: 1.5, h: 1.5, fill: { type: "none" }, line: { color: C.ai, width: 6 } });
  s.addShape("ellipse", { x: PW / 2 - 0.14, y: 2.93, w: 0.34, h: 0.34, fill: { color: C.amber } });

  s.addText("国际疗愈师赛题  ×  AI 应用创新赛道", {
    x: 0, y: 0.9, w: PW, h: 0.36, fontFace: F.b, fontSize: 13, bold: true,
    color: C.amber, align: "center", charSpacing: 2, margin: 0,
  });
  s.addText("MindBridge AI", {
    x: 0, y: 4.25, w: PW, h: 0.95, fontFace: F.h, fontSize: 58, bold: true,
    color: C.white, align: "center", margin: 0,
  });
  s.addText("+  疗愈轨道", {
    x: 0, y: 5.18, w: PW, h: 0.6, fontFace: F.h, fontSize: 26, bold: true,
    color: C.aiLt, align: "center", margin: 0,
  });
  s.addText("企业员工心理安全与成长共生系统", {
    x: 0, y: 5.95, w: PW, h: 0.5, fontFace: F.b, fontSize: 17,
    color: "9FB2C0", align: "center", charSpacing: 1, margin: 0,
  });
  // tagline
  s.addText("AI 不替代疗愈，而是让疗愈服务在关键时刻可及", {
    x: 0, y: 6.7, w: PW, h: 0.4, fontFace: F.b, fontSize: 13, italic: true,
    color: C.sage, align: "center", margin: 0,
  });
  s.addNotes("我们带来的不是单纯的AI工具，也不是传统的EAP服务，而是一个AI预警与推荐 + 疗愈师深度陪伴的双轨系统。AI不替代疗愈，而是让疗愈服务在关键时刻可及。");
}

// ─────────────────────────────────────────────────────── DUAL TRACK (p2)
function dualTrack(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "核心创意 · 双轨定位", title: "双轨并行 —— AI 负责广度，疗愈负责深度" });

  // problem statement strip
  D.card(s, MX, 1.62, PW - 2 * MX, 0.78, C.panel, { r: 0.1 });
  s.addText([
    { text: "痛点  ", options: { bold: true, color: C.heal } },
    { text: "员工要么不敢求助，要么求助后只得到「治标不治本」的话术。本方案创造性提出 ", options: { color: C.txt } },
    { text: "「AI 预警与推荐 + 疗愈师深度陪伴」", options: { bold: true, color: C.ink } },
    { text: " 双轨模型。", options: { color: C.txt } },
  ], { x: MX + 0.25, y: 1.62, w: PW - 2 * MX - 0.5, h: 0.78, fontFace: F.b, fontSize: 13.5, valign: "middle", margin: 0 });

  // two track columns
  const colW = (PW - 2 * MX - 0.4) / 2;
  const ty = 2.68, th = 2.75;
  // AI track
  D.card(s, MX, ty, colW, th, C.aiLt, { r: 0.14, shadow: true });
  s.addShape("ellipse", { x: MX + 0.35, y: ty + 0.32, w: 0.62, h: 0.62, fill: { color: C.ai } });
  s.addText("AI", { x: MX + 0.35, y: ty + 0.32, w: 0.62, h: 0.62, fontFace: F.h, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("AI 轨道", { x: MX + 1.1, y: ty + 0.34, w: colW - 1.3, h: 0.34, fontFace: F.h, fontSize: 19, bold: true, color: C.aiDk, margin: 0, valign: "middle" });
  s.addText("倾听者 + 匹配师", { x: MX + 1.1, y: ty + 0.68, w: colW - 1.3, h: 0.3, fontFace: F.b, fontSize: 12, color: C.ai, margin: 0, valign: "middle" });
  s.addText([
    { text: "核心任务　", options: { bold: true, color: C.aiDk } },
    { text: "AI 树洞情绪识别、预警、个性化推荐\n", options: { color: C.txt } },
    { text: "赛题对齐　", options: { bold: true, color: C.aiDk } },
    { text: "数字疗愈与 AI 辅助支持", options: { color: C.txt } },
  ], { x: MX + 0.35, y: ty + 1.2, w: colW - 0.7, h: 1.4, fontFace: F.b, fontSize: 13, lineSpacingMultiple: 1.35, valign: "top", margin: 0 });

  // Healing track
  const hx = MX + colW + 0.4;
  D.card(s, hx, ty, colW, th, C.healLt, { r: 0.14, shadow: true });
  s.addShape("ellipse", { x: hx + 0.35, y: ty + 0.32, w: 0.62, h: 0.62, fill: { color: C.heal } });
  s.addText("疗", { x: hx + 0.35, y: ty + 0.32, w: 0.62, h: 0.62, fontFace: F.h, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("疗愈轨道", { x: hx + 1.1, y: ty + 0.34, w: colW - 1.3, h: 0.34, fontFace: F.h, fontSize: 19, bold: true, color: C.healDk, margin: 0, valign: "middle" });
  s.addText("转化师 + 陪伴者", { x: hx + 1.1, y: ty + 0.68, w: colW - 1.3, h: 0.3, fontFace: F.b, fontSize: 12, color: C.heal, margin: 0, valign: "middle" });
  s.addText([
    { text: "核心任务　", options: { bold: true, color: C.healDk } },
    { text: "能量疗愈、情绪疏导、深层转化\n", options: { color: C.txt } },
    { text: "赛题对齐　", options: { bold: true, color: C.healDk } },
    { text: "疗愈师主体性与专业胜任力", options: { color: C.txt } },
  ], { x: hx + 0.35, y: ty + 1.2, w: colW - 0.7, h: 1.4, fontFace: F.b, fontSize: 13, lineSpacingMultiple: 1.35, valign: "top", margin: 0 });

  // core belief band
  D.card(s, MX, 5.68, PW - 2 * MX, 0.82, C.ink, { r: 0.12 });
  s.addText([
    { text: "核心理念　", options: { bold: true, color: C.amber } },
    { text: "AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由疗愈师完成。", options: { color: C.white } },
  ], { x: MX + 0.3, y: 5.68, w: PW - 2 * MX - 0.6, h: 0.82, fontFace: F.b, fontSize: 15, bold: true, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("双轨并行：AI负责广度识别与推荐，疗愈师负责深度转化。AI不做诊断，只做读数和吹哨，真正的疗愈由疗愈师完成。");
}

// ─────────────────────────────────── SIX INDUSTRIES (deck1 p3)
const INDUSTRIES = [
  ["互联网 / IT", "65.4% 将「线上秒回」列为第二大负担", 5],
  ["金融 / 银行", "42.9% 业绩压力为主要负担（全行业第一）", 5],
  ["医护 / 护理", "护理人员抑郁率达 11%", 4],
  ["教育", "部分教师抑郁检出率 ＞ 30%", 4],
  ["客服 / 服务业", "餐饮服务员女性抑郁率 15%", 3],
  ["制造 / 汽车业", "新车上市月均加班 140 小时", 3],
];
function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

function industries(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "市场靶向", title: "六大高内耗行业 —— 谁最急需？" });

  // 2 x 3 grid of industry cards
  const cols = 3, rows = 2, gx = 0.32, gy = 0.34;
  const gw = (PW - 2 * MX - (cols - 1) * gx) / cols;
  const gh = 1.62, y0 = 1.78;
  INDUSTRIES.forEach((it, i) => {
    const cx = MX + (i % cols) * (gw + gx);
    const cy = y0 + Math.floor(i / cols) * (gh + gy);
    D.card(s, cx, cy, gw, gh, C.panel, { r: 0.12, shadow: true });
    // number chip
    s.addShape("ellipse", { x: cx + 0.28, y: cy + 0.28, w: 0.5, h: 0.5, fill: { color: C.ai } });
    s.addText(String(i + 1), { x: cx + 0.28, y: cy + 0.28, w: 0.5, h: 0.5, fontFace: F.h, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(it[0], { x: cx + 0.92, y: cy + 0.26, w: gw - 1.1, h: 0.54, fontFace: F.h, fontSize: 16, bold: true, color: C.ink, valign: "middle", margin: 0 });
    s.addText(it[1], { x: cx + 0.3, y: cy + 0.86, w: gw - 0.6, h: 0.5, fontFace: F.b, fontSize: 11.5, color: C.txt, valign: "top", margin: 0, lineSpacingMultiple: 1.1 });
    s.addText(stars(it[2]), { x: cx + 0.3, y: cy + gh - 0.42, w: gw - 0.6, h: 0.32, fontFace: F.b, fontSize: 13, color: C.gold, margin: 0, valign: "middle" });
  });

  // market support strip
  D.card(s, MX, 5.86, PW - 2 * MX, 0.7, C.sageLt, { r: 0.1 });
  s.addText([
    { text: "市场支撑　", options: { bold: true, color: C.sage } },
    { text: "2025 年南网数字集团、海南电网、长江电力等多家大型企业已公开采购员工心理关爱服务。", options: { color: C.txt } },
  ], { x: MX + 0.28, y: 5.86, w: PW - 2 * MX - 0.56, h: 0.7, fontFace: F.b, fontSize: 12.5, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("六大高内耗行业按采购优先级排序，互联网与金融为最高优先级。2025年已有大型企业公开采购员工心理关爱服务，市场真实存在。");
}

// ─────────────────────────────── SEVEN SCENARIOS (deck1 p4)
const SCENARIOS = [
  ["通用预防型", "24h 倾诉 + 自动推送资源", "全员心理教育 + 自助工具包"],
  ["互联网 / IT", "识别焦虑、「被替代」关键词", "正念工作坊 + 叙事疗愈小组"],
  ["金融 / 银行", "监测业绩高压倾诉", "积极心理培训 + 跨团队小组"],
  ["医护 / 护理", "持续倾听 + 耗竭信号识别", "巴林特小组 + 困境盲盒工作坊"],
  ["教育", "追踪情绪耗竭 + 沟通焦虑", "奥尔夫音乐疗愈 + ABC 工作坊"],
  ["客服 / 服务业", "识别情绪崩溃风险", "心流插花 + 正念 + 芳香疗愈"],
  ["制造 / 汽车业", "识别社交隔离 + 疲劳分析", "沙盘疗愈 + 拳击课 + 心灵驿站"],
];
function scenarios(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "应用场景", title: "七大场景 —— 精准定义 AI 与疗愈的协同时刻" });
  D.trackLegend(s, PW - MX - 3.0, 0.72);

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.72, totalW,
    [ { label: "场景类型", w: 2.6 }, { label: "AI 轨道的角色", w: (totalW - 2.6) / 2 }, { label: "疗愈轨道的角色", w: (totalW - 2.6) / 2 } ],
    SCENARIOS, { accent: C.deep, rowH: 0.6, headH: 0.46, fs: 12.5 }
  );
  D.footer(s, n);
  s.addNotes("七大应用场景覆盖通用预防及六大行业，每个场景都精准定义了AI轨道与疗愈轨道各自的角色与协同时刻。");
}

// ───────────────── INDUSTRIES + SCENARIOS combined (deck2 p3)
function industriesAndScenarios(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "市场靶向 + 应用场景", title: "六大高内耗行业靶向 + 七大应用场景" });

  // Left: six industries as compact rows
  const lw = 4.7, lx = MX, ly = 1.66;
  s.addText("六大高内耗行业", { x: lx, y: ly, w: lw, h: 0.34, fontFace: F.h, fontSize: 15, bold: true, color: C.ink, margin: 0 });
  const rH = 0.56, r0 = ly + 0.46;
  INDUSTRIES.forEach((it, i) => {
    const ry = r0 + i * (rH + 0.08);
    D.card(s, lx, ry, lw, rH, i % 2 ? C.panel : C.white, { r: 0.06, line: C.line, lw: 0.75 });
    s.addText(it[0], { x: lx + 0.18, y: ry, w: 2.0, h: rH, fontFace: F.b, fontSize: 12.5, bold: true, color: C.ink, valign: "middle", margin: 0 });
    s.addText(stars(it[2]), { x: lx + lw - 1.35, y: ry, w: 1.2, h: rH, fontFace: F.b, fontSize: 12, color: C.gold, align: "right", valign: "middle", margin: 0 });
    s.addText(it[1].replace(/（.*?）/g, ""), { x: lx + 2.05, y: ry, w: lw - 3.4, h: rH, fontFace: F.b, fontSize: 9.5, color: C.mut, valign: "middle", margin: 0, lineSpacingMultiple: 0.95 });
  });

  // Right: seven scenarios compact
  const rx = MX + lw + 0.4, rw = PW - MX - rx;
  s.addText("七大应用场景（AI 轨道 · 疗愈轨道）", { x: rx, y: ly, w: rw, h: 0.34, fontFace: F.h, fontSize: 15, bold: true, color: C.ink, margin: 0 });
  const sH = 0.56, s0 = ly + 0.46;
  SCENARIOS.forEach((it, i) => {
    const ry = s0 + i * (sH + 0.03);
    D.card(s, rx, ry, rw, sH, i % 2 ? C.panel : C.white, { r: 0.06, line: C.line, lw: 0.75 });
    s.addText(it[0], { x: rx + 0.16, y: ry, w: 1.75, h: sH, fontFace: F.b, fontSize: 11, bold: true, color: C.ink, valign: "middle", margin: 0 });
    s.addShape("ellipse", { x: rx + 1.95, y: ry + sH / 2 - 0.05, w: 0.1, h: 0.1, fill: { color: C.ai } });
    s.addText(it[1], { x: rx + 2.12, y: ry, w: (rw - 2.1) / 2 - 0.1, h: sH, fontFace: F.b, fontSize: 8.8, color: C.aiDk, valign: "middle", margin: 0, lineSpacingMultiple: 0.95 });
    s.addShape("ellipse", { x: rx + 2.1 + (rw - 2.1) / 2, y: ry + sH / 2 - 0.05, w: 0.1, h: 0.1, fill: { color: C.heal } });
    s.addText(it[2], { x: rx + 2.27 + (rw - 2.1) / 2, y: ry, w: (rw - 2.1) / 2 - 0.25, h: sH, fontFace: F.b, fontSize: 8.8, color: C.healDk, valign: "middle", margin: 0, lineSpacingMultiple: 0.95 });
  });

  D.footer(s, n);
  s.addNotes("左侧六大高内耗行业按采购优先级排序，右侧七大应用场景对应AI轨道与疗愈轨道的协同角色。2025年已有大型企业公开采购员工心理关爱服务。");
}

// ─────────────────── ACTIVITIES general version
const ACT_GENERAL = [
  ["焦虑紧张型", "赶工恐慌、心跳加速", "正念呼吸工作坊", "90 分钟"],
  ["耗竭疲惫型", "身心俱疲、情绪麻木", "能量唤醒工作坊", "2 小时"],
  ["情绪劳动型", "强撑笑脸、情感透支", "艺术疗愈工作坊", "2 小时"],
  ["孤独无意义型", "价值感丧失、存在性焦虑", "叙事疗愈深度小组", "2h × 4 次"],
  ["躯体紧张型", "肩颈僵硬、压抑愤怒", "身体觉知与释放", "2 小时"],
  ["混合 / 预防型", "团队凝聚力下降", "心理嘉年华游园会", "半天"],
];
function activitiesGeneral(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "疗愈交付 · 通用版", title: "按情绪类型快速匹配疗愈活动" });

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.72, totalW,
    [ { label: "情绪类型", w: 2.5 }, { label: "典型表现", w: 3.6 }, { label: "推荐活动", w: 3.6 }, { label: "时长", w: totalW - 9.7, align: "center" } ],
    ACT_GENERAL, { accent: C.heal, rowH: 0.58, headH: 0.46, fs: 12.5 }
  );
  D.card(s, MX, 6.02, totalW, 0.56, C.healLt, { r: 0.1 });
  s.addText([
    { text: "核心亮点　", options: { bold: true, color: C.healDk } },
    { text: "每个活动均标注理论依据 —— MBSR、表达性艺术治疗、叙事疗愈、躯体疗法等。", options: { color: C.txt } },
  ], { x: MX + 0.28, y: 6.02, w: totalW - 0.56, h: 0.56, fontFace: F.b, fontSize: 12.5, valign: "middle", margin: 0 });
  D.footer(s, n);
  s.addNotes("通用版按六种情绪类型快速匹配疗愈活动，每个活动都有明确的理论依据支撑，非随意拼凑。");
}

// ─────────────────── ACTIVITIES industry version
const ACT_IND = [
  ["互联网 / IT", "怕被替代、怕赶不上", "情绪红绿灯正念工作坊", "可控与不可控拆解"],
  ["金融 / 银行", "业绩压得喘不过气", "积极心理与管理提升培训", "情绪暂停法"],
  ["医护 / 护理", "面对痛苦掏空了自己", "巴林特小组", "不评判 · 不打断 · 不指导"],
  ["教育", "多重角色耗竭", "奥尔夫音乐疗愈", "简易乐器合奏"],
  ["客服 / 服务业", "强撑笑脸耗尽了我", "心流插花", "花材选择 + 创作命名"],
  ["制造 / 汽车业", "孤独扛着双重压力", "沙盘疗愈", "团队沙盘共创"],
];
function activitiesIndustry(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "疗愈交付 · 行业版", title: "六大行业精准痛点对标" });

  const totalW = PW - 2 * MX;
  D.dataTable(s, MX, 1.72, totalW,
    [ { label: "行业", w: 2.3 }, { label: "最核心痛点", w: 3.3 }, { label: "首选活动", w: 3.4 }, { label: "关键环节", w: totalW - 9.0 } ],
    ACT_IND.map(r => [r[0], "「" + r[1] + "」", r[2], r[3]]),
    { accent: C.deep, rowH: 0.62, headH: 0.46, fs: 12 }
  );
  D.footer(s, n);
  s.addNotes("行业版针对六大行业各自最核心的痛点，配置差异化首选活动与关键环节设计，体现非模板化。");
}

// ─────────────────── TREEHOLE combined (deck1 p7)
const WARN3 = [
  ["绿色", "「好累」「压力大」", "自动推送正念音频", C.sage],
  ["黄色", "「快撑不住了」「想辞职」", "推送资源 + 提醒 HRBP", C.amber],
  ["红色", "极端词汇", "立即转接专业咨询师", C.heal],
];
function treeholeCombined(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "AI 识别引擎", title: "AI 树洞 —— 轻量级情绪识别与预警" });

  // Left: what is treehole + 3 abilities
  const lw = 5.7, lx = MX, ly = 1.7;
  D.card(s, lx, ly, lw, 1.15, C.aiLt, { r: 0.12 });
  s.addText("什么是 AI 树洞？", { x: lx + 0.28, y: ly + 0.16, w: lw - 0.5, h: 0.3, fontFace: F.h, fontSize: 14, bold: true, color: C.aiDk, margin: 0 });
  s.addText("24h 在线匿名倾诉平台，员工通过企业微信 / 钉钉 / 小程序进入，完全匿名。真实案例：郑州高新区总工会 AI 树洞上线后累计响应超 1300 次。", {
    x: lx + 0.28, y: ly + 0.48, w: lw - 0.56, h: 0.6, fontFace: F.b, fontSize: 11.5, color: C.txt, margin: 0, lineSpacingMultiple: 1.15, valign: "top" });

  const abilities = [
    ["倾听与共情回应", "承接员工情绪，让倾诉本身成为疗愈第一步"],
    ["关键词识别与预警", "扫描情绪关键词，判定绿 / 黄 / 红等级"],
    ["资源自动推送", "根据预警等级推送匹配的疗愈资源"],
  ];
  let ay = ly + 1.3;
  abilities.forEach((a, i) => {
    D.card(s, lx, ay, lw, 0.82, C.panel, { r: 0.1 });
    s.addShape("ellipse", { x: lx + 0.22, y: ay + 0.19, w: 0.44, h: 0.44, fill: { color: C.ai } });
    s.addText(String(i + 1), { x: lx + 0.22, y: ay + 0.19, w: 0.44, h: 0.44, fontFace: F.h, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(a[0], { x: lx + 0.8, y: ay + 0.1, w: lw - 1.0, h: 0.32, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(a[1], { x: lx + 0.8, y: ay + 0.42, w: lw - 1.0, h: 0.34, fontFace: F.b, fontSize: 10.5, color: C.mut, margin: 0, valign: "middle" });
    ay += 0.92;
  });

  // Right: 3-level warning
  const rx = MX + lw + 0.4, rw = PW - MX - rx;
  s.addText("三级预警机制", { x: rx, y: ly, w: rw, h: 0.34, fontFace: F.h, fontSize: 15, bold: true, color: C.ink, margin: 0 });
  let wy = ly + 0.5;
  WARN3.forEach((w) => {
    D.card(s, rx, wy, rw, 1.02, C.white, { r: 0.1, line: C.line, lw: 1 });
    s.addShape("roundRect", { x: rx, y: wy, w: 0.16, h: 1.02, rectRadius: 0.05, fill: { color: w[3] } });
    s.addShape("ellipse", { x: rx + 0.32, y: wy + 0.3, w: 0.42, h: 0.42, fill: { color: w[3] } });
    s.addText(w[0], { x: rx + 0.88, y: wy + 0.12, w: rw - 1.0, h: 0.32, fontFace: F.h, fontSize: 13.5, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText([
      { text: "关键词  ", options: { bold: true, color: C.mut } },
      { text: w[1] + "\n", options: { color: C.txt } },
      { text: "动作  ", options: { bold: true, color: C.mut } },
      { text: w[2], options: { color: C.txt } },
    ], { x: rx + 0.88, y: wy + 0.42, w: rw - 1.0, h: 0.56, fontFace: F.b, fontSize: 10.5, margin: 0, lineSpacingMultiple: 1.1, valign: "top" });
    wy += 1.14;
  });

  // key design band
  D.card(s, MX, 5.98, PW - 2 * MX, 0.6, C.ink, { r: 0.1 });
  s.addText([
    { text: "关键设计　", options: { bold: true, color: C.amber } },
    { text: "「AI 预警 + 人工复核」闭环 —— AI 不自动定性任何员工，疗愈师 / HRBP 复核后再决定介入。", options: { color: C.white } },
  ], { x: MX + 0.28, y: 5.98, w: PW - 2 * MX - 0.56, h: 0.6, fontFace: F.b, fontSize: 12.5, bold: true, valign: "middle", margin: 0 });
  D.footer(s, n);
  s.addNotes("AI树洞是24小时匿名倾诉平台。AI做三件事：倾听共情、关键词识别预警、资源自动推送。三级预警配合人工复核闭环，AI不自动定性任何员工。");
}

// ─────────────────── TREEHOLE tech (deck2 p6)
const TECH_LAYERS = [
  ["前端", "小程序 / H5 页面", "扫码即入，无需登录"],
  ["对话引擎", "DeepSeek / 通义千问等", "共情式对话能力"],
  ["规则引擎", "轻量级关键词匹配库", "识别情绪信号"],
  ["数据层", "匿名化存储", "仅存储情绪标签统计"],
];
function treeholeTech(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "AI 树洞识别（一）", title: "以 AI 树洞为核心的轻量级识别方式" });

  // Left: what + case
  const lw = 5.4, lx = MX, ly = 1.72;
  D.card(s, lx, ly, lw, 1.55, C.aiLt, { r: 0.12 });
  s.addText("什么是 AI 树洞？", { x: lx + 0.3, y: ly + 0.2, w: lw - 0.6, h: 0.32, fontFace: F.h, fontSize: 15, bold: true, color: C.aiDk, margin: 0 });
  s.addText("24h 在线匿名倾诉平台，员工通过企业微信 / 钉钉 / 小程序即可进入 —— 无需登录、不记录身份、不留痕迹。", {
    x: lx + 0.3, y: ly + 0.56, w: lw - 0.6, h: 0.9, fontFace: F.b, fontSize: 12, color: C.txt, margin: 0, lineSpacingMultiple: 1.25, valign: "top" });

  D.card(s, lx, ly + 1.75, lw, 1.05, C.sageLt, { r: 0.12 });
  s.addText([
    { text: "真实案例　", options: { bold: true, color: C.sage } },
    { text: "郑州高新区总工会心理健康智慧化平台接入 AI 大模型，上线后累计响应职工诉求超 1300 次。", options: { color: C.txt } },
  ], { x: lx + 0.3, y: ly + 1.75, w: lw - 0.6, h: 1.05, fontFace: F.b, fontSize: 12, valign: "middle", margin: 0, lineSpacingMultiple: 1.2 });

  D.card(s, lx, ly + 3.0, lw, 1.28, C.ink, { r: 0.12 });
  s.addText("核心设计原则", { x: lx + 0.3, y: ly + 3.14, w: lw - 0.6, h: 0.3, fontFace: F.h, fontSize: 13, bold: true, color: C.amber, margin: 0 });
  s.addText([
    { text: "· 不存储任何可识别身份的信息\n", options: {} },
    { text: "· 对话记录不保存原文，仅提取情绪标签\n", options: {} },
    { text: "· 员工可随时清空所有历史记录", options: {} },
  ], { x: lx + 0.3, y: ly + 3.46, w: lw - 0.6, h: 0.78, fontFace: F.b, fontSize: 11.5, color: "D5E0E8", margin: 0, lineSpacingMultiple: 1.2, valign: "top" });

  // Right: 4-layer tech stack
  const rx = MX + lw + 0.45, rw = PW - MX - rx;
  s.addText("技术实现 · 轻量级四层架构", { x: rx, y: ly, w: rw, h: 0.34, fontFace: F.h, fontSize: 15, bold: true, color: C.ink, margin: 0 });
  const layerColors = [C.ai, C.aiDk, C.sage, C.deep];
  let yy = ly + 0.5;
  TECH_LAYERS.forEach((L, i) => {
    D.card(s, rx, yy, rw, 0.86, C.panel, { r: 0.1, shadow: true });
    s.addShape("roundRect", { x: rx + 0.18, y: yy + 0.18, w: 1.3, h: 0.5, rectRadius: 0.08, fill: { color: layerColors[i] } });
    s.addText(L[0], { x: rx + 0.18, y: yy + 0.18, w: 1.3, h: 0.5, fontFace: F.h, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(L[1], { x: rx + 1.68, y: yy + 0.13, w: rw - 1.85, h: 0.36, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(L[2], { x: rx + 1.68, y: yy + 0.47, w: rw - 1.85, h: 0.3, fontFace: F.b, fontSize: 10.5, color: C.mut, margin: 0, valign: "middle" });
    yy += 0.98;
  });

  D.footer(s, n);
  s.addNotes("AI树洞采用轻量级四层架构：前端小程序、对话引擎、规则引擎、匿名化数据层。核心设计原则是隐私优先，不存储身份信息，仅提取情绪标签。");
}

// ─────────────────── TREEHOLE warning (deck2 p7)
const WARN3_FULL = [
  ["绿色", "「好累」「压力大」", "自动推送正念音频 / 呼吸练习链接", "无需人工介入", C.sage],
  ["黄色", "「快撑不住了」「想辞职」", "推送资源 + 提醒 HRBP 关注", "HRBP 查看该员工近期整体状态", C.amber],
  ["红色", "极端词汇", "立即转接专业咨询师 + 通知 EAP 专员", "EAP 专员 2 小时内电话确认", C.heal],
];
function treeholeWarning(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "AI 树洞识别（二）", title: "AI 做什么 + 三级预警机制" });

  // top: 3 abilities as row
  const abilities = [
    ["倾听与共情回应", "让倾诉本身成为疗愈第一步"],
    ["关键词识别与预警", "扫描情绪关键词判定等级"],
    ["资源自动推送", "按等级推送匹配疗愈资源"],
  ];
  const aw = (PW - 2 * MX - 2 * 0.3) / 3;
  abilities.forEach((a, i) => {
    const ax = MX + i * (aw + 0.3);
    D.card(s, ax, 1.66, aw, 0.92, C.aiLt, { r: 0.12 });
    s.addShape("ellipse", { x: ax + 0.24, y: 1.86, w: 0.5, h: 0.5, fill: { color: C.ai } });
    s.addText("①②③"[i], { x: ax + 0.24, y: 1.86, w: 0.5, h: 0.5, fontFace: F.h, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(a[0], { x: ax + 0.86, y: 1.76, w: aw - 1.0, h: 0.36, fontFace: F.h, fontSize: 12.5, bold: true, color: C.aiDk, margin: 0, valign: "middle" });
    s.addText(a[1], { x: ax + 0.86, y: 2.1, w: aw - 1.0, h: 0.34, fontFace: F.b, fontSize: 9.5, color: C.mut, margin: 0, valign: "middle" });
  });

  // 3-level warning table
  const totalW = PW - 2 * MX;
  const cols = [ { label: "等级", w: 1.1, align: "center" }, { label: "关键词示例", w: 2.9 }, { label: "AI 自动触发动作", w: 4.4 }, { label: "人工介入节点", w: totalW - 8.4 } ];
  // header
  const hy = 2.78;
  s.addShape("roundRect", { x: MX, y: hy, w: totalW, h: 0.46, rectRadius: 0.06, fill: { color: C.deep } });
  let cx = MX;
  cols.forEach((c) => { s.addText(c.label, { x: cx + 0.14, y: hy, w: c.w - 0.24, h: 0.46, fontFace: F.b, fontSize: 12, bold: true, color: C.white, align: c.align || "left", valign: "middle", margin: 0 }); cx += c.w; });
  let ry = hy + 0.52;
  WARN3_FULL.forEach((w) => {
    const rowH = 0.86;
    D.card(s, MX, ry, totalW, rowH, C.white, { r: 0.06, line: C.line, lw: 0.75 });
    s.addShape("roundRect", { x: MX, y: ry, w: 0.14, h: rowH, rectRadius: 0.04, fill: { color: w[4] } });
    // level cell w/ dot
    s.addShape("ellipse", { x: MX + 0.36, y: ry + rowH / 2 - 0.16, w: 0.32, h: 0.32, fill: { color: w[4] } });
    s.addText(w[0], { x: MX, y: ry + rowH / 2 + 0.02, w: 1.1, h: 0.28, fontFace: F.b, fontSize: 10.5, bold: true, color: C.ink, align: "center", margin: 0 });
    let xx = MX + cols[0].w;
    [w[1], w[2], w[3]].forEach((cell, ci) => {
      const c = cols[ci + 1];
      s.addText(cell, { x: xx + 0.14, y: ry, w: c.w - 0.26, h: rowH, fontFace: F.b, fontSize: 11, color: C.txt, valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
      xx += c.w;
    });
    ry += rowH + 0.06;
  });

  // closed-loop band
  D.card(s, MX, ry + 0.04, totalW, 0.62, C.ink, { r: 0.1 });
  s.addText([
    { text: "关键设计　", options: { bold: true, color: C.amber } },
    { text: "AI 预警后必须经人工复核，疗愈师或 HRBP 确认后再决定是否介入 —— AI 不自动定性任何员工。", options: { color: C.white } },
  ], { x: MX + 0.28, y: ry + 0.04, w: totalW - 0.56, h: 0.62, fontFace: F.b, fontSize: 12, bold: true, valign: "middle", margin: 0 });

  D.footer(s, n);
  s.addNotes("AI在树洞中做三件事，配合绿黄红三级预警。每级都有明确的AI自动动作和人工介入节点，红色预警EAP专员2小时内电话确认。核心是AI预警加人工复核的闭环。");
}

// ─────────────────── RECOMMEND engine (p8)
const MAP3 = [
  ["焦虑", "三分钟呼吸着陆法", "正念呼吸工作坊", "疗愈师一对一焦虑疏导"],
  ["疲惫", "工间身体扫描音频", "能量唤醒工作坊", "疗愈师一对一能量修复"],
  ["低落", "每日三件好事打卡", "叙事疗愈深度小组", "疗愈师一对一意义重构"],
];
const PERSONA = [
  ["员工画像", "岗位 · 部门 · 职级", "程序员推线上资源；工人推线下活动"],
  ["情绪轨迹", "近 30 天情绪标签变化", "持续疲惫→能量唤醒；突发焦虑→正念"],
  ["参与历史", "过往活动参与反馈", "正念好评者优先推送进阶叙事疗愈"],
];
function recommend(pres, n, withPersona) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "AI 推荐引擎", title: "把情绪信号翻译成可执行的疗愈方案" });

  // 3-step transform flow
  const steps = [
    ["①", "信号识别", "AI 树洞捕捉情绪信号", "情绪标签 + 预警等级", C.ai],
    ["②", "方案匹配", "按标签 · 画像 · 行业匹配", "个性化推荐清单", C.sage],
    ["③", "触达执行", "IM 自动推送 + 人工复核", "完整闭环", C.heal],
  ];
  const sw = (PW - 2 * MX - 2 * 0.7) / 3;
  const syy = 1.66;
  steps.forEach((st, i) => {
    const sx = MX + i * (sw + 0.7);
    D.card(s, sx, syy, sw, 1.35, C.panel, { r: 0.12, shadow: true });
    s.addShape("ellipse", { x: sx + 0.24, y: syy + 0.24, w: 0.56, h: 0.56, fill: { color: st[4] } });
    s.addText(st[0], { x: sx + 0.24, y: syy + 0.24, w: 0.56, h: 0.56, fontFace: F.h, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(st[1], { x: sx + 0.92, y: syy + 0.28, w: sw - 1.1, h: 0.44, fontFace: F.h, fontSize: 15, bold: true, color: C.ink, margin: 0, valign: "middle" });
    s.addText(st[2], { x: sx + 0.28, y: syy + 0.86, w: sw - 0.56, h: 0.3, fontFace: F.b, fontSize: 10.5, color: C.mut, margin: 0, valign: "middle" });
    s.addText("→ " + st[3], { x: sx + 0.28, y: syy + 1.06, w: sw - 0.56, h: 0.28, fontFace: F.b, fontSize: 10.5, bold: true, color: st[4], margin: 0, valign: "middle" });
    if (i < 2) s.addText("▸", { x: sx + sw + 0.14, y: syy, w: 0.44, h: 1.35, fontFace: F.b, fontSize: 22, bold: true, color: C.mutLt, align: "center", valign: "middle", margin: 0 });
  });

  // mapping table
  const totalW = PW - 2 * MX;
  const mapY = 3.28;
  s.addText("情绪标签 → 活动映射示例", { x: MX, y: mapY, w: totalW, h: 0.32, fontFace: F.h, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  const bottom = D.dataTable(s, MX, mapY + 0.42, totalW,
    [ { label: "情绪标签", w: 1.8, align: "center" }, { label: "绿色推送（自助）", w: (totalW - 1.8) / 3 }, { label: "黄色推荐（团体）", w: (totalW - 1.8) / 3 }, { label: "红色介入（一对一）", w: (totalW - 1.8) / 3 } ],
    MAP3, { accent: C.deep, rowH: withPersona ? 0.44 : 0.56, headH: 0.44, fs: withPersona ? 11 : 12.5 }
  );

  if (withPersona) {
    const py = bottom + 0.12;
    s.addText("个性化推荐逻辑", { x: MX, y: py, w: totalW, h: 0.3, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0 });
    const pw = (totalW - 2 * 0.3) / 3;
    PERSONA.forEach((p, i) => {
      const px = MX + i * (pw + 0.3);
      D.card(s, px, py + 0.36, pw, 0.86, C.aiLt, { r: 0.1 });
      s.addText(p[0], { x: px + 0.2, y: py + 0.44, w: pw - 0.4, h: 0.28, fontFace: F.h, fontSize: 11.5, bold: true, color: C.aiDk, margin: 0 });
      s.addText([
        { text: p[1] + "\n", options: { color: C.mut, italic: true } },
        { text: p[2], options: { color: C.txt } },
      ], { x: px + 0.2, y: py + 0.7, w: pw - 0.4, h: 0.5, fontFace: F.b, fontSize: 9.3, margin: 0, lineSpacingMultiple: 1.05, valign: "top" });
    });
  }

  D.footer(s, n);
  s.addNotes("推荐引擎三步转化：信号识别、方案匹配、触达执行。情绪标签按绿黄红三级映射到自助、团体、一对一活动" + (withPersona ? "。个性化推荐结合员工画像、情绪轨迹、参与历史三个维度。" : "，形成完整闭环。"));
}

// ─────────────────── RESULTS (p9)
const KPI = [
  ["心理安全", "PSI 得分（7 分）", "3.2–3.8", "≥ 5.5"],
  ["留任意向", "主动离职率", "35%", "≤ 15%"],
  ["疗愈覆盖", "AI 树洞使用率", "0%", "≥ 40%"],
  ["疗愈效果", "情绪改善比例", "0%", "≥ 60%"],
];
const EVAL = [
  ["L0", "使用率", "系统后台", "实时 / 周度", C.ai],
  ["L1", "即时反馈", "情绪温度计", "每场活动后", C.aiDk],
  ["L2", "短期效果", "简讯随访", "第 3 / 7 天", C.sage],
  ["L3", "中期效果", "PSI 问卷", "月度 / 季度", C.amber],
  ["L4", "长期影响", "离职率 + 绩效", "半年 / 年度", C.heal],
];
function results(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.white);
  D.header(s, { kicker: "预期效果 · 评估方式", title: "效果可衡量、可验证" });

  // Left: KPI cards 2x2
  const lw = 6.2, lx = MX, ly = 1.72;
  s.addText("预期效果总览", { x: lx, y: ly, w: lw, h: 0.32, fontFace: F.h, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  const kw = (lw - 0.3) / 2, kh = 1.62, ky0 = ly + 0.44;
  KPI.forEach((k, i) => {
    const kx = lx + (i % 2) * (kw + 0.3);
    const kyy = ky0 + Math.floor(i / 2) * (kh + 0.26);
    D.card(s, kx, kyy, kw, kh, C.panel, { r: 0.12, shadow: true });
    s.addText(k[0], { x: kx + 0.24, y: kyy + 0.18, w: kw - 0.48, h: 0.3, fontFace: F.h, fontSize: 13, bold: true, color: C.ink, margin: 0 });
    s.addText(k[1], { x: kx + 0.24, y: kyy + 0.5, w: kw - 0.48, h: 0.28, fontFace: F.b, fontSize: 10, color: C.mut, margin: 0 });
    s.addText(k[3], { x: kx + 0.24, y: kyy + 0.76, w: kw - 0.48, h: 0.56, fontFace: F.h, fontSize: 30, bold: true, color: C.heal, margin: 0, valign: "middle" });
    s.addText("基线 " + k[2], { x: kx + 0.24, y: kyy + kh - 0.34, w: kw - 0.48, h: 0.26, fontFace: F.b, fontSize: 9.5, color: C.mutLt, margin: 0 });
  });

  // Right: 4/5-layer evaluation pyramid-ish stack
  const rx = MX + lw + 0.5, rw = PW - MX - rx;
  s.addText("五层评估体系", { x: rx, y: ly, w: rw, h: 0.32, fontFace: F.h, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  let yy = ly + 0.44;
  const eh = 0.82;
  EVAL.forEach((e, i) => {
    const inset = i * 0.18; // pyramid taper
    D.card(s, rx + inset, yy, rw - 2 * inset, eh, C.white, { r: 0.08, line: C.line, lw: 0.75 });
    s.addShape("roundRect", { x: rx + inset + 0.12, y: yy + 0.15, w: 0.7, h: 0.52, rectRadius: 0.06, fill: { color: e[4] } });
    s.addText(e[0], { x: rx + inset + 0.12, y: yy + 0.15, w: 0.7, h: 0.52, fontFace: F.h, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText([
      { text: e[1] + "　", options: { bold: true, color: C.ink } },
      { text: e[2], options: { color: C.mut } },
    ], { x: rx + inset + 0.94, y: yy + 0.12, w: rw - 2 * inset - 2.1, h: eh - 0.24, fontFace: F.b, fontSize: 11, valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
    s.addText(e[3], { x: rx + inset + rw - 2 * inset - 1.35, y: yy, w: 1.2, h: eh, fontFace: F.b, fontSize: 9.5, color: e[4], bold: true, align: "right", valign: "middle", margin: 0 });
    yy += eh + 0.06;
  });

  D.footer(s, n);
  s.addNotes("预期效果覆盖心理安全、留任意向、疗愈覆盖、疗愈效果四大维度，均有明确基线与目标。五层评估体系从使用率到长期影响，工具与频次清晰，效果可衡量可验证。");
}

// ─────────────────── SUMMARY (p10)
function summary(pres, n) {
  const s = pres.addSlide();
  D.bg(s, C.ink);
  s.addShape("rect", { x: PW / 2, y: 0, w: PW / 2, h: PH, fill: { color: C.deep } });

  s.addText("双赢价值", { x: 0, y: 0.6, w: PW, h: 0.36, fontFace: F.b, fontSize: 13, bold: true, color: C.amber, align: "center", charSpacing: 3, margin: 0 });
  s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变", {
    x: 0, y: 0.98, w: PW, h: 0.7, fontFace: F.h, fontSize: 30, bold: true, color: C.white, align: "center", margin: 0 });

  const colW = (PW - 2 * MX - 0.5) / 2;
  const cy = 2.15, ch = 3.75;
  // AI value
  D.card(s, MX, cy, colW, ch, "1B3446", { r: 0.14 });
  s.addShape("ellipse", { x: MX + 0.4, y: cy + 0.36, w: 0.6, h: 0.6, fill: { color: C.ai } });
  s.addText("AI", { x: MX + 0.4, y: cy + 0.36, w: 0.6, h: 0.6, fontFace: F.h, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("对 AI 评委的价值", { x: MX + 1.15, y: cy + 0.4, w: colW - 1.4, h: 0.55, fontFace: F.h, fontSize: 18, bold: true, color: C.aiLt, valign: "middle", margin: 0 });
  const aiVals = [
    "AI 树洞 + 轻量级推荐引擎，非实验室设想",
    "隐私与伦理设计严谨：匿名化 · 人工复核 · 可退出",
    "AI 定位清晰：不做诊断，只做「吹哨」",
  ];
  let ay = cy + 1.25;
  aiVals.forEach((v) => {
    s.addText("✓", { x: MX + 0.42, y: ay, w: 0.4, h: 0.6, fontFace: F.b, fontSize: 15, bold: true, color: C.sage, margin: 0, valign: "top" });
    s.addText(v, { x: MX + 0.82, y: ay, w: colW - 1.15, h: 0.7, fontFace: F.b, fontSize: 13, color: "DCE6EC", margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
    ay += 0.82;
  });

  // Healing value
  const hx = MX + colW + 0.5;
  D.card(s, hx, cy, colW, ch, "3A2A24", { r: 0.14 });
  s.addShape("ellipse", { x: hx + 0.4, y: cy + 0.36, w: 0.6, h: 0.6, fill: { color: C.heal } });
  s.addText("疗", { x: hx + 0.4, y: cy + 0.36, w: 0.6, h: 0.6, fontFace: F.h, fontSize: 17, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("对疗愈评委的价值", { x: hx + 1.15, y: cy + 0.4, w: colW - 1.4, h: 0.55, fontFace: F.h, fontSize: 18, bold: true, color: C.healLt, valign: "middle", margin: 0 });
  const healVals = [
    "工作坊有清晰疗愈理论基础：巴林特 · 奥尔夫 · 叙事 · MBSR",
    "疗愈师角色被充分定义，AI 不替代疗愈师",
    "六大行业差异化活动设计，非模板化",
    "与 IAOTH 认证与伦理对齐",
  ];
  let hy = cy + 1.2;
  healVals.forEach((v) => {
    s.addText("✓", { x: hx + 0.42, y: hy, w: 0.4, h: 0.6, fontFace: F.b, fontSize: 15, bold: true, color: C.amber, margin: 0, valign: "top" });
    s.addText(v, { x: hx + 0.82, y: hy, w: colW - 1.15, h: 0.7, fontFace: F.b, fontSize: 13, color: "EAD9D0", margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
    hy += 0.64;
  });

  s.addText("MindBridge AI + 疗愈轨道　·　让疗愈服务在关键时刻可及", {
    x: 0, y: 6.35, w: PW, h: 0.5, fontFace: F.b, fontSize: 14, italic: true, color: C.sage, align: "center", margin: 0 });

  D.footer(s, n, true);
  s.addNotes("双赢价值总结：对AI评委，方案真实可落地、隐私伦理严谨、AI定位清晰；对疗愈评委，理论基础扎实、疗愈师主体性明确、行业差异化、与IAOTH对齐。");
}

module.exports = {
  cover, dualTrack, industries, scenarios, industriesAndScenarios,
  activitiesGeneral, activitiesIndustry, treeholeCombined, treeholeTech,
  treeholeWarning, recommend, results, summary,
};
