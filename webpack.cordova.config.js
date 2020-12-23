const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    ui: "./src/entry-cordova.tsx",
    record: "./src/entry-record.ts",
    player: "./src/entry-player.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
          },
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: ["file-loader"],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.mp3$/i,
        loader: "file-loader",
        query: {
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts", ".css", ".ttf"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "www"),
    publicPath: "",
  },
  devtool: "source-map",
  plugins: [
    new webpack.EnvironmentPlugin(
      ["NODE_ENV"],
      ["APP_GIT_REV"],
      ["DISABLE_BROWSER_GUIDE"],
      ["DISABLE_SCREEN_SHARE"],
      ["USE_TEST_TOKEN"],
      ["WEBRTC_DEVICE_HANDLER_NAME"],
    ),
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["ui"],
      template: "src/index.cordova.html",
    }),
    new HtmlWebpackPlugin({
      filename: "player.html",
      chunks: ["player"],
      template: "src/player.cordova.html",
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    historyApiFallback: true,
    proxy: {
      "/graphql": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
      "/sfu": {
        target: "http://localhost:8002",
        changeOrigin: true,
        ws: true,
      },
      "/h5p": {
        target: "https://zoo.kidsloop.net",
        changeOrigin: true,
      },
      "/auth": {
        target: "https://prod.auth.badanamu.net/",
        changeOrigin: true,
        pathRewrite: { '^/auth': '' },
      },
      "/account": {
        target: "https://prod.account.badanamu.net/",
        changeOrigin: true,
        pathRewrite: { '^/account': '' },
      },
      "/v1": {
        target: "https://kl2-test.kidsloop.net/",
        secure: true,
        changeOrigin: true,
      },

    },
    disableHostCheck: true,
  },
};
