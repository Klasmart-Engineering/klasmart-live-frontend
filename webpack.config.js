const webpack = require(`webpack`);
const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const { loadBrandingOptions } = require(`kidsloop-branding`);
require(`dotenv`).config();

const brandingOptions = loadBrandingOptions(process.env.BRAND);

const newRelicConfig = {
    newRelicAccountID: `3286825`,
    newRelicAgentID: `322534677`,
    newRelicTrustKey: `3286825`,
    newRelicLicenseKey: `NRJS-eff8c9c844416a5083f`,
    newRelicApplicationID: `322534677`,
};

module.exports = {
    mode: `development`,
    entry: {
        ui: `./src/entry.tsx`,
        "record-3f6f2667": `./src/entry-record.ts`,
        player: `./src/entry-player.ts`,
        pdfviewer: `./src/entry-pdfviewer.js`,
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
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [ `file-loader` ],
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
                                quality: [ 0.65, 0.9 ],
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.mp3$/i,
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
            `.css`,
            `.ttf`,
        ],
        alias: {
            ...brandingOptions.webpack.resolve.alias,
        },
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, `dist`),
    },
    devtool: `source-map`,
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: undefined,
            ENDPOINT_GQL: undefined,
            ENDPOINT_H5P: undefined,
            ENDPOINT_TEST_ASSETS_S3: undefined,
            APP_GIT_REV: undefined,
            LIVE_WEBSOCKET_ENDPOINT: undefined,
            SFU_WEBSOCKET_ENDPOINT: undefined,
            ENDPOINT_API: `https://api.alpha.kidsloop.net`,
            ENDPOINT_HUB: `https://hub.alpha.kidsloop.net`,
            ENDPOINT_CMS: `https://kl2-test.kidsloop.net`,
            ENDPOINT_PDF: `https://live.alpha.kidsloop.net`,
            PDF_VERSION: `SVG`, // SVG or JPEG - Defaults to SVG
        }),
        new HtmlWebpackPlugin({
            filename: `index.html`,
            chunks: [ `ui` ],
            template: `src/index.html`,
            ...brandingOptions.webpack.html,
            ...newRelicConfig,
        }),
        new HtmlWebpackPlugin({
            filename: `player.html`,
            chunks: [ `player` ],
            template: `src/player.html`,
            ...newRelicConfig,git
        }),
        new HtmlWebpackPlugin({
            filename: `pdfviewer.html`,
            chunks: [ `pdfviewer` ],
            template: `src/pdfviewer.html`,
            ...newRelicConfig,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `node_modules/pdfjs-dist/cmaps`,
                    to: `cmaps/`,
                },
                {
                    from: `node_modules/pdfjs-dist`,
                    to: `pdfjs-dist/`,
                },
            ],
        }),
    ],
    devServer: {
        https: true,
        host: `local.alpha.kidsloop.net`,
        port: 8082,
        proxy: {
            "/graphql": {
                target: `http://local.alpha.kidsloop.net:8000`,
                changeOrigin: true,
                ws: true,
            },
            "/sfu": {
                target: `http://local.alpha.kidsloop.net:8002`,
                changeOrigin: true,
                ws: true,
            },
            "/h5p": {
                target: `https://live.kidsloop.net`,
                changeOrigin: true,
            },
            "/pdf": {
                target: `https://live.alpha.kidsloop.net`,
                changeOrigin: true,
            },
            "/assets": {
                target: `https://live.kidsloop.net`,
                changeOrigin: true,
            },
            "/video": {
                target: `https://live.kidsloop.net`,
                changeOrigin: true,
            },
            "/v1": {
                target: `https://kl2-test.kidsloop.net`,
                changeOrigin: true,
            },
        },
        disableHostCheck: true,
    },
};
