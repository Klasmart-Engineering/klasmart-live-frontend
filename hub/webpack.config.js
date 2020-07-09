const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: {
        ui: "./src/client-entry.tsx",
        record: "./src/pages/classroom/live/liveClient/entry-record.ts",
        player: "./src/pages/classroom/live/liveClient/entry-player.ts"
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
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new webpack.EnvironmentPlugin({
            "STAGE": "dev",
            "CALM_ORG_ID": "CALM-ISLAND-QA",
            "PAYMENT_ENDPOINT": "http://localhost:8092/",
            "AUTH_ENDPOINT": "http://localhost:8080/",
            "ACCOUNT_ENDPOINT": "http://localhost:8089/",
            "PRODUCT_ENDPOINT": "http://localhost:8044/",
            "REGION_ENDPOINT": "http://localhost:8094/",
            "ORGANIZATION_ENDPOINT": "http://localhost:8084/",
            "ASSESSMENT_ENDPOINT": "http://localhost:8065/",
            "DEFAULT_PROG_ID": "KIDSLOOP-2.0"
        }),
        new HtmlWebpackPlugin({
            filename: "player.html",
            chunks: ["player"],
            template: "src/pages/classroom/live/liveClient/player.html"
        })
    ],
    devServer: {
        host: "0.0.0.0",
        historyApiFallback: true,
        proxy: {
            "/graphql": {
                target: "http://localhost:8000",
                changeOrigin: true,
                ws: true
            },
            "/h5p": {
                target: "https://zoo.kidsloop.net/",
                secure: false,
                changeOrigin: true,
            },
            "/v1": {
                target: "https://seoul-beta.assessment-api.badanamu.net",
                secure: false,
                changeOrigin: true,
            }
        }
    },
};