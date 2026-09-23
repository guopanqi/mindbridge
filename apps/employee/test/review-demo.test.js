import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestPost } from '../functions/api/auth/demo.js';

class RecordingDb {
  operations = [];

  prepare(sql) {
    return {
      bind: (...params) => ({
        run: async () => {
          this.operations.push({ sql, params });
          return { success: true };
        },
      }),
    };
  }
}

test('体验通道开启时签发独立匿名会话', async () => {
  const db = new RecordingDb();
  const response = await onRequestPost({ env: { REVIEW_DEMO: 'on', CARE_DB: db } });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.authenticated, true);
  assert.equal(body.review, true);
  assert.match(response.headers.get('set-cookie'), /^__Host-mb_session=/);
  assert.equal(db.operations.length, 1);
  assert.match(db.operations[0].params[1], /^mbreview_[a-f0-9]{32}$/);
});

test('体验通道关闭时不写数据库', async () => {
  const db = new RecordingDb();
  const response = await onRequestPost({ env: { REVIEW_DEMO: 'off', CARE_DB: db } });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.reasonCode, 'REVIEW_DEMO_DISABLED');
  assert.equal(db.operations.length, 0);
});
