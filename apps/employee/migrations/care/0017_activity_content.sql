-- Content availability belongs to the content pipeline; enabled remains HR-owned.
ALTER TABLE activities ADD COLUMN content_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE activities ADD COLUMN content_hash TEXT;
ALTER TABLE activities ADD COLUMN content_available INTEGER NOT NULL DEFAULT 0;
ALTER TABLE activities ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE resource_events ADD COLUMN content_version INTEGER;
ALTER TABLE resource_events ADD COLUMN activity_snapshot_json TEXT;
-- One-time repair of legacy name-based references, never used by runtime again.
UPDATE resource_events SET activity_id = (
  SELECT activity_id FROM resource_catalog WHERE name = resource_events.resource_name
) WHERE activity_id IS NULL;
-- Freeze existing participation before the first content import replaces rows.
UPDATE resource_events SET content_version = 1, activity_snapshot_json = (
  SELECT json_object('id', a.id, 'title', a.title, 'kind', a.kind, 'form', a.form,
    'duration', a.duration, 'description', a.description, 'pre_label', a.pre_label,
    'low_label', a.low_label, 'high_label', a.high_label, 'direction', a.direction,
    'score_label', a.score_label, 'schedule', a.schedule, 'location', a.location,
    'stages_json', a.stages_json, 'content_version', 1)
  FROM activities a WHERE a.id = resource_events.activity_id
) WHERE state IN ('joined', 'completed');
