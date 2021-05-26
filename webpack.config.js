const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    ui: "./src/entry.tsx",
    "record-e44f2b3": "./src/entry-record.ts",
    player: "./src/entry-player.ts",
    pdfviewer: "./src/entry-pdfviewer.js",
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
              // mozjpeg: {
              //     progressive: true,
              //     quality: 65
              // },
              // // optipng.enabled: false will disable optipng
              // optipng: {
              //     enabled: false,
              // },
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
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  plugins: [
    new webpack.EnvironmentPlugin(
      ["NODE_ENV"],
      ["ENDPOINT_GQL"],
      ["ENDPOINT_H5P"],
      ["ENDPOINT_TEST_ASSETS_S3"],
      ["ENDPOINT_WEBSOCKET"],
      ["APP_GIT_REV"],
      { "ENDPOINT_CMS": "https://kl2-test.kidsloop.net" },
    ),
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["ui"],
      template: "src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "player.html",
      chunks: ["player"],
      template: "src/player.html",
    }),
    new HtmlWebpackPlugin({
      filename: "pdfviewer.html",
      chunks: ["pdfviewer"],
      template: "src/pdfviewer.html",
    }),
  ],
  devServer: {
    host: "0.0.0.0",
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
        target: "https://live.kidsloop.net",
        changeOrigin: true,
      },
      "/assets": {
        target: "https://live.kidsloop.net",
        changeOrigin: true,
      },
      "/video": {
        target: "https://live.kidsloop.net",
        changeOrigin: true,
      },
      "/v1": {
        target: "https://kl2-test.kidsloop.net",
        changeOrigin: true,
      }
    },
    disableHostCheck: true,
  },
};
