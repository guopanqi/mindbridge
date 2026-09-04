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

test('支持链路：MB 编号可见、接单闭环后员工状态同步', async () => {
  const { db, env, employeeRequest, healerRequest } = await fixture();
  const created = await body(await createAppointment({
    env,
    request: employeeRequest('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ riskLevel: 'yellow', shareContext: true, note: '合成验收备注' }),
    }),
  }));
  assert.equal(created.status, 200);
  assert.match(created.body.caseCode, /^MB-[A-Z2-9]{6}$/);

  const visible = await body(await listCases({
    env,
    request: healerRequest(),
  }));
  assert.equal(visible.status, 200);
  assert.equal(visible.body.cases[0].caseCode, created.body.caseCode);
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
      body: JSON.stringify({ riskLevel: 'yellow', shareContext: true }),
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
        body: JSON.stringify({ riskLevel: 'yellow', shareContext: false }),
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
      body: JSON.stringify({ riskLevel: 'yellow', shareContext: true }),
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
      body: JSON.stringify({ riskLevel: 'yellow', shareContext: true }),
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
  const rows = {
    matrix: [{ emotion: '焦虑', icon: 'A', l1_name: 'L1', l1_desc: '', l2_name: 'L2', l2_desc: '', l3_action: '', enabled: 1, updated_at: 1, updated_by: 'test' }],
    catalog: [],
    signals: [],
    hits: [{ emotion: '焦虑', n: 1 }],
    rhythm: [{ metric: 'median_off_duty_minutes', value: 123, sample_size: 1, unit: 'minutes', created_at: 1 }],
  };
  const db = {
    prepare(sql) {
      const key = sql.includes('intervention_matrix') ? 'matrix'
        : sql.includes('resource_catalog') ? 'catalog'
          : sql.includes('sensing_signals') ? 'signals'
            : sql.includes('aggregate_events') ? 'hits' : 'rhythm';
      return { bind() { return this; }, async all() { return { results: rows[key] }; } };
    },
  };
  const response = await readConfig({
    env: { CARE_DB: db, INTERNAL_SERVICE_TOKEN: SERVICE_TOKEN },
    request: new Request('https://employee.test/api/internal/config', { headers: { authorization: `Bearer ${SERVICE_TOKEN}` } }),
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.minSample, 10);
  assert.ok(!Number.isFinite(result.matrix[0].hits), '低样本 hits 不得泄露精确次数');
  assert.ok(result.rhythmSamples.every((row) => !Number.isFinite(row.value) && !Number.isFinite(row.sample_size)), '低样本 rhythm 不得泄露 value/sample_size');
});

async function metricsFixture(livePeople, demoPeople = 0) {
  const db = new DatabaseSync(':memory:');
  const dir = new URL('../migrations/care/', import.meta.url);
  for (const file of readdirSync(dir).sort().filter((name) => name.endsWith('.sql'))) {
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  }
  const now = Date.now();
  db.prepare(
    'INSERT INTO tenant_profile(id, display_name, headcount, industry, data_origin, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run('demo', '合成验收租户', livePeople + demoPeople + 100, 'test', 'demo_seed', now);
  const addPeople = (count, origin) => {
    for (let index = 0; index < count; index += 1) {
      const anonId = `${origin}_support_${index}`;
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
        'INSERT INTO aggregate_events(id, event_type, emotion, level, bucket_day, created_at, data_origin) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(`agg_${origin}_${index}`, 'chat_message', '焦虑', 'yellow', new Date(now).toISOString().slice(0, 10), now, origin);
    }
  };
  addPeople(livePeople, 'live');
  addPeople(demoPeople, 'demo_seed');
  const env = { CARE_DB: d1(db), INTERNAL_SERVICE_TOKEN: SERVICE_TOKEN };
  const request = (origin) => new Request(`https://employee.test/api/internal/metrics?days=7&origin=${origin}`, {
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
      assert.equal(result.coverage.rate, 9.1);
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
