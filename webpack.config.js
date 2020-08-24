var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js'
  ],
  output: {
    filename: 'vue-gtm.min.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: [ '.js', '.json' ]
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        },
        exclude: /node_modules/
      }
    ]
  }
}
