#!/usr/bin/env node
// MindBridge 语音合成：小米 MiMo 预置音色，只做最简单的事——
// 文本进，wav 出。克隆/定制等复杂模式去隔壁 ssnoir 的 tools/mimo-tts。
//
// 用法：
//   node scripts/mimo-tts.mjs --voice 茉莉 --text '坐着，或者站着，都可以。' --out /tmp/molly.wav
//   node scripts/mimo-tts.mjs --voice 白桦 --text-file ./lines.txt --out /tmp/bohua.wav \
//     --direction '语速慢、平稳，像朋友说话，不要播音腔'
//
// key 顺序：MIMO_API_KEY 环境变量 → 本机 Keychain（与 ssnoir 共用同一条目，
// service com.ssnoir.mimo-tts.api-key，只读不写）。key 绝不打印、不入库。
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const API_URL = 'https://api.xiaomimimo.com/v1/chat/completions';
const MODEL = 'mimo-v2.5-tts';
// MiMo V2.5 官方内置预置音色（与 ssnoir 那份一致）。
const VOICES = {
  '冰糖': '中文/活泼少女', '茉莉': '中文/知性女声', '苏打': '中文/阳光少年', '白桦': '中文/成熟男声',
  'Mia': '英文/女', 'Chloe': '英文/女', 'Milo': '英文/男', 'Dean': '英文/男',
};

const fail = message => { console.error(`错误：${message}`); process.exit(1); };

const args = process.argv.slice(2);
const get = name => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
};
const voice = get('--voice');
const out = get('--out');
const direction = get('--direction') || '';
const dryRun = args.includes('--dry-run');
let text = get('--text');
const textFile = get('--text-file');

if (!voice || !VOICES[voice]) fail(`--voice 必须是预置音色之一：${Object.keys(VOICES).join('、')}`);
if (textFile) text = readFileSync(textFile, 'utf8');
if (!text || !text.trim()) fail('文本为空（--text 或 --text-file）');
if (!out) fail('必须指定 --out 输出路径');

const loadKey = () => {
  if (process.env.MIMO_API_KEY?.trim()) return process.env.MIMO_API_KEY.trim();
  try {
    const key = execFileSync('security', [
      'find-generic-password', '-a', 'SSNoir MiMo TTS',
      '-s', 'com.ssnoir.mimo-tts.api-key', '-w',
    ], { encoding: 'utf8' }).trim();
    if (key) return key;
  } catch { /* 无 Keychain 条目就走报错 */ }
  fail('找不到 key：设置 MIMO_API_KEY，或在 Keychain 建 service「com.ssnoir.mimo-tts.api-key」/ account「SSNoir MiMo TTS」的通用密码项');
};

const messages = [{ role: 'assistant', content: text }];
if (direction) messages.unshift({ role: 'user', content: direction });

const payload = { model: MODEL, messages, audio: { format: 'wav', voice } };
console.log(`音色：${voice}（${VOICES[voice]}）· 正文 ${text.length} 字 → ${out}`);
if (dryRun) { console.log(JSON.stringify({ ...payload, messages: `[${messages.length} 条]` })); process.exit(0); }

const response = await fetch(API_URL, {
  method: 'POST',
  headers: { 'api-key': loadKey(), 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
if (!response.ok) fail(`API 返回 HTTP ${response.status}：${(await response.text()).slice(0, 300)}`);
const data = await response.json();
const b64 = data?.choices?.[0]?.message?.audio?.data;
if (!b64) fail('响应里没有音频数据');
const bytes = Buffer.from(b64, 'base64');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, bytes);
console.log(`已生成：${out}（${bytes.length} bytes）`);
