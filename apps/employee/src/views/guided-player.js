import { el } from '../dom.js';

const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

// 本地、静音的演示播放器。分段字幕和时长均来自活动内容；没有外部媒体请求。
export function renderGuidedPlayer(stage, { complete, cleanup }) {
  const segments = stage.segments || (stage.parts || []).map(part => ({ title: part.name, hint: part.hint, seconds: part.seconds || 12 }));
  const total = segments.reduce((sum, segment) => sum + segment.seconds, 0);
  const video = stage.presentation === 'video';
  const title = el('p', { class: 'demo-player-title' });
  const caption = el('p', { class: 'demo-player-caption' });
  const clock = el('span', { class: 'demo-player-clock' });
  const seek = el('input', { attrs: { type: 'range', min: 0, max: total, value: 0, step: 1, 'aria-label': '播放进度' } });
  const toggle = el('button', { class: 'secondary small', text: '开始播放', attrs: { type: 'button' } });
  const restart = el('button', { class: 'link', text: '重新播放', attrs: { type: 'button' } });
  const art = video
    ? el('div', { class: 'demo-figure', attrs: { 'aria-hidden': 'true' } }, [
      el('i', { class: 'figure-head' }), el('i', { class: 'figure-body' }),
      el('i', { class: 'figure-arm left' }), el('i', { class: 'figure-arm right' }),
      el('i', { class: 'figure-leg left' }), el('i', { class: 'figure-leg right' }),
    ])
    : el('div', { class: 'demo-wave', attrs: { 'aria-hidden': 'true' } }, Array.from({ length: 21 }, (_, i) => el('i', { style: `--bar:${i % 7};--delay:-${i * .13}s` })));
  const screen = el('div', { class: `demo-screen ${video ? 'video' : 'audio'}` }, [art, title, caption]);
  const root = el('div', { class: 'demo-player' }, [
    el('p', { class: 'media-label', text: video ? '视频引导 · 演示片段' : '音频引导 · 演示片段' }),
    screen, seek,
    el('div', { class: 'media-controls' }, [toggle, restart, clock]),
    el('p', { class: 'act-note', text: `本段为 ${time(total)} 的静音演示，跟随字幕即可。` }),
  ]);
  let elapsed = 0;
  let playing = !document.hidden;
  let resumeOnVisible = document.hidden;
  let last = performance.now();
  let disposed = false;
  let ended = false;
  const update = () => {
    let start = 0;
    const segment = segments.find(item => { start += item.seconds; return elapsed < start; }) || segments.at(-1);
    title.textContent = elapsed >= total ? '播放完成' : segment?.title || '';
    caption.textContent = elapsed >= total ? '可以重新播放，也可以结束这次练习。' : segment?.hint || '';
    seek.value = String(Math.floor(elapsed));
    clock.textContent = `${time(elapsed)} / ${time(total)}`;
    toggle.textContent = playing ? '暂停' : elapsed >= total ? '再播放一次' : elapsed > 0 ? '继续播放' : '开始播放';
    root.classList.toggle('playing', playing);
  };
  const sample = () => {
    if (disposed || ended) return;
    const now = performance.now();
    if (playing) elapsed = Math.min(total, elapsed + (now - last) / 1000);
    last = now;
    if (elapsed >= total) { playing = false; ended = true; complete(); return; }
    if (!disposed) update();
  };
  toggle.addEventListener('click', () => {
    sample();
    resumeOnVisible = false;
    if (elapsed >= total) elapsed = 0;
    playing = !playing;
    update();
  });
  restart.addEventListener('click', () => { elapsed = 0; playing = true; resumeOnVisible = false; last = performance.now(); update(); });
  seek.addEventListener('input', () => { elapsed = Number(seek.value); last = performance.now(); sample(); });
  const visibility = () => {
    if (disposed || ended) return;
    if (document.hidden) {
      if (playing) { sample(); resumeOnVisible = true; playing = false; }
    } else if (resumeOnVisible) {
      last = performance.now(); playing = true; resumeOnVisible = false;
    }
    update();
  };
  document.addEventListener('visibilitychange', visibility);
  const timer = setInterval(sample, 100);
  cleanup(() => { disposed = true; clearInterval(timer); document.removeEventListener('visibilitychange', visibility); });
  update();
  return [root];
}

// 正式媒体与模拟播放器遵循同一个结束/清理协议，替换素材无需更改活动流程。
export function renderMediaPlayer(stage, { complete, cleanup }) {
  const media = el(stage.presentation === 'audio' ? 'audio' : 'video', {
    class: 'activity-media', attrs: { src: stage.src, controls: true, playsinline: true, preload: 'auto' },
  });
  const message = el('p', { class: 'act-note', attrs: { role: 'status' } });
  const retry = el('button', { class: 'secondary', text: '点击播放', attrs: { type: 'button', hidden: true } });
  let disposed = false;
  let ended = false;
  const play = async () => {
    try {
      await media.play();
      if (!disposed) { message.textContent = ''; retry.hidden = true; }
    } catch {
      if (!disposed) { message.textContent = '播放尚未开始，请点击播放。'; retry.hidden = false; }
    }
  };
  retry.addEventListener('click', () => { if (media.error) media.load(); void play(); });
  media.addEventListener('ended', () => { if (!disposed && !ended) { ended = true; complete(); } });
  media.addEventListener('error', () => {
    if (!disposed) { message.textContent = '媒体暂时无法加载，请重试。'; retry.hidden = false; }
  });
  const visibility = () => { if (document.hidden) media.pause(); };
  document.addEventListener('visibilitychange', visibility);
  cleanup(() => {
    disposed = true;
    media.pause();
    media.removeAttribute('src');
    media.load();
    document.removeEventListener('visibilitychange', visibility);
  });
  queueMicrotask(() => { if (!disposed) void play(); });
  return [media, message, retry];
}
