#!/usr/bin/env bash
# 拉取最新行情 → 构建 HTML → 输出到 docs/（供 GitHub Pages 部署）
set -euo pipefail
cd "$(dirname "$0")"

echo "==> 拉取行情快照"
python3 fetch-quotes.py

echo "==> 构建页面"
python3 build-stock-html.py

echo ""
echo "完成。可部署目录: docs/"
echo "  本地预览: python3 -m http.server 8080  →  http://localhost:8080/docs/"
echo "  GitHub Pages: 推送仓库后在 Settings → Pages 选择 main 分支 /docs 文件夹"
