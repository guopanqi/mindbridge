import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const activitySchema = JSON.parse(readFileSync(new URL('../content/activity.schema.json', import.meta.url), 'utf8'));

// Validator for the explicit schema vocabulary above (not a general JSON Schema engine).
function validateSchema(schema, value, path = '$') {
  const bad = rule => { throw new Error(`${path}: ${rule}`); };
  if (schema.type) {
    const valid = schema.type === 'array' ? Array.isArray(value)
      : schema.type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
      : schema.type === 'integer' ? Number.isSafeInteger(value) : typeof value === schema.type;
    if (!valid) bad(`expected ${schema.type}`);
  }
  if (schema.enum && !schema.enum.includes(value)) bad('invalid enum');
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) bad('below minimum');
  if (typeof value === 'number' && schema.maximum !== undefined && value > schema.maximum) bad('above maximum');
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) bad('too short');
    if (schema.maxLength && value.length > schema.maxLength) bad('too long');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) bad('invalid pattern');
  }
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) bad('too few items');
    if (schema.maxItems && value.length > schema.maxItems) bad('too many items');
    if (schema.items) value.forEach((v, i) => validateSchema(schema.items, v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const key of schema.required || []) if (!(key in value)) bad(`missing ${key}`);
    for (const [key, v] of Object.entries(value)) {
      if (schema.properties?.[key]) validateSchema(schema.properties[key], v, `${path}.${key}`);
      else if (schema.additionalProperties === false) bad(`unknown ${key}`);
    }
  }
}

