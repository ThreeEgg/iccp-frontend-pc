const withLess = require("@zeit/next-less");
const withCss = require("@zeit/next-css");
const lessToJS = require('less-vars-to-js');
const withPlugins = require("next-compose-plugins");
const path = require('path');
const fs = require('fs');

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/antd-custom-theme.less'), 'utf8')
)

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => { }
}

module.exports = withPlugins([withLess, withCss], {
  lessLoaderOptions: {//如果是antd就需要，antd-mobile不需要
    javascriptEnabled: true,
    modifyVars: themeVariables
  },
  // distDir: 'build',
  generateEtags: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  webpack(config) {
    if (config.externals) {
      const includes = [/antd/];
      config.externals = config.externals.map(external => {
        if (typeof external !== 'function') return external;
        return (ctx, req, cb) => {
          return includes.find(include =>
            req.startsWith('.')
              ? include.test(path.resolve(ctx, req))
              : include.test(req)
          )
            ? cb()
            : external(ctx, req, cb);
        };
      });
    }
    return config;
  }
});