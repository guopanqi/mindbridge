// 对外地址 mindbridge-beta.pages.dev。请求原样转到仍在运行的员工端，
// 密钥和数据库都不复制。内测结束后关掉旧地址前，先把员工端直接部署到这个项目。
const ORIGIN = 'https://mindbridge-app-8j6.pages.dev';

export async function onRequest({ request }) {
  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, ORIGIN);
  const headers = new Headers(request.headers);
  headers.delete('host');
  const init = { method: request.method, headers, redirect: 'manual' };
  if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body;
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  const cookies = typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : [];
  if (cookies.length) {
    responseHeaders.delete('set-cookie');
    for (const cookie of cookies) responseHeaders.append('set-cookie', cookie);
  }
  const location = responseHeaders.get('location');
  if (location?.startsWith(ORIGIN)) responseHeaders.set('location', location.replace(ORIGIN, incoming.origin));
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
}
