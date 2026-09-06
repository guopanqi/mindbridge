// 「我的」「我的活动」共用同一份 bootstrap 数据：一次网络请求，两个页面都能用。
// 缓存只用来「先把上次的内容画出来」，每次进页面照常回源刷新，不会让人看到过期状态太久。
import { api } from './api.js';

let cache = null;
let inflight = null;

export const cached = () => cache;

export function refresh() {
  if (!inflight) {
    inflight = api.bootstrap()
      .then((body) => { cache = body; return body; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function clearCache() {
  cache = null;
}
