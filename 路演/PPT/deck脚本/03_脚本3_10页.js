const L = require("../工具库/lib.js");
const { C, HF } = L;
const p = L.newDeck();
const OUT = process.argv[2] || __dirname + "/../成品/MindBridge_脚本3.pptx";

// P1 cover
L.cover(p);
// P2 dual track
L.dualTrack(p);

// P3 企业应用场景(一) 六大行业靶向
let s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"企业应用场景 (一)","方案针对哪些企业场景？—— 六大高内耗行业靶向");
L.table(p,s,{ x:0.8,y:1.85,w:11.75,colFr:[2.2,6.6,2.2],
  headers:["行业","核心内耗表现","采购优先级"],
  rows:[
    ["互联网 / IT","65.4% 视「线上秒回」为第二大负担；「被替代」焦虑","★★★★★"],
    ["金融 / 银行","42.9% 业绩压力为主要负担（全行业第一）","★★★★★"],
    ["医护 / 护理","护理人员抑郁率达 11%；共情疲劳高发","★★★★☆"],
    ["教育","部分教师抑郁检出率 ＞30%；多重角色耗竭","★★★★☆"],
    ["客服 / 服务业","餐饮服务员女性抑郁率 15%；情绪劳动疲劳","★★★☆☆"],
    ["制造 / 汽车业","新车上市月均加班 140 小时；产线孤独感","★★★☆☆"],
  ], rowH:0.53, fs:12.5, starCol:2 });
// market stats
const ms=[["52.1%","职场人曾有焦虑不安等心理表现"],["83.7%","认为情绪劳动已不限于服务行业"],["多家央企","南网数字集团、海南电网等已采购"]];
ms.forEach((m,i)=>{
  const x=0.8+i*3.95, y=5.95;
  L.card(p,s,x,y,3.75,1.15,C.FOREST,{shadow:L.shadow()});
  s.addText(m[0],{ x:x+0.25,y:y+0.13,w:3.3,h:0.5, fontFace:HF, color:C.AMBERL, fontSize:25, bold:true });
  s.addText(m[1],{ x:x+0.25,y:y+0.63,w:3.3,h:0.45, fontFace:HF, color:C.CREAMTXT, fontSize:12, lineSpacingMultiple:1.1 });
});

// P4 企业应用场景(二) 七大场景
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"企业应用场景 (二)","精准定义 AI 与疗愈的协同时刻 —— 七大应用场景");
L.table(p,s,{ x:0.8,y:1.9,w:11.75,colFr:[2.3,4.7,4.7],
  headers:["场景类型","AI 轨道的角色","疗愈轨道的角色"],
  rows:[
    ["通用预防型","AI树洞24h倾诉 + 自动推送资源","全员心理健康教育 + 自助工具包"],
    ["互联网 / IT","识别焦虑、「被替代」关键词","正念工作坊 + 叙事疗愈小组"],
    ["金融 / 银行","监测业绩高压倾诉","积极心理培训 + 跨团队疗愈小组"],
    ["医护 / 护理","持续倾听 + 情绪耗竭识别","巴林特小组 + 困境盲盒工作坊"],
    ["教育","追踪情绪耗竭 + 沟通焦虑","奥尔夫音乐疗愈 + ABC理论工作坊"],
    ["客服 / 服务业","识别情绪崩溃风险","心流插花 + 正念冥想 + 芳香疗愈"],
    ["制造 / 汽车业","识别社交隔离 + 疲劳分析","沙盘疗愈 + 拳击课 + 心灵驿站"],
  ], rowH:0.66, fs:12.5 });

