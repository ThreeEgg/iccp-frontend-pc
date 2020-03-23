# 国际风险管理平台 ICCP - PC 网页端

## TODOs

[ ] CDN 配置 [ ] OSS 集成

## 工程化

### 代码质量配置

`eslint`、`prettier`、`stylelint`均使用`@umijs/fabric`库做出的规范，与`ant.design pro`项目模板保持一致

### 部署

- 测试环境页面访问地址：http://172.16.110.5:1993/
- 端口自定义 配置环境变量`PORT`
- 测试环境脚本，仅同步代码使用：deploy-test.sh
- 使用`pm2`管理 server，运行`npm run pm2`启动，具体见`pm2.json`配置
- 部署各环境脚本: run.sh --env test

## Antd

### 主题定制

`src`目录下`antd-custom-theme.less`文件

### 按需加载

参考以下两篇文章已完成配置

> https://www.cnblogs.com/1wen/p/10793868.html > https://www.jianshu.com/p/823537e79fa4

## DVA

> 参考该项目配置：https://github.com/smithyj/nextjs-dva-ssr

### 加载 Loading

使用`dva-loading`简化 loading 逻辑代码

## 国际化

使用`react-intl-universal`方案，特点主要是`修改语言需要刷新页面才能生效`，_临时方案_

## 人机校验

根据接口的全局错误码`600(待定)`，本地缓存判定应用处于 ip 受限状态。此时给应用弹出人机校验交互框，完成后校验后清除判定状态。

## 实现细节

### OSS 后续需要支持为私有读写

- 使用 oss sdk 对图片、文件进行签名，然后使用签名后的地址进行访问
- 考虑代码方便，考虑将相关资源全部放在同一路径下，对该路径进行签名，统一使用，可以减少签名调用次数
