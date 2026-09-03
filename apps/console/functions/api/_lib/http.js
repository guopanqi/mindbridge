export const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...headers } });
}

export function readCookie(request, name) {
  const source = request.headers.get('cookie') || '';
  const prefix = `${name}=`;
  for (const part of source.split(/;\s*/)) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

// 管理端会话与员工端会话使用不同的 Cookie 名，且分处不同 origin，互不可见。
export const STAFF_COOKIE = '__Host-mb_staff';

export function staffCookie(value, maxAge) {
  return `${STAFF_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearStaffCookie() {
  return `${STAFF_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