// P5 目标人群
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"目标人群","方案面向谁？—— 三层目标人群");
s.addText("第一层 · 直接人群（六大高内耗行业全体员工）",{ x:0.8,y:1.8,w:7,h:0.35, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
L.table(p,s,{ x:0.8,y:2.2,w:7.0,colFr:[2.0,2.6,3.0],
  headers:["行业","核心痛点人群","关键数据"],
  rows:[
    ["互联网/IT","赶工期全员 + 35+员工","线上秒回 65.4%"],
    ["金融/银行","一线业务岗 + 决策岗","业绩压力 42.9%"],
    ["医护/护理","临床护理 + 急诊/ICU","抑郁率 11%"],
    ["教育","班主任 + 主科教师","抑郁检出率 >30%"],
    ["客服/服务业","一线客服 + 餐饮服务","抑郁率 15%"],
    ["制造/汽车","产线工人 + 井下作业","月均加班 140h"],
  ], rowH:0.63, fs:11.5, headFs:12 });
// right: two cards
L.card(p,s,8.05,2.2,4.5,2.15,C.CARD,{shadow:L.shadow()});
s.addShape(p.ShapeType.ellipse,{ x:8.3,y:2.42,w:0.14,h:0.14, fill:{color:C.AMBER} });
s.addText("第二层 · 重点关注人群",{ x:8.55,y:2.3,w:3.8,h:0.4, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
["女性返岗员工（产假返岗后 3–12 个月）","高压岗位群体（研发、销售、客服、产线）","跨文化团队员工（海外派遣、多元团队）"].forEach((t,i)=>{
  s.addText("·",{ x:8.3,y:2.82+i*0.44,w:0.2,h:0.4, fontFace:HF, color:C.AMBER, fontSize:15, bold:true });
  s.addText(t,{ x:8.52,y:2.82+i*0.44,w:3.85,h:0.44, fontFace:HF, color:C.INK, fontSize:12, valign:"middle" });
});
L.card(p,s,8.05,4.55,4.5,1.55,C.FOREST,{shadow:L.shadow()});
s.addText("第三层 · 间接受益人群",{ x:8.55,y:4.72,w:3.8,h:0.4, fontFace:HF, color:C.AMBERL, fontSize:14, bold:true });
s.addText("企业主管、HRBP、EAP专员、工会干部、党务工作者",
  { x:8.55,y:5.15,w:3.75,h:0.85, fontFace:HF, color:C.WHITE, fontSize:13.5, valign:"top", lineSpacingMultiple:1.2 });
s.addText("直接人群 → 重点关注 → 间接受益：从个体疗愈到组织能力的层层放大",
  { x:0.8,y:6.5,w:11.75,h:0.5, fontFace:HF, color:C.MUTE, fontSize:12.5, italic:true });

// P6 干预逻辑与实施路径
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"干预逻辑与实施路径","双轨协同 —— 如何落地执行？");
// three principle chips
const pr=[["AI 轨道","降低求助门槛 · 主动预警 · 个性化匹配",C.MOSS],
  ["疗愈轨道","非病理化深度支持 · 能量转化 · 整体平衡",C.FOREST],
  ["协同原则","AI 是疗愈师的「扩音器」与「望远镜」",C.AMBER]];
pr.forEach((c,i)=>{
  const x=0.8+i*3.98, y=1.8;
  L.card(p,s,x,y,3.75,0.95,C.CARD,{shadow:L.shadow()});
  s.addShape(p.ShapeType.ellipse,{ x:x+0.28,y:y+0.4,w:0.16,h:0.16, fill:{color:c[2]} });
  s.addText(c[0],{ x:x+0.55,y:y+0.15,w:3,h:0.35, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
  s.addText(c[1],{ x:x+0.3,y:y+0.5,w:3.25,h:0.4, fontFace:HF, color:C.MUTE, fontSize:11 });
});
s.addText("四阶段实施路径",{ x:0.8,y:2.95,w:6,h:0.35, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
L.table(p,s,{ x:0.8,y:3.35,w:11.75,colFr:[1.5,1.5,3.85,3.85],
  headers:["阶段","时间","AI 轨道","疗愈轨道"],
  rows:[
    ["预备期","第1–2周","AI树洞部署 + 基线采集","疗愈师伦理培训 + 行业定制方案"],
    ["融入期","1–3个月","24h运行 + 情绪趋势图 + 自动推送","一对一疏导 + 团体工作坊 + 人工复核"],
    ["成长期","4–6个月","情绪轨迹追踪 + 个人成长报告","进阶疗愈小组 + 自主工具包引导"],
    ["嵌入期","6个月后","流程标准化 + 主管OKR纳入","培养企业内部「疗愈大使」"],
  ], rowH:0.82, fs:12 });

// P7 疗愈交付 通用版+行业版
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"疗愈活动交付","六大情绪类型 + 六大行业精准对标");
s.addText("通用版 · 按情绪类型匹配",{ x:0.8,y:1.8,w:6,h:0.35, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
L.table(p,s,{ x:0.8,y:2.2,w:5.85,colFr:[2.6,2.6,1.4],
  headers:["情绪类型","推荐活动","时长"],
  rows:[
    ["焦虑紧张型","正念呼吸工作坊","90分钟"],
    ["耗竭疲惫型","能量唤醒工作坊","2小时"],
    ["情绪劳动型","艺术疗愈工作坊","2小时"],
    ["孤独无意义型","叙事疗愈深度小组","2h×4次"],
    ["躯体紧张型","身体觉知与释放","2小时"],
    ["混合 / 预防型","心理嘉年华游园会","半天"],
  ], rowH:0.6, fs:11.5, headFs:12.5 });
s.addText("行业版 · 六大行业对标",{ x:6.95,y:1.8,w:6,h:0.35, fontFace:HF, color:C.FOREST, fontSize:14, bold:true });
L.table(p,s,{ x:6.95,y:2.2,w:5.6,colFr:[1.7,2.9,3.0],
  headers:["行业","首选活动","关键环节"],
  rows:[
    ["互联网","情绪红绿灯正念工作坊","可控/不可控拆解"],
    ["金融","积极心理与管理提升","情绪暂停法"],
    ["医护","巴林特小组","不评判/不打断/不指导"],
    ["教育","奥尔夫音乐疗愈","简易乐器合奏"],
    ["客服","心流插花","花材选择 + 创作命名"],
    ["制造","沙盘疗愈","团队沙盘共创"],
  ], rowH:0.6, fs:11, headFs:12.5 });
s.addText("核心亮点：每个活动均标注理论依据（MBSR、表达性艺术治疗、叙事疗愈、巴林特小组、躯体疗法等）",
  { x:0.8,y:6.75,w:11.75,h:0.4, fontFace:HF, color:C.MUTE, fontSize:12, italic:true });

// P8 AI识别与推荐引擎
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"AI 识别与推荐引擎","AI 如何识别信号、推荐方案？");
// left intro
L.card(p,s,0.8,1.95,4.15,4.9,C.CARD,{shadow:L.shadow()});
s.addShape(p.ShapeType.ellipse,{ x:1.1,y:2.25,w:0.6,h:0.6, fill:{color:C.MOSSL} });
s.addText("树",{ x:1.1,y:2.25,w:0.6,h:0.6, align:"center",valign:"middle", fontFace:HF, color:C.FOREST, fontSize:20, bold:true });
s.addText("AI 树洞 · 核心识别",{ x:1.85,y:2.3,w:3,h:0.5, fontFace:HF, color:C.FOREST, fontSize:16, bold:true });
s.addText("24 小时在线匿名倾诉平台，员工通过企业微信 / 钉钉 / 小程序进入。",
  { x:1.1,y:3.05,w:3.65,h:1.0, fontFace:HF, color:C.INK, fontSize:13.5, lineSpacingMultiple:1.25 });
L.card(p,s,1.1,4.1,3.55,1.05,C.MOSST);
s.addText("真实案例",{ x:1.3,y:4.23,w:3,h:0.35, fontFace:HF, color:C.AMBER, fontSize:12, bold:true });
s.addText("郑州高新区总工会 AI 树洞，累计响应超 1300 次。",
  { x:1.3,y:4.55,w:3.2,h:0.55, fontFace:HF, color:C.INK, fontSize:12.5, lineSpacingMultiple:1.1 });
s.addText("关键设计：「AI 预警 + 人工复核」闭环 —— AI 不自动定性任何员工。",
  { x:1.1,y:5.35,w:3.65,h:1.3, fontFace:HF, color:C.FOREST, fontSize:13, bold:true, valign:"top", lineSpacingMultiple:1.2 });
// right: 三级预警 + 三步转化
L.table(p,s,{ x:5.25,y:1.95,w:7.3,colFr:[1.1,2.5,2.6,2.0],
  headers:["等级","关键词示例","AI 自动触发","人工介入"],
  rows:[
    ["绿色","「好累」「压力大」","自动推送正念音频","无需介入"],
    ["黄色","「快撑不住了」「想辞职」","推送资源 + 提醒HRBP","HRBP 关注"],
    ["红色","极端词汇","转接专业咨询师","EAP 2h 内确认"],
  ], rowH:0.6, fs:11, headFs:12 });
s.addText("三步转化模型 · 从信号到行动",{ x:5.25,y:4.15,w:6,h:0.35, fontFace:HF, color:C.FOREST, fontSize:13.5, bold:true });
L.table(p,s,{ x:5.25,y:4.55,w:7.3,colFr:[1.0,4.0,3.0],
  headers:["步骤","核心任务","输出"],
  rows:[
    ["①","AI树洞捕捉情绪信号","情绪标签 + 预警等级"],
    ["②","按标签、画像、行业匹配资源","个性化推荐清单"],
    ["③","IM自动推送 + 人工复核","完整闭环"],
  ], rowH:0.6, fs:12, headFs:12.5 });

// P9 预期效果 + 评估 + SDGs/ESG (dense two-column)
s = p.addSlide(); L.bg(s,C.CREAM);
L.header(p,s,"预期效果 · 评估 · 国际对齐","效果如何衡量？如何对齐 SDGs / ESG 国际标准？");
// LEFT column
s.addText("预期效果总览",{ x:0.8,y:1.8,w:6,h:0.28, fontFace:HF, color:C.FOREST, fontSize:13, bold:true });
L.table(p,s,{ x:0.8,y:2.06,w:5.85,colFr:[1.8,2.4,1.4,1.4],
  headers:["维度","指标","基线","目标"],
  rows:[
    ["心理安全","PSI得分(7分)","3.2–3.8","≥5.5"],
    ["留任意向","主动离职率","35%","≤15%"],
    ["疗愈覆盖","AI树洞使用率","0%","≥40%"],
    ["疗愈效果","情绪改善比例","0%","≥60%"],
  ], rowH:0.40, fs:9.5, headFs:10, headH:0.38 });
s.addText("分行业预期效果",{ x:0.8,y:4.14,w:6,h:0.28, fontFace:HF, color:C.FOREST, fontSize:13, bold:true });
L.table(p,s,{ x:0.8,y:4.4,w:5.85,colFr:[1.7,4.0,1.4],
  headers:["行业","核心预期效果","周期"],
  rows:[
    ["互联网/IT","PSI 3.5→5.8；焦虑信号↓50%","3个月"],
    ["金融/银行","PSI 3.2→5.5；离职率→15%","6个月"],
    ["医护/护理","抑郁自评↓30%；巴林特参与≥70%","3个月"],
    ["教育","MBI 倦怠得分↓25%","3个月"],
    ["客服/服务","情绪耗竭得分↓30%","3个月"],
    ["制造/汽车","躯体紧张↓40%；驿站使用≥50%","6个月"],
  ], rowH:0.40, fs:9.5, headFs:10, headH:0.38 });
// RIGHT column
s.addText("四层评估体系",{ x:6.8,y:1.8,w:6,h:0.28, fontFace:HF, color:C.FOREST, fontSize:13, bold:true });
L.table(p,s,{ x:6.8,y:2.06,w:5.75,colFr:[0.9,2.4,2.0,2.0],
  headers:["层级","评估内容","工具","频次"],
  rows:[
    ["L0","使用率","系统后台","实时/周度"],
    ["L1","即时反馈","情绪温度计","每场后"],
    ["L2","短期效果","简讯随访","第3/7天"],
    ["L3","中期效果","PSI问卷","月/季度"],
    ["L4","长期影响","离职率+绩效","半年/年"],
  ], rowH:0.40, fs:9.5, headFs:10, headH:0.38 });
s.addText("SDGs / ESG 国际标准对齐",{ x:6.8,y:4.5,w:6,h:0.28, fontFace:HF, color:C.FOREST, fontSize:13, bold:true });
L.table(p,s,{ x:6.8,y:4.76,w:5.75,colFr:[2.2,4.6],
  headers:["框架 / 维度","方案贡献"],
  rows:[
    ["SDG 3 健康","心理健康与疗愈服务应对企业压力"],
    ["SDG 5 性别平等","赋能女性员工，平等返岗与DEI"],
    ["SDG 8 体面工作","提升充分就业，保障安全环境"],
    ["GRI 403 员工福祉","追踪心理安全并提供疗愈支持"],
    ["GRI 405-1 DEI","女性返岗支持与DEI文化建设"],
    ["G · AI治理章程","隐私保护、假阳性控制、人工审核"],
  ], rowH:0.40, fs:9.5, headFs:10, headH:0.38 });

// P10 value summary
L.valueSummary(p,"AI 发现信号，AI 推荐方案，疗愈创造改变");

p.writeFile({ fileName: OUT }).then(f=>console.log("deck3 saved", f));
