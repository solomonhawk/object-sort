var config = require('./package.json');

module.exports = {
  entry: './lib/index.js',

  cache: true,
  bail: false,
  debug: true,
  profile: true,
  devtool: 'eval',

  output: {
    pathInfo: true,
    path: './dist/',
    filename: config.name + '.js',
    library: config.name,
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  }
};
