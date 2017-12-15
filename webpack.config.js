const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');

let libraryName = 'mailsac',
  plugins = [],
  outputFile;

if (yargs.argv.p) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, sourceMap: true}));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
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
    extensions: [".tsx", ".ts", ".js"]
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
