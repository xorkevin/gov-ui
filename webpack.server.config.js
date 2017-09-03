const path = require('path');
const webpack = require('webpack');

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
      {test: /\.s?css$/, loader: 'ignore-loader'},
      {test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/, loader: 'ignore-loader'},
    ]
  },

  output: {
    path: path.resolve(__dirname, 'bin_server'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
};
