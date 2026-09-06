#!/usr/bin/env bash
# 将 `prototype/` 中的交互原型发布到 Cloudflare Pages。
# 用法：./scripts/deploy-prototype.sh
# 可选：./scripts/deploy-prototype.sh 其他-pages-项目名

set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "用法：./scripts/deploy-prototype.sh [Pages 项目名]"
  echo "默认项目名：mindbridge-demo"
  exit 0
fi

PROJECT_NAME="${1:-mindbridge-demo}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/prototype"

if ! command -v npx >/dev/null 2>&1; then
  echo "未找到 npx。请先安装 Node.js（建议 LTS 版本）。" >&2
  exit 1
fi

if [[ ! -f "$SITE_DIR/mindbridge-prototype.html" ]]; then
  echo "未找到演示原型文件：$SITE_DIR/mindbridge-prototype.html" >&2
  exit 1
fi

echo "正在发布到 Cloudflare Pages 项目：$PROJECT_NAME"
echo "发布目录：$SITE_DIR"

# npx 会按需运行 Wrangler，不会向这个项目写入 node_modules 或密钥。
exec npx --yes wrangler@latest pages deploy "$SITE_DIR" --project-name "$PROJECT_NAME"
