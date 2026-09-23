import { activityAvailableSql } from './activity-availability.js';
import { MIN_SAMPLE } from './metrics.js';

const WINDOW_DAYS = 90;

export async function readOrganizationConfig(env, organizationId, { includeEnterpriseSignals = false } = {}) {
  const [organization, matrix, catalog, activityCatalog, signals, rhythm] = await Promise.all([
    env.CARE_DB.prepare('SELECT id, display_name, kind FROM organizations WHERE id = ?').bind(organizationId).first(),
    env.CARE_DB.prepare(`SELECT m.*, o.l1_activity_id AS org_l1_id, o.l2_activity_id AS org_l2_id,
      o.enabled AS org_enabled, o.updated_at AS org_updated_at, o.updated_by AS org_updated_by,
      l1.title AS effective_l1_name, l1.description AS effective_l1_desc,
      l2.title AS effective_l2_name, l2.description AS effective_l2_desc
      FROM intervention_matrix m
      LEFT JOIN organization_intervention_matrix o ON o.organization_id = ? AND o.emotion = m.emotion
      LEFT JOIN activities l1 ON l1.id = CASE WHEN o.organization_id IS NULL THEN m.l1_activity_id ELSE o.l1_activity_id END
      LEFT JOIN activities l2 ON l2.id = CASE WHEN o.organization_id IS NULL THEN m.l2_activity_id ELSE o.l2_activity_id END
      ORDER BY m.sort_order`).bind(organizationId).all(),
    env.CARE_DB.prepare(`SELECT a.id AS activityId, a.title AS name, a.level, a.description, '🌿' AS icon
      FROM activities a WHERE ${activityAvailableSql('a', organizationId)} ORDER BY a.level, a.title`).all(),
    env.CARE_DB.prepare(`SELECT a.id, a.title, a.content_available, a.enabled AS globally_enabled,
      CASE WHEN a.enabled = 1 THEN COALESCE(o.enabled, 1) ELSE 0 END AS enabled
      FROM activities a LEFT JOIN organization_activity_settings o
      ON o.organization_id = ? AND o.activity_id = a.id ORDER BY a.title`).bind(organizationId).all(),
    includeEnterpriseSignals ? env.CARE_DB.prepare('SELECT * FROM sensing_signals ORDER BY sort_order').all() : Promise.resolve({ results: [] }),
    includeEnterpriseSignals ? env.CARE_DB.prepare(
      'SELECT metric, value, sample_size, unit, created_at FROM org_rhythm WHERE data_origin = ? AND organization_id = ? ORDER BY bucket_day DESC LIMIT 12'
    ).bind('live', organizationId).all() : Promise.resolve({ results: [] }),
  ]);
  if (!organization) return null;
  return {
    ok: true,
    organization: { id: organization.id, name: organization.display_name, kind: organization.kind },
    minSample: MIN_SAMPLE,
    windowDays: WINDOW_DAYS,
    matrix: (matrix.results || []).map((row) => ({
      emotion: row.emotion, icon: row.icon,
      l1: { activityId: row.org_enabled === null ? row.l1_activity_id : row.org_l1_id,
        name: row.effective_l1_name || row.l1_name, description: row.effective_l1_desc || row.l1_desc },
      l2: { activityId: row.org_enabled === null ? row.l2_activity_id : row.org_l2_id,
        name: row.effective_l2_name || row.l2_name, description: row.effective_l2_desc || row.l2_desc },
      l3: row.l3_action, enabled: (row.org_enabled ?? row.enabled) === 1,
      hits: null, hitsSuppressed: true,
      updatedAt: row.org_updated_at ?? row.updated_at,
      updatedBy: row.org_updated_by ?? row.updated_by,
    })),
    catalog: catalog.results || [],
    activityCatalog: activityCatalog.results || [],
    sensing: (signals.results || []).map((row) => ({
      key: row.key, label: row.label, category: row.category, source: row.source,
      detail: row.detail, enabled: row.enabled === 1, requiresPermission: row.requires_permission,
      lockedOff: row.source === 'none', updatedAt: row.updated_at, updatedBy: row.updated_by,
    })),
    rhythmSamples: (rhythm.results || []).map((row) => ({
      metric: row.metric, unit: row.unit, created_at: row.created_at,
      suppressed: row.sample_size < MIN_SAMPLE,
      value: row.sample_size >= MIN_SAMPLE ? row.value : null,
      sample_size: row.sample_size >= MIN_SAMPLE ? row.sample_size : null,
    })),
  };
}

