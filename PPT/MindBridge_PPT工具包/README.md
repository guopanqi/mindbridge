# MindBridge PPT 工具包（可复用）

一套用 **pptxgenjs** 快速生成「温暖疗愈风格」PPT 的可复用代码，用于 MindBridge AI 系列路演 deck。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `lib.js` | 核心设计库：配色、卡片、表格、封面/双轨定位/总结页等可复用组件 |
| `示例_deck3.js` | 完整示例——脚本3的10页生成代码，照着改内容即可 |

## 快速开始

```bash
# 1. 装依赖（只需一次）
npm install pptxgenjs

# 2. 把 lib.js 和你的生成脚本放同一目录，运行
node 你的deck.js
```

一个最小生成脚本：

```js
const L = require("./lib.js");
const { C, HF } = L;
const p = L.newDeck();          // 16:9 宽屏

L.cover(p);                     // 封面（共享）
L.dualTrack(p);                 // 双轨定位页（共享）

// 自定义一页：标题 + 表格
const s = p.addSlide(); L.bg(s, C.CREAM);
L.header(p, s, "小节标签", "这一页的大标题");
L.table(p, s, {
  x:0.8, y:1.95, w:11.75,
  colFr:[2, 5, 2],                       // 各列宽度比例
  headers:["列1","列2","列3"],
  rows:[ ["a","b","★★★★★"], ["c","d","★★★☆☆"] ],
  rowH:0.6, fs:13, starCol:2,            // starCol：该列渲染成琥珀色星级
});

L.valueSummary(p, "结尾大标题");         // 双赢总结页（共享）
p.writeFile({ fileName: "输出.pptx" }).then(f=>console.log("saved", f));
```

## lib.js API 速查

**配色 `C`**：`FOREST` 深森林绿(主) · `MOSS` 苔绿 · `AMBER` 暖琥珀(强调) · `CREAM` 暖白底 · `CARD` 卡片 · `INK` 深文字 · `MUTE` 灰文字

**组件函数**
- `newDeck()` → 新建 16:9 演示文稿
- `bg(s, color)` → 设置整页背景
- `cover(p)` → 封面页（森林绿 + 圆形装饰）
- `dualTrack(p)` → 双轨定位页（AI轨道 / 疗愈轨道 + 核心理念）
- `header(p, s, 小标签, 大标题, dark?)` → 页眉标题块（dark=true 用于深色页）
- `card(p, s, x, y, w, h, fill, {shadow, line})` → 圆角卡片
- `table(p, s, cfg)` → 表格，cfg 见上例；`boldCol0:false` 关闭首列加粗
- `foot(p, s, 文本, dark?)` → 页脚小字
- `valueSummary(p, 大标题)` → 双栏「对AI评委/对疗愈评委的价值」总结页

## 排版经验（避免溢出）

- 宽屏画布 13.33 × 7.5 英寸，左右留 0.8 边距，内容宽约 11.75。
- 页眉标题占到 y≈1.75；正文从 1.9 起。
- 一页放两张表就用双栏（左 x0.8 w5.85 / 右 x6.8 w5.75），行高 `rowH` 降到 0.4–0.44、字号 9.5–10。
- 表格总高 = `headH + 行数 × rowH`，控制在结束 y ≤ 7.3。
- **改完必做 QA**：转 PDF → 转图片 → 逐页看有没有文字溢出/元素重叠。

```bash
# 校验文件结构
python3 <pptx_skill>/scripts/office/validate.py 输出.pptx
# 渲染成图片检查
soffice --headless --convert-to pdf 输出.pptx
pdftoppm -jpeg -r 110 输出.pdf slide
```

## 配色来源

森林绿 + 苔绿 + 暖琥珀，对应「疗愈的温度 + 技术的可信」，契合企业心理健康/EAP 主题。如需换主题，只改 `lib.js` 顶部的 `C` 对象即可全局生效。
