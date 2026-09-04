// Explicit local credential provisioning; never prints values or overwrites an existing .env.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(root, '.env');
if (existsSync(target)) throw new Error('EXISTING_ENV_NOT_OVERWRITTEN');
const vars = JSON.parse(readFileSync(resolve(root, '../employee/wrangler.jsonc'), 'utf8')).vars;
const local = {};
for (const line of readFileSync(resolve(root, '../employee/.dev.vars'), 'utf8').split('\n')) {
  const match = line.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/);
  if (match) local[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, '$2');
}
if (!local.DINGTALK_APP_SECRET || !vars.DINGTALK_ROBOT_CODE) throw new Error('MISSING_DINGTALK_CONFIG');
const values = {
  DINGTALK_CLIENT_ID: vars.DINGTALK_CLIENT_ID,
  DINGTALK_CLIENT_SECRET: local.DINGTALK_APP_SECRET,
  DINGTALK_CORP_ID: vars.DINGTALK_CORP_ID,
  DINGTALK_ROBOT_CODE: vars.DINGTALK_ROBOT_CODE,
  CARE_API_ORIGIN: 'https://mindbridge-app-8j6.pages.dev',
  H5_ORIGIN: 'https://mindbridge-app-8j6.pages.dev',
  BOT_RELAY_TOKEN: randomBytes(32).toString('base64url'),
  BOT_INBOX_KEY: randomBytes(32).toString('base64'),
  BOT_DATA_DIR: './data',
};
writeFileSync(target, Object.entries(values).map(([key,value]) => `${key}=${JSON.stringify(value)}`).join('\n')+'\n', { mode: 0o600, flag: 'wx' });
console.log('Local Stream credentials provisioned; values not displayed. Upload BOT_RELAY_TOKEN through stdin before starting.');
