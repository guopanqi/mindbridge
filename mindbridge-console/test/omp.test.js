import assert from 'node:assert/strict';
import test from 'node:test';

import { exchangeOmpCode } from '../functions/api/auth/omp.js';
import { parseRoles } from '../functions/api/_lib/staff.js';

const env = {
  DINGTALK_CORP_ID: 'ding-corp',
  DINGTALK_SSO_SECRET: 'x'.repeat(40),
};

test('管理后台免登按 SSO 链路交换：先 gettoken 再 getuserinfo', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    if (calls.length === 1) return Response.json({ errcode: 0, access_token: 'sso-token' });
    return Response.json({ errcode: 0, is_sys: true, sys_level: 1, user_info: { userid: 'admin-user', name: '张敏' } });
  });

  const identity = await exchangeOmpCode('one-time-code', env);
  assert.equal(identity.userId, 'admin-user');
  assert.equal(identity.displayName, '张敏');
  assert.equal(identity.isAdmin, true);
  assert.match(calls[0], /^https:\/\/oapi\.dingtalk\.com\/sso\/gettoken\?/);
  assert.match(calls[0], /corpsecret=x{40}/);
  assert.match(calls[1], /^https:\/\/oapi\.dingtalk\.com\/sso\/getuserinfo\?/);
  assert.match(calls[1], /code=one-time-code/);
});

test('非管理员的身份不会被标记为 admin', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => (
    String(url).includes('gettoken')
      ? Response.json({ errcode: 0, access_token: 'sso-token' })
      : Response.json({ errcode: 0, is_sys: false, sys_level: 0, user_info: { userid: 'plain-user', name: '普通员工' } })
  ));
  const identity = await exchangeOmpCode('code', env);
  assert.equal(identity.isAdmin, false);
});

test('钉钉返回 errcode 非 0 时拒绝签发会话', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ errcode: 40078, errmsg: 'invalid code' }));
  await assert.rejects(exchangeOmpCode('bad', env), /DINGTALK_SSO_TOKEN_FAILED/);
});

test('缺少 SSOSecret 时按配置缺失处理，不去调用钉钉', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => Response.json({}));
  await assert.rejects(
    exchangeOmpCode('code', { DINGTALK_CORP_ID: 'ding-corp' }),
    /APP_CONFIGURATION_MISSING/
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('角色解析只接受白名单内的角色', () => {
  assert.deepEqual(parseRoles('admin,hr_viewer'), ['admin', 'hr_viewer']);
  assert.deepEqual(parseRoles('admin, superuser ,healer'), ['admin', 'healer']);
  assert.deepEqual(parseRoles(''), []);
  assert.deepEqual(parseRoles(null), []);
});
