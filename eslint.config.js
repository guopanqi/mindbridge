// 静态检查的目标很窄：挡住「改名之后漏改调用」「引用了不存在的变量」这一类。
// 这一轮真实踩到过两次（renderPost 未定义、resourceFeedback 端点参数不匹配），
// 都是跑起来才发现的，而它们本可以在提交前被拦下。
// 这里不引入风格规则，避免把一次可用性改进变成全仓格式化。
import js from '@eslint/js';

const browser = {
  document: 'readonly', window: 'readonly', fetch: 'readonly', console: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
  requestAnimationFrame: 'readonly', AbortController: 'readonly', Request: 'readonly',
  Response: 'readonly', URL: 'readonly', crypto: 'readonly', TextEncoder: 'readonly',
  TextDecoder: 'readonly', btoa: 'readonly', atob: 'readonly', matchMedia: 'readonly',
  localStorage: 'readonly', navigator: 'readonly', location: 'readonly', Event: 'readonly',
  CustomEvent: 'readonly', FormData: 'readonly', Headers: 'readonly', WebSocket: 'readonly',
  performance: 'readonly', structuredClone: 'readonly', queueMicrotask: 'readonly',
  URLSearchParams: 'readonly', AbortSignal: 'readonly', DOMException: 'readonly',
  ReadableStream: 'readonly', HTMLElement: 'readonly', Node: 'readonly',
};
const node = {
  process: 'readonly', console: 'readonly', Buffer: 'readonly', URL: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', fetch: 'readonly', crypto: 'readonly',
  TextEncoder: 'readonly', TextDecoder: 'readonly', Request: 'readonly', Response: 'readonly',
  __dirname: 'readonly', __filename: 'readonly', structuredClone: 'readonly',
};

export default [
  {
    // 构建产物、第三方 vendor 包、wrangler 临时目录都不是我们维护的代码。
    ignores: [
      '**/node_modules/**', '**/.wrangler/**', '**/public/app.js', '**/public/vendor/**',
      'prototype/**', 'PPT/**', 'docs/**',
    ],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      // __BUILD_ID__ 由 esbuild 在构建时替换，源码里没有声明。
      globals: { ...browser, ...node, __BUILD_ID__: 'readonly' },
    },
    rules: {
      ...js.configs.recommended.rules,
      // 未使用的变量按警告处理：它多半是清理没做干净，不是错误，
      // 不该让 lint 因此变红而失去「红了就一定有问题」的意义。
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['**/test/**/*.js', '**/scripts/**/*.mjs'],
    languageOptions: { globals: { ...node, ...browser } },
  },
];
