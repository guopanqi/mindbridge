export function hasActivityAudio(stagesJson) {
  try {
    return JSON.parse(stagesJson || '[]').some(stage =>
      typeof stage.src === 'string' && /\.(?:mp3|m4a|wav|ogg)(?:\?|$)/i.test(stage.src));
  } catch { return false; }
}
