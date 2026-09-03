import { json } from '../_lib/http.js';
import { ApiError, aggregateStatement, handleError, readJson, requireSession } from '../_lib/care.js';

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    const id = (await readJson(request))?.postId;
    if (typeof id !== 'string' || !id) throw new ApiError('POST_ID_REQUIRED', 400, '缺少帖子标识');
    const post = await env.CARE_DB
      .prepare('SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL').bind(id).first();
    if (!post) throw new ApiError('POST_NOT_FOUND', 404, '这条内容已不可用');
    const existing = await env.CARE_DB
      .prepare("SELECT post_id FROM post_reactions WHERE post_id = ? AND anon_id = ? AND kind = 'hug'")
      .bind(id, anonId).first();
    const now = Date.now();
    if (existing) {
      await env.CARE_DB.prepare("DELETE FROM post_reactions WHERE post_id = ? AND anon_id = ? AND kind = 'hug'")
        .bind(id, anonId).run();
    } else {
      await env.CARE_DB.batch([
        env.CARE_DB.prepare(
          "INSERT INTO post_reactions (post_id, anon_id, kind, created_at, data_origin) VALUES (?, ?, 'hug', ?, 'live')"
        ).bind(id, anonId, now),
        aggregateStatement(env, { eventType: 'wall_hug', level: 'green', at: now }),
      ]);
    }
    const count = await env.CARE_DB
      .prepare("SELECT COUNT(*) AS n FROM post_reactions WHERE post_id = ? AND kind = 'hug'").bind(id).first();
    return json({ ok: true, hugged: !existing, hugs: count?.n || 0 });
  } catch (error) {
    return handleError(error, 'wall_react_failed');
  }
}
