var config = require('./package.json');

module.exports = {
  entry: './lib/index.js',

  output: {
    filename: './dist/' + config.name + '.js',
    library: config.name,
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  }
};