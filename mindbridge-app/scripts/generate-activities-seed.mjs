// 把原型里的活动定义归一化成统一的 stages 结构，落进 care 库。
//
// 原型用了 8 种不同的交互引擎（steps / bodyscan / choice / audio / anchor /
// journal / three-good / video）。前端不应该为每种引擎写一套渲染逻辑，
// 因此这里统一归一化成四类 stage：prompt（引导一步）、choice（选一个）、
// input（写点什么）、note（纯提示）。新增活动只要给出 stages，不用改前端。
import { writeFileSync } from 'node:fs';
import { ACTIVITIES } from '../functions/api/_lib/activities-data.js';

const esc = (s) => String(s).replace(/'/g, "''");

function normalize(a) {
  const engine = a.demoEngine || (a.type === 'offline' ? 'offline' : 'steps');
  const stages = [];
  const push = (stage) => stages.push(stage);

  if (Array.isArray(a.steps) && a.steps.length) {
    for (const [title, hint] of a.steps) push({ type: 'prompt', title, hint });
  }
  if (engine === 'bodyscan' && Array.isArray(a.parts)) {
    for (const part of a.parts) push({ type: 'prompt', title: `${part.icon} ${part.name}`, hint: part.hint });
  }
  if (engine === 'choice' && Array.isArray(a.choices)) {
    push({
      type: 'choice',
      title: '现在想先试哪一个？',
      options: a.choices.map((c) => ({ icon: c.icon, label: c.label, desc: c.desc, reflection: c.reflection })),
    });
  }
  if (engine === 'audio' && Array.isArray(a.tracks)) {
    push({
      type: 'choice',
      title: '选一段声音陪你一会儿',
      options: a.tracks.map((t) => ({ icon: t.icon, label: t.label, desc: t.desc, reflection: '开始播放后，把注意力放在声音上就好，不用刻意做什么。' })),
    });
    push({ type: 'note', title: '就这样待一会儿', hint: '不需要评价自己做得对不对。听到哪里算哪里。' });
  }
  if (engine === 'anchor') {
    push({
      type: 'choice',
      title: '哪一个是你现在最看重的职业价值？',
      options: (a.values || []).map((v) => ({ icon: v.icon, label: v.label, desc: v.desc, reflection: '把它记住。岗位会变，这个东西不会因为岗位变化而消失。' })),
    });
    push({
      type: 'choice',
      title: '本周可以先做哪一个小行动？',
      options: (a.actions || []).map((v) => ({ icon: v.icon, label: v.label, desc: v.desc, reflection: '只挑这一个就够了。做完了再想下一个。' })),
    });
  }
  if (engine === 'journal') {
    push({ type: 'input', title: a.prompt || '写下你的感受', hint: a.placeholder || '不必写得通顺完整。' });
  }
  if (engine === 'three-good') {
    for (let i = 1; i <= 3; i++) {
      push({ type: 'input', title: `今天的第 ${i} 件好事`, hint: '很小的事也算，比如有人帮你留了门。' });
    }
  }
  if (engine === 'video') {
    push({ type: 'note', title: '跟着做就好', hint: '肩颈绕环、上肢伸展、深呼吸收束。跟不上就慢一点，不用做满。' });
    push({ type: 'prompt', title: '收束', hint: '最后做三次深呼吸，感受身体和刚开始有什么不同。' });
  }
  if (!stages.length && a.type !== 'offline') {
    push({ type: 'note', title: a.title, hint: a.desc });
  }
  return stages;
}

const lines = ['-- 由 scripts/generate-activities-seed.mjs 生成，勿手改。'];
const scoreLabel = (a) => (a.preLabel || '').replace(/^此刻的?/, '').replace(/是多少？$/, '').trim() || '状态';

for (const [id, a] of Object.entries(ACTIVITIES)) {
  const stages = normalize(a);
  lines.push(
    `INSERT OR REPLACE INTO activities (id, title, kind, form, duration, description, pre_label, low_label, high_label, direction, score_label, schedule, location, stages_json, enabled, data_origin) VALUES (`
    + `'${esc(id)}', '${esc(a.title)}', '${esc(a.type)}', '${esc(a.form || '')}', '${esc(a.duration || '')}', '${esc(a.desc || '')}', `
    + `'${esc(a.preLabel || '')}', '${esc(a.low || '')}', '${esc(a.high || '')}', '${esc(a.direction || 'down')}', '${esc(scoreLabel(a))}', `
    + `${a.schedule ? `'${esc(a.schedule)}'` : 'NULL'}, ${a.location ? `'${esc(a.location)}'` : 'NULL'}, `
    + `'${esc(JSON.stringify(stages))}', 1, 'demo_seed');`
  );
  // 资源目录按标题关联活动，配置矩阵里选中的资源就能直接打开对应活动。
  lines.push(`UPDATE resource_catalog SET activity_id = '${esc(id)}' WHERE name = '${esc(a.title)}';`);
}

writeFileSync('seed/activities.sql', `${lines.join('\n')}\n`);
console.log(`生成 ${Object.keys(ACTIVITIES).length} 个活动 → seed/activities.sql`);
