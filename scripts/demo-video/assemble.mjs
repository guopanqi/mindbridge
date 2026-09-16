// 把截图序列合成为带样机外框的 MP4。
// 用法：node scripts/demo-video/assemble.mjs A phone-941 [--speed from:to:factor ...]
// speed 段用录制时的 mark 秒数表示，例如呼吸圆那 72 秒压到 12 秒：--speed 30.9:100.9:6
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [name, frame = 'phone-941', ...rest] = process.argv.slice(2);
const speeds = [];
let canvas = null;
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--speed') {
    const [from, to, factor] = rest[++i].split(':').map(Number);
    speeds.push({ from, to, factor });
  }
  // --canvas 2560x1440：把样机等比缩放后居中放到统一画布上，多段不同设备才能拼成一条视频。
  if (rest[i] === '--canvas') {
    const [w, h] = rest[++i].split('x').map(Number);
    canvas = { w, h };
  }
}

const OUT = path.resolve('scripts/demo-video/out');
const take = JSON.parse(readFileSync(path.join(OUT, `${name}.take.json`), 'utf8'));
const frames = take.frames;

// 每帧时长 = 到下一帧的真实间隔；落在加速段里的按倍率缩短。
// 太密的帧（加速后 < 1/30 s）直接丢掉，避免 concat 里出现几毫秒的碎帧。
const lines = ['ffconcat version 1.0'];
let carried = 0;
for (let i = 0; i < frames.length; i++) {
  const at = frames[i].at;
  const next = i + 1 < frames.length ? frames[i + 1].at : at + 3; // 末帧定格 3 秒
  let duration = next - at;
  const seg = speeds.find((s) => at >= s.from && at < s.to);
  if (seg) duration /= seg.factor;
  duration += carried;
  if (duration < 1 / 30 && i + 1 < frames.length) { carried = duration; continue; }
  carried = 0;
  lines.push(`file '${frames[i].file}'`, `duration ${duration.toFixed(4)}`);
}
lines.push(`file '${frames[frames.length - 1].file}'`);
const listFile = path.join(OUT, `${name}.concat.txt`);
writeFileSync(listFile, lines.join('\n'));

const isPhone = frame.startsWith('phone');
const asset = path.join(OUT, 'assets', `${frame}.png`);
const output = path.join(OUT, `${name}.mp4`);

// 截图是 JPEG 全范围色、拉伸过的边带还会带上奇怪的像素宽高比，最后统一归一到 tv 色域和 1:1。
// 手机：内容 1170×2532（安全区留白由录制时注入的 CSS 负责），直接嵌进屏幕区再叠外框。
// 电脑：内容 2160×1350，直接嵌进屏幕区。
const device = isPhone ? { w: 1290, h: 2652, ox: 60, oy: 60 } : { w: 2268, h: 1548, ox: 54, oy: 54 };
const CANVAS_BG = '#eef4f2';
const fit = canvas
  ? `,scale=-2:'min(${canvas.h - 120},ih)':flags=lanczos,pad=${canvas.w}:${canvas.h}:(ow-iw)/2:(oh-ih)/2:${CANVAS_BG}`
  : '';
const filter = [
  `[0:v]pad=${device.w}:${device.h}:${device.ox}:${device.oy}:black[screen]`,
  `[screen][1:v]overlay=0:0:format=auto:shortest=1${fit},fps=30,scale=in_range=pc:out_range=tv,format=yuv420p,setsar=1[v]`,
].join(';');

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-stats',
  '-f', 'concat', '-safe', '0', '-i', listFile,
  '-loop', '1', '-i', asset,
  '-filter_complex', filter, '-map', '[v]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-level', '5.1', '-movflags', '+faststart',
  output,
], { stdio: 'inherit' });

const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height', '-of', 'csv=p=0', output]).toString().trim();
console.log(`${output}\n${probe}`);
