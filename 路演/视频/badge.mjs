// 生成合成阶段叠加用的小角标 PNG（ffmpeg 这台机器没有 drawtext，所以先画成图再 overlay）。
// 用法：node 路演/视频/badge.mjs "已快进 · 实际 3 分钟" out/assets/badge-fastforward.png
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [text = '已快进 · 实际 3 分钟', out = '路演/视频/out/assets/badge-fastforward.png'] = process.argv.slice(2);
const script = `
from PIL import Image, ImageDraw, ImageFont
text = ${JSON.stringify(text)}
font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 30)
pad_x, pad_y = 26, 14
probe = ImageDraw.Draw(Image.new('RGBA', (8, 8)))
box = probe.textbbox((0, 0), text, font=font)
w, h = box[2] - box[0] + pad_x * 2, box[3] - box[1] + pad_y * 2
img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, w - 1, h - 1], radius=h // 2, fill=(13, 26, 23, 216), outline=(238, 185, 108, 150), width=2)
d.text((pad_x - box[0], pad_y - box[1]), text, font=font, fill=(243, 217, 168, 255))
img.save(${JSON.stringify(path.resolve(out))})
print(img.size)
`;
console.log(execFileSync('python3', ['-c', script]).toString().trim(), '→', out);
