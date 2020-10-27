const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: {
        ui: "./src/entry.tsx",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
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
        alias: {
            react: path.resolve("./node_modules/react"),
        },
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    devServer: {
        host: "0.0.0.0",
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
            "/transfer": {
                target: "http://localhost:8081",
                secure: false,
            },

            "/refresh": {
                target: "http://localhost:8081",
                secure: false,
            },
        }
    },
};