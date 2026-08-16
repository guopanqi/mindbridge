// Shared design system for MindBridge AI 疗愈双轨 decks
// Palette — "Healing Dual-Track"
const C = {
  ink:    "13293D",  // deep midnight (dark slides)
  deep:   "1D3E52",  // panel dark
  ai:     "2E86AB",  // AI track (cool blue)
  aiDk:   "1B5E7E",
  aiLt:   "D6ECF3",  // AI track light fill
  heal:   "E07A5F",  // healing track (coral)
  healDk: "C05C43",
  amber:  "F2A25C",  // healing amber
  healLt: "FBEBE2",  // healing track light fill
  sage:   "6FA287",  // calm accent green
  sageLt: "E4EFE7",
  white:  "FFFFFF",
  panel:  "EEF3F6",  // neutral light panel
  line:   "D8E0E6",
  txt:    "1F2D3A",  // body dark
  mut:    "5C6B78",  // muted
  mutLt:  "8A97A2",
  gold:   "E9B44C",  // star accent
};

const F = { h: "Microsoft YaHei", b: "Microsoft YaHei" };

// Layout constants (LAYOUT_WIDE = 13.33 x 7.5)
const PW = 13.33, PH = 7.5, MX = 0.62;

function bg(slide, color) { slide.background = { color }; }

// Kicker + big title block for content slides (no accent lines)
function header(slide, opts) {
  const { kicker, title, dark = false } = opts;
  const kColor = dark ? C.amber : C.ai;
  const tColor = dark ? C.white : C.ink;
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: MX, y: 0.42, w: PW - 2 * MX, h: 0.32,
      fontFace: F.b, fontSize: 12, bold: true, color: kColor,
      charSpacing: 3, align: "left", margin: 0,
    });
  }
  slide.addText(title, {
    x: MX, y: kicker ? 0.72 : 0.5, w: PW - 2 * MX, h: 0.78,
    fontFace: F.h, fontSize: 30, bold: true, color: tColor,
    align: "left", margin: 0, valign: "top",
  });
}

// Small dual-track legend chip (AI blue / 疗愈 coral)
function trackLegend(slide, x, y) {
  slide.addShape("ellipse", { x, y: y + 0.03, w: 0.16, h: 0.16, fill: { color: C.ai } });
  slide.addText("AI 轨道", { x: x + 0.2, y: y - 0.05, w: 1.1, h: 0.3, fontFace: F.b, fontSize: 11, color: C.mut, margin: 0, valign: "middle" });
  slide.addShape("ellipse", { x: x + 1.3, y: y + 0.03, w: 0.16, h: 0.16, fill: { color: C.heal } });
  slide.addText("疗愈轨道", { x: x + 1.5, y: y - 0.05, w: 1.2, h: 0.3, fontFace: F.b, fontSize: 11, color: C.mut, margin: 0, valign: "middle" });
}

// Footer with page number
function footer(slide, n, dark = false) {
  const col = dark ? "6E8494" : C.mutLt;
  slide.addText("MindBridge AI · 疗愈双轨", {
    x: MX, y: PH - 0.42, w: 6, h: 0.28, fontFace: F.b, fontSize: 9,
    color: col, margin: 0, valign: "middle",
  });
  slide.addText(String(n).padStart(2, "0") + " / 10", {
    x: PW - MX - 2, y: PH - 0.42, w: 2, h: 0.28, fontFace: F.b, fontSize: 9,
    color: col, align: "right", margin: 0, valign: "middle",
  });
}

// Rounded card
function card(slide, x, y, w, h, fill, opts = {}) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: opts.r || 0.1,
    fill: { color: fill },
    line: opts.line ? { color: opts.line, width: opts.lw || 1 } : { type: "none" },
    shadow: opts.shadow ? { type: "outer", color: "8899A6", opacity: 0.22, blur: 8, offset: 3, angle: 90 } : undefined,
  });
}

// Draw a styled data table as colored header + rows (custom, for polish)
// cols: [{label, w, align}], rows: [[..],..], accent color for header
function dataTable(slide, x, y, totalW, cols, rows, opts = {}) {
  const accent = opts.accent || C.ai;
  const rowH = opts.rowH || 0.5;
  const headH = opts.headH || 0.46;
  const fs = opts.fs || 12;
  const headFs = opts.headFs || 12;
  // header
  slide.addShape("roundRect", { x, y, w: totalW, h: headH, rectRadius: 0.06, fill: { color: accent } });
  let cx = x;
  cols.forEach((c) => {
    slide.addText(c.label, {
      x: cx + 0.12, y, w: c.w - 0.24, h: headH, fontFace: F.b, fontSize: headFs, bold: true,
      color: C.white, align: c.align || "left", valign: "middle", margin: 0,
    });
    cx += c.w;
  });
  // rows
  let ry = y + headH + 0.05;
  rows.forEach((row, ri) => {
    const fill = ri % 2 === 0 ? C.white : C.panel;
    slide.addShape("roundRect", { x, y: ry, w: totalW, h: rowH, rectRadius: 0.05, fill: { color: fill }, line: { color: C.line, width: 0.75 } });
    let rx = x;
    row.forEach((cell, ci) => {
      const c = cols[ci];
      const isFirst = ci === 0;
      slide.addText(cell, {
        x: rx + 0.12, y: ry, w: c.w - 0.24, h: rowH, fontFace: F.b, fontSize: fs,
        bold: isFirst && opts.boldFirst !== false, color: isFirst ? C.ink : C.txt,
        align: c.align || "left", valign: "middle", margin: 0,
      });
      rx += c.w;
    });
    ry += rowH + 0.05;
  });
  return ry; // bottom y
}

module.exports = { C, F, PW, PH, MX, bg, header, trackLegend, footer, card, dataTable };
