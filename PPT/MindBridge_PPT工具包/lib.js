// Shared design library — 温暖疗愈风格 (Forest & Moss + warm amber)
const pptxgen = require("pptxgenjs");

const C = {
  FOREST:"2C5F2D", FOREST2:"244C25", FOREST3:"356B36",
  MOSS:"7BA05B", MOSSL:"AEC79A", MOSST:"EDF1E6",
  AMBER:"E1943B", AMBERL:"F3D9A8",
  CREAM:"F5F1E8", CARD:"FBF8F1", INK:"2E2A24", MUTE:"6E6A60",
  CREAMTXT:"E9E4D6", WHITE:"FFFFFF",
};
const HF = "Microsoft YaHei";

function shadow(){ return { type:"outer", color:"6E6A60", opacity:0.20, blur:8, offset:3, angle:90 }; }

function newDeck(){ const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; return p; }

function bg(s,c){ s.background = { color:c }; }

function card(p,s,x,y,w,h,fill,opts){
  opts=opts||{};
  s.addShape(p.ShapeType.roundRect,{ x,y,w,h, rectRadius:0.12, fill:{color:fill}, line:opts.line||{type:"none"}, shadow:opts.shadow });
}

// section eyebrow + title header block. dark=true for dark slides
function header(p,s,eyebrow,title,dark){
  s.addText(eyebrow,{ x:0.8,y:0.5,w:11,h:0.4, fontFace:HF, color:dark?C.AMBERL:C.AMBER, fontSize:15, bold:true, charSpacing:2 });
  s.addText(title,{ x:0.8,y:0.9,w:11.75,h:0.85, fontFace:HF, color:dark?C.WHITE:C.INK, fontSize:32, bold:true });
}

// generic table. cfg: {x,y,w,colFr:[..],headers:[..],rows:[[..]],rowH,headH,fs,headFs,boldCol0,starCol}
function table(p,s,cfg){
  const x=cfg.x, y=cfg.y, w=cfg.w;
  const headH=cfg.headH||0.55, rowH=cfg.rowH||0.62;
  const fs=cfg.fs||12, headFs=cfg.headFs||13;
  const n=cfg.rows.length;
  const totalH=headH+n*rowH;
  const fr=cfg.colFr; const sum=fr.reduce((a,b)=>a+b,0);
  const cw=fr.map(f=>w*f/sum);
  const cx=[]; let acc=x; cw.forEach(c=>{ cx.push(acc); acc+=c; });
  const pad=0.16;
  // outer card
  card(p,s,x,y,w,totalH,C.CARD,{shadow:shadow()});
  // header band
  s.addShape(p.ShapeType.roundRect,{ x,y,w,h:headH, rectRadius:0.12, fill:{color:C.FOREST} });
  s.addShape(p.ShapeType.rect,{ x,y:y+headH-0.14,w,h:0.14, fill:{color:C.FOREST} });
  cfg.headers.forEach((h,i)=>{
    s.addText(h,{ x:cx[i]+pad, y, w:cw[i]-pad*2, h:headH, fontFace:HF, color:C.WHITE, fontSize:headFs, bold:true, valign:"middle", align:i===0?"left":"left" });
  });
  // rows
  cfg.rows.forEach((row,r)=>{
    const ry=y+headH+r*rowH;
    if(r%2===1) s.addShape(p.ShapeType.rect,{ x, y:ry, w, h:rowH, fill:{color:C.MOSST} });
    row.forEach((cell,i)=>{
      const isStar = cfg.starCol!=null && i===cfg.starCol;
      const c0 = (i===0 && cfg.boldCol0!==false);
      s.addText(cell,{ x:cx[i]+pad, y:ry, w:cw[i]-pad*2, h:rowH, fontFace:HF,
        color: isStar? C.AMBER : (c0? C.FOREST : C.INK),
        fontSize: isStar? fs+2 : fs, bold: (c0||isStar), valign:"middle",
        lineSpacingMultiple:1.05 });
    });
  });
  return totalH;
}

