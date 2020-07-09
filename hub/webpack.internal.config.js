const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: {
        hubui: "./src/client-entry.tsx",
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
            template: "src/index.html",
        }),
        new HtmlWebpackPlugin({
            filename: "player.html",
            chunks: ["player"],
            template: "src/pages/classroom/live/liveClient/player.html"
        }),
        new webpack.ProvidePlugin({
            //'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
        new webpack.EnvironmentPlugin({
            "STAGE": "inhouse",
            "CALM_ORG_ID": "CALM-ISLAND-QA",
            "PAYMENT_ENDPOINT": "https://payment.internal.badanamu.net/",
            "AUTH_ENDPOINT": "https://auth.internal.badanamu.net/",
            "ACCOUNT_ENDPOINT": "https://account.internal.badanamu.net/",
            "PRODUCT_ENDPOINT": "https://product.internal.badanamu.net/",
            "REGION_ENDPOINT": "https://region.internal.badanamu.net/",
            "ORGANIZATION_ENDPOINT": "https://organization-api.internal.badanamu.net/",
            "ASSESSMENT_ENDPOINT": "https://assessment-api.internal.badanamu.net/",
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
            },
            "/v1": {
                target: "https://seoul-beta.assessment-api.badanamu.net",
                secure: false,
                changeOrigin: true,
            },
        }
    },
};