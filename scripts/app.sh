#!/usr/bin/env bash
# 统一应用入口；无参数只显示帮助，不默认发布。
set -euo pipefail
APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTION="${1:-help}"
TARGET="${2:-all}"
case "$ACTION" in
  help|-h|--help)
    echo "用法：bash scripts/app.sh <check|build|deploy|health|dev> [console|employee|all]"
    echo "deploy：校验、构建、发布 main、核对线上健康及静态资源；不迁移数据库或导入内容。"
    echo "dev 必须指定一个应用；其他命令默认 all。依赖首次用 npm ci 安装（根目录及各应用）。"
    exit 0 ;;
  check|build|deploy|health|dev) ;;
  *) echo "未知操作：$ACTION" >&2; exit 2 ;;
esac
case "$TARGET" in
  console|employee) TARGETS=("$TARGET") ;;
  all) TARGETS=(employee console) ;;
  *) echo "未知应用：$TARGET" >&2; exit 2 ;;
esac
if [[ "$ACTION" == dev && "$TARGET" == all ]]; then
  echo "dev 请指定 console 或 employee，在两个终端分别启动。" >&2
  exit 2
fi
cd "$APP_ROOT"
if [[ "$ACTION" == check || "$ACTION" == deploy ]]; then
  npm run check
  # all 模式下先让所有应用通过检查，再开始任何发布。
  for app in "${TARGETS[@]}"; do npm --prefix "apps/$app" run check; done
  [[ "$ACTION" != check ]] || exit 0
fi
for app in "${TARGETS[@]}"; do
  echo "[$ACTION] $app"
  case "$ACTION" in
    build) npm --prefix "apps/$app" run build ;;
    deploy)
      # 上面已执行 predeploy 的检查；直接使用已安装、锁定的 CLI，不临时下载最新版。
      (
        cd "apps/$app"
        project=mindbridge-console
        [[ "$app" != employee ]] || project=mindbridge-app
        node_modules/.bin/wrangler pages deploy public --project-name "$project" --branch main --commit-dirty=true
      )
      node scripts/app-health.mjs "$app" --verify-assets ;;
    health) node scripts/app-health.mjs "$app" ;;
    dev)
      npm --prefix "apps/$app" run build
      port=8789
      [[ "$app" != employee ]] || port=8788
      npm --prefix "apps/$app" run dev -- --port "$port" ;;
  esac
done
