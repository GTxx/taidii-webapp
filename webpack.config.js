var path = require('path');


var config = {
  entry:[
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'app/main.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css'},
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};

module.exports = config;
