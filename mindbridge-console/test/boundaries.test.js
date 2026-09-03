import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

// 架构约束的守卫测试：管理端一旦拿到 care 数据库 binding，
// "HR 端没有任何数据库路径可以读到个案原文" 这句话就不再成立。
const config = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
const withoutComments = config.replace(/^\s*\/\/.*$/gm, '');
const parsed = JSON.parse(withoutComments);

test('console 不得绑定 care 数据库', () => {
  const names = (parsed.d1_databases || []).map((db) => `${db.binding}:${db.database_name}`);
  assert.deepEqual(names, ['STAFF_DB:mindbridge-staff']);
  assert.ok(!config.includes('mindbridge-care'), 'wrangler.jsonc 不应出现 mindbridge-care');
});

test('console 不得绑定身份中继数据库', () => {
  assert.ok(!config.includes('mindbridge-identity'), 'wrangler.jsonc 不应出现 mindbridge-identity');
});

test('care 取数地址必须是 https 且可配置', () => {
  assert.match(parsed.vars.CARE_API_ORIGIN, /^https:\/\//);
});
