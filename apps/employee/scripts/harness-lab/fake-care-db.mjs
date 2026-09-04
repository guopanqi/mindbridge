// 测试替身：把最终内容 JSON 读成内存表，不依赖旧 prototype seed。
// 目的是让对话实验不依赖 wrangler / D1；不是通用 SQL 引擎，加新查询要同步扩展这里。
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validateActivity } from '../activity-content.mjs';

export function loadActivities(directory) {
  return readdirSync(directory).filter(f => f.endsWith('.json')).sort().map(f => {
    const a = validateActivity(JSON.parse(readFileSync(join(directory, f), 'utf8')));
    return { id: a.id, title: a.title, kind: a.kind, form: a.form || '文字自助', duration: a.duration || '',
      description: a.description, level: a.level, enabled: Number(a.available), content_available: Number(a.available),
      content_version: a.contentVersion, stages_json: JSON.stringify(a.stages) };
  });
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
            first: async () => null, // 实验台不模拟企业HR策略；线上由真实配置决定。
            all: async () => {
              let results;
              if (/id IN \(/.test(sql)) {
                const byId = new Map(enabled.map((row) => [row.id, row]));
                results = args.map((id) => byId.get(id)).filter(Boolean);
              } else if (/LIKE \?/.test(sql)) {
                // tools.js 把 query 拆成多个词，每个词按 title/description/form 各绑一次；
                // 这里按命中的词数打分排序，与 SQL 里的 score 表达式等价。
                const limit = Number(args[args.length - 1]) || 2;
                const terms = [...new Set(args.slice(0, -1).map((item) => String(item).replace(/%/g, '')))];
                results = enabled
                  .map((row) => {
                    const haystack = `${row.title}${row.description}${row.form}`;
                    return { row, score: terms.filter((term) => term && haystack.includes(term)).length };
                  })
                  .filter((item) => item.score > 0)
                  .sort((a, b) => b.score - a.score || String(a.row.title).localeCompare(b.row.title))
                  .slice(0, limit)
                  .map((item) => item.row);
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
