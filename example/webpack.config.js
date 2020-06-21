const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const aliasModules = (names) => {
  return Object.fromEntries(
    names.map((name) => [
      name,
      path.resolve(__dirname, `node_modules/${name}`),
    ]),
  );
};

const govuiDeps = [
  'core-js',
  'react',
  'react-router-dom',
  '@xorkevin/substation',
  '@xorkevin/turbine',
  '@xorkevin/nuke',
];

const createConfig = (env, argv) => {
  const config = {
    target: 'web',

    context: path.resolve(__dirname, 'src'),
    entry: {
      main: ['main.js'],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        ...aliasModules(govuiDeps),
        '@xorkevin/gov-ui': path.resolve(__dirname, '..'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.s?css$/,
          use: [
            ExtractTextPlugin.loader,
            {loader: 'css-loader'},
            {loader: 'sass-loader'},
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'static/fonts/',
            },
          },
        },
      ],
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
        }),
      ],
    },

    plugins: [
      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'blake2b512',
        hashDigest: 'base64',
        hashDigestLength: 8,
      }),
      new HtmlPlugin({
        title: 'Nuke',
        filename: 'index.html',
        inject: 'body',
        template: 'template/index.html',
      }),
      new ExtractTextPlugin({
        filename: 'static/[name].[contenthash].css',
        chunkFilename: 'static/chunk.[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [{from: 'public'}],
      }),
    ],

    output: {
      path: path.resolve(__dirname, 'bin'),
      publicPath: '/',
      filename: 'static/[name].[hash].js',
      chunkFilename: 'static/chunk.[name].[chunkhash].js',
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
      port: 3000,
      disableHostCheck: true,
      historyApiFallback: true,
    },
  };

  if (argv.mode === 'development') {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('http://governor.dev.home:8080/api'),
        COURIERBASE_URL: JSON.stringify('http://go.governor.dev.home:8080'),
      }),
    );
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('/api'),
        COURIERBASE_URL: JSON.stringify('http://go.governor.dev.home:8080'),
      }),
    );
  }

  return config;
};

module.exports = createConfig;
