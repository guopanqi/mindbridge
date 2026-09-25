// MindBridge 跟练角色。动作活动可切换 pose；觉察活动只切换 focus。
// 两者使用同一幅 SVG 和相同的身体比例，避免每个活动长出不同的小人。
const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

export function guideFigure() {
  const root = svg('svg', { class: 'stretch-figure guide-figure', viewBox: '0 0 220 245', role: 'img', 'aria-label': '坐姿动作示意图' });
  const seat = svg('path', { class: 'stretch-chair', d: 'M64 147 L64 204 M64 155 H155 M155 155 L155 218' });
  const legs = svg('path', { class: 'stretch-limbs', 'data-region': 'legs', d: 'M109 150 L78 165 L78 215 M109 150 L143 165 L143 215' });
  const feet = svg('path', { class: 'stretch-feet', 'data-region': 'feet', d: 'M68 216 H80 M141 216 H153' });
  const torso = svg('path', { class: 'stretch-body', 'data-region': 'torso', d: 'M110 77 L110 151' });
  const leftArm = svg('path', { class: 'stretch-limbs stretch-left-arm', 'data-region': 'arms' });
  const rightArm = svg('path', { class: 'stretch-limbs stretch-right-arm', 'data-region': 'arms' });
  const leftHand = svg('path', { class: 'stretch-hand stretch-left-hand', 'data-region': 'arms' });
  const rightHand = svg('path', { class: 'stretch-hand stretch-right-hand', 'data-region': 'arms' });
  const head = svg('circle', { class: 'stretch-head', 'data-region': 'head', cx: 110, cy: 55, r: 17 });
  const halo = svg('path', { class: 'stretch-halo', d: '' });
  root.append(seat, legs, feet, torso, leftArm, rightArm, leftHand, rightHand, head, halo);

  const pose = name => {
    root.dataset.pose = name;
    head.setAttribute('cx', name === 'neck-left' ? 101 : name === 'neck-right' ? 119 : 110);
    head.setAttribute('cy', name.startsWith('neck') ? 57 : 55);
    const arms = {
      neutral: ['M109 87 L82 112 L86 145', 'M111 87 L138 112 L134 145'],
      shoulders: ['M109 87 L78 91 L75 131', 'M111 87 L142 91 L145 131'],
      chest: ['M109 87 L70 101 L48 86', 'M111 87 L150 101 L172 86'],
      'wrist-left': ['M109 87 L70 105 L48 111', 'M111 87 L138 112 L134 145'],
      'wrist-right': ['M109 87 L82 112 L86 145', 'M111 87 L150 105 L172 111'],
      'side-left': ['M109 87 L80 108 L84 146', 'M111 87 L135 69 L126 28'],
      'side-right': ['M109 87 L94 69 L104 28', 'M111 87 L140 108 L136 146'],
    };
    const [left, right] = arms[name] || arms.neutral;
    leftArm.setAttribute('d', left);
    rightArm.setAttribute('d', right);
    leftHand.setAttribute('d', name === 'wrist-left' ? 'M48 111 L41 100' : '');
    rightHand.setAttribute('d', name === 'wrist-right' ? 'M172 111 L179 100' : '');
    torso.setAttribute('d', name === 'side-left' ? 'M110 77 Q91 111 106 151' : name === 'side-right' ? 'M110 77 Q129 111 112 151' : 'M110 77 L110 151');
    const focus = name === 'shoulders' ? 'M68 91 Q110 50 152 91' : name.startsWith('neck') ? 'M75 55 Q110 18 145 55'
      : name === 'chest' ? 'M74 104 Q110 123 146 104' : name.startsWith('wrist') ? name.endsWith('left') ? 'M39 108 A11 11 0 1 0 61 108' : 'M160 108 A11 11 0 1 0 182 108'
        : name.startsWith('side') ? 'M76 80 Q110 56 144 80' : '';
    halo.setAttribute('d', focus);
  };
  const focus = region => { root.dataset.focus = region; };
  pose('neutral');
  return { root, pose, focus };
}
