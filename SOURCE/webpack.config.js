const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: './client/webpack.scripts.js',
  output: {
    path: path.join(__dirname, 'public/javascripts'),
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    }]
  }
};
