import { el } from '../dom.js';

// 跟练语音层：有录音时播放录音；否则用设备中文语音读当前提示。
// 声音由用户主动开启。切段、暂停、退到后台和组件卸载都立即停声。
export function guideVoice(src, cleanup) {
  const hasTts = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance === 'function';
  const audio = src ? new Audio(src) : null;
  const button = el('button', {
    class: 'guide-voice', text: '开启语音',
    attrs: { type: 'button', 'aria-pressed': 'false', ...(audio || hasTts ? {} : { hidden: true }) },
  });
  let enabled = false;
  let playing = false;
  let cue = '';
  let position = 0;
  let disposed = false;

  const cancelSpeech = () => { if (hasTts && !audio) window.speechSynthesis.cancel(); };
  const speak = () => {
    if (!hasTts || audio || !enabled || !playing || !cue || disposed) return;
    cancelSpeech();
    const utterance = new window.SpeechSynthesisUtterance(cue);
    utterance.lang = 'zh-CN';
    utterance.rate = .9;
    const chinese = window.speechSynthesis.getVoices().find(voice => /^zh(-|_)/i.test(voice.lang));
    if (chinese) utterance.voice = chinese;
    window.speechSynthesis.speak(utterance);
  };
  const syncAudio = () => {
    if (!audio || disposed) return;
    if (!enabled || !playing) { audio.pause(); return; }
    if (Number.isFinite(audio.duration) && Math.abs(audio.currentTime - position) > 1.5) {
      try { audio.currentTime = Math.min(position, Math.max(0, audio.duration - .1)); } catch { /* 元数据尚未就绪 */ }
    }
    audio.play().catch(() => {});
  };
  button.addEventListener('click', () => {
    enabled = !enabled;
    button.textContent = enabled ? '关闭语音' : '开启语音';
    button.setAttribute('aria-pressed', String(enabled));
    if (audio) syncAudio();
    else if (enabled) speak();
    else cancelSpeech();
  });
  audio?.addEventListener('error', () => { button.hidden = !hasTts; enabled = false; button.setAttribute('aria-pressed', 'false'); button.textContent = '开启语音'; });
  const update = ({ isPlaying, text, elapsed }) => {
    if (disposed) return;
    const cueChanged = text !== cue;
    const playbackChanged = isPlaying !== playing;
    cue = text;
    playing = isPlaying;
    position = elapsed;
    if (audio) syncAudio();
    else if (!playing) cancelSpeech();
    else if (cueChanged || playbackChanged) speak();
  };
  const seek = elapsed => {
    position = elapsed;
    if (audio) { try { audio.currentTime = elapsed; } catch { /* 元数据尚未就绪 */ } }
    else if (enabled && playing) speak();
  };
  const stop = () => { playing = false; if (audio) audio.pause(); cancelSpeech(); };
  cleanup(() => {
    disposed = true;
    stop();
    if (audio) { audio.removeAttribute('src'); audio.load(); }
  });
  return { button, update, seek, stop };
}
