import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const targets = {
  console: { origin: 'https://mindbridge-console.pages.dev', service: 'mindbridge-console' },
  employee: { origin: 'https://mindbridge-app-8j6.pages.dev', service: 'mindbridge-stage-2' },
};
const target = process.argv[2];
if (!Object.hasOwn(targets, target)) throw new Error('请指定 console 或 employee');
const { origin, service } = targets[target];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let failure;
for (let attempt = 1; attempt <= 6; attempt++) {
  try {
    const response = await fetch(`${origin}/api/health`, { signal: AbortSignal.timeout(15000) });
    const health = await response.json();
    if (!response.ok || health.ok !== true || health.service !== service) throw new Error(`健康检查未通过：HTTP ${response.status}`);
    if (process.argv.includes('--verify-assets')) {
      for (const asset of ['index.html', 'app.js', 'styles.css']) {
        const local = await readFile(new URL(`../apps/${target}/public/${asset}`, import.meta.url));
        const remote = await fetch(`${origin}/${asset}?verify=${Date.now()}`, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
        if (!remote.ok || hash(Buffer.from(await remote.arrayBuffer())) !== hash(local)) throw new Error(`${asset} 尚未与本地构建一致`);
      }
    }
    console.log(`通过：${origin}（健康检查${process.argv.includes('--verify-assets') ? ' + 静态资源一致' : ''}）`);
    failure = null;
    break;
  } catch (error) {
    failure = error;
    console.warn(`检查 ${attempt}/6：${error.message}`);
    if (attempt < 6) await new Promise(resolve => setTimeout(resolve, 3000));
  }
}
if (failure) throw failure;
