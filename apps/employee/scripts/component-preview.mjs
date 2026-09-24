// 组件预览服务器：零依赖，只供本地开发。把 employee 目录以静态文件 serve 出去，
// 让 preview/ 页能以浏览器原生 ESM 直接 import src 下的组件源码——
// 改完 src 刷新即看，不走 esbuild 构建、不写 D1、不需要登录态。
// 用法：npm run preview -- breathing [port]，只绑 127.0.0.1。
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/\/+$/, '');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const port = Number(process.argv[3]) || 8137;
const initial = process.argv[2] && !process.argv[2].startsWith('-') ? process.argv[2] : 'breathing';

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/') {
      res.writeHead(302, { Location: `/preview/?component=${encodeURIComponent(initial)}` });
      return res.end();
    }
    // 与 Pages 部署行为对齐：public/ 下的东西挂在站点根目录，
    // 所以 /media/* 要映射到 public/media/*，组件行为才跟真机一致。
    const pathname = url.pathname === '/media' || url.pathname.startsWith('/media/')
      ? `/public${url.pathname}`
      : url.pathname;
    let path = normalize(join(root, pathname));
    if (url.pathname.endsWith('/')) path = join(path, 'index.html');
    const segments = path.slice(root.length).split(sep).filter(Boolean);
    // 只 servir 预览必需的目录；密钥、依赖、迁移脚本一律不暴露。
    // temp 只放本地试音/试看，不进 git（见 .gitignore），也不会被部署。
    if (!path.startsWith(root + sep) || segments.some(s => s.startsWith('.'))
      || !['preview', 'src', 'public', 'content', 'temp'].includes(segments[0])) {
      res.writeHead(403);
      return res.end('forbidden');
    }
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`组件预览：http://127.0.0.1:${port}/preview/?component=${initial}`);
  console.log('改完 src 直接刷新；变速/减少动态在页面顶部切换。Ctrl-C 退出。');
});
