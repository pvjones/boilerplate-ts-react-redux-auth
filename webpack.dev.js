const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')('dev')

module.exports = webpackMerge(commonConfig, {

  mode: 'development',

  devtool: '#cheap-module-eval-source-map',

  devServer: {
    contentBase: '../../dist/api/static/',
    historyApiFallback: true,
    stats: 'minimal',
  },

  output: {
    publicPath: 'http://localhost:3001/',
    filename: '[name].js',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify('dev'),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ],

})
