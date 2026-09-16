// 把多段同尺寸 MP4 按顺序拼成一条：node scripts/demo-video/concat.mjs B B1 B2 B3
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const [name, ...parts] = process.argv.slice(2);
const OUT = path.resolve('scripts/demo-video/out');
const list = path.join(OUT, `${name}.parts.txt`);
writeFileSync(list, parts.map((p) => `file '${path.join(OUT, `${p}.mp4`)}'`).join('\n'));
const output = path.join(OUT, `${name}.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', output], { stdio: 'inherit' });
console.log(output, execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', output]).toString().trim());
