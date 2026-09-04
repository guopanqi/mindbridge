// 测试替身：把 seed/activities.sql 读成内存表，只回答 harness/tools.js 实际发出的三种查询。
// 目的是让对话实验不依赖 wrangler / D1；不是通用 SQL 引擎，加新查询要同步扩展这里。
import { readFileSync } from 'node:fs';

const COLUMNS = ['id', 'title', 'kind', 'form', 'duration', 'description', 'pre_label', 'low_label',
  'high_label', 'direction', 'score_label', 'schedule', 'location', 'stages_json', 'enabled', 'data_origin'];

function splitValues(raw) {
  const out = [];
  let i = 0;
  while (i < raw.length) {
    while (raw[i] === ' ' || raw[i] === ',') i++;
    if (i >= raw.length) break;
    if (raw[i] === "'") {
      let value = '';
      i++;
      while (i < raw.length) {
        if (raw[i] === "'" && raw[i + 1] === "'") { value += "'"; i += 2; continue; }
        if (raw[i] === "'") { i++; break; }
        value += raw[i++];
      }
      out.push(value);
    } else {
      let token = '';
      while (i < raw.length && raw[i] !== ',') token += raw[i++];
      token = token.trim();
      out.push(token === 'NULL' ? null : Number(token));
    }
  }
  return out;
}

export function loadActivities(sqlPath) {
  const sql = readFileSync(sqlPath, 'utf8');
  const rows = [];
  for (const match of sql.matchAll(/INSERT OR REPLACE INTO activities \([^)]*\) VALUES \(([\s\S]*?)\);\n/g)) {
    const values = splitValues(match[1]);
    rows.push(Object.fromEntries(COLUMNS.map((name, index) => [name, values[index] ?? null])));
  }
  if (!rows.length) throw new Error(`没有从 ${sqlPath} 解析出活动，检查 seed 格式`);
  return rows;
}

// 记录每次检索，实验里可以直接看到模型的 query 命中了什么。
export function createFakeCareDb(activities, log = []) {
  const enabled = activities.filter((row) => row.enabled === 1);
  return {
    log,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            all: async () => {
              let results;
              if (/id IN \(/.test(sql)) {
                const byId = new Map(enabled.map((row) => [row.id, row]));
                results = args.map((id) => byId.get(id)).filter(Boolean);
              } else if (/LIKE \?/.test(sql)) {
                const needle = String(args[0]).replace(/%/g, '');
                const limit = Number(args[args.length - 1]) || 2;
                results = enabled
                  .filter((row) => `${row.title}${row.description}${row.form}`.includes(needle))
                  .slice(0, limit);
              } else {
                results = enabled.slice(0, Number(args[args.length - 1]) || 2);
              }
              log.push({ sql: sql.replace(/\s+/g, ' ').trim().slice(0, 60), args, hits: results.map((row) => row.id) });
              return { results };
            },
          };
        },
      };
    },
  };
}
