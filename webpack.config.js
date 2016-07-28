'use strict';

import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  name: 'app',
  //target: 'node',
  entry: {
    vendor: [
      'jquery', 
      'lodash', 
      'bootstrap', 
      'react', 
      'react-dom', 
      'react-redux', 
      'redux', 
      'iscroll/build/iscroll-probe.js', 
      'superagent',
      'markdown-it'
    ],
    index: './frontend/index.js',
    post: './frontend/post.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].min.js',
    publicPath: '../'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  externals: {
    $: 'jquery'
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx|es6)$/,
        loader: 'eslint',
        include: [path.resolve(__dirname, 'frontend')],
        exclude: /node_modules/
      },
    ],
    loaders: [
      {
        test: /\.(js|jsx|es6)?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0', 'react'],
          //plugins: ['transform-runtime']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap!' + 'autoprefixer-loader'
        )
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap&-restructuring!' + 'autoprefixer-loader!' + 'sass?sourceMap'
        )
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?mimetype=image/png&limit=20000&name=img/[sha512:hash:base64:7].[ext]'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?importLoaders=1&limit=1000&name=fonts/[name].[ext]'
      },
        
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
    new ExtractTextPlugin('css/[name].min.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ],
  //devtool: 'source-map'
}