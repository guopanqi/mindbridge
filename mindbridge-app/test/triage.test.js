import assert from 'node:assert/strict';
import test from 'node:test';

import { analyze, emptyState, triage } from '../functions/api/_lib/triage.js';

test('危机表达判定为红色，并且不返回自助资源', () => {
  const result = triage('我真的撑不下去了，觉得活着没有意义', emptyState(), 'none');
  assert.equal(result.level, 'red');
  assert.equal(result.resource, null);
  assert.match(result.rule, /命中危机词/);
});

test('危机词处于否定语境时保守降级为黄色，不直接放行', () => {
  const result = analyze('我没有想死的念头，只是最近很累', emptyState());
  assert.equal(result.lv, 'yellow');
  assert.match(result.rule, /否定语境/);
});

test('黄色词单独出现即升级为需关注', () => {
  assert.equal(analyze('最近天天失眠', emptyState()).lv, 'yellow');
});

test('普通压力表达为绿色并识别情绪', () => {
  const result = analyze('项目要上线了，一直很焦虑，怕来不及', emptyState());
  assert.equal(result.lv, 'green');
  assert.equal(result.top, '焦虑');
});

test('连续同类信号累积后升级为黄色', () => {
  let state = emptyState();
  let level = 'green';
  for (const text of ['今天特别累', '还是很累，连轴转', '真的累到不行了']) {
    const result = triage(text, state, 'none');
    state = result.nextState;
    level = result.level;
  }
  assert.equal(level, 'yellow');
});

test('第二轮绿色对话会给出一次自助资源，且不重复推送', () => {
  let state = emptyState();
  const first = triage('最近有点焦虑', state, 'none');
  state = first.nextState;
  const second = triage('还是很焦虑，怕来不及', state, 'none');
  assert.ok(second.resource);
  state = second.nextState;
  // 同一资源不重复推送；若累积升级到更高级别，只会给出对应级别的新资源。
  const third = triage('依然焦虑，怕搞砸', state, 'none');
  assert.notEqual(third.resource?.name, second.resource.name);
});

test('处境标签只改变措辞，不改变风险级别', () => {
  const text = '最近压力大，天天失眠';
  const plain = triage(text, emptyState(), 'none');
  const manager = triage(text, emptyState(), 'manager');
  assert.equal(plain.level, manager.level);
  assert.notEqual(plain.reply, manager.reply);
});

test('隐私类提问走意图回复，不产生风险升级', () => {
  const result = triage('公司能看到我说的话吗', emptyState(), 'none');
  assert.equal(result.level, 'green');
  assert.match(result.reply, /名字和工号/);
});
