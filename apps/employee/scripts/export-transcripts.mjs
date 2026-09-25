#!/usr/bin/env node
// RESEARCH_EXPORT_TOKEN 是独立的服务端密钥；不要把它写进仓库或命令参数。
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [originText, organizationId, from, to, outputDir, purpose] = process.argv.slice(2);
const token = process.env.RESEARCH_EXPORT_TOKEN;
if (!originText || !/^org_[a-z0-9_]{3,80}$/.test(organizationId || '') || !/^\d{4}-\d\d-\d\d$/.test(from || '') || !/^\d{4}-\d\d-\d\d$/.test(to || '') || !outputDir || !purpose?.trim() || !token) {
  throw new Error('用法：RESEARCH_EXPORT_TOKEN=... node scripts/export-transcripts.mjs https://员工端域名 <组织ID> <起始日> <截止日> <输出目录> <用途>');
}
const origin = new URL(originText);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('必须使用 HTTPS 站点根地址');
const lines = ['organization_id,anonymous_user_id,conversation_id,message_id,role,created_at,text'];
let cursor = 0;
for (;;) {
  const url = new URL('/api/internal/research-transcripts', origin);
  for (const [key, value] of Object.entries({ organizationId, from, to, cursor })) url.searchParams.set(key, String(value));
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(`导出失败：${body.reasonCode || response.status}`);
  lines.push(...body.rows);
  if (body.nextCursor === null) break;
  cursor = body.nextCursor;
}
const out = resolve(outputDir);
mkdirSync(out, { recursive: true, mode: 0o700 });
const filename = resolve(out, `transcripts-${organizationId}-${from}-${to}.csv`);
writeFileSync(filename, lines.join('\n') + '\n', { mode: 0o600 });
appendFileSync(resolve(out, 'export-audit.jsonl'), JSON.stringify({ at: new Date().toISOString(), operator: process.env.USER || 'unknown', organizationId, from, to, purpose: purpose.trim(), file: filename, rows: lines.length - 1 }) + '\n', { mode: 0o600 });
process.stdout.write(`已导出 ${lines.length - 1} 条消息到 ${filename}\n`);
