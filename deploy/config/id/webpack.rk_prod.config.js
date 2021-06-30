const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SentryWebpackPlugin = require("@sentry/webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { loadBrandingOptions } = require(`kidsloop-branding`);
require('dotenv').config();

const brandingOptions = loadBrandingOptions("RUMAH_KISAH");

module.exports = {
  mode: 'production',
  entry: {
    ui: './src/entry.tsx',
    "record-1db5341": './src/entry-record.ts',
    player: './src/entry-player.ts',
    pdfviewer: './src/entry-pdfviewer.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader'
          },
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
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
                quality: [0.65, 0.90],
                speed: 4
              },
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          "file-loader",
        ],
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: { ...brandingOptions.webpack.resolve.alias }
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      "CALLSTATS_ENABLE": "TRUE",
      "BRAND": "RUMAH_KISAH",
      "ENDPOINT_API": "https://api.rumahkisah.net",
      "ENDPOINT_HUB": "https://hub.rumahkisah.net",
      "ENDPOINT_CMS": "https://cms.rumahkisah.net",
      "ENDPOINT_PDF": "https://live.kidsloop.net",
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['ui'],
      template: 'src/index.html',
      ...brandingOptions.webpack.html,
    }),
    new HtmlWebpackPlugin({
      filename: 'player.html',
      chunks: ['player'],
      template: 'src/player.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'pdfviewer.html',
      chunks: ['pdfviewer'],
      template: 'src/pdfviewer.html',
    }),
    new SentryWebpackPlugin({
      include: ".",
      ignoreFile: ".sentrycliignore",
      ignore: ["node_modules", "webpack.config.js", "webpack.prod.config.js"],
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/pdfjs-dist/cmaps',
        to: 'cmaps/'
      }, {
        from: 'node_modules/pdfjs-dist',
        to: 'pdfjs-dist/'
      }]
    }),
  ]
}