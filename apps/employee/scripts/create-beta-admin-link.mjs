#!/usr/bin/env node
// 为已存在的公开组织创建或轮换独立管理链接；旧管理会话同步失效。
import { randomBytes, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [orgId, consoleOriginText = 'https://mindbridge-console.pages.dev'] = process.argv.slice(2);
if (!/^org_beta_[a-f0-9]{32}$/.test(orgId || '')) {
  throw new Error('用法：node scripts/create-beta-admin-link.mjs <组织ID> [https://管理端域名]');
}
const consoleOrigin = new URL(consoleOriginText);
if (consoleOrigin.protocol !== 'https:' || consoleOrigin.pathname !== '/' || consoleOrigin.search || consoleOrigin.hash) {
  throw new Error('管理端地址必须是 HTTPS 站点根地址');
}
const token = randomBytes(32).toString('base64url');
const digest = createHash('sha256').update(token).digest('base64url');
const sql = `INSERT INTO beta_admin_credentials (organization_id, token_digest, created_at)
  SELECT id, '${digest}', ${Date.now()} FROM organizations WHERE id = '${orgId}' AND kind = 'beta'
  ON CONFLICT(organization_id) DO UPDATE SET token_digest=excluded.token_digest, created_at=excluded.created_at, revoked_at=NULL;
  DELETE FROM beta_admin_sessions WHERE organization_id = '${orgId}';
  SELECT COUNT(*) AS n FROM beta_admin_credentials WHERE organization_id = '${orgId}' AND token_digest = '${digest}';`;
const raw = execFileSync(resolve(appDir, 'node_modules/.bin/wrangler'), [
  'd1', 'execute', 'mindbridge-beta-care', '--remote', '--config', 'wrangler.beta-db.jsonc', '--json', '--command', sql,
], { cwd: appDir, encoding: 'utf8' });
const results = JSON.parse(raw);
if (!results.every((r) => r.success) || results.at(-1)?.results?.[0]?.n !== 1) throw new Error('组织不存在或管理凭证保存失败');
const link = new URL('/', consoleOrigin);
link.searchParams.set('orgKey', token);
process.stdout.write(`组织 ID：${orgId}\n管理链接（只显示一次，勿发给普通参与者）：${link.href}\n`);
