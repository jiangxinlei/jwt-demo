const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackBar = require("webpackbar");
const path = require("path");

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...(process.env.NODE_ENV === "development"
        ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
        : [])
    ],
    alias: {
      "@": path.resolve(__dirname, '..', 'src')
    }
  },
  plugins: [
    {
      plugin: require("craco-antd"),
      options: {
        customizeTheme: {
            // "@primary-color": "#1DA57A"
        },
        lessLoaderOptions: {
            // noIeCompat: true
        }
      }
    }
  ],
  // devServer(devServerConfig) {
  //   // devServerConfig.proxy = {
  //   //   '/login': {
  //   //     target: 'http://localhost:3003',
  //   //     changeOrigin: true
  //   //   }
  //   // }
  //   return devServerConfig;
  // }
};
