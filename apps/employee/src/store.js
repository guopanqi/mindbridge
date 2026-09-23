// 「我的」「我的活动」共用同一份 bootstrap 数据：一次网络请求，两个页面都能用。
// 缓存只用来「先把上次的内容画出来」，每次进页面照常回源刷新，不会让人看到过期状态太久。
import { api } from './api.js';

let cache = null;
let inflight = null;
let seq = 0;

export const cached = () => cache;

// 写操作成功后必须看一次新数据：直接复用进行中的旧请求会把变更前的快照再画一遍，
// 新建的预约/授权看起来就像没生效。force 跳过请求去重，且只有最新一次回源才写缓存。
export function refresh(force = false) {
  if (force) inflight = null;
  if (!inflight) {
    const mine = ++seq;
    inflight = api.bootstrap()
      .then((body) => { if (mine === seq) cache = body; return body; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function clearCache() {
  cache = null;
}
