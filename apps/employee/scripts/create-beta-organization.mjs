#!/usr/bin/env node
// 仅供持有 Cloudflare D1 写权限的内部人员使用；邀请原码只在终端输出一次。
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [name, originText, maxText = '100', daysText = '30', consoleOriginText = 'https://mindbridge-console.pages.dev'] = process.argv.slice(2);
if (!name || name.length > 80 || /[\x00-\x1f]/.test(name) || !originText) { // eslint-disable-line no-control-regex -- 组织名不得含控制字符
  throw new Error('用法：node scripts/create-beta-organization.mjs "组织名称" https://员工端域名 [人数上限] [有效天数] [https://管理端域名]');
}
const origin = new URL(originText);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('应用地址必须是 HTTPS 站点根地址');
}
const consoleOrigin = new URL(consoleOriginText);
if (consoleOrigin.protocol !== 'https:' || consoleOrigin.pathname !== '/' || consoleOrigin.search || consoleOrigin.hash) {
  throw new Error('管理端地址必须是 HTTPS 站点根地址');
}
const maxJoins = Number(maxText);
const days = Number(daysText);
if (!Number.isInteger(maxJoins) || maxJoins < 1 || maxJoins > 100000 || !Number.isInteger(days) || days < 1 || days > 365) {
  throw new Error('人数上限或有效天数不合法');
}
const id = `org_beta_${randomUUID().replaceAll('-', '')}`;
const inviteId = `inv_${randomUUID().replaceAll('-', '')}`;
// 参与者邀请码：12 字节随机 → 16 个 base64url 字符（96 位熵，链接好转发；
// 在线猜测不可行，且有名额上限与有效期兜底）。管理密钥保持 32 字节。
const token = randomBytes(12).toString('base64url');
const digest = createHash('sha256').update(token).digest('base64url');
const adminToken = randomBytes(32).toString('base64url');
const adminDigest = createHash('sha256').update(adminToken).digest('base64url');
const now = Date.now();
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sql = `INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at)
VALUES (${quote(id)}, ${quote(name)}, 'beta', 'active', ${now}, ${now});
INSERT INTO beta_invites (id, organization_id, token_digest, expires_at, max_joins, created_at)
VALUES (${quote(inviteId)}, ${quote(id)}, ${quote(digest)}, ${now + days * 86400000}, ${maxJoins}, ${now});
INSERT INTO beta_admin_credentials (organization_id, token_digest, created_at)
VALUES (${quote(id)}, ${quote(adminDigest)}, ${now});`;
execFileSync(resolve(appDir, 'node_modules/.bin/wrangler'), [
  'd1', 'execute', 'mindbridge-beta-care', '--remote', '--config', 'wrangler.beta-db.jsonc', '--command', sql,
], { cwd: appDir, stdio: ['ignore', 'pipe', 'inherit'] });
const url = new URL(origin);
url.searchParams.set('invite', token);
const adminUrl = new URL('/', consoleOrigin);
adminUrl.searchParams.set('orgKey', adminToken);
process.stdout.write(`组织 ID：${id}\n邀请链接（只显示一次）：${url.href}\n管理链接（只显示一次，勿发给普通参与者）：${adminUrl.href}\n`);
