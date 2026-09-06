// 预设一名疗愈师并生成长期入口链接。
//
// 用法：node scripts/provision-healer.mjs "李佳" "UNIHEAL 国际疗愈师 · UH-2024-0871" [--remote]
// 输出一条 SQL 与一个入口链接。密钥只以摘要入库，明文只在这一次输出。
import { createHash, randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const [name = '李佳', credential = 'UNIHEAL 国际疗愈师 · UH-2024-0871'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const base = process.env.CONSOLE_ORIGIN || 'https://mindbridge-console.pages.dev';

const key = randomBytes(24).toString('base64url');
const digest = createHash('sha256').update(key).digest('base64url');
const staffId = `stf_${randomBytes(8).toString('hex')}`;
const keyId = `key_${randomBytes(8).toString('hex')}`;
const now = Date.now();
const esc = (s) => String(s).replace(/'/g, "''");

const sql = [
  `INSERT OR REPLACE INTO staff (staff_id, tenant_id, display_name, credential, roles, auth_method, status, created_at, updated_at, last_seen_at)`
  + ` VALUES ('${staffId}', 'external', '${esc(name)}', '${esc(credential)}', 'healer', 'access_key', 'active', ${now}, ${now}, ${now});`,
  `INSERT INTO staff_access_keys (id, staff_id, key_digest, label, created_at)`
  + ` VALUES ('${keyId}', '${staffId}', '${digest}', '${esc(name)} 的常用入口', ${now});`,
].join('\n');

writeFileSync('seed/healer.sql', `${sql}\n`);
console.log(`已生成 seed/healer.sql（只含摘要，可安全提交给 wrangler 执行）`);
console.log(`\n疗愈师：${name} · ${credential}`);
console.log(`入口链接（只显示这一次，请立即保存）：\n${base}/healer?k=${key}\n`);
