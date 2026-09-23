// 内测体验登录：预置账号，输入姓名即可进入，密码不校验。
//
// 这是为内测体验准备的旁路，不是产品形态：真实上线时疗愈师走入口密钥或邀请码，
// HR / 管理员走钉钉免登。它的存在等于「知道名字就能看到个案台」，
// 因此必须能被一个开关彻底关掉——设置环境变量 DEMO_LOGIN=off 即整条路径返回 404 语义的拒绝。
import { randomToken } from '../_lib/crypto.js';
import { enterpriseOrganizationId } from '../_lib/care.js';
import { json, staffCookie } from '../_lib/http.js';
import { ApiError, audit, createStaffSession, handleError, readJson } from '../_lib/staff.js';

const TTL_SECONDS = 12 * 3600;

// 预置账号：staff_id 固定，重复登录复用同一条记录，不会每次体验都新增工作人员。
const ACCOUNTS = [
  {
    match: ['李佳', 'lijia', 'healer'],
    staffId: 'stf_demo_healer',
    displayName: '李佳',
    credential: 'UNIHEAL 国际疗愈师 · UH-2024-0871',
    roles: 'healer',
  },
  {
    match: ['admin', '管理员', 'hr'],
    staffId: 'stf_demo_admin',
    displayName: '内测管理员',
    credential: null,
    roles: 'admin,hr_viewer',
  },
];

const findAccount = (name) => {
  const key = name.trim().toLowerCase();
  return ACCOUNTS.find((account) => account.match.some((alias) => alias.toLowerCase() === key)) || null;
};

export async function onRequestPost({ request, env }) {
  try {
    if (String(env.REVIEW_DEMO || '').toLowerCase() !== 'on' || String(env.DEMO_LOGIN || '').toLowerCase() === 'off') {
      throw new ApiError('DEMO_LOGIN_DISABLED', 403, '当前环境未开启内测体验登录');
    }
    const body = await readJson(request);
    const name = String(body?.name || '');
    if (!name.trim() || name.length > 64) throw new ApiError('NAME_REQUIRED', 400, '请输入姓名');
    const account = findAccount(name);
    if (!account) throw new ApiError('ACCOUNT_UNKNOWN', 401, '没有这个内测账号，可用：李佳 / admin');

    const now = Date.now();
    const raw = randomToken();
    const orgId = enterpriseOrganizationId(env);
    await env.STAFF_DB.prepare(
      `INSERT INTO staff (staff_id, tenant_id, display_name, credential, roles, auth_method, status, created_at, updated_at, last_seen_at)
       VALUES (?, 'demo', ?, ?, ?, 'demo', 'active', ?, ?, ?)
       ON CONFLICT(staff_id) DO UPDATE SET display_name = excluded.display_name,
         credential = excluded.credential, roles = excluded.roles, status = 'active',
         updated_at = excluded.updated_at, last_seen_at = excluded.last_seen_at`
    ).bind(account.staffId, account.displayName, account.credential, account.roles, now, now, now).run();
    await createStaffSession(env, {
      staffId: account.staffId,
      rawToken: raw,
      ttlSeconds: TTL_SECONDS,
      organizationId: account.roles.includes('healer') ? null : orgId,
      organizationKind: account.roles.includes('healer') ? null : 'enterprise',
      organizationName: account.roles.includes('healer') ? null : '钉钉企业组织',
    });
    await audit(env, account.staffId, 'sign_in', 'console', 'demo', 'ok');
    return json(
      { ok: true, displayName: account.displayName, roles: account.roles.split(',') },
      200,
      { 'set-cookie': staffCookie(raw, TTL_SECONDS) }
    );
  } catch (error) {
    return handleError(error, 'demo_sign_in_failed');
  }
}
