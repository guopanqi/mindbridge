import { readdirSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { validateActivity, classifyActivity, activitySql, catalogSql, contentHash } from './activity-content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/import-activities.mjs --check | --local [--apply] | --remote [--apply]\nDefault is validation only. Database modes report changes; --apply explicitly writes. Missing files never delete records.');
  process.exit(0);
}
if (args.some(a => !['--check', '--local', '--remote', '--apply'].includes(a)) || (args.includes('--local') && args.includes('--remote'))) throw new Error('Invalid arguments');
const documents = readdirSync(join(root, 'content/activities')).filter(f => f.endsWith('.json')).sort().map(f => {
  const a = validateActivity(JSON.parse(readFileSync(join(root, 'content/activities', f), 'utf8')));
  if (f !== `${a.id}.json`) throw new Error(`Filename must match id: ${f}`);
  return a;
});
if (new Set(documents.map(a => a.id)).size !== documents.length) throw new Error('Duplicate activity id');
const mappings = JSON.parse(readFileSync(join(root, 'content/resource-activities.json'), 'utf8'));
for (const item of mappings) { catalogSql(item); if (!documents.some(a => a.id === item.activityId)) throw new Error(`Missing activity ${item.activityId}`); }
const mode = args.includes('--remote') ? '--remote' : args.includes('--local') ? '--local' : null;
if (!mode) {
  if (args.includes('--apply')) throw new Error('--apply requires --local or --remote');
  console.log(`Validated ${documents.length} activities and ${mappings.length} mappings`);
} else {
  const cli = options => execFileSync(process.execPath, [join(root, 'node_modules/wrangler/bin/wrangler.js'), 'd1', 'execute', 'mindbridge-beta-care', mode, ...options], { cwd: root, encoding: 'utf8' });
  const existing = JSON.parse(cli(['--command', 'SELECT id,content_version,content_hash FROM activities', '--json'])).flatMap(r => r.results || []);
  const plan = documents.map(a => ({ a, status: classifyActivity(a, existing.find(r => r.id === a.id)) }));
  for (const { a, status } of plan) console.log(`${status}: ${a.id} v${a.contentVersion}`);
  if (args.includes('--apply')) {
    const temp = mkdtempSync(join(tmpdir(), 'mindbridge-activities-'));
    try {
      const file = join(temp, 'import.sql');
      writeFileSync(file, [...plan.filter(p => p.status !== '未变').map(p => activitySql(p.a)), ...mappings.map(catalogSql)].join('\n'));
      cli(['--file', file, '--yes']);
      const confirmed = JSON.parse(cli(['--command', 'SELECT id,content_version,content_hash FROM activities', '--json'])).flatMap(r => r.results || []);
      for (const a of documents) {
        if (confirmed.find(r => r.id === a.id)?.content_hash !== contentHash(a)) throw new Error(`Verification failed for ${a.id}; do not run concurrent imports`);
      }
      console.log('Import completed; HR enabled flags preserved.');
    } finally { rmSync(temp, { recursive: true, force: true }); }
  }
}