export async function updateOrganizationConfig(env, organizationId, body, actor, { allowSensing = false } = {}) {
  const now = Date.now();
  if (body?.kind === 'activity') {
    if (typeof body.activityId !== 'string' || typeof body.enabled !== 'boolean') return { status: 400, body: { ok: false, reasonCode: 'ACTIVITY_INVALID' } };
    const row = await env.CARE_DB.prepare('SELECT id, enabled, content_available FROM activities WHERE id = ?').bind(body.activityId).first();
    if (!row) return { status: 404, body: { ok: false, reasonCode: 'ACTIVITY_UNKNOWN' } };
    if (body.enabled && (row.enabled !== 1 || row.content_available !== 1)) return { status: 409, body: { ok: false, reasonCode: 'ACTIVITY_UNAVAILABLE' } };
    await env.CARE_DB.prepare(`INSERT INTO organization_activity_settings
      (organization_id, activity_id, enabled, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(organization_id, activity_id) DO UPDATE SET enabled=excluded.enabled,
        updated_at=excluded.updated_at, updated_by=excluded.updated_by`)
      .bind(organizationId, body.activityId, Number(body.enabled), now, actor).run();
    return { status: 200, body: { ok: true, activityId: body.activityId, enabled: body.enabled } };
  }
  if (body?.kind === 'matrix') {
    const { emotion, l1ActivityId, l2ActivityId, enabled } = body;
    if (typeof emotion !== 'string' || !emotion) return { status: 400, body: { ok: false, reasonCode: 'EMOTION_REQUIRED' } };
    const current = await env.CARE_DB.prepare(`SELECT m.emotion, m.enabled AS base_enabled, m.l1_activity_id AS base_l1,
      m.l2_activity_id AS base_l2, o.enabled AS org_enabled, o.l1_activity_id AS org_l1,
      o.l2_activity_id AS org_l2 FROM intervention_matrix m
      LEFT JOIN organization_intervention_matrix o ON o.organization_id = ? AND o.emotion = m.emotion
      WHERE m.emotion = ?`).bind(organizationId, emotion).first();
    if (!current) return { status: 404, body: { ok: false, reasonCode: 'EMOTION_UNKNOWN' } };
    const next = {
      l1: l1ActivityId === undefined ? (current.org_enabled === null ? current.base_l1 : current.org_l1) : l1ActivityId || null,
      l2: l2ActivityId === undefined ? (current.org_enabled === null ? current.base_l2 : current.org_l2) : l2ActivityId || null,
      enabled: typeof enabled === 'boolean' ? Number(enabled) : (current.org_enabled ?? current.base_enabled),
    };
    for (const [id, level] of [[l1ActivityId, 'L1'], [l2ActivityId, 'L2']]) {
      if (id === undefined || id === null || id === '') continue;
      if (typeof id !== 'string') return { status: 400, body: { ok: false, reasonCode: 'ACTIVITY_INVALID' } };
      const row = await env.CARE_DB.prepare(`SELECT id FROM activities WHERE id = ? AND level = ? AND ${activityAvailableSql('activities', organizationId)}`)
        .bind(id, level).first();
      if (!row) return { status: 400, body: { ok: false, reasonCode: 'ACTIVITY_UNAVAILABLE' } };
    }
    await env.CARE_DB.prepare(`INSERT INTO organization_intervention_matrix
      (organization_id, emotion, l1_activity_id, l2_activity_id, enabled, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(organization_id, emotion) DO UPDATE SET l1_activity_id=excluded.l1_activity_id,
      l2_activity_id=excluded.l2_activity_id, enabled=excluded.enabled,
      updated_at=excluded.updated_at, updated_by=excluded.updated_by`)
      .bind(organizationId, emotion, next.l1, next.l2, next.enabled, now, actor).run();
    return { status: 200, body: { ok: true, emotion } };
  }
  if (body?.kind === 'sensing' && allowSensing) {
    const { key, enabled } = body;
    if (typeof key !== 'string' || typeof enabled !== 'boolean') return { status: 400, body: { ok: false, reasonCode: 'KEY_REQUIRED' } };
    const row = await env.CARE_DB.prepare('SELECT key, source FROM sensing_signals WHERE key = ?').bind(key).first();
    if (!row) return { status: 404, body: { ok: false, reasonCode: 'SIGNAL_UNKNOWN' } };
    if (row.source === 'none' && enabled) return { status: 409, body: { ok: false, reasonCode: 'SIGNAL_PERMANENTLY_OFF' } };
    await env.CARE_DB.prepare('UPDATE sensing_signals SET enabled=?, updated_at=?, updated_by=? WHERE key=?')
      .bind(Number(enabled), now, actor, key).run();
    return { status: 200, body: { ok: true, key, enabled } };
  }
  return { status: 400, body: { ok: false, reasonCode: 'KIND_INVALID' } };
}
