const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let libraryName = 'mailsac',
  plugins = [new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })],
  outputFile;

if (yargs.argv.p) {
  plugins.push(new UglifyJsPlugin({sourceMap: true}));
  // plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, sourceMap: true}));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  target: 'node',
  node: {
    process: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }, {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: true,
              failOnHint: true
            }
          }
        ],
        enforce: 'pre',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: plugins
};