// footer note
function foot(p,s,txt,dark){
  s.addText(txt,{ x:0.8,y:6.95,w:11.75,h:0.4, fontFace:HF, color: dark?C.MOSSL:C.MUTE, fontSize:11.5, italic:true });
}

// cover slide (shared)
function cover(p){
  const s=p.addSlide(); bg(s,C.FOREST);
  s.addShape(p.ShapeType.ellipse,{ x:10.2,y:-1.7,w:5.2,h:5.2, fill:{color:C.FOREST2} });
  s.addShape(p.ShapeType.ellipse,{ x:11.5,y:4.5,w:4.4,h:4.4, fill:{color:C.FOREST3} });
  s.addShape(p.ShapeType.ellipse,{ x:-1.4,y:5.3,w:3.8,h:3.8, fill:{color:C.FOREST2} });
  s.addShape(p.ShapeType.ellipse,{ x:1.0,y:1.05,w:0.5,h:0.5, fill:{color:C.AMBER} });
  s.addText("企业员工心理安全与成长共生系统",{ x:1.0,y:1.75,w:9,h:0.5, fontFace:HF, color:C.AMBERL, fontSize:16, charSpacing:2 });
  s.addText([
    { text:"MindBridge AI", options:{ fontSize:56, bold:true, color:C.WHITE, breakLine:true } },
    { text:"+ 疗愈轨道", options:{ fontSize:38, bold:true, color:C.MOSSL } },
  ],{ x:1.0,y:2.4,w:11,h:1.9, fontFace:HF });
  s.addText("AI 负责广度 · 疗愈轨道负责深度",{ x:1.0,y:4.45,w:10,h:0.6, fontFace:HF, color:C.CREAMTXT, fontSize:22 });
  card(p,s,1.0,5.5,7.4,0.9,C.WHITE);
  s.addText("AI 预警与推荐 + 疗愈师深度陪伴 —— 让疗愈服务在关键时刻可及",{ x:1.2,y:5.5,w:7.0,h:0.9, fontFace:HF, color:C.FOREST, fontSize:14, valign:"middle" });
  s.addText("国际疗愈师赛题 × AI 应用创新赛道  融合方案",{ x:1.0,y:6.7,w:9,h:0.4, fontFace:HF, color:C.MOSSL, fontSize:12.5 });
  return p;
}

// dual-track slide (shared page 2)
function dualTrack(p){
  const s=p.addSlide(); bg(s,C.CREAM);
  header(p,s,"核心创意","双轨并行 —— AI 负责广度，疗愈轨道负责深度");
  s.addText("员工要么不敢求助，要么求助后只得到「治标不治本」的话术。我们创造性提出「AI 预警与推荐 + 疗愈师深度陪伴」双轨模型。",
    { x:0.8,y:1.75,w:11.75,h:0.5, fontFace:HF, color:C.MUTE, fontSize:13.5 });
  const tracks=[
    ["AI 轨道","倾听者 + 匹配师", "AI树洞情绪识别、预警、个性化推荐", "对齐：数字疗愈与 AI 辅助支持", C.MOSS],
    ["疗愈轨道","转化师 + 陪伴者", "能量疗愈、情绪疏导、深层转化", "对齐：疗愈师主体性与专业胜任力", C.FOREST],
  ];
  tracks.forEach((t,i)=>{
    const x=0.8+i*6.05, y=2.4;
    card(p,s,x,y,5.7,2.7,C.CARD,{shadow:shadow()});
    s.addShape(p.ShapeType.roundRect,{ x,y,w:5.7,h:0.9, rectRadius:0.12, fill:{color:t[4]} });
    s.addShape(p.ShapeType.rect,{ x,y:y+0.55,w:5.7,h:0.35, fill:{color:t[4]} });
    s.addText(t[0],{ x:x+0.35,y,w:3,h:0.9, fontFace:HF, color:C.WHITE, fontSize:22, bold:true, valign:"middle" });
    s.addText(t[1],{ x:x+3.0,y,w:2.4,h:0.9, fontFace:HF, color:C.WHITE, fontSize:15, valign:"middle", align:"right" });
    s.addText("核心任务",{ x:x+0.35,y:y+1.15,w:5,h:0.35, fontFace:HF, color:C.AMBER, fontSize:12.5, bold:true });
    s.addText(t[2],{ x:x+0.35,y:y+1.5,w:5.0,h:0.5, fontFace:HF, color:C.INK, fontSize:15, bold:true });
    s.addText(t[3],{ x:x+0.35,y:y+2.05,w:5.0,h:0.5, fontFace:HF, color:C.MUTE, fontSize:12.5, italic:true });
  });
  // center connector
  s.addShape(p.ShapeType.ellipse,{ x:6.25,y:3.55,w:0.85,h:0.85, fill:{color:C.AMBER}, shadow:shadow() });
  s.addText("复核",{ x:6.25,y:3.55,w:0.85,h:0.85, align:"center", valign:"middle", fontFace:HF, color:C.WHITE, fontSize:14, bold:true });
  // idea band
  card(p,s,0.8,5.4,11.75,1.35,C.FOREST,{shadow:shadow()});
  s.addText("核心理念",{ x:1.2,y:5.6,w:5,h:0.4, fontFace:HF, color:C.AMBERL, fontSize:14, bold:true });
  s.addText("AI 不做诊断，只做「读数」和「吹哨」；真正的疗愈由疗愈师完成。",
    { x:1.2,y:5.98,w:10.9,h:0.6, fontFace:HF, color:C.WHITE, fontSize:20, bold:true });
  return p;
}

