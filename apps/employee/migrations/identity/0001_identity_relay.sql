CREATE TABLE IF NOT EXISTS identity_mappings (
  canonical_anon_id TEXT PRIMARY KEY,
  subject_lookup TEXT NOT NULL UNIQUE,
  encrypted_subject TEXT NOT NULL,
  encryption_key_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS identity_aliases (
  derived_anon_id TEXT PRIMARY KEY,
  canonical_anon_id TEXT NOT NULL,
  anon_key_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (canonical_anon_id) REFERENCES identity_mappings(canonical_anon_id)
);

CREATE INDEX IF NOT EXISTS idx_identity_aliases_canonical
  ON identity_aliases(canonical_anon_id);
