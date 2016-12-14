var path = require('path');
var webpack = require('webpack');
var compileMode = process.argv[3];

var webpackConfig = {
  entry: {
    home:['./src/stage/home/index']
  },
  output: {
    path: path.join(__dirname,'dist/static'),
    filename: '[name].[hash].js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.coffee']
  },
  plugins: [
    // 公共模块提取
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.[hash].js',
      minChunks: 2,
      chunks: ['home']
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [
    {
      test: /\.(js|jsx)$/,
      loader:'babel',
      exclude: /node_modules/
    },
    {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    },
    {
      test:/\.(png|jpg|jpeg|gif)$/,
      loader:'file-loader'
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }]
  }
};


var exportConfig = function (mode) {
  switch(mode){
    case 'hot':
      webpackConfig.devtool = 'cheap-eval-source-map';
      webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      // webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
      for (var prop in webpackConfig.entry ) {
        if (prop !== 'workerclient' && prop !== 'workerserver') {
          var entryItem = webpackConfig.entry[prop];
          entryItem.push('webpack-hot-middleware/client');
        }
      }
    break;
    case 'daily':
      webpackConfig.devtool = 'source-map';
    break;
    case 'pre':
      webpackConfig.devtool = 'source-map';
    break;
    case 'product':
      webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}));
      webpackConfig.plugins.push(new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}));
    break;
  }
  // console.log(webpackConfig.entry);
  return webpackConfig;
}

//webpack --mode release
if(compileMode === 'release'){
  exportConfig = exportConfig('product');
}

module.exports = exportConfig;
