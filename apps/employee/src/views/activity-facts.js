import { el } from '../dom.js';

export function activityFacts(activity) {
  const audioAvailable = activity.audioAvailable ?? (activity.stages || []).some(stage =>
    typeof stage.src === 'string' && /\.(?:mp3|m4a|wav|ogg)(?:\?|$)/i.test(stage.src));
  const rows = [
    ['形式', activity.form || (activity.kind === 'offline' ? '线下活动' : '线上自助')],
    ['时长', activity.duration || '按自己的节奏'],
    ['声音', activity.kind === 'offline' ? '现场引导' : audioAvailable ? '语音可开关' : '无需声音'],
  ];
  return el('dl', { class: 'activity-facts' }, rows.map(([label, value]) => el('div', {}, [
    el('dt', { text: label }), el('dd', { text: value }),
  ])));
}
