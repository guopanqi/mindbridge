import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';

import { onRequestDelete as cancelAppointment, onRequestGet as listAppointments, onRequestPost as createAppointment } from '../functions/api/appointments/index.js';
import { onRequestGet as listAuthorizations, onRequestPost as decideAuthorization } from '../functions/api/authorizations.js';
import { onRequestPost as updateConsent } from '../functions/api/consents.js';
import { onRequestGet as listCases, onRequestPost as caseAction } from '../functions/api/internal/cases.js';
import { onRequestGet as readConfig } from '../functions/api/internal/config.js';
import { onRequestGet as readMetrics } from '../functions/api/internal/metrics.js';
import { sha256Base64Url, toBase64Url } from '../functions/api/_lib/crypto.js';
import { sealBody } from '../functions/api/_lib/care.js';
import { loadMessages } from '../functions/api/_lib/conversation/service.js';
import { hydrateCards } from '../functions/api/_lib/conversation/card-state.js';
import { onRequestPost as dismissCard } from '../functions/api/chat/card.js';

const SESSION_TOKEN = 'support-acceptance-session-token-20260904';
const SERVICE_TOKEN = 'support-acceptance-service-token-20260904-xxxxxxxx';
const CONTENT_KEY = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));

function d1(db) {
  return {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) { args = values; return this; },
        async first() { return db.prepare(sql).get(...args) || null; },
        async all() { return { results: db.prepare(sql).all(...args) }; },
        async run() {
          const result = db.prepare(sql).run(...args);
          return { meta: { changes: Number(result.changes) } };
        },
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  };
}

async function fixture() {
  const db = new DatabaseSync(':memory:');
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  }
  const now = Date.now();
  db.prepare(
    'INSERT INTO sessions(session_digest, anon_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)'
  ).run(await sha256Base64Url(SESSION_TOKEN), 'anon_support_acceptance', now + 86_400_000, now, now);
  db.prepare(
    'INSERT INTO conversations(id, anon_id, channel, turn_count, signal_count, intensity_total, emotion_history, offered_resources, highest_level, started_at, last_message_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run('conv_support_acceptance', 'anon_support_acceptance', 'h5', 2, 0, 0, '[]', '[]', 'yellow', now, now, 'live');
  db.prepare(
    'INSERT INTO messages(id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'msg_support_u', 'conv_support_acceptance', 'anon_support_acceptance', 'user', '合成验收上下文：压力很大', 'plain', 'yellow', now, 'live',
    'msg_support_a', 'conv_support_acceptance', 'anon_support_acceptance', 'assistant', '合成验收回复', 'plain', 'yellow', now + 1, 'live',
  );
  const env = {
    CARE_DB: d1(db),
    CARE_CONTENT_KEY_V1: CONTENT_KEY,
    CARE_CONTENT_KEY_VERSION: 'v1',
    INTERNAL_SERVICE_TOKEN: SERVICE_TOKEN,
  };
  const employeeRequest = (path, init = {}) => new Request(`https://employee.test${path}`, {
    ...init,
    headers: { cookie: `__Host-mb_session=${SESSION_TOKEN}`, ...(init.headers || {}) },
  });
  const healerRequest = (init = {}) => new Request('https://employee.test/api/internal/cases', {
    ...init,
    headers: { authorization: `Bearer ${SERVICE_TOKEN}`, ...(init.headers || {}) },
  });
  return { db, env, employeeRequest, healerRequest };
}

async function body(response) {
  return { status: response.status, body: await response.json() };
}

