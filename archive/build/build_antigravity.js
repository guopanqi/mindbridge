const pptxgen = require("pptxgenjs");
const S = require("./slides_antigravity.js");

function newPres(title, subject) {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE";
  p.author = "Antigravity AI (Google DeepMind)";
  p.title = title;
  p.subject = subject;
  return p;
}

// ── Deck 1 : PPT脚本.md ──
(async () => {
  try {
    const p1 = newPres("MindBridge AI + 疗愈轨道 (方案A)", "企业员工心理安全与成长共生系统");
    S.cover(p1);
    S.dualTrack(p1, 2);
    S.industries(p1, 3);
    S.scenarios(p1, 4);
    S.activitiesGeneral(p1, 5);
    S.activitiesIndustry(p1, 6);
    S.treeholeCombined(p1, 7);
    S.recommend(p1, 8, false);
    S.results(p1, 9);
    S.summary(p1, 10);
    await p1.writeFile({ fileName: "/Users/usr/desktop/mindbridge/PPT输出_antigravity/MindBridge_脚本1.pptx" });
    console.log("Deck 1 (Script 1) written successfully to PPT输出_antigravity/MindBridge_脚本1.pptx");
  } catch (err) {
    console.error("Error writing Deck 1:", err);
  }

  // ── Deck 2 : PPT脚本2.md ──
  try {
    const p2 = newPres("MindBridge AI + 疗愈轨道 (方案B)", "企业员工心理安全与成长共生系统");
    S.cover(p2);
    S.dualTrack(p2, 2);
    S.industriesAndScenarios(p2, 3);
    S.activitiesGeneral(p2, 4);
    S.activitiesIndustry(p2, 5);
    S.treeholeTech(p2, 6);
    S.treeholeWarning(p2, 7);
    S.recommend(p2, 8, true);
    S.results(p2, 9);
    S.summary(p2, 10);
    await p2.writeFile({ fileName: "/Users/usr/desktop/mindbridge/PPT输出_antigravity/MindBridge_脚本2.pptx" });
    console.log("Deck 2 (Script 2) written successfully to PPT输出_antigravity/MindBridge_脚本2.pptx");
  } catch (err) {
    console.error("Error writing Deck 2:", err);
  }
})();
