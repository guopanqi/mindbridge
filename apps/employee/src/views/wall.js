import { api, ApiError } from '../api.js';
import { clear, el, timeAgo, toast } from '../dom.js';

let feed;
let posts = null;
let composer;
const expanded = new Set();

function replyBox(post, onDone) {
  const input = el('input', { attrs: { type: 'text', maxlength: 200, placeholder: '回一句温暖的话…', 'aria-label': '回复内容' } });
  const submit = async () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      await api.reply(post.id, text);
      input.value = '';
      onDone();
    } catch (error) {
      toast(error instanceof ApiError && error.userMessage ? error.userMessage : '回复没有成功，请稍后再试。');
    }
  };
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); void submit(); }
  });
  return el('div', { class: 'reply-box' }, [
    input,
    el('button', { class: 'secondary small', text: '回复', attrs: { type: 'button' }, on: { click: () => void submit() } }),
  ]);
}

function card(post, reload) {
  const replies = expanded.has(post.id) ? post.replies : post.replies.slice(-2);
  return el('div', { class: `post${post.mine ? ' mine' : ''}` }, [
    el('div', { class: 'post-head' }, [
      el('span', { class: 'post-author', text: post.author }),
      post.simulated ? el('span', { class: 'chip sim', text: '模拟数据' }) : null,
      el('span', { class: 'post-time', text: timeAgo(post.at) }),
    ]),
    el('p', { class: 'post-body', text: post.text }),
    el('div', { class: 'post-actions' }, [
      el('button', {
        class: `hug${post.hugged ? ' on' : ''}`,
        text: `🤗 抱抱 ${post.hugs}`,
        attrs: { type: 'button', 'aria-pressed': post.hugged },
        on: {
          click: async () => {
            try { await api.hug(post.id); reload(); } catch { toast('操作没有成功，请稍后再试。'); }
          },
        },
      }),
      el('button', {
        class: 'link', text: post.replies.length > 2 && !expanded.has(post.id) ? `展开 ${post.replies.length} 条回复` : '回复',
        attrs: { type: 'button' },
        on: { click: () => { expanded.add(post.id); reload(); } },
      }),
      post.mine ? el('button', {
        class: 'link danger', text: '删除', attrs: { type: 'button' },
        on: {
          click: async () => {
            try { await api.deletePost(post.id); reload(); } catch { toast('删除没有成功，请稍后再试。'); }
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
  const input = el('textarea', { attrs: { rows: 2, maxlength: 500, placeholder: '写点什么…这里只显示你的匿名代号' } });
  const publish = async () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      await api.createPost(text);
      input.value = '';
      await loadWall();
      toast('已发布。');
    } catch (error) {
      toast(error instanceof ApiError && error.userMessage ? error.userMessage : '发布没有成功，请稍后再试。');
    }
  };
  composer = el('div', { class: 'composer wall' }, [
    input,
    el('div', { class: 'composer-row' }, [
      el('span', { class: 'composer-safe', text: '已开启隐私保护与温暖社区守护' }),
      el('button', { class: 'primary small', text: '发布', attrs: { type: 'button' }, on: { click: () => void publish() } }),
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
    toast('广场内容暂时读不出来，请稍后再试。');
  }
}