async function addConsent(env, db, id = 'msg_consent') {
  const sealed = await sealBody(env, JSON.stringify({ title: '支持', actions: [{ action: 'request_appointment', label: '安排' }, { action: 'dismiss', label: '暂时不用' }] }), 'care:message:conv_support_acceptance');
  db.prepare('INSERT INTO messages(id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, 'conv_support_acceptance', 'anon_support_acceptance', 'consent', sealed.cipher, sealed.version, 'red', Date.now(), 'live');
}

test('对话转接：刷新恢复、受理/结束/取消投影，同卡重试不重复预约', async () => {
  const { db, env, employeeRequest } = await fixture();
  await addConsent(env, db);
  const create = () => createAppointment({ env, request: employeeRequest('/api/appointments', { method: 'POST', body: JSON.stringify({ messageId: 'msg_consent', shareContext: true }) }) });
  const first = await (await create()).json();
  assert.equal(first.ok, true);
  for (const status of ['requested', 'claimed', 'active', 'done', 'cancelled']) {
    db.prepare('UPDATE appointments SET status=? WHERE id=?').run(status, first.id);
    const card = (await loadMessages(env, 'anon_support_acceptance')).find(message => message.id === 'msg_consent').card;
    assert.deepEqual(card.support, { status, caseCode: first.caseCode, linked: true });
    assert.equal((await (await create()).json()).id, first.id);
  }
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM appointments').get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM aggregate_events WHERE event_type='appointment_requested'").get().n, 1);
  db.close();
});

test('旧支持卡只显示已有预约，不伪造关联；拒绝其他人的卡片', async () => {
  const { db, env, employeeRequest } = await fixture();
  await addConsent(env, db);
  await createAppointment({ env, request: employeeRequest('/api/appointments', { method: 'POST', body: '{}' }) });
  const history = await loadMessages(env, 'anon_support_acceptance');
  assert.equal(history.find(message => message.id === 'msg_consent').card.support.linked, false);
  db.prepare('UPDATE messages SET anon_id=? WHERE id=?').run('another_person', 'msg_consent');
  const response = await createAppointment({ env, request: employeeRequest('/api/appointments', { method: 'POST', body: JSON.stringify({ messageId: 'msg_consent' }) }) });
  assert.equal(response.status, 404);
  db.close();
});

test('暂时不用持久化，之后可改主意；提交后不能用拒绝动作覆盖', async () => {
  const { db, env, employeeRequest } = await fixture();
  await addConsent(env, db);
  const dismiss = () => dismissCard({ env, request: employeeRequest('/api/chat/card', { method: 'POST', body: JSON.stringify({ messageId: 'msg_consent', action: 'dismiss' }) }) });
  assert.equal((await dismiss()).status, 200);
  assert.equal((await loadMessages(env, 'anon_support_acceptance')).find(message => message.id === 'msg_consent').card.support.status, 'dismissed');
  assert.equal((await createAppointment({ env, request: employeeRequest('/api/appointments', { method: 'POST', body: JSON.stringify({ messageId: 'msg_consent' }) }) })).status, 200);
  assert.equal((await dismiss()).status, 409);
  db.close();
});

test('活动卡读取当前参与与评价，按匿名主体隔离', async () => {
  const { db, env } = await fixture();
  db.prepare('INSERT INTO resource_events(id, anon_id, conversation_id, resource_name, resource_level, risk_level, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run('res_card', 'anon_support_acceptance', 'conv_support_acceptance', '呼吸', 'L1', 'green', 'offered', Date.now(), Date.now());
  const messages = [{ role: 'resource', card: { eventId: 'res_card' } }];
  for (const state of ['offered', 'joined', 'completed', 'declined']) {
    db.prepare('UPDATE resource_events SET state=?, stage_index=1, helpfulness=? WHERE id=?').run(state, '有帮助', 'res_card');
    const [message] = await hydrateCards(env, 'anon_support_acceptance', messages);
    assert.deepEqual(message.card.progress, { state, stageIndex: 1, helpfulness: '有帮助' });
  }
  assert.equal((await hydrateCards(env, 'another_person', messages))[0].card.progress.state, 'unavailable');
  db.close();
});

test('支持卡关联写入失败时预约及授权整体回滚', async () => {
  const { db, env, employeeRequest } = await fixture();
  await addConsent(env, db);
  db.exec("CREATE TRIGGER fail_card_update BEFORE UPDATE ON messages BEGIN SELECT RAISE(ABORT, 'test rollback'); END");
  const response = await createAppointment({ env, request: employeeRequest('/api/appointments', { method: 'POST', body: JSON.stringify({ messageId: 'msg_consent', shareContext: true }) }) });
  assert.equal(response.status, 500);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM appointments').get().n, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM consent_grants').get().n, 0);
  db.close();
});

