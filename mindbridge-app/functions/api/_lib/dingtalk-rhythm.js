// 钉钉行为元数据拉取与组织级聚合。
//
// 隐私设计（不可退让）：
// - userid 只在本模块的内存里短暂存在，用于调用钉钉接口；
// - 落库的只有组织级聚合值与样本量，没有任何个人打卡记录；
// - 本模块不读取、也不申请「会话内容存档」权限，拿不到任何消息内容。
//
// 接口与限制来自官方文档：POST https://oapi.dingtalk.com/attendance/list，
// userIdList 单次最多 50 人，limit 最大 50。
const TIMEOUT_MS = 10_000;
const USER_CHUNK = 50;
const PAGE_LIMIT = 50;

async function callDingTalk(url, init) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || (payload.errcode !== undefined && payload.errcode !== 0)) {
    const error = new Error('DINGTALK_CALL_FAILED');
    error.errcode = payload.errcode;
    error.errmsg = payload.errmsg;
    throw error;
  }
  return payload;
}

export async function appAccessToken(env) {
  const payload = await callDingTalk('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ appKey: env.DINGTALK_CLIENT_ID, appSecret: env.DINGTALK_APP_SECRET }),
  });
  if (typeof payload.accessToken !== 'string' || !payload.accessToken) {
    throw new Error('DINGTALK_APP_TOKEN_INVALID');
  }
  return payload.accessToken;
}

// 遍历部门树收集 userid。返回值只在调用方内存中使用。
//
// 这里刻意不做静默 catch：缺少通讯录权限时必须把钉钉的 errcode 抛上去，
// 否则会表现成「连接成功但组织 0 人」，把权限问题伪装成没有数据。
export async function listUserIds(token) {
  const seen = new Set();
  const queue = [1];
  const visited = new Set();
  while (queue.length) {
    const deptId = queue.shift();
    if (visited.has(deptId)) continue;
    visited.add(deptId);

    const subs = await callDingTalk(
      `https://oapi.dingtalk.com/topapi/v2/department/listsub?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dept_id: deptId }),
      }
    );
    for (const dept of subs.result || []) queue.push(dept.dept_id);

    const users = await callDingTalk(
      `https://oapi.dingtalk.com/topapi/user/listid?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dept_id: deptId }),
      }
    );
    for (const id of users.result?.userid_list || []) seen.add(id);
  }
  if (!seen.size) {
    const error = new Error('DINGTALK_NO_MEMBERS');
    error.errmsg = '通讯录接口调用成功但没有返回任何成员，请确认应用的权限范围已设为全部员工';
    throw error;
  }
  return [...seen];
}

const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 00:00:00`;

export async function fetchAttendance(token, userIds, fromDate, toDate) {
  const records = [];
  for (let i = 0; i < userIds.length; i += USER_CHUNK) {
    const chunk = userIds.slice(i, i + USER_CHUNK);
    let offset = 0;
    // 单次最多 50 条，翻页直到取空。
    for (;;) {
      const payload = await callDingTalk(
        `https://oapi.dingtalk.com/attendance/list?access_token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            workDateFrom: fmt(fromDate),
            workDateTo: fmt(toDate),
            userIdList: chunk,
            offset,
            limit: PAGE_LIMIT,
          }),
        }
      );
      const page = payload.recordresult || [];
      records.push(...page);
      if (page.length < PAGE_LIMIT || !payload.hasMore) break;
      offset += PAGE_LIMIT;
      if (offset > 2000) break;
    }
  }
  return records;
}

const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// 只输出组织级聚合：下班打卡中位时间、晚间下班占比、参与打卡人数。
export function aggregateAttendance(records) {
  const offDuty = [];
  const people = new Set();
  let lateOff = 0;
  for (const record of records) {
    const checkType = record.checkType || record.check_type;
    const at = Number(record.userCheckTime || record.user_check_time);
    const userId = record.userId || record.userid;
    if (userId) people.add(userId);
    if (checkType !== 'OffDuty' || !Number.isFinite(at)) continue;
    const date = new Date(at);
    const minutes = date.getHours() * 60 + date.getMinutes();
    offDuty.push(minutes);
    if (minutes >= 20 * 60) lateOff++;
  }
  const medianMinutes = median(offDuty);
  return {
    sampleSize: people.size,
    records: records.length,
    offDutyCount: offDuty.length,
    medianOffDutyMinutes: medianMinutes,
    lateOffDutyShare: offDuty.length ? Math.round((lateOff / offDuty.length) * 1000) / 10 : null,
  };
}

export const formatMinutes = (minutes) => (
  minutes === null || minutes === undefined ? null : `${pad(Math.floor(minutes / 60))}:${pad(Math.round(minutes % 60))}`
);
