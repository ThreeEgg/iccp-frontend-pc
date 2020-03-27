# 参数的可选项
# $1 --env
# $2 test/online

# 运行示例: sh run.sh --env test

#! /bin/bash

if [ "$1" == "--env" ]; then
  if [ "$2" == "test" ]; then
    # 端口
    export PORT=8090
    # 环境
  # 线上
  elif [ "$2" == "online" ]; then
    echo "online"
  else
    echo "default"
  fi
fi

export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD

#使用淘宝镜像安装依赖包
npm install --registry=http://registry.npm.taobao.org

# 编译
npm run build

# pm2运行
# npm run pm2
