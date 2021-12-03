const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

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
          use: ['babel-loader'],
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
      new ESLintPlugin(),
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
      new CompressionPlugin({
        test: /\.(html|js|css|json)(\.map)?$/,
        algorithm: 'gzip',
        compressionOptions: {level: 9},
        threshold: 0,
        minRatio: 0.95,
        filename: '[path][base].gz',
        deleteOriginalAssets: false,
      }),
      new CompressionPlugin({
        test: /\.(html|js|css|json)(\.map)?$/,
        algorithm: (input, _compressionOptions, cb) => {
          zlib.brotliCompress(
            input,
            {
              params: {
                [zlib.constants.BROTLI_PARAM_MODE]:
                  zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                [zlib.constants.BROTLI_PARAM_SIZE_HINT]:
                  Buffer.byteLength(input),
              },
            },
            cb,
          );
        },
        threshold: 0,
        minRatio: 0.95,
        filename: '[path][base].br',
        deleteOriginalAssets: false,
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
      static: {
        directory: 'public',
        watch: true,
      },
      compress: true,
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: 'all',
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
