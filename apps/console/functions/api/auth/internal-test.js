// 内部测试账号仅绑定一个指定内测组织，与可转发的组织管理凭证分开。
import { sha256Base64Url, randomToken } from '../_lib/crypto.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, createStaffSession, handleError, readJson } from '../_lib/staff.js';

const TTL_SECONDS = 7 * 86400;

function sameDigest(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestPost({ request, env }) {
  try {
    const token = (await readJson(request))?.token;
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{40,100}$/.test(token)
      || !env.INTERNAL_TEST_KEY || !/^org_beta_[a-f0-9]{32}$/.test(env.INTERNAL_TEST_ORG_ID || '')) {
      throw new ApiError('INTERNAL_TEST_LOGIN_INVALID', 403, '内部测试入口无效');
    }
    const actual = await sha256Base64Url(token);
    const expected = await sha256Base64Url(env.INTERNAL_TEST_KEY);
    if (!sameDigest(actual, expected)) throw new ApiError('INTERNAL_TEST_LOGIN_INVALID', 403, '内部测试入口无效');

    const orgId = env.INTERNAL_TEST_ORG_ID;
    const staffId = `stf_internal_test_${orgId}`;
    const displayName = 'Mind Bridge · 内部测试员';
    const now = Date.now();
    await env.STAFF_DB.prepare(
      `INSERT INTO staff (staff_id, tenant_id, display_name, roles, auth_method, status, created_at, updated_at, last_seen_at)
       VALUES (?, ?, ?, 'hr_viewer,internal_tester', 'internal_test_key', 'active', ?, ?, ?)
       ON CONFLICT(staff_id) DO UPDATE SET display_name = excluded.display_name,
         roles = excluded.roles, status = 'active', updated_at = excluded.updated_at, last_seen_at = excluded.last_seen_at`
    ).bind(staffId, orgId, displayName, now, now, now).run();
    const raw = randomToken();
    await createStaffSession(env, {
      staffId,
      rawToken: raw,
      ttlSeconds: TTL_SECONDS,
      organizationId: orgId,
      organizationKind: 'beta',
      organizationName: env.INTERNAL_TEST_ORG_NAME || 'Mind Bridge 内测组',
    });
    await audit(env, staffId, 'sign_in_internal_test', 'organization', orgId, 'ok');
    return json({ ok: true, displayName, organization: { id: orgId, name: env.INTERNAL_TEST_ORG_NAME || 'Mind Bridge 内测组', kind: 'beta' } }, 200,
      { 'set-cookie': staffCookie(raw, TTL_SECONDS) });
  } catch (error) {
    return handleError(error, 'internal_test_sign_in_failed');
  }
}
