import assert from 'node:assert/strict';
import test from 'node:test';
import { bareEntryCode } from '../src/entry-mode.js';

test('普通浏览器打开根地址时要求邀请链接', () => {
  assert.equal(bareEntryCode('Mozilla/5.0 Chrome/120.0.0.0'), 'INVITE_REQUIRED');
  assert.equal(bareEntryCode(''), 'INVITE_REQUIRED');
});

test('钉钉客户端仍走免登', () => {
  assert.equal(bareEntryCode('Mozilla/5.0 DingTalk/7.0.10'), null);
  assert.equal(bareEntryCode('dingtalk'), null);
});
