const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    ui: "./src/entry.tsx",
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
  plugins: [
    new webpack.EnvironmentPlugin(
      ["NODE_ENV"],
      ["ENDPOINT_GQL"],
      ["ENDPOINT_SFU"],
      ["ENDPOINT_WEBSOCKET"],
      ["ENDPOINT_CONTENT"],
      ["APP_GIT_REV"],
      ["DISABLE_BROWSER_GUIDE"],
      ["DISABLE_SCREEN_SHARE"],
      ["USE_TEST_TOKEN"],
      ["WEBRTC_DEVICE_HANDLER_NAME"],
      ["ENDPOINT_KL2"],
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
};
