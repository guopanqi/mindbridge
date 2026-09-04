import { encryptSubject, hmacBase64Url } from './crypto.js';

function requiredSecret(env, name, minLength = 32) {
  const value = env[name];
  if (typeof value !== 'string' || value.length < minLength || value.length > 4096) throw new Error('APP_CONFIGURATION_MISSING');
  return value;
}

function versionedSecretName(prefix, version) {
  if (!/^v[1-9]\d*$/.test(version)) throw new Error(`invalid ${prefix} key version`);
  return `${prefix}_${version.toUpperCase()}`;
}

export async function anonIdFromStaffId(env, userId) {
  const corpId = env.DINGTALK_CORP_ID;
  if (typeof corpId !== 'string' || !corpId || typeof userId !== 'string' || !userId || userId.length > 512) throw new Error('IDENTITY_INPUT_INVALID');
  const keyVersion = env.ANON_KEY_VERSION || 'v1';
  const encryptionKeyVersion = env.IDENTITY_ENCRYPTION_KEY_VERSION || 'v1';
  const subject = `${corpId}:${userId}`;
  const subjectLookup = await hmacBase64Url(requiredSecret(env, 'SUBJECT_LOOKUP_KEY_V1'), subject);
  const anonKey = requiredSecret(env, versionedSecretName('ANON_HMAC_KEY', keyVersion));
  const derivedAnonId = `mb_${keyVersion}_${await hmacBase64Url(anonKey, subject)}`;
  const now = Date.now();
  let existing = await env.IDENTITY_DB
    .prepare('SELECT canonical_anon_id FROM identity_mappings WHERE subject_lookup = ?')
    .bind(subjectLookup)
    .first();

  if (!existing?.canonical_anon_id) {
    const encryptedSubject = await encryptSubject(
      JSON.stringify({ corpId, userId }),
      requiredSecret(env, versionedSecretName('IDENTITY_ENCRYPTION_KEY', encryptionKeyVersion), 43),
      derivedAnonId
    );
    await env.IDENTITY_DB.prepare(
      'INSERT INTO identity_mappings (canonical_anon_id, subject_lookup, encrypted_subject, encryption_key_version, created_at, updated_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(subject_lookup) DO NOTHING'
    ).bind(derivedAnonId, subjectLookup, encryptedSubject, encryptionKeyVersion, now, now, now).run();
    existing = await env.IDENTITY_DB
      .prepare('SELECT canonical_anon_id FROM identity_mappings WHERE subject_lookup = ?')
      .bind(subjectLookup)
      .first();
  }
  const canonicalAnonId = existing?.canonical_anon_id;
  if (!canonicalAnonId) throw new Error('identity mapping unavailable');
  await env.IDENTITY_DB.batch([
    env.IDENTITY_DB.prepare('UPDATE identity_mappings SET updated_at = ?, last_seen_at = ? WHERE canonical_anon_id = ?')
      .bind(now, now, canonicalAnonId),
    env.IDENTITY_DB.prepare(
      'INSERT INTO identity_aliases (derived_anon_id, canonical_anon_id, anon_key_version, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(derived_anon_id) DO NOTHING'
    ).bind(derivedAnonId, canonicalAnonId, keyVersion, now),
  ]);
  return canonicalAnonId;
}


