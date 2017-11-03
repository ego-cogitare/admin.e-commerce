const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.jsx',
  output: {
    path: "public",
    filename: 'app.js'
  },
  devtool: null,
  module: {
    loaders: [
      {
        test : /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'react-html-attrs'
          ]
        }
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=images/[name].[ext]"
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ['.js', ''],
    alias: {
      config: path.resolve(__dirname, './src/config/config.dev'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({ config: 'config' }),
    new HtmlWebpackPlugin({
      title: 'Admin panel',
      inject: false,
      template: 'src/staticFiles/index.ejs',
      externalSources: {
        css: [
          './vendors/font-awesome/css/font-awesome.min.css',
          './vendors/bootstrap/dist/css/bootstrap.min.css',
          './vendors/datatable/media/css/dataTables.bootstrap.min.css',
          './vendors/select2/dist/css/select2.min.css',
          './vendors/trumbowyg/dist/ui/trumbowyg.min.css',
          './vendors/trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css',
        ],
        js: [
          './vendors/jquery/jquery.min.js',
          './vendors/bootstrap/dist/js/bootstrap.min.js',
          './vendors/datatable/media/js/jquery.dataTables.min.js',
          './vendors/datatable/media/js/dataTables.bootstrap.min.js',
          './vendors/select2/dist/js/select2.full.min.js',
          './vendors/trumbowyg/dist/trumbowyg.min.js',
          './vendors/trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js',
        ]
      }
    })
  ]
};
