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

const esmpaths = (names) => {
  return names.map((name) => path.resolve(__dirname, `node_modules/${name}`));
};

const govuiDeps = [
  'core-js',
  'react',
  'react-router-dom',
  '@xorkevin/substation',
  '@xorkevin/turbine',
  '@xorkevin/nuke',
  'qrcode',
];

const esModules = [
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
          include: [
            ...esmpaths(esModules),
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../index.js'),
            path.resolve(__dirname, 'src'),
          ],
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
          test: /\.(ttf|otf|woff|woff2|svg|eot)/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name].[contenthash][ext]',
          },
        },
      ],
    },

    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [new TerserPlugin()],
    },

    plugins: [
      new HtmlPlugin({
        title: 'Nuke',
        filename: 'index.html',
        inject: 'body',
        template: 'template/index.html',
      }),
      new ExtractTextPlugin({
        filename: 'static/[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [{from: 'public'}],
      }),
    ],

    output: {
      path: path.resolve(__dirname, 'bin'),
      publicPath: '/',
      filename: 'static/[name].[contenthash].js',
    },

    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },

    devtool: 'source-map',

    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      compress: true,
      host: '0.0.0.0',
      port: 3000,
      disableHostCheck: true,
      historyApiFallback: {
        disableDotRule: true,
      },
      hot: false,
      proxy: {
        '/api': {
          target: 'http://governor.dev.localhost:8080',
          changeOrigin: true,
        },
        '/.well-known': {
          target: 'http://governor.dev.localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };

  if (argv.mode === 'development') {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('/api'),
        COURIERBASE_URL: JSON.stringify(
          'http://go.governor.dev.localhost:8080',
        ),
      }),
    );
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('/api'),
        COURIERBASE_URL: JSON.stringify(
          'http://go.governor.dev.localhost:8080',
        ),
      }),
    );
  }

  return config;
};

module.exports = createConfig;