test('一人一条未结束预约，已受理或跟进不能重复；结束后可以再约', async () => {
  const { db, env, employeeRequest } = await fixture();
  const create = () => createAppointment({ env, request: employeeRequest('/api/appointments', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shareContext: true }),
  }) });
  assert.equal((await create()).status, 200);
  for (const status of ['requested', 'claimed', 'active']) {
    db.prepare('UPDATE appointments SET status=?').run(status);
    assert.equal((await create()).status, 429, status);
  }
  // 模拟并发下过期的预检查：写入语句仍须阻止重复，不能多统计或多授权。
  const prepare = env.CARE_DB.prepare.bind(env.CARE_DB);
  env.CARE_DB.prepare = sql => sql.includes('SELECT COUNT(*) AS n FROM appointments')
    ? { bind() { return { async first() { return { n: 0 }; } }; } } : prepare(sql);
  assert.equal((await create()).status, 409);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM appointments').get().n, 1);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM consent_grants').get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM aggregate_events WHERE event_type='appointment_requested'").get().n, 1);
  db.exec("UPDATE appointments SET status='done'");
  assert.equal((await create()).status, 200);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM appointments').get().n, 2);
  db.close();
});

test('支持链路：MB 编号可见、受理结束后员工状态同步', async () => {
  const { db, env, employeeRequest, healerRequest } = await fixture();
  const rejected = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'yellow', shareContext: false }),
    }),
  }));
  assert.equal(rejected.status, 400);
  assert.equal(rejected.body.reasonCode, 'HEALER_RED_ONLY');

  const created = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'red', shareContext: true, note: '合成验收备注' }),
    }),
  }));
  assert.equal(created.status, 200);
  assert.match(created.body.caseCode, /^MB-[A-Z2-9]{6}$/);

  // 历史误建的黄色个案不得进入疗愈师台。
  db.prepare("INSERT INTO appointments (id, case_code, anon_id, risk_level, status, share_context, created_at, updated_at, data_origin) VALUES ('apt_yellow','MB-YELLOW','anon_fixture','yellow','requested',0,?,?, 'live')")
    .run(Date.now(), Date.now());
  const visible = await body(await listCases({
    env,
    request: healerRequest(),
  }));
  assert.equal(visible.status, 200);
  assert.equal(visible.body.cases.length, 1);
  assert.equal(visible.body.cases[0].caseCode, created.body.caseCode);
  assert.equal(visible.body.cases[0].riskLevel, 'red');
  assert.equal(visible.body.cases[0].status, 'pending');
  assert.deepEqual(visible.body.cases[0].textSnippets, [], '个案默认列表不得携带对话片段');

  for (const action of ['claim', 'start', 'close']) {
    const result = await body(await caseAction({
      env,
      request: healerRequest({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, caseCode: created.body.caseCode, staffId: 'staff_acceptance' }),
      }),
    }));
    assert.equal(result.status, 200, action);
  }
  const appointments = await body(await listAppointments({
    env,
    request: employeeRequest('/api/appointments'),
  }));
  assert.equal(appointments.status, 200);
  assert.equal(appointments.body.appointments[0].status, 'done');
  assert.equal(db.prepare('SELECT status FROM appointments').get().status, 'done');
  db.close();
});

