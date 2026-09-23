#!/usr/bin/env node
// 只导出假名研究数据；运行者需有 Cloudflare D1 读取权限。
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [orgId, fromText, toText, outputDir, purpose] = process.argv.slice(2);
if (!/^org_[a-z0-9_]{3,80}$/.test(orgId || '') || !/^\d{4}-\d\d-\d\d$/.test(fromText || '') || !/^\d{4}-\d\d-\d\d$/.test(toText || '') || !outputDir || !purpose?.trim()) {
  throw new Error('用法：node scripts/export-research.mjs <组织ID> <起始日YYYY-MM-DD> <截止日YYYY-MM-DD> <输出目录> <用途>');
}
const from = Date.parse(`${fromText}T00:00:00Z`);
const to = Date.parse(`${toText}T00:00:00Z`) + 86400000;
if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from || to > Date.now() + 2 * 86400000) throw new Error('日期范围不合法');
const quote = (s) => `'${String(s).replaceAll("'", "''")}'`;
function query(sql) {
  const raw = execFileSync(resolve(appDir, 'node_modules/.bin/wrangler'), [
    'd1', 'execute', 'mindbridge-beta-care', '--remote', '--config', 'wrangler.beta-db.jsonc', '--json', '--command', sql,
  ], { cwd: appDir, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const result = JSON.parse(raw);
  if (!result[0]?.success) throw new Error('D1 查询失败');
  return result[0].results || [];
}
function paged(sql) {
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const page = query(`${sql} LIMIT 500 OFFSET ${offset}`);
    rows.push(...page);
    if (page.length < 500) return rows;
  }
}
function csv(rows, columns) {
  const escape = (value) => {
    const raw = value == null ? '' : String(value);
    // 避免表格软件把导出字段解释为公式。
    const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [columns.join(','), ...rows.map((row) => columns.map((key) => escape(row[key])).join(','))].join('\n') + '\n';
}
const org = query(`SELECT id, display_name, kind, status, created_at FROM organizations WHERE id = ${quote(orgId)}`);
if (org.length !== 1) throw new Error('组织不存在');
const participants = paged(`SELECT s.organization_id, s.anon_id AS anonymous_user_id, s.entry_channel,
  s.created_at AS first_seen_at, s.last_seen_at,
  (SELECT COUNT(*) FROM product_events e WHERE e.anon_id = s.anon_id AND e.organization_id = s.organization_id AND e.occurred_at >= ${from} AND e.occurred_at < ${to}) AS event_count
  FROM subject_organizations s WHERE s.organization_id = ${quote(orgId)}
  AND EXISTS (SELECT 1 FROM product_events e WHERE e.anon_id = s.anon_id AND e.organization_id = s.organization_id AND e.occurred_at >= ${from} AND e.occurred_at < ${to})
  ORDER BY s.created_at, s.anon_id`);
const events = paged(`SELECT id AS event_id, organization_id, anon_id AS anonymous_user_id, entry_channel,
  event_name, occurred_at, object_type, object_id, app_version, content_version, schema_version
  FROM product_events WHERE organization_id = ${quote(orgId)} AND occurred_at >= ${from} AND occurred_at < ${to}
  AND data_origin = 'live' ORDER BY occurred_at, id`);
const feedback = paged(`SELECT id AS feedback_id, organization_id, anon_id AS anonymous_user_id,
  question_code, question_version, context_type, context_id, offered_at, answer_code, answered_at, skipped_at, app_version
  FROM experience_feedback WHERE organization_id = ${quote(orgId)} AND offered_at >= ${from} AND offered_at < ${to}
  AND data_origin = 'live' ORDER BY offered_at, id`);
const out = resolve(outputDir);
mkdirSync(out, { recursive: true, mode: 0o700 });
writeFileSync(resolve(out, 'organizations.csv'), csv(org, ['id', 'display_name', 'kind', 'status', 'created_at']), { mode: 0o600 });
writeFileSync(resolve(out, 'participants.csv'), csv(participants, ['organization_id', 'anonymous_user_id', 'entry_channel', 'first_seen_at', 'last_seen_at', 'event_count']), { mode: 0o600 });
writeFileSync(resolve(out, 'events.csv'), csv(events, ['event_id', 'organization_id', 'anonymous_user_id', 'entry_channel', 'event_name', 'occurred_at', 'object_type', 'object_id', 'app_version', 'content_version', 'schema_version']), { mode: 0o600 });
writeFileSync(resolve(out, 'feedback.csv'), csv(feedback, ['feedback_id', 'organization_id', 'anonymous_user_id', 'question_code', 'question_version', 'context_type', 'context_id', 'offered_at', 'answer_code', 'answered_at', 'skipped_at', 'app_version']), { mode: 0o600 });
appendFileSync(resolve(out, 'export-audit.jsonl'), JSON.stringify({ at: new Date().toISOString(), operator: process.env.USER || 'unknown', organizationId: orgId, from: fromText, to: toText, purpose: purpose.trim(), counts: { participants: participants.length, events: events.length, feedback: feedback.length } }) + '\n', { mode: 0o600 });
process.stdout.write(`已导出到 ${out}：${participants.length} 个假名主体、${events.length} 条事件、${feedback.length} 条反馈。\n`);
