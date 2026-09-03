import assert from 'node:assert/strict';
import test from 'node:test';

import { exchangeDingTalkCode, onRequestPost } from '../functions/api/auth.js';

test('企业 H5 免登使用应用 token 再交换 userid', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body) });
    if (calls.length === 1) return Response.json({ accessToken: 'app-access-token' });
    return Response.json({ errcode: 0, result: { userid: 'user-sensitive-value' } });
  });

  const userId = await exchangeDingTalkCode('one-time-code', {
    DINGTALK_CLIENT_ID: 'ding-app-key',
    DINGTALK_APP_SECRET: 'app-secret',
  });

  assert.equal(userId, 'user-sensitive-value');
  assert.equal(calls[0].url, 'https://api.dingtalk.com/v1.0/oauth2/accessToken');
  assert.deepEqual(calls[0].body, { appKey: 'ding-app-key', appSecret: 'app-secret' });
  assert.match(calls[1].url, /^https:\/\/oapi\.dingtalk\.com\/topapi\/v2\/user\/getuserinfo\?/);
  assert.deepEqual(calls[1].body, { code: 'one-time-code' });
  assert.ok(!JSON.stringify(calls).includes('userAccessToken'));
});

test('钉钉身份响应缺少 userid 时拒绝建立身份', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    const body = JSON.parse(init.body);
    if (body.appKey) return Response.json({ accessToken: 'app-access-token' });
    return Response.json({ errcode: 0, result: {} });
  });

  await assert.rejects(
    exchangeDingTalkCode('one-time-code', {
      DINGTALK_CLIENT_ID: 'ding-app-key',
      DINGTALK_APP_SECRET: 'app-secret',
    }),
    /DINGTALK_IDENTITY_INVALID/
  );
});

class RecordingDb {
  constructor(firstResult = null) {
    this.firstResult = firstResult;
    this.operations = [];
  }

  prepare(sql) {
    const db = this;
    return {
      bind(...params) {
        const operation = { sql, params };
        return {
          first: async () => {
            db.operations.push(operation);
            return db.firstResult;
          },
          run: async () => {
            db.operations.push(operation);
            if (sql.startsWith('INSERT INTO identity_mappings')) {
              db.firstResult = { canonical_anon_id: params[0] };
            }
            return { success: true };
          },
        };
      },
    };
  }

  async batch(statements) {
    for (const statement of statements) await statement.run();
    return statements.map(() => ({ success: true }));
  }
}

test('身份库保存加密映射，业务库和响应不出现 userid', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    const body = JSON.parse(init.body);
    if (body.appKey) return Response.json({ accessToken: 'app-access-token' });
    return Response.json({ errcode: 0, result: { userid: 'user-sensitive-value' } });
  });
  const identityDb = new RecordingDb();
  const careDb = new RecordingDb();
  const request = new Request('https://mindbridge.example/api/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code: 'one-time-code' }),
  });
  const response = await onRequestPost({
    request,
    env: {
      DINGTALK_CLIENT_ID: 'ding-app-key',
      DINGTALK_APP_SECRET: 'x'.repeat(32),
      DINGTALK_CORP_ID: 'corp-sensitive-value',
      ANON_KEY_VERSION: 'v2',
      ANON_HMAC_KEY_V2: 'a'.repeat(32),
      SUBJECT_LOOKUP_KEY_V1: 'b'.repeat(32),
      IDENTITY_ENCRYPTION_KEY_VERSION: 'v2',
      IDENTITY_ENCRYPTION_KEY_V2: 'c'.repeat(43),
      IDENTITY_DB: identityDb,
      CARE_DB: careDb,
    },
  });

  assert.equal(response.status, 200);
  const responseText = await response.text();
  const identityWrites = JSON.stringify(identityDb.operations);
  const careWrites = JSON.stringify(careDb.operations);
  assert.ok(identityDb.operations.some(({ sql }) => sql.includes('identity_mappings')));
  assert.ok(careDb.operations.some(({ sql }) => sql.includes('INSERT INTO sessions')));
  assert.ok(careWrites.includes('mb_v2_'));
  assert.ok(!identityWrites.includes('user-sensitive-value'));
  assert.ok(!identityWrites.includes('corp-sensitive-value'));
  assert.ok(!careWrites.includes('user-sensitive-value'));
  assert.ok(!careWrites.includes('corp-sensitive-value'));
  assert.ok(!responseText.includes('user-sensitive-value'));
  assert.ok(!responseText.includes('mb_v1_'));
});