// Deliberately small schema: final stage documents, never prototype engines.
export function validateActivity(a) {
  validateSchema(activitySchema, a);
  const fail = (message) => { throw new Error(`${a?.id || 'activity'}: ${message}`); };
  const str = (v, max = 2000) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  if (!a || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(a.id)) fail('invalid id');
  if (!Number.isSafeInteger(a.contentVersion) || a.contentVersion < 1) fail('invalid contentVersion');
  if (!str(a.title, 120) || !str(a.description) || !['online', 'offline'].includes(a.kind)) fail('invalid metadata');
  if (typeof a.available !== 'boolean' || !['L1', 'L2'].includes(a.level)) fail('invalid availability/level');
  if (!Array.isArray(a.tags) || a.tags.length > 20 || a.tags.some(t => !str(t, 40))) fail('invalid tags');
  if (!a.scale || !['up', 'down'].includes(a.scale.direction) || ['preLabel', 'low', 'high'].some(k => !str(a.scale[k], 200))) fail('invalid scale');
  if (!Array.isArray(a.stages) || a.stages.length > 50 || (a.kind === 'online' && !a.stages.length)) fail('invalid stages');
  // 播放器认识的步骤类型。新增类型必须同时在 src/views/activity-engines.js 里有渲染实现，
  // 否则旧版本 WebView 会退回 fallbackHint —— 所以除这几种之外一律强制要求 fallbackHint。
  const KNOWN = ['prompt', 'note', 'input', 'choice', 'breath', 'scan', 'timer', 'entries', 'media'];
  const positive = (v, max) => Number.isSafeInteger(v) && v > 0 && v <= max;
  for (const s of a.stages) {
    if (!s || !str(s.type, 40) || !str(s.title, 200)) fail('invalid stage');
    if (s.hint !== undefined && !str(s.hint)) fail('invalid hint');
    if (s.type === 'media') {
      if (!['audio', 'video'].includes(s.presentation)) fail('media needs audio/video presentation');
      if (s.src && (s.src.includes('\\') || !/^(https:\/\/[^\s]+|\/(?!\/)[^\s]+)$/.test(s.src))) fail('invalid media source');
      if (!s.src && (!Array.isArray(s.segments) || !s.segments.length || s.segments.length > 12
        || s.segments.some(seg => !str(seg.title, 60) || !positive(seg.seconds, 300)))) fail('demo media needs timed segments');
    }
    if (!KNOWN.includes(s.type) && !str(s.fallbackHint)) fail('new stage needs fallbackHint');
    if (s.type === 'choice' && (!Array.isArray(s.options) || !s.options.length || s.options.length > 20 || s.options.some(o => !str(o.label, 200)))) fail('invalid choices');
    if (s.type === 'breath') {
      const c = s.cycle;
      if (!c || !positive(c.inhale, 20) || !positive(c.exhale, 20)) fail('invalid breath cycle');
      if (c.hold !== undefined && !(Number.isSafeInteger(c.hold) && c.hold >= 0 && c.hold <= 20)) fail('invalid breath hold');
      if (!positive(s.rounds, 20)) fail('breath needs rounds');
    }
    if (s.type === 'scan' && (!Array.isArray(s.parts) || !s.parts.length || s.parts.length > 12
      || s.parts.some(part => !str(part.name, 40) || !str(part.hint, 300)
        || (part.seconds !== undefined && !positive(part.seconds, 120))))) fail('invalid scan parts');
    if (s.type === 'timer' && (!Array.isArray(s.segments) || !s.segments.length || s.segments.length > 12
      || s.segments.some(seg => !str(seg.title, 60) || !positive(seg.seconds, 300)))) fail('invalid timer segments');
    if (s.type === 'entries' && (!Array.isArray(s.placeholders) || !s.placeholders.length
      || s.placeholders.length > 6 || s.placeholders.some(t => !str(t, 120)))) fail('invalid entries');
  }
  if (JSON.stringify(a).length > 50000) fail('document too large');
  return a;
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
export const contentHash = a => createHash('sha256').update(JSON.stringify(canonical(a))).digest('hex');
export function classifyActivity(a, previous) {
  if (!previous) return '新增';
  if (previous.content_hash === contentHash(a)) return '未变';
  if (previous.content_hash && a.contentVersion <= previous.content_version) throw new Error(`${a.id}: changed content must increment contentVersion`);
  return '更新';
}
const sql = value => value === null || value === undefined ? 'NULL' : typeof value === 'number' ? String(value) : `'${String(value).replaceAll("'", "''")}'`;
export function activitySql(a) {
  const fields = {
    id: a.id, title: a.title, kind: a.kind, form: a.form || '文字自助', duration: a.duration || '', description: a.description,
    pre_label: a.scale.preLabel, low_label: a.scale.low, high_label: a.scale.high, direction: a.scale.direction,
    score_label: a.scoreLabel || '状态', stages_json: JSON.stringify(a.stages), level: a.level,
    suited_for: a.suitedFor || a.tags.join('、'), core_method: a.coreMethod || '', schedule: a.schedule, location: a.location,
    content_version: a.contentVersion, content_hash: contentHash(a), content_available: Number(a.available), tags_json: JSON.stringify(a.tags),
  };
  return `INSERT INTO activities (${Object.keys(fields).join(',')}) VALUES (${Object.values(fields).map(sql).join(',')}) ON CONFLICT(id) DO UPDATE SET ${Object.keys(fields).filter(k => k !== 'id').map(k => `${k}=excluded.${k}`).join(',')} WHERE activities.content_hash IS NULL OR excluded.content_version > activities.content_version;\nINSERT INTO service_status (service_id, status, preview_visible, updated_at) VALUES (${sql(`activity:${a.id}`)}, ${sql(a.available ? 'open' : 'coming_soon')}, ${Number(a.kind === 'offline' && !a.available)}, 0) ON CONFLICT(service_id) DO NOTHING;`;
}
export function catalogSql(config) {
  if (!config || typeof config.name !== 'string' || !/^[a-z0-9-]+$/.test(config.activityId)) throw new Error('Invalid resource mapping');
  return `INSERT INTO resource_catalog (name, level, description, icon, enabled, activity_id) VALUES (${sql(config.name)}, 'L1', '', '🌿', 1, ${sql(config.activityId)}) ON CONFLICT(name) DO UPDATE SET activity_id=excluded.activity_id;`;
}
