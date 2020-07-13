const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    ui: './src/entry.tsx',
    record: './src/entry-record.ts',
    player: './src/entry-player.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
              },
          ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['ui'],
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'player.html',
      chunks: ['player'],
      template: 'src/player.html'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      },
      '/h5p': {
        target: 'https://zoo.kidsloop.net',
        changeOrigin: true
      }
    },
    disableHostCheck: true
  }
}
