const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MD5Hash = require('webpack-md5-hash');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractScss = new ExtractTextPlugin('static/[name].[contenthash].css');

const config = {
  target: 'web',

  context: path.resolve(__dirname, 'src'),
  entry: {
    main: 'main.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    }
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.s?css$/,
        use: extractScss.extract({
          use: [
            {loader: 'css-loader', options: {minimize: true}},
            {loader: 'sass-loader'},
          ]
        }),
      },
      {test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        use: {loader: 'file-loader', options: {
          name: '/[name].[hash].[ext]',
          outputPath: 'static/fonts',
        }},
      },
    ]
  },

  plugins: [
    new MD5Hash(),
    new HtmlPlugin({
      title: 'Nuke',
      filename: 'index.html',
      inject: 'body',
      template: '../template/index.html',
    }),
    extractScss,
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({name: 'runtime'}),
    new webpack.optimize.CommonsChunkPlugin({children: true, minChunks: 2}),
    //new BundleAnalyzer({openAnalyzer: false}),
  ],

  output: {
    path: path.resolve(__dirname, 'bin'),
    publicPath: '/',
    filename: 'static/[name].[chunkhash].js',
    chunkFilename: 'static/[id].[chunkhash].js',
  },


  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
};

module.exports = config;
