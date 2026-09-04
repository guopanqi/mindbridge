import assert from 'node:assert/strict';
import test from 'node:test';
import { api } from '../src/api.js';

test('前端超时覆盖响应正文读取，而不只是响应头', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => ({
    ok: true,
    json: () => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }),
  }));
  const pending = api.chatHistory();
  await Promise.resolve();
  const rejected = assert.rejects(pending, { code: 'SERVER_TIMEOUT' });
  t.mock.timers.tick(12_000);
  await rejected;
});

test('前端保留服务端业务错误，不误报网络中断', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
    reasonCode: 'SESSION_REQUIRED', message: '请重新进入',
  }), { status: 401 }));
  await assert.rejects(api.chatHistory(), { code: 'SESSION_REQUIRED', userMessage: '请重新进入' });
});
