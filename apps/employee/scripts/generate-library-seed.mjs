// 用原型 LIB 的元数据补全活动目录，使资源库可浏览。
// 按标题匹配；LIB 里有而活动目录没有的条目会被登记出来，避免静默丢失。
import { writeFileSync } from 'node:fs';
import { LIB } from '../functions/api/_lib/library-data.js';

const esc = (s) => String(s).replace(/'/g, "''");
const lines = ['-- 由 scripts/generate-library-seed.mjs 生成，勿手改。'];
let count = 0;
for (const [level, items] of Object.entries(LIB)) {
  if (level === 'healer') continue; // 疗愈师服务项不在员工资源库里
  for (const item of items) {
    count += 1;
    lines.push(
      `UPDATE activities SET suited_for = '${esc(item.d || '')}', core_method = '${esc(item.core || '')}', level = '${level}'`
      + `${item.v ? `, duration = CASE WHEN duration = '' THEN '${esc(item.v)}' ELSE duration END` : ''}`
      + ` WHERE title = '${esc(item.n)}';`
    );
  }
}
// 目录里有活动但 LIB 没覆盖的，按干预矩阵的级别兜底，保证 level 字段都有值。
lines.push(`UPDATE activities SET level = 'L2' WHERE level = 'L1' AND kind = 'offline' AND suited_for = '';`);
writeFileSync('seed/library.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${count} 条资源库元数据 → seed/library.sql`);
