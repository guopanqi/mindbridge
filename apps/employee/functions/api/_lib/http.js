export const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

export function noStoreText(text, status = 200) {
  return new Response(text, { status, headers: { 'cache-control': 'no-store' } });
}

export function readCookie(request, name) {
  const source = request.headers.get('cookie') || '';
  const prefix = `${name}=`;
  for (const part of source.split(/;\s*/)) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

export function sessionCookie(value, maxAge) {
  return `__Host-mb_session=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookie() {
  return '__Host-mb_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
}
