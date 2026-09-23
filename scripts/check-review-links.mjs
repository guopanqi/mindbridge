// 评审聚合页的入口契约。输出只包含检查结果，不打印邀请或管理密钥。
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const localHtml = await readFile(new URL('../路演/原型/index.html', import.meta.url), 'utf8');
const remote = process.argv.includes('--remote');
const login = process.argv.includes('--login');
if (login && !remote) throw new Error('--login 需要同时指定 --remote');

function links(html) {
  return [...html.matchAll(/<a\s+class="role"\s+href="([^"]+)"/g)].map((match) => new URL(match[1]));
}

function checkContract(found) {
  assert.equal(found.length, 3, '聚合页必须恰有三个角色入口');
  const expected = [
    ['mindbridge-beta.pages.dev', '/', 'invite'],
    ['mindbridge-console.pages.dev', '/', 'orgKey'],
    ['mindbridge-console.pages.dev', '/healer/', null],
  ];
  found.forEach((url, index) => {
    const [host, path, key] = expected[index];
    assert.equal(url.protocol, 'https:');
    assert.equal(url.host, host);
    assert.equal(url.pathname, path);
    assert.deepEqual([...url.searchParams.keys()], key ? [key] : []);
    if (key) assert.ok(url.searchParams.get(key)?.length >= 16, `${key} 缺失`);
  });
}

const local = links(localHtml);
checkContract(local);
console.log('本地评审聚合页：三个入口契约通过');

if (remote) {
  const page = await fetch('https://mindbridge-demo.pages.dev/');
  assert.equal(page.status, 200, '线上聚合页不可访问');
  const deployed = links(await page.text());
  checkContract(deployed);
  assert.deepEqual(deployed.map(String), local.map(String), '线上链接与本地版本不一致');
  for (const target of deployed) {
    const response = await fetch(target, { redirect: 'follow' });
    assert.equal(response.status, 200, `${target.host}${target.pathname} 页面不可访问`);
  }
  for (const address of [
    'https://mindbridge-beta.pages.dev/api/health',
    'https://mindbridge-console.pages.dev/api/health',
  ]) {
    const response = await fetch(address);
    assert.equal(response.status, 200, `${new URL(address).host} 健康检查失败`);
    assert.equal((await response.json()).ok, true);
  }
  console.log('线上聚合页、三个入口页面与两端健康检查通过');
  if (login) {
    const checks = [
      ['https://mindbridge-beta.pages.dev/api/auth/invite', { token: deployed[0].searchParams.get('invite') }],
      ['https://mindbridge-console.pages.dev/api/auth/org', { token: deployed[1].searchParams.get('orgKey') }],
      ['https://mindbridge-console.pages.dev/api/auth/healer', { username: '评审疗愈师' }],
    ];
    for (const [index, [address, body]] of checks.entries()) {
      const response = await fetch(address, {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: new URL(address).origin },
        body: JSON.stringify(body),
      });
      assert.equal(response.status, 200, `${new URL(address).pathname} 凭证登录失败`);
      assert.equal((await response.json()).ok ?? true, true);
      const cookieName = index === 0 ? '__Host-mb_session' : '__Host-mb_staff';
      const cookie = (response.headers.getSetCookie?.() || [response.headers.get('set-cookie') || ''])
        .map((value) => value.split(';')[0])
        .find((value) => value.startsWith(`${cookieName}=`));
      assert.ok(cookie, `${new URL(address).pathname} 未签发会话`);
      const session = await fetch(`${new URL(address).origin}/api/session`, { headers: { cookie } });
      assert.equal(session.status, 200, `${new URL(address).pathname} 会话无法读取`);
      assert.equal((await session.json()).authenticated, true);
      const next = index === 0 ? '/api/bootstrap' : (index === 1 ? '/api/metrics?days=90&origin=demo_seed' : '/api/cases');
      const data = await fetch(`${new URL(address).origin}${next}`, { headers: { cookie } });
      assert.equal(data.status, 200, `${next} 无法读取`);
    }
    console.log('三个评审入口的凭证登录、会话及首屏数据通过');
  }
}
