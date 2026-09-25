import { el } from '../dom.js';

// 四个跟练活动共用的控制区。体验画面和时间轴仍由各活动自行决定。
export function guideTransport({ total, label, onToggle, onSkip, skipLabel, voiceButton }) {
  const phase = el('span', { class: 'guide-transport-phase' });
  const clock = el('span', { class: 'guide-transport-clock' });
  const fill = el('i');
  const progress = el('div', { class: 'guide-transport-progress', attrs: {
    role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': '0',
  } }, [fill]);
  const toggle = el('button', { class: 'guide-transport-toggle', text: '暂停', attrs: { type: 'button', 'aria-label': '暂停练习' }, on: { click: onToggle } });
  const skip = el('button', { class: 'guide-transport-skip', text: skipLabel, attrs: { type: 'button' }, on: { click: onSkip } });
  const root = el('div', { class: 'guide-transport' }, [
    el('div', { class: 'guide-transport-meta' }, [phase, clock]),
    progress,
    el('div', { class: 'guide-transport-actions' }, [toggle, voiceButton, skip]),
  ]);
  const stamp = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const update = ({ elapsed, phaseLabel, playing, canSkip = true }) => {
    phase.textContent = phaseLabel;
    clock.textContent = `${stamp(elapsed)} / ${stamp(total)}`;
    fill.style.width = `${Math.min(100, elapsed / total * 100)}%`;
    progress.setAttribute('aria-valuenow', String(Math.floor(elapsed)));
    toggle.textContent = playing ? '暂停' : '继续';
    toggle.setAttribute('aria-label', playing ? '暂停练习' : '继续练习');
    skip.hidden = !canSkip;
  };
  return { root, update };
}
