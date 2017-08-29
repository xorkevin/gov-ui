const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
  target: 'web',

  context: path.resolve(__dirname, 'src'),
  entry: {
    main: 'main.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader'},
      {test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: "css-loader", options: {minimize: true}},
            {loader: "sass-loader"},
          ]
        }),
      },
    ]
  },

  plugins: [
    new CleanPlugin(['bin']),
    new HtmlPlugin({
      title: 'Nuke',
      filename: 'index.html',
      inject: 'head',
      template: 'index.html',
    }),
    new ScriptExtHtmlPlugin({
      defaultAttribute: 'defer',
    }),
    new ExtractTextPlugin('static/[name].[contenthash].css'),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({name: 'runtime'}),
  ],

  output: {
    path: path.resolve(__dirname, 'bin'),
    publicPath: '/',
    filename: 'static/[name].[chunkhash].js',
    chunkFilename: 'static/[name].[chunkhash].js',
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
