// 打包员工端，并把构建标识注入 bundle。
// 目的（TD-001）：真机上能一眼确认 WebView 拿到的是不是新代码，
// 而不是靠"界面看起来没变"去猜缓存有没有刷掉。
import { execSync } from 'node:child_process';
import { build } from 'esbuild';

function gitShortSha() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'nogit';
  }
}

function workingTreeDirty() {
  try {
    const out = execSync('git status --porcelain -- src public functions migrations', {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim();
    return out.length > 0;
  } catch {
    return false;
  }
}

const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const stamp = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
// sha 是构建时 HEAD，构建产物随后才提交，所以它指向父提交；时间戳才是判断新旧的主要依据。
const buildId = `${gitShortSha()}${workingTreeDirty() ? '+' : ''} · ${stamp}`;

await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: true,
  outfile: 'public/app.js',
  define: { __BUILD_ID__: JSON.stringify(buildId) },
});

console.log(`build id: ${buildId}`);
