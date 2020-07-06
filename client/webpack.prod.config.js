const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Visualizer = require("webpack-visualizer-plugin");
const output_file_name = "bundle.[chunkhash].js";

module.exports = {
    mode: "production",
    entry: {
        hubui: "./src/client-entry.tsx",
        record: "./src/pages/classroom/live/liveClient/entry-record.ts",
        player: "./src/pages/classroom/live/liveClient/entry-player.ts"
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: {
                    loader: "babel-loader",
                }
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
                            modules: true
                        }
                    }
                ],
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
                    "file-loader",
                ],
            },
            {
                test: /\.mp4$/,
                use: "file-loader?name=videos/[name].[ext]",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    output: {
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            chunks: ["hubui"],
            template: "src/index_prod.html",
        }),
        new HtmlWebpackPlugin({
            filename: "player.html",
            chunks: ["player"],
            template: "src/pages/classroom/live/liveClient/player.html"
        }),
        new webpack.ProvidePlugin({
            "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
        }),
        new Visualizer({ filename: "../webpack-stats.html" }),
        new webpack.EnvironmentPlugin({
            "STAGE": "prod",
            "CALM_ORG_ID": "CALM-ISLAND",
            "ASSESSMENT_ENDPOINT": "https://seoul.assessment-api.badanamu.net/",
            "DEFAULT_PROG_ID": "KIDSLOOP-2.0"
        })
    ],
    devServer: {
        host: "0.0.0.0",
        historyApiFallback: true,
        proxy: {
            "/h5p": {
                target: "https://zoo.kidsloop.net/",
                secure: false,
                changeOrigin: true,
            }
        }
    },
};