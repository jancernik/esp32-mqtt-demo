const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      BROKER_URL: JSON.stringify('ws://broker.emqx.io:8083/mqtt')
    }),
  ],
  devServer: {
    watchFiles: ["./src/*"],
    port: 3000,
    open: true,
    hot: true,
  },
});
