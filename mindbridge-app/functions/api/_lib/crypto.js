const encoder = new TextEncoder();

export function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function fromBase64Url(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error('invalid base64url');
  }
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importHmacKey(secret) {
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('missing HMAC secret');
  return crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
}

export async function hmacBase64Url(secret, message) {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return toBase64Url(new Uint8Array(signature));
}

export async function sha256Base64Url(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return toBase64Url(new Uint8Array(digest));
}

export function randomToken(bytes = 32) {
  const output = new Uint8Array(bytes);
  crypto.getRandomValues(output);
  return toBase64Url(output);
}

export async function encryptSubject(plaintext, encodedKey, additionalData) {
  const rawKey = fromBase64Url(encodedKey);
  if (rawKey.byteLength !== 32) throw new Error('identity encryption key must contain 32 bytes');
  const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: encoder.encode(additionalData) },
    key,
    encoder.encode(plaintext)
  );
  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(ciphertext))}`;
}

async function importAesKey(encodedKey, usages) {
  const rawKey = fromBase64Url(encodedKey);
  if (rawKey.byteLength !== 32) throw new Error('AES key must contain 32 bytes');
  return crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, usages);
}

// 业务原文（倾诉内容、广场帖子）在 care D1 中只以密文保存。
export async function encryptText(plaintext, encodedKey, additionalData) {
  const key = await importAesKey(encodedKey, ['encrypt']);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: encoder.encode(additionalData) },
    key,
    encoder.encode(plaintext)
  );
  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(ciphertext))}`;
}

export async function decryptText(payload, encodedKey, additionalData) {
  if (typeof payload !== 'string' || !payload.includes('.')) throw new Error('invalid ciphertext');
  const [ivPart, dataPart] = payload.split('.');
  const key = await importAesKey(encodedKey, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(ivPart), additionalData: encoder.encode(additionalData) },
    key,
    fromBase64Url(dataPart)
  );
  return new TextDecoder().decode(plaintext);
}
