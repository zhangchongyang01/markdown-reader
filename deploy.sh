#!/bin/bash

# 构建项目
echo "开始构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "构建成功！"
    echo "构建文件位于 dist/ 目录"
    echo ""
    echo "部署说明："
    echo "1. 将 dist/ 目录的内容推送到 GitHub 仓库的 gh-pages 分支"
    echo "2. 在 GitHub 仓库设置中启用 GitHub Pages"
    echo "3. 选择 gh-pages 分支作为源"
    echo ""
    echo "访问地址将是：https://[username].github.io/markdown-reader/"
else
    echo "构建失败！"
    exit 1
fi
