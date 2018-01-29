const path = require('path');
const webpack = require('webpack');

const createConfig = (env, argv) => {
  const config = {
    target: 'node',

    context: path.resolve(__dirname, 'src'),
    entry: {
      render: ['babel-polyfill', 'isomorphic-fetch', 'render.js'],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      },
    },
    module: {
      rules: [{test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}],
    },

    plugins: [],

    output: {
      path: path.resolve(__dirname, 'bin_server'),
      filename: '[name].js',
      libraryTarget: 'commonjs',
    },
  };

  if (env && env.development) {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('http://localhost:8080/api'),
      }),
    );
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        APIBASE_URL: JSON.stringify('/api'),
      }),
    );
  }

  return config;
};

module.exports = createConfig;
