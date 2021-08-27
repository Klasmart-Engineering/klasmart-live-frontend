const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    ui: "./src/entry-cordova.tsx",
    record: "./src/entry-record.ts",
    player: "./src/entry-player.ts",
    pdfviewer: "./src/entry-pdfviewer.js",
    h5presize: "./src/entry-h5p-resize.js",
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
      ["APP_GIT_REV"],
      ["DISABLE_BROWSER_GUIDE"],
      ["DISABLE_SCREEN_SHARE"],
      ["USE_TEST_TOKEN"],
      ["WEBRTC_DEVICE_HANDLER_NAME"],
      ["CUSTOM_UA"]
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
    new HtmlWebpackPlugin({
      filename: "pdfviewer.html",
      chunks: ["pdfviewer"],
      template: "src/pdfviewer.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: "node_modules/pdfjs-dist/cmaps",
        to: "cmaps/"
      }, {
        from: "node_modules/pdfjs-dist",
        to: "pdfjs-dist/"
      }]
    })
  ],
};
