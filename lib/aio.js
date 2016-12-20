var serveStatic = require('serve-static');
var mockServer = require('../mock-server');
var config = require('./arguments');
var path = require('path');
var app = require('connect')();
var epp = require('easy-pipe-proxy');

var ENV = process.env.NODE_ENV || process.env.BABEL_ENV;

/**
 * 透明代理
 */
var proxy = new epp(config.proxy);
app.use(config.proxy.router,proxy.pipe());

if (['hot','test','dev'].indexOf(ENV) !== -1) {
  var webpack = require('webpack');
  var webpackConfig = require('../webpack.config.js');
  var devMiddleware = require('webpack-dev-middleware');
  var hotMiddleware = require('webpack-hot-middleware');
  // init webpack
  var wpconfig = webpackConfig(ENV);
  var compiler = webpack(wpconfig);
  var fileMap = {};
  compiler.plugin('done',(stats) => {
    fileMap = stats.toJson().assetsByChunkName;
    for (k in fileMap) {
      if ( '[object Array]'=== Object.prototype.toString.call(fileMap[k])) {
        fileMap[k] = fileMap[k][0]
      }
    }
  })

  var jade = require('jade');
  app.use((req, resp, next) =>{
    var match = req.url.match(/^\/(\w+)\/index.html(\b.+)?$/)
    if (match) {
      var file = path.join(__dirname, '../src/stage', match[1], 'index.jade');
      var templateFunc = jade.compileFile(file, {pretty: true});
      resp.end(templateFunc({__filemap: fileMap}));
    } else {
      next();
    }
  });

  app.use('/mock',mockServer);
  app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: wpconfig.output.publicPath
  }));
  app.use(hotMiddleware(compiler));
  app.use(serveStatic(path.join(__dirname,'../src/stage')));

} else {
  var assets = path.join(`${__dirname}`, '../dist');
  app.use(serveStatic(assets));
}

app.listen(config.port,() => {
  console.log(`listening on ${config.port}`);
});
