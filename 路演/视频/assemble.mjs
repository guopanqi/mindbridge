// 把截图序列合成为带样机外框的 MP4。
// 用法：node 路演/视频/assemble.mjs A phone-941 [--speed from:to:factor ...] [--dark-from sec]
// --dark-from 用 mark 秒数：从这一刻起改叠 <frame>-dark.png（浅色状态栏），给深色的员工端用；之前（钉钉工作台）仍是深色字。
// speed 段用录制时的 mark 秒数表示，例如呼吸圆那 72 秒压到 12 秒：--speed 30.9:100.9:6
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [name, frame = 'phone-941', ...rest] = process.argv.slice(2);
const speeds = [];
const badges = [];
let canvas = null;
let darkFrom = null;
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--speed') {
    const [from, to, factor] = rest[++i].split(':').map(Number);
    speeds.push({ from, to, factor });
  }
  // --canvas 2560x1440：把样机等比缩放后居中放到统一画布上，多段不同设备才能拼成一条视频。
  if (rest[i] === '--dark-from') darkFrom = Number(rest[++i]);
  // --badge assets名:from:to —— 在成片的这段时间里叠一个小角标（如呼吸快进时的「已快进」）。
  // 时间用录制时的 mark 秒数，和 --speed 一样，内部会换算到加速后的输出时间轴。
  if (rest[i] === '--badge') {
    const [asset, from, to] = rest[++i].split(':');
    badges.push({ asset, from: Number(from), to: Number(to) });
  }
  if (rest[i] === '--canvas') {
    const [w, h] = rest[++i].split('x').map(Number);
    canvas = { w, h };
  }
}

// 读 JPEG 头里的宽高，不解码整张图。录制时偶尔会掉出一张差 1px 的截图，
// 而 concat 遇到尺寸变化会把整帧错位、把样机外框顶出画面，所以这种帧直接丢掉。
function jpegSize(file) {
  const buf = readFileSync(file);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return `${buf.readUInt16BE(i + 7)}x${buf.readUInt16BE(i + 5)}`;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return 'unknown';
}

const OUT = path.resolve('路演/视频/out');
const take = JSON.parse(readFileSync(path.join(OUT, `${name}.take.json`), 'utf8'));
const sizes = new Map();
for (const frame of take.frames) {
  const size = jpegSize(frame.file);
  sizes.set(size, (sizes.get(size) || 0) + 1);
}
const [mainSize] = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0];
const frames = take.frames.filter((frame) => jpegSize(frame.file) === mainSize);
if (frames.length !== take.frames.length) {
  console.log(`丢掉 ${take.frames.length - frames.length} 张尺寸异常的帧（主尺寸 ${mainSize}）`);
}

// 每帧时长 = 到下一帧的真实间隔；落在加速段里的按倍率缩短。
// 太密的帧（加速后 < 1/30 s）直接丢掉，避免 concat 里出现几毫秒的碎帧。
const lines = ['ffconcat version 1.0'];
let carried = 0;
let elapsed = 0; // 输出时间轴（加速后）
let darkAt = null;
for (const badge of badges) { badge.fromAt = null; badge.toAt = null; }
for (let i = 0; i < frames.length; i++) {
  const at = frames[i].at;
  if (darkFrom !== null && darkAt === null && at >= darkFrom) darkAt = elapsed;
  for (const badge of badges) {
    if (badge.fromAt === null && at >= badge.from) badge.fromAt = elapsed;
    if (badge.toAt === null && at >= badge.to) badge.toAt = elapsed;
  }
  const next = i + 1 < frames.length ? frames[i + 1].at : at + 3; // 末帧定格 3 秒
  let duration = next - at;
  const seg = speeds.find((s) => at >= s.from && at < s.to);
  if (seg) duration /= seg.factor;
  duration += carried;
  if (duration < 1 / 30 && i + 1 < frames.length) { carried = duration; continue; }
  carried = 0;
  elapsed += duration;
  lines.push(`file '${frames[i].file}'`, `duration ${duration.toFixed(4)}`);
}
lines.push(`file '${frames[frames.length - 1].file}'`);
const listFile = path.join(OUT, `${name}.concat.txt`);
writeFileSync(listFile, lines.join('\n'));

const isPhone = frame.startsWith('phone');
const asset = path.join(OUT, 'assets', `${frame}.png`);
const darkAsset = path.join(OUT, 'assets', `${frame}-dark.png`);
const output = path.join(OUT, `${name}.mp4`);

// 截图是 JPEG 全范围色、拉伸过的边带还会带上奇怪的像素宽高比，最后统一归一到 tv 色域和 1:1。
// 手机：内容 1170×2532（安全区留白由录制时注入的 CSS 负责），直接嵌进屏幕区再叠外框。
// 电脑：内容 2160×1350，直接嵌进屏幕区。
const device = isPhone ? { w: 1290, h: 2652, ox: 60, oy: 60 } : { w: 2268, h: 1548, ox: 54, oy: 54 };
const CANVAS_BG = '#eef4f2';
const fit = canvas
  ? `,scale=-2:'min(${canvas.h - 120},ih)':flags=lanczos,pad=${canvas.w}:${canvas.h}:(ow-iw)/2:(oh-ih)/2:${CANVAS_BG}`
  : '';
const useDark = darkAt !== null;
// 角标叠在样机外框之后，位置固定在内容区右上（状态栏下方一点）。
const badgeInputIndex = (useDark ? 3 : 2);
let last = useDark ? 's2' : 's1';
const badgeSteps = badges.map((badge, i) => {
  const from = (badge.fromAt ?? 0).toFixed(3);
  const to = (badge.toAt ?? 1e9).toFixed(3);
  const next = `b${i}`;
  const step = `[${last}][${badgeInputIndex + i}:v]overlay=W-w-${device.ox + 36}:${device.oy + 210}:format=auto:shortest=1:enable='between(t,${from},${to})'[${next}]`;
  last = next;
  return step;
});
const filter = [
  // 截图偶尔会差 1px（1170×2531），concat 遇到尺寸变化会把整帧错位、把样机外框顶出画面，
  // 所以 pad 之前先统一缩回内容尺寸。
  `[0:v]scale=${device.w - device.ox * 2}:${device.h - device.oy * 2}:flags=lanczos,pad=${device.w}:${device.h}:${device.ox}:${device.oy}:${CANVAS_BG}[screen]`,
  useDark
    ? `[screen][1:v]overlay=0:0:format=auto:shortest=1:enable='lt(t,${darkAt.toFixed(3)})'[s1]`
    : `[screen][1:v]overlay=0:0:format=auto:shortest=1[s1]`,
  useDark ? `[s1][2:v]overlay=0:0:format=auto:shortest=1:enable='gte(t,${darkAt.toFixed(3)})'[s2]` : null,
  ...badgeSteps,
  `[${last}]null${fit},fps=30,scale=in_range=pc:out_range=tv,format=yuv420p,setsar=1[v]`,
].filter(Boolean).join(';');

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-stats',
  '-f', 'concat', '-safe', '0', '-i', listFile,
  '-loop', '1', '-i', asset,
  ...(useDark ? ['-loop', '1', '-i', darkAsset] : []),
  ...badges.flatMap((badge) => ['-loop', '1', '-i', path.join(OUT, 'assets', `${badge.asset}.png`)]),
  '-filter_complex', filter, '-map', '[v]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-level', '5.1', '-movflags', '+faststart',
  output,
], { stdio: 'inherit' });

const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height', '-of', 'csv=p=0', output]).toString().trim();
console.log(`${output}\n${probe}`);
