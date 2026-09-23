// 系统侧创建全局疗愈师账号：登录名唯一，网页不需要邀请码或专用链接。
// 用法：node scripts/provision-healer.mjs "姓名" "资质说明" [--remote]
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const remote = args.includes('--remote');
const [name, credential = ''] = args.filter((arg) => arg !== '--remote');
if (!name || name.trim().length < 2 || name.trim().length > 40 || credential.length > 200) {
  throw new Error('用法：node scripts/provision-healer.mjs "疗愈师登录名" "资质说明" [--remote]');
}

const loginName = name.trim();
const staffId = `stf_${randomBytes(12).toString('hex')}`;
const now = Date.now();
const esc = (value) => String(value).replace(/'/g, "''");
const sql = `INSERT INTO staff
  (staff_id, tenant_id, display_name, credential, login_name, roles, auth_method, status, created_at, updated_at, last_seen_at)
  VALUES ('${staffId}', 'external', '${esc(loginName)}', '${esc(credential)}', '${esc(loginName)}',
    'healer', 'name_login', 'active', ${now}, ${now}, ${now});\n`;

writeFileSync('seed/healer.sql', sql);
if (remote) {
  execFileSync('node_modules/.bin/wrangler', [
    'd1', 'execute', 'mindbridge-staff', '--remote', '--file', 'seed/healer.sql',
  ], { stdio: 'inherit' });
  console.log(`疗愈师账号已创建：${loginName}`);
} else {
  console.log(`已生成 seed/healer.sql；执行到 mindbridge-staff 后，疗愈师用「${loginName}」在工作台登录。`);
}
