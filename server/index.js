const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { createProxyMiddleware } = require('http-proxy-middleware');

const devProxy = {
  '/api': {
    target: 'http://221.215.57.110:9090', // 端口自己配置合适的
    // pathRewrite: {
    //     '^/api': '/'
    // },
    changeOrigin: true,
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
