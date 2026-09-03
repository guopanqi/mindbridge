// 预设疗愈师账号并生成长期门户密钥。一次性运行，输出的链接收好即可。
//
// 用法：node scripts/provision-healer.mjs "李佳" "UNIHEAL 国际疗愈师 · UH-2024-0871" [--remote]
import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';

const [name = '李佳', title = 'UNIHEAL 国际疗愈师 · UH-2024-0871'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const remote = process.argv.includes('--remote');

const key = randomBytes(24).toString('base64url');
const digest = createHash('sha256').update(key).digest('base64url');
const now = Date.now();
const staffId = `stf_healer_${randomBytes(6).toString('hex')}`;
const keyId = `pk_${randomBytes(8).toString('hex')}`;
const esc = (s) => String(s).replace(/'/g, "''");

const sql = [
  `INSERT OR REPLACE INTO staff (staff_id, tenant_id, display_name, title, roles, auth_method, status, created_at, updated_at, last_seen_at)`
  + ` VALUES ('${staffId}', 'external', '${esc(name)}', '${esc(title)}', 'healer', 'portal_key', 'active', ${now}, ${now}, ${now});`,
  `INSERT INTO healer_portal_keys (id, key_digest, staff_id, label, created_by, created_at)`
  + ` VALUES ('${keyId}', '${digest}', '${staffId}', '${esc(name)} 门户密钥', 'provision-script', ${now});`,
].join('\n');

execFileSync('npx', [
  'wrangler', 'd1', 'execute', 'mindbridge-staff',
  remote ? '--remote' : '--local', '--command', sql,
], { stdio: ['ignore', 'ignore', 'inherit'] });

const origin = remote ? 'https://mindbridge-console.pages.dev' : 'http://localhost:8789';
console.log(`已创建疗愈师：${name}（${title}）`);
console.log(`门户链接（请妥善保存，等同于登录凭证）：`);
console.log(`${origin}/healer?k=${key}`);
