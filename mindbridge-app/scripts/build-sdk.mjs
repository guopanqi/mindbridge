// 构建钉钉 SDK bundle，文件名带内容哈希。
//
// 为什么要哈希：只有文件名随内容变化，immutable 缓存才是正确的；
// 否则一旦 SDK 升级，WebView 会长期拿着旧文件（TD-001 踩过这个坑）。
// 有了哈希文件名，vendor 目录才能安全地用单一的长缓存策略，
// 不必再和全局 no-store 混在一起产生冲突指令（TD-006）。
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const OUT_DIR = 'public/vendor';
const PREFIX = 'dingtalk-auth.';

const result = await build({
  entryPoints: ['scripts/dingtalk-entry.js'],
  bundle: true,
  format: 'iife',
  target: ['chrome90', 'safari14'],
  write: false,
});
const code = result.outputFiles[0].text;
const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
const filename = `${PREFIX}${hash}.js`;

mkdirSync(OUT_DIR, { recursive: true });
// 清掉旧哈希产物，避免 vendor 目录无限堆积。
for (const name of readdirSync(OUT_DIR)) {
  if (name.startsWith(PREFIX) && name !== filename) rmSync(`${OUT_DIR}/${name}`);
}
writeFileSync(`${OUT_DIR}/${filename}`, code);

// 把引用同步进 HTML。哈希会进 git diff，这正好让 SDK 变更可追溯。
const htmlPath = 'public/index.html';
const html = readFileSync(htmlPath, 'utf8');
const next = html.replace(
  /src="\/vendor\/dingtalk-auth[^"]*\.js"/,
  `src="/vendor/${filename}"`
);
if (next !== html) writeFileSync(htmlPath, next);

console.log(`sdk bundle: ${filename} (${(code.length / 1024).toFixed(0)} KB)`);
