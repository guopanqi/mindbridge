// 公开组织管理链接登录：密钥在 CARE 侧校验，会话落在 console staff 库并绑定该组织。
import { randomToken } from '../_lib/crypto.js';
import { careToken } from '../_lib/care.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, createStaffSession, handleError, readJson } from '../_lib/staff.js';

const TTL_SECONDS = 7 * 86400;

export async function onRequestPost({ request, env }) {
  try {
    const token = (await readJson(request))?.token;
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
      throw new ApiError('ADMIN_LINK_INVALID', 403, '管理链接无效或已失效');
    }
    const upstream = await fetch(`${env.CARE_API_ORIGIN}/api/internal/org-admin`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${careToken(env)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!upstream) throw new ApiError('CARE_UPSTREAM_FAILED', 502, '暂时无法校验管理链接');
    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !body?.organization?.id) {
      throw new ApiError('ADMIN_LINK_INVALID', 403, '管理链接无效或已失效');
    }
    const org = body.organization;
    const staffId = `stf_org_${org.id}`;
    const now = Date.now();
    const displayName = `${org.name} · 管理员`;
    await env.STAFF_DB.prepare(
      `INSERT INTO staff (staff_id, tenant_id, display_name, roles, auth_method, status, created_at, updated_at, last_seen_at)
       VALUES (?, ?, ?, 'admin,hr_viewer', 'org_admin_key', 'active', ?, ?, ?)
       ON CONFLICT(staff_id) DO UPDATE SET display_name = excluded.display_name,
         roles = excluded.roles, status = 'active', updated_at = excluded.updated_at, last_seen_at = excluded.last_seen_at`
    ).bind(staffId, org.id, displayName, now, now, now).run();

    const raw = randomToken();
    await createStaffSession(env, {
      staffId,
      rawToken: raw,
      ttlSeconds: TTL_SECONDS,
      organizationId: org.id,
      organizationKind: org.kind || 'beta',
      organizationName: org.name,
    });
    await audit(env, staffId, 'sign_in', 'console', `org:${org.id}`, 'ok');
    return json(
      {
        ok: true,
        displayName,
        organization: { id: org.id, name: org.name, kind: org.kind || 'beta' },
      },
      200,
      { 'set-cookie': staffCookie(raw, TTL_SECONDS) },
    );
  } catch (error) {
    return handleError(error, 'org_admin_sign_in_failed');
  }
}