test('支持链路：上下文必须二次授权，撤销后疗愈师不可再读且列表不返回正文', async () => {
  const { db, env, employeeRequest, healerRequest } = await fixture();
  const created = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'red', shareContext: true }),
    }),
  }));
  const caseCode = created.body.caseCode;

  const requestResult = await body(await caseAction({
    env,
    request: healerRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'request_context', caseCode, staffId: 'staff_acceptance', reason: '需要合成上下文' }),
    }),
  }));
  assert.equal(requestResult.status, 200);
  const pending = await body(await listAuthorizations({ env, request: employeeRequest('/api/authorizations') }));
  const requestId = pending.body.requests[0].id;
  assert.equal(pending.body.requests[0].status, 'pending');

  const beforeApproval = await body(await caseAction({
    env,
    request: healerRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'staff_acceptance' }),
    }),
  }));
  assert.equal(beforeApproval.status, 403);
  assert.equal(beforeApproval.body.reasonCode, 'CONTEXT_NOT_AUTHORIZED');

  const approved = await body(await decideAuthorization({
    env,
    request: employeeRequest('/api/authorizations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: requestId, approve: true }),
    }),
  }));
  assert.equal(approved.status, 200);
  const afterApproval = await body(await caseAction({
    env,
    request: healerRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'staff_acceptance' }),
    }),
  }));
  assert.equal(afterApproval.status, 200);
  assert.equal(afterApproval.body.messages.length, 2);

  const crossStaff = await body(await caseAction({
    env,
    request: healerRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'another_staff' }),
    }),
  }));
  assert.equal(crossStaff.status, 403);
  assert.equal(crossStaff.body.reasonCode, 'CONTEXT_NOT_AUTHORIZED');

  const revoked = await body(await updateConsent({
    env,
    request: employeeRequest('/api/consents', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scope: 'share_context_with_healer', granted: false }),
    }),
  }));
  assert.equal(revoked.status, 200);
  const afterRevoke = await body(await caseAction({
    env,
    request: healerRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'staff_acceptance' }),
    }),
  }));
  assert.equal(afterRevoke.status, 403);
  assert.equal(afterRevoke.body.reasonCode, 'CONTEXT_NOT_AUTHORIZED');
  const listAfterRevoke = await body(await listCases({ env, request: healerRequest() }));
  assert.deepEqual(listAfterRevoke.body.cases[0].textSnippets, []);
  assert.notEqual(listAfterRevoke.body.cases[0].contextStatus, 'approved');
  db.close();
});

test('支持链路：撤销预约在各状态均使个案不可见，取消后不能再 start/close 复活', async () => {
  for (const state of ['requested', 'claimed', 'active', 'done']) {
    const { db, env, employeeRequest, healerRequest } = await fixture();
    const created = await body(await createAppointment({
      env,
      request: employeeRequest('/api/appointments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ riskLevel: 'red', shareContext: false }),
      }),
    }));
    const caseCode = created.body.caseCode;
    if (state === 'claimed' || state === 'active' || state === 'done') {
      const claimed = await caseAction({
        env,
        request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'claim', caseCode, staffId: 'staff_acceptance' }) }),
      });
      assert.equal(claimed.status, 200, state);
    }
    if (state === 'active' || state === 'done') {
      const started = await caseAction({
        env,
        request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', caseCode, staffId: 'staff_acceptance' }) }),
      });
      assert.equal(started.status, 200, state);
    }
    if (state === 'done') {
      const closed = await caseAction({
        env,
        request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'close', caseCode, staffId: 'staff_acceptance' }) }),
      });
      assert.equal(closed.status, 200, state);
    }

    const cancelled = await body(await cancelAppointment({
      env,
      request: employeeRequest(`/api/appointments?id=${encodeURIComponent(created.body.id)}`, { method: 'DELETE' }),
    }));
    assert.equal(cancelled.status, 200, state);
    assert.equal(db.prepare('SELECT status FROM appointments').get().status, 'cancelled', state);
    const employeeList = await body(await listAppointments({ env, request: employeeRequest('/api/appointments') }));
    assert.equal(employeeList.body.appointments[0].status, 'cancelled', state);
    const healerList = await body(await listCases({ env, request: healerRequest() }));
    assert.equal(healerList.body.cases.length, 0, state);

    for (const action of ['claim', 'start', 'close', 'refer', 'note', 'request_context', 'read_context']) {
      const result = await body(await caseAction({
        env,
        request: healerRequest({
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action, caseCode, staffId: 'staff_acceptance', text: '合成备注', reason: '合成理由' }),
        }),
      }));
      assert.equal(result.status, 404, `${state}/${action}`);
    }
    db.close();
  }
});

