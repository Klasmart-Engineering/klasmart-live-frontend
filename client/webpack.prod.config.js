const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const output_file_name = 'bundle.[chunkhash].js'

module.exports = {
    mode: 'production',
    entry: ['./src/client-entry.tsx'],
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ],
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
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.mp4$/,
                use: 'file-loader?name=videos/[name].[ext]',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    output: {
        filename: output_file_name,
        chunkFilename: output_file_name,
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index_prod.html',
        }),
        new webpack.ProvidePlugin({
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
        new Visualizer({ filename: '../webpack-stats.html' }),
        new webpack.EnvironmentPlugin({
            "STAGE": "prod",
            "CALM_ORG_ID": "CALM-ISLAND",
            "ASSESSMENT_ENDPOINT": "https://seoul.assessment-api.badanamu.net/",
            "DEFAULT_PROG_ID": "KIDSLOOP-2.0"
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 32 * 1024,
            maxSize: 128 * 1024,
            minChunks: 1,
            name: false,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
    },
    devServer: {
        host: "0.0.0.0",
    },
};