export const VALUE_DOMAINS = [
  { label: '工作', phrase: '工作中' },
  { label: '家庭', phrase: '家庭中' },
  { label: '朋友', phrase: '与朋友相处时' },
  { label: '学习与成长', phrase: '学习与成长时' },
  { label: '健康', phrase: '照顾健康时' },
  { label: '社区 / 他人', phrase: '与社区及他人相处时' },
  { label: '自己', phrase: '面对自己时' },
];

export const VALUE_QUALITIES = ['可靠', '有耐心', '勇敢', '诚实', '有创造力', '关心别人', '愿意学习', '有责任感', '公平', '保持好奇'];

export function valueSentence(domain, qualities) {
  const place = VALUE_DOMAINS.find(item => item.label === domain)?.phrase || '生活中';
  const words = qualities.map(item => item.trim()).filter(Boolean);
  return words.length ? `在${place}，我希望成为一个${words.join('、')}的人。` : `在${place}，我希望以自己重视的方式行动。`;
}

export function valueCard(state) {
  return [
    '今天朝自己重视的方向走一步',
    state.statement.trim() || valueSentence(state.domain, state.qualities),
    `未来 24 小时，我会：${state.action.trim()}`,
    state.when.trim() ? `我打算在：${state.when.trim()}` : '',
  ].filter(Boolean).join('\n');
}
