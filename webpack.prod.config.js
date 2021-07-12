const webpack = require(`webpack`);
const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const SentryWebpackPlugin = require(`@sentry/webpack-plugin`);
const { loadBrandingOptions } = require(`kidsloop-branding`);
require(`dotenv`).config();

const brandingOptions = loadBrandingOptions(process.env.BRAND);

module.exports = {
    mode: `production`,
    entry: {
        ui: `./src/entry.tsx`,
        "record-1db5341": `./src/entry-record.ts`,
        player: `./src/entry-player.ts`,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: `ts-loader`,
                },
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: `style-loader`,
                    },
                    `css-modules-typescript-loader`,
                    {
                        loader: `css-loader`,
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    `file-loader`,
                    {
                        loader: `image-webpack-loader`,
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
                                quality: [ 0.65, 0.90 ],
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [ `file-loader` ],
            },
            {
                test: /\.mp3$/,
                loader: `file-loader`,
                query: {
                    name: `static/media/[name].[hash:8].[ext]`,
                },
            },
        ],
    },
    resolve: {
        extensions: [
            `.js`,
            `.jsx`,
            `.tsx`,
            `.ts`,
        ],
        alias: {
            ...brandingOptions.webpack.resolve.alias,
        },
    },
    output: {
        filename: `[name].[contenthash].js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            CALLSTATS_ENABLE: `TRUE`,
            ENDPOINT_API: `https://api.kidsloop.net`,
            ENDPOINT_HUB: `https://hub.kidsloop.net`,
            ENDPOINT_CMS: `https://kl2.kidsloop.net`,
        }),
        new HtmlWebpackPlugin({
            filename: `index.html`,
            chunks: [ `ui` ],
            template: `src/index.html`,
            ...brandingOptions.webpack.html,
        }),
        new HtmlWebpackPlugin({
            filename: `player.html`,
            chunks: [ `player` ],
            template: `src/player.html`,
        }),
        new SentryWebpackPlugin({
            include: `.`,
            ignoreFile: `.sentrycliignore`,
            ignore: [
                `node_modules`,
                `webpack.config.js`,
                `webpack.prod.config.js`,
            ],
        }),
    ],
};
