import { ApiError, newId } from '../care.js';

export async function withConversationLock(env, anonId, work) {
  const owner = newId('lock');
  const now = Date.now();
  const acquired = await env.CARE_DB.prepare(`
    INSERT INTO conversation_locks (anon_id, owner, expires_at) VALUES (?, ?, ?)
    ON CONFLICT(anon_id) DO UPDATE SET owner=excluded.owner, expires_at=excluded.expires_at
    WHERE conversation_locks.expires_at <= ?
  `).bind(anonId, owner, now + 60_000, now).run();
  if (acquired.meta.changes !== 1) throw new ApiError('CONVERSATION_BUSY', 409, '上一条消息仍在处理中，请稍后再发送。');
  const fence = () => env.CARE_DB.prepare(`INSERT INTO conversation_write_guards(token)
    VALUES ((SELECT owner FROM conversation_locks WHERE anon_id=? AND owner=? AND expires_at>?))`
  ).bind(anonId, owner, Date.now());
  const unfence = () => env.CARE_DB.prepare('DELETE FROM conversation_write_guards WHERE token=?').bind(owner);
  try {
    return await work({ fence, unfence });
  } finally {
    await env.CARE_DB.prepare('UPDATE conversation_locks SET expires_at=0 WHERE anon_id=? AND owner=?').bind(anonId, owner).run();
  }
}
