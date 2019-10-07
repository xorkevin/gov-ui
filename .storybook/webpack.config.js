const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const createConfig = ({config}) => {
  (config.context = path.resolve(__dirname, '../src')),
    (config.resolve.modules = [
      path.resolve(__dirname, '../src'),
      'node_modules',
    ]);

  config.module.rules = config.module.rules.filter(
    (i) => !i.test.test('.css') && !i.test.test('.ttf'),
  );

  config.module.rules.push({
    test: /\.s?css$/,
    use: [
      ExtractTextPlugin.loader,
      {loader: 'css-loader'},
      {loader: 'sass-loader'},
    ],
  });
  config.module.rules.push({
    test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'static/fonts/',
        // required because otherwise path becomes static/static/fonts
        publicPath: 'fonts/',
      },
    },
  });

  config.plugins.push(
    new ExtractTextPlugin({
      filename: 'static/[name].[contenthash].css',
      chunkFilename: 'static/chunk.[name].[contenthash].css',
    }),
  );
  config.plugins.push(
    new CopyPlugin([
      {
        from: '../public',
      },
    ]),
  );
  config.plugins.push(
    new webpack.DefinePlugin({
      APIBASE_URL: JSON.stringify('http://localhost:8080/api'),
      COURIERBASE_URL: JSON.stringify('http://localhost:8080/link'),
    }),
  );

  return config;
};

module.exports = createConfig;
