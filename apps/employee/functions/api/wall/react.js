import { json } from '../_lib/http.js';
import { ApiError, aggregateStatement, handleError, readJson, requireSession } from '../_lib/care.js';
import { productEventStatement } from '../_lib/product-events.js';

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { anonId, organizationId } = session;
    const id = (await readJson(request))?.postId;
    if (typeof id !== 'string' || !id) throw new ApiError('POST_ID_REQUIRED', 400, '缺少帖子标识');
    const post = await env.CARE_DB
      .prepare('SELECT id FROM posts WHERE id = ? AND organization_id = ? AND deleted_at IS NULL').bind(id, organizationId).first();
    if (!post) throw new ApiError('POST_NOT_FOUND', 404, '这条内容已不可用');
    const existing = await env.CARE_DB
      .prepare("SELECT post_id FROM post_reactions WHERE post_id = ? AND anon_id = ? AND kind = 'hug'")
      .bind(id, anonId).first();
    const now = Date.now();
    if (existing) {
      await env.CARE_DB.prepare("DELETE FROM post_reactions WHERE post_id = ? AND anon_id = ? AND kind = 'hug'")
        .bind(id, anonId).run();
    } else {
      const statements = [
        env.CARE_DB.prepare(
          "INSERT INTO post_reactions (post_id, anon_id, kind, created_at, data_origin) VALUES (?, ?, 'hug', ?, 'live')"
        ).bind(id, anonId, now),
        aggregateStatement(env, { eventType: 'wall_hug', level: 'green', at: now, organizationId }),
      ];
      const event = productEventStatement(env, session, 'wall_reaction_added', { at: now, objectType: 'post', objectId: id });
      if (event) statements.push(event);
      await env.CARE_DB.batch(statements);
    }
    const count = await env.CARE_DB
      .prepare("SELECT COUNT(*) AS n FROM post_reactions WHERE post_id = ? AND kind = 'hug'").bind(id).first();
    return json({ ok: true, hugged: !existing, hugs: count?.n || 0 });
  } catch (error) {
    return handleError(error, 'wall_react_failed');
  }
}
