const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',

  context: path.resolve(__dirname, 'src'),
  entry: {
    render: ['babel-polyfill', 'isomorphic-fetch', 'render.js'],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
    ]
  },

  output: {
    path: path.resolve(__dirname, 'bin_server'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
};
