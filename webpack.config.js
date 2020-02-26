const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/index.ts'
  },
  mode: 'production',
  resolve: {
    symlinks: false,
    extensions: ['.js', '.json', '.ts'],
    plugins: [new TsConfigPathsPlugin()]
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  target: 'node',
  module: {
    rules: [{ test: /\.ts(x?)$/, include: path.resolve(__dirname, 'src'), loader: 'ts-loader' }]
  }
};
