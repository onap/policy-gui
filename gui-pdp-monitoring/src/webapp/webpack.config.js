const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/MonitoringMain.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      "/papservices/monitoring": "http://localhost:17999",
    }
  }
};
