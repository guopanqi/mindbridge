// 匿名广场：帖子与回复同样只以密文落库，展示名由 anon_id 派生，不可反查组织身份。
import { json } from '../_lib/http.js';
import {
  ApiError, aggregateStatement, ensureProfile, handleError, newId,
  openBody, PLAIN_VERSION, readJson, requireSession, requireText, sealBody,
} from '../_lib/care.js';
import { classifyTopic } from '../_lib/topics.js';
import { productEventStatement } from '../_lib/product-events.js';

const PAGE_SIZE = 30;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT = 5;

export const postAad = (id) => `care:post:${id}`;
export const replyAad = (id) => `care:reply:${id}`;

const BAD = ['活该', '矫情', '废物', '滚', '闭嘴', '傻', '蠢', '受不了你', '玻璃心', '没本事', '怪你自己'];
const PHONE = /(?<!\d)(?:\+?86)?1[3-9]\d{9}(?!\d)/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const ID_CARD = /(?<!\d)\d{15}(?:\d{2}[\dxX])?(?!\d)/;

// 善意与隐私检查在服务端执行；前端提示只是同一规则的镜像，不能作为唯一防线。
export function screenContent(text) {
  if (BAD.some((b) => text.includes(b))) {
    throw new ApiError('CONTENT_UNKIND', 422, '这条内容可能会伤到正在难受的人，换个说法再发好吗？');
  }
  if (PHONE.test(text) || EMAIL.test(text) || ID_CARD.test(text)) {
    throw new ApiError('CONTENT_IDENTIFYING', 422, '内容里似乎有手机号、邮箱或证件号。为了保护你，请先去掉再发布。');
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const { anonId, organizationId } = await requireSession(request, env);
    if (!organizationId) throw new ApiError('ORGANIZATION_REQUIRED', 403, '当前入口没有组织');
    await ensureProfile(env, anonId);
    const { results: posts } = await env.CARE_DB.prepare(
      `SELECT p.id, p.anon_id, p.body_cipher, p.content_key_version, p.created_at, p.data_origin,
              pr.display_name,
              (SELECT COUNT(*) FROM post_reactions r WHERE r.post_id = p.id) AS hugs,
              (SELECT COUNT(*) FROM post_reactions r WHERE r.post_id = p.id AND r.anon_id = ?) AS hugged
       FROM posts p LEFT JOIN profiles pr ON pr.anon_id = p.anon_id
       WHERE p.organization_id = ? AND p.deleted_at IS NULL ORDER BY p.created_at DESC LIMIT ?`
    ).bind(anonId, organizationId, PAGE_SIZE).all();

    const ids = (posts || []).map((p) => p.id);
    let replies = [];
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(',');
      const { results } = await env.CARE_DB.prepare(
        `SELECT rp.id, rp.post_id, rp.anon_id, rp.body_cipher, rp.content_key_version, rp.created_at, rp.data_origin, pr.display_name
         FROM post_replies rp LEFT JOIN profiles pr ON pr.anon_id = rp.anon_id
         WHERE rp.post_id IN (${placeholders}) AND rp.deleted_at IS NULL ORDER BY rp.created_at ASC`
      ).bind(...ids).all();
      replies = results || [];
    }

    // 明文只允许出现在演示 seed 行上；真实行即使被写坏也不会被当作明文读出。
    const readable = (row, version) => (
      version === PLAIN_VERSION && row.data_origin !== 'demo_seed' ? null : version
    );

    const shaped = [];
    for (const post of posts || []) {
      const version = readable(post, post.content_key_version);
      if (version === null) continue;
      const text = await openBody(env, post.body_cipher, version, postAad(post.id));
      if (text === null) continue;
      const own = [];
      for (const reply of replies.filter((r) => r.post_id === post.id)) {
        const replyVersion = readable(reply, reply.content_key_version);
        if (replyVersion === null) continue;
        const body = await openBody(env, reply.body_cipher, replyVersion, replyAad(reply.id));
        if (body === null) continue;
        own.push({
          id: reply.id,
          author: reply.display_name || '匿名同事',
          mine: reply.anon_id === anonId,
          at: reply.created_at,
          text: body,
        });
      }
      shaped.push({
        id: post.id,
        author: post.display_name || '匿名同事',
        mine: post.anon_id === anonId,
        at: post.created_at,
        text,
        hugs: post.hugs,
        hugged: post.hugged > 0,
        simulated: post.data_origin === 'demo_seed',
        replies: own,
      });
    }
    return json({ ok: true, posts: shaped });
  } catch (error) {
    return handleError(error, 'wall_list_failed');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    const { anonId, organizationId } = session;
    if (!organizationId) throw new ApiError('ORGANIZATION_REQUIRED', 403, '当前入口没有组织');
    await ensureProfile(env, anonId);
    const text = requireText((await readJson(request))?.text, { min: 2, max: 500, field: 'text' });
    screenContent(text);
    const now = Date.now();
    const recent = await env.CARE_DB
      .prepare('SELECT COUNT(*) AS n FROM posts WHERE anon_id = ? AND created_at > ?')
      .bind(anonId, now - RATE_WINDOW_MS).first();
    if ((recent?.n || 0) >= RATE_LIMIT) {
      throw new ApiError('RATE_LIMITED', 429, '发布得有点频繁，稍后再来。');
    }
    const id = newId('post');
    const sealed = await sealBody(env, text, postAad(id));
    // 广场发布不再复用已废弃的对话规则引擎；情绪留空，议题仍走独立分类。
    const emotion = null;
    // 议题在此刻分类并落库；HR 端之后只对类别计数，不接触原文。
    const topic = classifyTopic(text);
    const statements = [
      env.CARE_DB.prepare(
        'INSERT INTO posts (id, anon_id, organization_id, body_cipher, content_key_version, emotion, topic, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, anonId, organizationId, sealed.cipher, sealed.version, emotion, topic, now, 'live'),
      aggregateStatement(env, { eventType: 'wall_post', emotion, level: 'green', at: now, organizationId }),
    ];
    const event = productEventStatement(env, session, 'wall_post_created', { at: now, objectType: 'post', objectId: id });
    if (event) statements.push(event);
    await env.CARE_DB.batch(statements);
    return json({ ok: true, id });
  } catch (error) {
    return handleError(error, 'wall_post_failed');
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const { anonId, organizationId } = await requireSession(request, env);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new ApiError('POST_ID_REQUIRED', 400, '缺少帖子标识');
    const result = await env.CARE_DB
      .prepare('UPDATE posts SET deleted_at = ? WHERE id = ? AND anon_id = ? AND organization_id = ? AND deleted_at IS NULL')
      .bind(Date.now(), id, anonId, organizationId).run();
    if (!result.meta?.changes) throw new ApiError('POST_NOT_FOUND', 404, '这条内容不存在或不属于你');
    return json({ ok: true });
  } catch (error) {
    return handleError(error, 'wall_delete_failed');
  }
}
