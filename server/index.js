const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { createProxyMiddleware } = require('http-proxy-middleware');

const devProxy = {
  '/api': {
    target: 'http://221.215.57.110:9821', // 公网测试
    // target: 'http://172.16.1.161:8080', // 内网测试
    // target: 'http://221.215.57.110:9090', // 公网开发
    // target: 'http://172.16.110.5:9090', // 内网开发
    // pathRewrite: {
    //     '^/api': '/'
    // },
    changeOrigin: false,
  },
};

const port = process.env.PORT || 8090;

app
  .prepare()
  .then(() => {
    const server = express();

    if (dev && devProxy) {
      Object.keys(devProxy).forEach(function(context) {
        server.use(createProxyMiddleware(context, devProxy[context]));
      });
    }

    server.all('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
