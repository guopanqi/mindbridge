#!/usr/bin/env node
// 内测组织最小配置入口：停用组织立即阻止会话续签和业务访问。
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [orgId, action] = process.argv.slice(2);
if (!/^org_beta_[a-f0-9]{32}$/.test(orgId || '') || !['active', 'paused', 'closed'].includes(action)) {
  throw new Error('用法：node scripts/manage-beta-organization.mjs <org_beta_...> <active|paused|closed>');
}
const now = Date.now();
const sql = `UPDATE organizations SET status = '${action}', updated_at = ${now} WHERE id = '${orgId}' AND kind = 'beta';`;
const raw = execFileSync(resolve(appDir, 'node_modules/.bin/wrangler'), [
  'd1', 'execute', 'mindbridge-beta-care', '--remote', '--config', 'wrangler.beta-db.jsonc', '--json', '--command', sql,
], { cwd: appDir, encoding: 'utf8' });
const results = JSON.parse(raw);
if (!results[0]?.success || results[0]?.meta?.changes !== 1) throw new Error('组织不存在或状态更新失败');
process.stdout.write(`组织 ${orgId} 状态已设为 ${action}。\n`);
