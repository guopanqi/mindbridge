// Design System for Antigravity's Premium PPT generation
// Palette — "Healing Dual-Track Premium"
const C = {
  ink:       "0B132B",  // Deep midnight navy (for dark slides)
  deep:      "1C2541",  // Dark panel background
  bgLight:   "F4F7F6",  // Soft, calming warm-white/light-sage tint for content slides
  ai:        "0077B6",  // AI track (cool tech blue)
  aiDk:      "005F9E",
  aiLt:      "E0F2FE",  // AI track light fill (sky-100)
  heal:      "E07A5F",  // Healing track (terracotta / comforting coral)
  healDk:    "C86247",
  healLt:    "FDF2E9",  // Healing track light fill (orange-50)
  amber:     "E67E22",  // Warning amber
  amberLt:   "FEF3C7",  // Warning amber light fill
  sage:      "4895EF",  // Calm blue-purple accent
  sageLt:    "EEF2FF",
  green:     "2E7D32",  // Safe green
  greenLt:   "E8F5E9",
  white:     "FFFFFF",
  panel:     "EADBC8",  // Warm accent panel
  panelLight:"F8FAFC",  // Off-white slate panel
  line:      "E2E8F0",  // Divider line (slate-200)
  txt:       "1E293B",  // Body dark text (slate-800)
  mut:       "475569",  // Muted body text (slate-600)
  mutLt:     "94A3B8",  // Light muted text (slate-400)
  gold:      "F59E0B",  // Gold stars (amber-500)
};

const F = { 
  h: "Microsoft YaHei", 
  b: "Microsoft YaHei" 
};

// Layout constants (16:9 widescreen: 13.33 x 7.5 inches)
const PW = 13.33, PH = 7.5, MX = 0.62;

function bg(slide, color) { 
  slide.background = { color }; 
}

// Header block with a modern left-accent bar
function header(slide, opts) {
  const { kicker, title, dark = false } = opts;
  const kColor = dark ? C.heal : C.ai;
  const tColor = dark ? C.white : C.ink;
  
  // Vertical accent bar on the left
  slide.addShape("rect", {
    x: MX, y: 0.45, w: 0.08, h: 0.95,
    fill: { color: kColor }
  });
  
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: MX + 0.2, y: 0.4, w: PW - 2 * MX - 0.2, h: 0.3,
      fontFace: F.b, fontSize: 11.5, bold: true, color: kColor,
      charSpacing: 2, align: "left", margin: 0,
    });
  }
  
  slide.addText(title, {
    x: MX + 0.2, y: kicker ? 0.72 : 0.48, w: PW - 2 * MX - 0.2, h: 0.7,
    fontFace: F.h, fontSize: 26, bold: true, color: tColor,
    align: "left", margin: 0, valign: "top",
  });
}

// Small dual-track legend chip (AI blue / 疗愈 coral)
function trackLegend(slide, x, y) {
  slide.addShape("ellipse", { x, y: y + 0.04, w: 0.14, h: 0.14, fill: { color: C.ai } });
  slide.addText("AI 轨道", { x: x + 0.2, y: y - 0.05, w: 1.1, h: 0.3, fontFace: F.b, fontSize: 10.5, bold: true, color: C.mut, margin: 0, valign: "middle" });
  slide.addShape("ellipse", { x: x + 1.2, y: y + 0.04, w: 0.14, h: 0.14, fill: { color: C.heal } });
  slide.addText("疗愈轨道", { x: x + 1.4, y: y - 0.05, w: 1.2, h: 0.3, fontFace: F.b, fontSize: 10.5, bold: true, color: C.mut, margin: 0, valign: "middle" });
}

// Footer with page number
function footer(slide, n, dark = false) {
  const col = dark ? "64748B" : C.mutLt;
  slide.addText("MindBridge AI · 疗愈双轨路演方案", {
    x: MX, y: PH - 0.42, w: 6, h: 0.28, fontFace: F.b, fontSize: 9,
    color: col, margin: 0, valign: "middle",
  });
  slide.addText(String(n).padStart(2, "0") + " / 10", {
    x: PW - MX - 2, y: PH - 0.42, w: 2, h: 0.28, fontFace: F.b, fontSize: 9,
    color: col, align: "right", margin: 0, valign: "middle",
  });
}

// Rounded card with shadow option and subtle border
function card(slide, x, y, w, h, fill, opts = {}) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: opts.r || 0.08,
    fill: { color: fill },
    line: opts.line ? { color: opts.line, width: opts.lw || 1 } : (opts.noBorder ? { type: "none" } : { color: C.line, width: 0.75 }),
    shadow: opts.shadow ? { type: "outer", color: "94A3B8", opacity: 0.15, blur: 6, offset: 2, angle: 90 } : undefined,
  });
}

// Text Badge with background color
function badge(slide, x, y, w, h, text, fill, textColor, fs = 10.5) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.4, fill: { color: fill }, line: { type: "none" } });
  slide.addText(text, {
    x, y, w, h, fontFace: F.b, fontSize: fs, bold: true,
    color: textColor, align: "center", valign: "middle", margin: 0
  });
}

// Draw a styled data table as colored header + rows (custom, for polish)
// cols: [{label, w, align}], rows: [[..],..]
function dataTable(slide, x, y, totalW, cols, rows, opts = {}) {
  const accent = opts.accent || C.ai;
  const rowH = opts.rowH || 0.5;
  const headH = opts.headH || 0.44;
  const fs = opts.fs || 11.5;
  const headFs = opts.headFs || 11.5;
  
  // Draw header card
  slide.addShape("roundRect", { x, y, w: totalW, h: headH, rectRadius: 0.05, fill: { color: accent } });
  let cx = x;
  cols.forEach((c) => {
    slide.addText(c.label, {
      x: cx + 0.12, y, w: c.w - 0.24, h: headH, fontFace: F.b, fontSize: headFs, bold: true,
      color: C.white, align: c.align || "left", valign: "middle", margin: 0,
    });
    cx += c.w;
  });
  
  // Draw rows
  let ry = y + headH + 0.06;
  rows.forEach((row, ri) => {
    const fill = ri % 2 === 0 ? C.white : C.panelLight;
    // Row background with subtle shadow
    card(slide, x, ry, totalW, rowH, fill, { r: 0.05, shadow: false });
    
    let rx = x;
    row.forEach((cell, ci) => {
      const c = cols[ci];
      const isFirst = ci === 0;
      
      // If cell content is an array of runs (rich text), use that
      if (Array.isArray(cell)) {
        slide.addText(cell, {
          x: rx + 0.12, y: ry, w: c.w - 0.24, h: rowH, fontFace: F.b, fontSize: fs,
          align: c.align || "left", valign: "middle", margin: 0
        });
      } else {
        slide.addText(cell, {
          x: rx + 0.12, y: ry, w: c.w - 0.24, h: rowH, fontFace: F.b, fontSize: fs,
          bold: isFirst && opts.boldFirst !== false, color: isFirst ? C.ink : C.txt,
          align: c.align || "left", valign: "middle", margin: 0,
        });
      }
      rx += c.w;
    });
    ry += rowH + 0.06;
  });
  return ry; // bottom y
}

module.exports = { C, F, PW, PH, MX, bg, header, trackLegend, footer, card, badge, dataTable };
