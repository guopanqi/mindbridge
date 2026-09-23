#!/usr/bin/env bash
# 用法: ./build.sh deck脚本/08_决赛夺冠版_17页.js [--preview]
# 生成 pptx 到 成品/；加 --preview 时再转 PDF、渲染每页 jpg 与拼图到 预览/<脚本名>/
set -e
cd "$(dirname "$0")"
SCRIPT="$1"; [ -f "$SCRIPT" ] || { echo "用法: $0 deck脚本/xx.js [--preview]"; exit 1; }
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
OUT=$(node "$SCRIPT" | sed -n 's/^saved //p; /\.pptx$/p' | tail -1)
echo "生成: $OUT"
if [ "$2" = "--preview" ]; then
  NAME=$(basename "$SCRIPT" .js); DIR="预览/$NAME"; rm -rf "$DIR"; mkdir -p "$DIR"
  soffice --headless --convert-to pdf --outdir "$DIR" "$OUT" >/dev/null
  pdftoppm -jpeg -r 60 "$DIR"/*.pdf "$DIR/slide"
  python3 - "$DIR" <<'PY'
import sys, glob; from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(f"{d}/slide-*.jpg"), key=lambda f:int(f.rsplit('-',1)[1][:-4]))
ims=[Image.open(f) for f in fs]; w,h=ims[0].size; c=3; r=(len(ims)+c-1)//c
m=Image.new("RGB",(w*c,h*r),"white")
for i,im in enumerate(ims): m.paste(im,((i%c)*w,(i//c)*h))
m.save(f"{d}/montage.jpg",quality=80); print("预览:", f"{d}/montage.jpg", f"({len(ims)} 页)")
PY
fi
