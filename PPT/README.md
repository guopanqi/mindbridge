# MindBridge PPT 工作区

用 **pptxgenjs** 生成「温暖疗愈风格」（森林绿 + 苔绿 + 暖琥珀）路演 deck。所有版本共用一套设计库，每个版本一个脚本。

## 目录约定

| 目录 | 放什么 | 规则 |
| --- | --- | --- |
| `工具库/` | `lib.js`（配色、卡片、表格、封面等基础组件）、`helpers.js`（数字卡、统计卡、流程条等复合组件） | 只此一份，改这里全局生效；不要复制到别处 |
| `deck脚本/` | 每个 deck 版本一个脚本，`NN_名称_页数.js` | 序号递增；新版本 **复制最近一版改内容**，不要在旧脚本上覆盖 |
| `素材/` | 脚本引用的图片（`icon.png`、截图等） | 脚本用 `IMG + "文件名"` 引用 |
| `成品/` | 生成的 `.pptx` | 默认输出位置，纳入 git |
| `大纲/` | 文字稿 / 演讲脚本（md、docx） | 内容来源，先改这里再改脚本 |
| `预览/` | 渲染出的 PDF / jpg / 拼图 | **不进 git**，随时可用 `build.sh --preview` 重建 |

`package.json` 把本目录声明为 CommonJS（仓库根目录是 ESM），脚本可直接 `node` 运行。

## 构建

```bash
# 只需一次：全局装 pptxgenjs（build.sh 会自动用 npm root -g 作为 NODE_PATH）
npm install -g pptxgenjs

# 生成 pptx 到 成品/
./build.sh deck脚本/08_决赛夺冠版_17页.js

# 生成 + 渲染逐页预览与拼图到 预览/08_决赛夺冠版_17页/montage.jpg（需 soffice、pdftoppm、Pillow）
./build.sh deck脚本/08_决赛夺冠版_17页.js --preview
```

也可以直接 `node deck脚本/xx.js [输出路径.pptx]`，不传参则输出到 `成品/`。

## 新建一版的流程

1. 在 `大纲/` 写好或更新文字稿。
2. `cp deck脚本/08_决赛夺冠版_17页.js deck脚本/09_新名字_N页.js`，改 `OUT` 文件名与各页内容。
3. `./build.sh deck脚本/09_... --preview`，打开 `预览/09_.../montage.jpg` 逐页检查溢出/重叠。
4. 需要新组件时加到 `工具库/helpers.js`，不要在单个脚本里堆通用函数。

## 版本一览

| 脚本 | 成品 | 说明 |
| --- | --- | --- |
| `03_脚本3_10页.js` | `MindBridge_脚本3.pptx` | 早期 10 页版 |
| `04_商业答辩_12页.js` | `MindBridge_商业答辩方案_12页.pptx` | 需截图素材 ① |
| `05_商业答辩_20页.js` | `MindBridge_商业答辩方案_20页.pptx` | 需截图素材 ① |
| `06_商业答辩_35页.js` | `MindBridge_商业答辩方案_35页.pptx` | 需截图素材 ① |
| `07_新版路演_18页.js` | `MindBridge_新版路演_候选稿.pptx` | 另一版路演（原 .codex-ppt-build） |
| `08_决赛夺冠版_17页.js` | `MindBridge_决赛路演_完整夺冠版_17页.pptx` | 决赛版 |
| `16_决赛PPT8_完整版_21页.js` | `MindBridge_决赛路演_PPT8_完整版_21页.pptx` | PPT8 完整版 |
| `17_决赛PPT9_精简版_17页.js` | `MindBridge_决赛路演_PPT9_精简版_17页.pptx` | PPT8 精简为 17 页，合并参与度与 ROI/增长 |
| `18_决赛PPT11_17页.js` | `MindBridge_决赛路演_PPT11_17页.pptx` | PPT9 基础上三盏灯扩充触发词、三级干预改三卡 |
| `19_决赛PPT12_17页.js` | `MindBridge_决赛路演_PPT12_17页.pptx` | PPT12：加目录页、去掉「双轨怎么跑」；AI 树洞改多轮上下文评估；数据口径标注实测/目标值；ROI 页加效果对赌 |
| `20_决赛PPT13_18页.js` | `MindBridge_决赛路演_PPT13_18页.pptx` | PPT13：「一行业一方案」改制造业实例推演；新增「疗愈工具箱」8 行业高表现工具页；三层数据页文案收紧 |
| `21_决赛PPT14_19页.js` | `MindBridge_决赛路演_PPT14_19页.pptx` | 当前版：第二部分重排为 7 页（双轨 / 产品总览 / AI 树洞 / 三盏灯 / 参与度 / 数据怎么流 / 数据安全），加三处视频占位；移出「三级干预体系」页 |

① 这三个脚本引用 `chat.jpg / breath.jpg / healer.jpg / hr-bars.jpg / hr-trend.jpg`（员工端/疗愈师台/看板截图），仓库里没有这些图，重新构建前需截图放入 `素材/`。`成品/` 里的 `MindBridge_脚本1/2/4/5.pptx`、`MindBridge_AI_路演.pptx`、`..._新版路演方案_20260919.pptx` 是早期产物，没有对应脚本。

## lib.js API 速查

**配色 `C`**：`FOREST` 深森林绿(主) · `MOSS` 苔绿 · `AMBER` 暖琥珀(强调) · `CREAM` 暖白底 · `CARD` 卡片 · `INK` 深文字 · `MUTE` 灰文字

- `newDeck()` / `bg(s,color)` / `header(p,s,小标签,大标题,dark?)` / `card(p,s,x,y,w,h,fill,{shadow,line})`
- `table(p,s,{x,y,w,colFr,headers,rows,rowH,headH,fs,headFs,starCol,boldCol0})`
- `foot(p,s,文本,dark?)` · `cover(p)` · `dualTrack(p)` · `valueSummary(p,标题)`

**helpers.js**（`const H = require("../工具库/helpers.js")(p)`）：`page(eyebrow,title)` 新建浅色内容页 · `darkSlide()` · `lead` 导语 · `numCard` 序号卡 · `dotCard` 圆点卡 · `stat` 大数字卡 · `label` 小节标签 · `flow` 箭头流程条 · `imgCard` 图片卡 · `circleNum` · `dot`

## 排版经验（避免溢出）

- 画布 13.33 × 7.5 英寸，左右边距 0.8，内容宽 11.75；页眉占到 y≈1.75，正文从 1.9 起，底部不超过 7.3。
- 双栏：左 x0.8 w5.7 / 右 x6.85 w5.7；三栏：x = 0.8 + i×3.98，w 3.8。
- 表格总高 = headH + 行数 × rowH；行多时 rowH 0.44–0.52、字号 11–12。
- 改完必跑 `--preview` 逐页看。
