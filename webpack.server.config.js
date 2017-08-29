const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'node',

  context: path.resolve(__dirname, 'src'),
  entry: {
    render: 'render.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
    ]
  },

  plugins: [
    new CleanPlugin(['bin_server']),
    new webpack.IgnorePlugin(/\.s?css$/)
  ],

  output: {
    path: path.resolve(__dirname, 'bin_server'),
    publicPath: '/',
    filename: '[name].js',
  },
};
