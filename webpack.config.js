const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

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
    new HtmlPlugin({
      title: 'Nuke',
      filename: 'index.html',
      inject: 'body',
      template: 'index.html',
    }),
    extractScss,
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

module.exports = config;
