// 参与者随时写下的产品建议。正文加密后留在本表，不写入研究事件。
import { json } from './_lib/http.js';
import { ApiError, handleError, newId, readJson, requireSession, requireText, sealBody } from './_lib/care.js';
import { screenContent } from './wall/index.js';

const suggestionAad = (id) => `care:suggestion:${id}`;

const WINDOW_MS = 10 * 60_000;
const LIMIT = 5;

export async function onRequestPost({ request, env }) {
  try {
    const session = await requireSession(request, env);
    if (!session.organizationId) throw new ApiError('ORGANIZATION_REQUIRED', 403, '当前入口没有组织');
    const text = requireText((await readJson(request))?.text, { max: 500, field: 'text' });
    screenContent(text);
    const now = Date.now();
    const recent = await env.CARE_DB.prepare(
      'SELECT COUNT(*) AS n FROM suggestions WHERE anon_id = ? AND created_at > ?'
    ).bind(session.anonId, now - WINDOW_MS).first();
    if ((recent?.n || 0) >= LIMIT) throw new ApiError('SUGGESTION_RATE_LIMITED', 429, '反馈发得有点密，过几分钟再写。');
    const channel = session.entryChannel === 'beta_web' ? 'beta_web' : 'dingtalk';
    const id = newId('sug');
    const sealed = await sealBody(env, text, suggestionAad(id));
    await env.CARE_DB.prepare(
      'INSERT INTO suggestions (id, organization_id, anon_id, body, content_key_version, created_at, entry_channel) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, session.organizationId, session.anonId, sealed.cipher, sealed.version, now, channel).run();
    return json({ ok: true });
  } catch (error) {
    return handleError(error, 'suggestion_create_failed');
  }
}
