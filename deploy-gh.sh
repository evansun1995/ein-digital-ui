#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/evansun1995/ein-digital-ui.git  master:docs

# cd -
# 执行bash命令防止窗口自动关闭
exec /bin/bash