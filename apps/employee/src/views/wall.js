import { api, ApiError } from '../api.js';
import { clear, el, timeAgo, toast } from '../dom.js';

let feed;
let posts = null;
let composer;
const expanded = new Set();
// 回复框在刷新时会整体重渲染（先画缓存、网络回来再画一次；切走再回来也一样）。
// 不留草稿的话，正在输入的字会被静默清空，点发送等于没点。按帖子记住未发出的字。
const drafts = new Map();

function replyBox(post, onDone) {
  const input = el('input', { attrs: { type: 'text', maxlength: 200, placeholder: '回一句温暖的话…', 'aria-label': '回复内容' } });
  input.value = drafts.get(post.id) || '';
  input.addEventListener('input', () => {
    if (input.value) drafts.set(post.id, input.value);
    else drafts.delete(post.id);
  });
  const submit = async () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      await api.reply(post.id, text);
      drafts.delete(post.id);
      input.value = '';
      onDone();
    } catch (error) {
      toast(error instanceof ApiError && error.userMessage ? error.userMessage : '回复失败，请稍后再试。');
    }
  };
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); void submit(); }
  });
  return el('div', { class: 'reply-box' }, [
    input,
    el('button', { class: 'link', text: '发送', attrs: { type: 'button' }, on: { click: () => void submit() } }),
  ]);
}

function card(post, reload) {
  const replies = expanded.has(post.id) ? post.replies : post.replies.slice(-2);
  return el('div', { class: `post${post.mine ? ' mine' : ''}` }, [
    el('div', { class: 'post-head' }, [
      el('span', { class: 'post-author', text: post.author }),
      post.mine ? el('span', { class: 'post-you', text: '你' }) : null,
      el('span', { class: 'post-time', text: `· ${timeAgo(post.at)}` }),
    ]),
    el('p', { class: 'post-body', text: post.text }),
    el('div', { class: 'post-actions' }, [
      el('button', {
        class: `hug${post.hugged ? ' on' : ''}`,
        text: `${post.hugged ? '♥' : '♡'} ${post.hugs}`,
        attrs: { type: 'button', 'aria-pressed': post.hugged, 'aria-label': '抱抱' },
        on: {
          click: async () => {
            try { await api.hug(post.id); reload(); } catch { toast('操作失败，请稍后再试。'); }
          },
        },
      }),
      el('button', {
        class: 'link mut', text: post.replies.length > 2 && !expanded.has(post.id) ? `查看全部 ${post.replies.length} 条回复` : `回复${post.replies.length ? ` · ${post.replies.length}` : ''}`,
        attrs: { type: 'button' },
        on: { click: () => { expanded.add(post.id); reload(); } },
      }),
      post.mine ? el('button', {
        class: 'link danger', text: '删除', attrs: { type: 'button' },
        on: {
          click: async () => {
            try { await api.deletePost(post.id); reload(); } catch { toast('删除失败，请稍后再试。'); }
          },
        },
      }) : null,
    ]),
    replies.length ? el('div', { class: 'replies' }, replies.map((reply) => el('div', { class: 'reply' }, [
      el('span', { class: 'reply-author', text: reply.author }),
      el('span', { class: 'reply-text', text: reply.text }),
    ]))) : null,
    expanded.has(post.id) ? replyBox(post, reload) : null,
  ]);
}

export function renderWall(root) {
  clear(root);
  feed = el('div', { class: 'feed' });
  const input = el('textarea', { attrs: { rows: 1, maxlength: 500, placeholder: '写点什么…将以匿名身份发布' } });
  const publish = async () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      await api.createPost(text);
      input.value = '';
      await loadWall();
      toast('已发布。');
    } catch (error) {
      toast(error instanceof ApiError && error.userMessage ? error.userMessage : '发布失败，请稍后再试。');
    }
  };
  composer = el('div', { class: 'composer wall' }, [
    input,
    el('div', { class: 'composer-row' }, [
      el('span', { class: 'composer-safe', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>发布前会进行隐私与善意检查' }),
      el('button', { class: 'primary pill', text: '发布', attrs: { type: 'button' }, on: { click: () => void publish() } }),
    ]),
  ]);
  root.append(composer, feed);
}

function paintWall() {
  clear(feed);
  if (!posts.length) {
    feed.append(el('p', { class: 'empty', text: '广场还很安静。你可以成为第一个说话的人。' }));
    return;
  }
  for (const post of posts) feed.append(card(post, () => void loadWall()));
}

export async function loadWall() {
  // 上次的内容先留在屏幕上，刷新完成再整体替换，避免每次进广场都闪一下空白。
  if (posts) paintWall();
  try {
    posts = (await api.wall()).posts;
    paintWall();
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    toast('广场内容暂时无法加载，请稍后再试。');
  }
}