test('支持链路：已批准上下文过期后再次读取必须拒绝', async () => {
  const { db, env, employeeRequest, healerRequest } = await fixture();
  const created = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'red', shareContext: true }),
    }),
  }));
  const caseCode = created.body.caseCode;
  await caseAction({
    env,
    request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'request_context', caseCode, staffId: 'staff_acceptance', reason: '合成理由' }) }),
  });
  const pending = await body(await listAuthorizations({ env, request: employeeRequest('/api/authorizations') }));
  await decideAuthorization({
    env,
    request: employeeRequest('/api/authorizations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: pending.body.requests[0].id, approve: true }) }),
  });
  db.prepare('UPDATE context_requests SET expires_at = ?').run(Date.now() - 1);
  const expired = await body(await caseAction({
    env,
    request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'staff_acceptance' }) }),
  }));
  assert.equal(expired.status, 403);
  assert.equal(expired.body.reasonCode, 'CONTEXT_NOT_AUTHORIZED');
  db.close();
});

test('支持链路：即使是历史撤销记录未同步 request 状态，读取也必须按当前 grant 拒绝', async () => {
  const { db, env, employeeRequest, healerRequest } = await fixture();
  const created = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'red', shareContext: true }),
    }),
  }));
  const caseCode = created.body.caseCode;
  await caseAction({
    env,
    request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'request_context', caseCode, staffId: 'staff_acceptance', reason: '合成理由' }) }),
  });
  const pending = await body(await listAuthorizations({ env, request: employeeRequest('/api/authorizations') }));
  await decideAuthorization({
    env,
    request: employeeRequest('/api/authorizations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: pending.body.requests[0].id, approve: true }) }),
  });
  // 模拟修复上线前已发生的撤销：grant 已撤销，但历史 context_requests 仍是 approved。
  db.prepare('UPDATE consent_grants SET revoked_at = ? WHERE anon_id = ? AND scope = ?').run(Date.now(), 'anon_support_acceptance', 'share_context_with_healer');
  const staleApproval = await body(await caseAction({
    env,
    request: healerRequest({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'read_context', caseCode, staffId: 'staff_acceptance' }) }),
  }));
  assert.equal(staleApproval.status, 403);
  assert.equal(staleApproval.body.reasonCode, 'CONTEXT_NOT_AUTHORIZED');
  db.close();
});

test('HR 内部配置：低于 k=10 的 live 命中与节奏样本不得返回精确值', async () => {
  const sqlite = new DatabaseSync(':memory:');
  try {
    const dir = new URL('../migrations/care/', import.meta.url);
    for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
      sqlite.exec(readFileSync(new URL(file, dir), 'utf8'));
    }
    const now = Date.now();
    sqlite.prepare("INSERT INTO organizations (id, display_name, kind, status, created_at, updated_at) VALUES ('org_enterprise_primary', '钉钉企业组织', 'enterprise', 'active', ?, ?)").run(now, now);
    sqlite.prepare("UPDATE intervention_matrix SET icon='A', l1_name='L1', l2_name='L2', enabled=1 WHERE emotion='焦虑'").run();
    sqlite.prepare("INSERT INTO org_rhythm (id, bucket_day, metric, value, sample_size, unit, source, data_origin, created_at, organization_id) VALUES ('r1', '2026-09-23', 'median_off_duty_minutes', 123, 1, 'minutes', 'test', 'live', ?, 'org_enterprise_primary')").run(now);
    const response = await readConfig({
      env: { CARE_DB: d1(sqlite), INTERNAL_SERVICE_TOKEN: SERVICE_TOKEN, DINGTALK_ORG_ID: 'org_enterprise_primary' },
      request: new Request('https://employee.test/api/internal/config', { headers: { authorization: `Bearer ${SERVICE_TOKEN}` } }),
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.minSample, 10);
    assert.ok(!Number.isFinite(result.matrix[0].hits), '低样本 hits 不得泄露精确次数');
    assert.ok(result.rhythmSamples.every((row) => !Number.isFinite(row.value) && !Number.isFinite(row.sample_size)), '低样本 rhythm 不得泄露 value/sample_size');
  } finally {
    sqlite.close();
  }
});