// value summary slide (shared page 10)
function valueSummary(p,title){
  const s=p.addSlide(); bg(s,C.FOREST);
  s.addShape(p.ShapeType.ellipse,{ x:-1.5,y:-1.6,w:5,h:5, fill:{color:C.FOREST2} });
  s.addShape(p.ShapeType.ellipse,{ x:11.0,y:4.8,w:4.2,h:4.2, fill:{color:C.FOREST3} });
  header(p,s,"总结",title,true);
  const cols=[
    ["对 AI 评委的价值", C.MOSS, [
      "AI树洞 + 轻量级推荐引擎，非实验室设想",
      "隐私与伦理设计严谨（匿名化、人工复核、可退出）",
      "AI 定位清晰：不做诊断，只做「吹哨」",
    ]],
    ["对疗愈评委的价值", C.AMBER, [
      "工作坊有清晰疗愈理论基础（巴林特、奥尔夫、叙事、MBSR）",
      "疗愈师角色被充分定义，AI 不替代疗愈师",
      "六大行业差异化活动设计，非模板化",
      "与 IAOTH 认证与伦理对齐",
    ]],
  ];
  cols.forEach((col,i)=>{
    const x=0.8+i*6.05, y=2.15;
    card(p,s,x,y,5.7,3.7,C.CARD,{shadow:shadow()});
    s.addShape(p.ShapeType.ellipse,{ x:x+0.35,y:y+0.35,w:0.16,h:0.16, fill:{color:col[1]} });
    s.addText(col[0],{ x:x+0.7,y:y+0.2,w:4.8,h:0.5, fontFace:HF, color:C.FOREST, fontSize:18, bold:true });
    col[2].forEach((it,j)=>{
      const iy=y+0.95+j*0.62;
      s.addText("✓",{ x:x+0.35,y:iy,w:0.4,h:0.5, fontFace:HF, color:col[1], fontSize:15, bold:true, valign:"top" });
      s.addText(it,{ x:x+0.78,y:iy,w:4.7,h:0.6, fontFace:HF, color:C.INK, fontSize:13, valign:"top", lineSpacingMultiple:1.05 });
    });
  });
  card(p,s,0.8,6.15,11.75,0.9,C.FOREST3);
  s.addText("AI 发现信号，AI 推荐方案，疗愈创造改变。",
    { x:1.0,y:6.15,w:11.35,h:0.9, align:"center", valign:"middle", fontFace:HF, color:C.WHITE, fontSize:18, bold:true });
  return p;
}

module.exports = { pptxgen, C, HF, shadow, newDeck, bg, card, header, table, foot, cover, dualTrack, valueSummary };
