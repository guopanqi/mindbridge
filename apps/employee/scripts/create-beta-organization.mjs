#!/usr/bin/env node
// 仅供持有 Cloudflare D1 写权限的内部人员使用；邀请原码只在终端输出一次。
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [name, originText, maxText = '100', daysText = '30'] = process.argv.slice(2);
if (!name || name.length > 80 || /[\x00-\x1f]/.test(name) || !originText) {
  throw new Error('用法：node scripts/create-beta-organization.mjs "组织名称" https://应用域名 [人数上限] [有效天数]');
}
const origin = new URL(originText);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('应用地址必须是 HTTPS 站点根地址');
}
const maxJoins = Number(maxText);
const days = Number(daysText);
if (!Number.isInteger(maxJoins) || maxJoins < 1 || maxJoins > 100000 || !Number.isInteger(days) || days < 1 || days > 365) {
  throw new Error('人数上限或有效天数不合法');
}
const id = `org_beta_${randomUUID().replaceAll('-', '')}`;
const inviteId = `inv_${randomUUID().replaceAll('-', '')}`;
const token = randomBytes(32).toString('base64url');
const digest = createHash('sha256').update(token).digest('base64url');
const now = Date.now();
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sql = `INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at)
VALUES (${quote(id)}, ${quote(name)}, 'beta', 'active', ${now}, ${now});
INSERT INTO beta_invites (id, organization_id, token_digest, expires_at, max_joins, created_at)
VALUES (${quote(inviteId)}, ${quote(id)}, ${quote(digest)}, ${now + days * 86400000}, ${maxJoins}, ${now});`;
execFileSync(resolve(appDir, 'node_modules/.bin/wrangler'), [
  'd1', 'execute', 'mindbridge-beta-care', '--remote', '--config', 'wrangler.beta-db.jsonc', '--command', sql,
], { cwd: appDir, stdio: ['ignore', 'pipe', 'inherit'] });
const url = new URL(origin);
url.searchParams.set('invite', token);
process.stdout.write(`组织 ID：${id}\n邀请链接（只显示一次）：${url.href}\n`);
