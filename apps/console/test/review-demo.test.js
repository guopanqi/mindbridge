import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestPost } from '../functions/api/auth/demo.js';

test('评审模式关闭时拒绝演示登录且不访问数据库', async () => {
  const response = await onRequestPost({
    request: new Request('https://example.test/api/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ name: 'admin' }),
    }),
    env: {
      REVIEW_DEMO: 'off',
      STAFF_DB: { prepare: () => { throw new Error('不应访问数据库'); } },
    },
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.equal(body.reasonCode, 'DEMO_LOGIN_DISABLED');
});
