import { json } from './_lib/http.js';
import { ApiError, ensureProfile, handleError, readJson, requireSession } from './_lib/care.js';
import { CONTEXT_TAGS } from './_lib/triage.js';

export async function onRequestGet({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const { profile, created } = await ensureProfile(env, anonId);
    if (created) {
      await env.CARE_DB.prepare('UPDATE profiles SET onboarded_at = ?, updated_at = ? WHERE anon_id = ?')
        .bind(Date.now(), Date.now(), anonId).run();
    }
    return json({
      ok: true,
      displayName: profile.display_name,
      contextTag: profile.context_tag,
      contextDecided: Boolean(profile.context_decided_at),
      firstVisit: created,
    });
  } catch (error) {
    return handleError(error, 'me_read_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const body = await readJson(request);
    const tag = body?.contextTag;
    if (!CONTEXT_TAGS.includes(tag)) throw new ApiError('CONTEXT_TAG_INVALID', 400, '未知的处境标签');
    const now = Date.now();
    await env.CARE_DB.prepare('UPDATE profiles SET context_tag = ?, context_decided_at = ?, updated_at = ? WHERE anon_id = ?')
      .bind(tag, now, now, anonId).run();
    return json({ ok: true, contextTag: tag, contextDecided: true });
  } catch (error) {
    return handleError(error, 'me_update_failed');
  }
}
