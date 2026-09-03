import { json } from '../_lib/http.js';
import {
  ApiError, ensureProfile, handleError, newId, readJson, requireSession, requireText, sealBody,
} from '../_lib/care.js';
import { replyAad, screenContent } from './index.js';

export async function onRequestPost({ request, env }) {
  try {
    const { anonId } = await requireSession(request, env);
    await ensureProfile(env, anonId);
    const body = await readJson(request);
    const postId = body?.postId;
    if (typeof postId !== 'string' || !postId) throw new ApiError('POST_ID_REQUIRED', 400, '缺少帖子标识');
    const text = requireText(body?.text, { min: 1, max: 200, field: 'text' });
    screenContent(text);
    const post = await env.CARE_DB
      .prepare('SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL').bind(postId).first();
    if (!post) throw new ApiError('POST_NOT_FOUND', 404, '这条内容已不可用');
    const id = newId('rep');
    const sealed = await sealBody(env, text, replyAad(id));
    await env.CARE_DB.prepare(
      'INSERT INTO post_replies (id, post_id, anon_id, body_cipher, content_key_version, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, postId, anonId, sealed.cipher, sealed.version, Date.now(), 'live').run();
    return json({ ok: true, id });
  } catch (error) {
    return handleError(error, 'wall_reply_failed');
  }
}
