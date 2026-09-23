import { newId } from './care.js';

const EVENTS = new Set([
  'beta_joined', 'session_started', 'chat_message_sent', 'chat_reply_delivered',
  'wall_post_created', 'wall_reply_created', 'wall_reaction_added',
  'activity_opened', 'activity_started', 'activity_completed',
  'activity_feedback_submitted', 'followup_answered', 'appointment_requested', 'appointment_cancelled',
]);

// 只接受服务端传入的枚举和对象 ID；员工原文不进入研究事件。
export function productEventStatement(env, session, eventName, { at = Date.now(), objectType = null, objectId = null, contentVersion = null, ifChanged = false } = {}) {
  if (!session?.organizationId || !session?.anonId) return null;
  if (!EVENTS.has(eventName)) throw new Error('PRODUCT_EVENT_INVALID');
  const sql = ifChanged
    ? `INSERT INTO product_events
       (id, organization_id, anon_id, entry_channel, event_name, occurred_at,
        object_type, object_id, properties_json, app_version, content_version, schema_version, data_origin)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, '{}', ?, ?, 1, 'live' WHERE changes() = 1`
    : `INSERT INTO product_events
       (id, organization_id, anon_id, entry_channel, event_name, occurred_at,
        object_type, object_id, properties_json, app_version, content_version, schema_version, data_origin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '{}', ?, ?, 1, 'live')`;
  return env.CARE_DB.prepare(sql).bind(newId('evt'), session.organizationId, session.anonId,
    session.entryChannel === 'beta_web' ? 'beta_web' : 'dingtalk',
    eventName, at, objectType, objectId, env.APP_VERSION || 'unversioned',
    contentVersion === null ? null : String(contentVersion));
}

export async function writeProductEvent(env, session, eventName, options) {
  const statement = productEventStatement(env, session, eventName, options);
  if (statement) await statement.run();
}
