# 构建缓存（可随时删除重建，不进 git）

PPT 构建的 disposable 中间产物（渲染图、inspect JSON、一次性脚本）统一放这里，根 `.gitignore` 已忽略 `.ppt-build/` 与 `.codex-ppt-overview/`。目录可整体删除，用 `路演/PPT/build.sh --preview` 重建预览。