async function metricsFixture(livePeople, demoPeople = 0) {
  const db = new DatabaseSync(':memory:');
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  }
  const now = Date.now();
  for (const [id, kind] of [['org_enterprise_primary', 'enterprise'], ['org_review', 'beta']]) {
    db.prepare("INSERT INTO organizations(id,display_name,kind,status,created_at,updated_at) VALUES (?,?,?,'active',?,?)")
      .run(id, id, kind, now, now);
  }
  const addPeople = (count, origin) => {
    const organizationId = origin === 'live' ? 'org_enterprise_primary' : 'org_review';
    for (let index = 0; index < count; index += 1) {
      const anonId = `${origin}_support_${index}`;
      db.prepare('INSERT INTO subject_organizations(anon_id,organization_id,entry_channel,created_at,last_seen_at) VALUES (?,?,?,?,?)')
        .run(anonId, organizationId, origin === 'live' ? 'dingtalk' : 'beta_web', now, now);
      db.prepare(
        'INSERT INTO profiles(anon_id, display_name, context_tag, created_at, updated_at, data_origin) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(anonId, '合成人员', 'none', now, now, origin);
      // 活跃口径是「真的开口说过话的人」：心情打卡入口已下线，不再是数据源。
      db.prepare(
        'INSERT INTO messages(id, conversation_id, anon_id, role, body_cipher, content_key_version, risk_level, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(`msg_${origin}_${index}`, `conv_${origin}_${index}`, anonId, 'user', 'cipher', 'v1', 'yellow', now, origin);
      db.prepare(
        'INSERT INTO risk_events(id, anon_id, conversation_id, level, rule, emotion, engine, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(`risk_${origin}_${index}`, anonId, null, 'yellow', 'synthetic', '焦虑', 'test', now, origin);
      db.prepare(
        'INSERT INTO aggregate_events(id, event_type, emotion, level, bucket_day, created_at, data_origin, organization_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(`agg_${origin}_${index}`, 'chat_message', '焦虑', 'yellow', new Date(now).toISOString().slice(0, 10), now, origin, organizationId);
    }
  };
  addPeople(livePeople, 'live');
  addPeople(demoPeople, 'demo_seed');
  const env = { CARE_DB: d1(db), INTERNAL_SERVICE_TOKEN: SERVICE_TOKEN, DINGTALK_ORG_ID: 'org_enterprise_primary' };
  const request = (origin) => new Request(`https://employee.test/api/internal/metrics?days=7&origin=${origin}${origin === 'demo_seed' ? '&organizationId=org_review' : ''}`, {
    headers: { authorization: `Bearer ${SERVICE_TOKEN}` },
  });
  return { db, env, request };
}

test('HR metrics：live 样本 1/4/5/9 人均按 k=10 抑制，10 人才放行', async () => {
  for (const count of [1, 4, 5, 9, 10]) {
    const { db, env, request } = await metricsFixture(count);
    const response = await readMetrics({ env, request: request('live') });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.origin, 'live');
    assert.equal(result.minSample, 10);
    assert.equal(result.origins.live.activeUsers.suppressed, count < 10, `count=${count}`);
    if (count < 10) {
      assert.equal(result.origins.live.activeUsers.value, undefined, `count=${count}`);
      assert.equal(result.coverage.rate, null, `count=${count}`);
      assert.equal(result.temperature.value, null, `count=${count}`);
    } else {
      assert.equal(result.origins.live.activeUsers.value, 10);
      assert.equal(result.coverage.rate, null);
      assert.equal(typeof result.temperature.value, 'number');
    }
    db.close();
  }
});

test('HR metrics：demo_seed 与 live 分组，demo 不能拿来凑 live 的 k=10', async () => {
  const mixed = await metricsFixture(1, 10);
  const liveResponse = await readMetrics({ env: mixed.env, request: mixed.request('live') });
  const live = await liveResponse.json();
  assert.equal(live.origin, 'live');
  assert.equal(live.origins.live.activeUsers.suppressed, true);
  assert.equal(live.origins.live.activeUsers.value, undefined);

  const demoResponse = await readMetrics({ env: mixed.env, request: mixed.request('demo_seed') });
  const demo = await demoResponse.json();
  assert.equal(demo.origin, 'demo_seed');
  assert.equal(demo.origins.demo_seed.activeUsers.suppressed, false);
  assert.equal(demo.origins.demo_seed.activeUsers.value, 10);
  mixed.db.close();
});
