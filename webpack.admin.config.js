const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractScss = new ExtractTextPlugin('static/[name].[contenthash].css');

const createConfig = (env, argv) => {
  const config = {
    target: 'web',

    context: path.resolve(__dirname, 'src'),
    entry: {
      admin: ['babel-polyfill', 'adminmain.js'],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      },
    },
    module: {
      rules: [
        {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
        {
          test: /\.s?css$/,
          use: extractScss.extract({
            use: [
              {loader: 'css-loader', options: {minimize: true}},
              {loader: 'sass-loader'},
            ],
          }),
        },
        {
          test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
          use: {
            loader: 'file-loader',
            options: {
              name: '/[name].[hash].[ext]',
              outputPath: 'static/fonts',
            },
          },
        },
      ],
    },

    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new HtmlPlugin({
        title: 'Nuke',
        filename: 'index.html',
        inject: 'body',
        template: '../template/admin.html',
      }),
      extractScss,
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({resource}) => /node_modules/.test(resource),
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime',
        filename: 'static/runtime.[hash].js',
      }),
      new CopyPlugin([
        {
          from: '../public',
        },
      ]),
    ],

    output: {
      path: path.resolve(__dirname, 'bin_admin'),
      publicPath: '/',
      filename: 'static/[name].[chunkhash].js',
      chunkFilename: 'static/chunk.[id].[chunkhash].js',
    },

    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },

    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      compress: true,
      host: '0.0.0.0',
      port: 3001,
      disableHostCheck: true,
      historyApiFallback: true,
    },
  };

  if (env && env.development) {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('http://localhost:8080/api'),
      }),
    );
    config.entry.admin.push('preact/devtools');
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('/api'),
      }),
    );
    //config.plugins.push(new BundleAnalyzer({analyzerMode: 'static', openAnalyzer: true}));
  }

  return config;
};

module.exports = createConfig;
