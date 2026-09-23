// 把最终成品（剧本 + 绿/黄/红 三段 + HR 看板篇）复制到面向人的交付目录。
// out/ 里的中间产物（分段、帧、take 日志）不动，只复制最终文件。
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const out = join(here, 'out');
const dest = join(root, 'docs', '路演视频成品');

const files = [
  [join(root, 'docs', '路演视频剧本.md'), '路演视频剧本.md'],
  [join(out, 'green.mp4'), '绿灯篇-一次没人知道的倾诉.mp4'],
  [join(out, 'yellow.mp4'), '黄灯篇-从一句话到线下那张合照.mp4'],
  [join(out, 'red.mp4'), '红灯篇-AI吹哨人来接住.mp4'],
  [join(out, 'HR.mp4'), 'HR看板篇-看得见组织看不见个人.mp4'],
];

mkdirSync(dest, { recursive: true });
for (const [src, name] of files) {
  copyFileSync(src, join(dest, name));
  const mb = (statSync(src).size / 1048576).toFixed(1);
  console.log(`${name}  ${mb} MB`);
}
console.log(`\n→ ${dest}`);
