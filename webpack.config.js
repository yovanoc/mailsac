const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/index.ts',
  devtool: 'source-map',
  target: "web",
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
    extensions: [".config.js", ".web.js", ".js", ".ts", ".tsx"]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "mailsac.js",
    library: "mailsac",
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  }
};
