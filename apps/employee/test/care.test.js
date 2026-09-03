import assert from 'node:assert/strict';
import test from 'node:test';

import { decryptText, encryptText, toBase64Url } from '../functions/api/_lib/crypto.js';
import { deriveDisplayName } from '../functions/api/_lib/care.js';
import { screenContent } from '../functions/api/wall/index.js';

const KEY = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));

test('业务原文加密后可用同一 AAD 解回', async () => {
  const cipher = await encryptText('我最近很累', KEY, 'care:message:conv_1');
  assert.notEqual(cipher, '我最近很累');
  assert.equal(await decryptText(cipher, KEY, 'care:message:conv_1'), '我最近很累');
});

test('AAD 不匹配时无法解密，防止跨会话取用密文', async () => {
  const cipher = await encryptText('我最近很累', KEY, 'care:message:conv_1');
  await assert.rejects(decryptText(cipher, KEY, 'care:message:conv_2'));
});

test('展示名由 anon_id 稳定派生，且不包含 anon_id 本身', async () => {
  const anonId = 'mb_v1_abcdefghijklmnop';
  const name = await deriveDisplayName(anonId);
  assert.equal(name, await deriveDisplayName(anonId));
  assert.ok(!name.includes(anonId));
  assert.notEqual(name, await deriveDisplayName('mb_v1_zzzzzzzzzzzzzzzz'));
});

test('广场内容检查拦截攻击性表达与可识别信息', () => {
  assert.throws(() => screenContent('你就是矫情'), /CONTENT_UNKIND/);
  assert.throws(() => screenContent('我的手机号 13800138000'), /CONTENT_IDENTIFYING/);
  assert.throws(() => screenContent('有事发我邮箱 a.b@example.com'), /CONTENT_IDENTIFYING/);
  assert.doesNotThrow(() => screenContent('今天有点难，但还是想说说'));
});
