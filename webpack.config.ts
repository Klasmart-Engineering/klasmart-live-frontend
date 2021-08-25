import 'webpack-dev-server';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { config } from "dotenv";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";

config();

const modes = [
    `development`,
    `production`,
    `none`,
] as const;
type Mode = typeof modes[number];

const dirtyNodeEnv = process.env.NODE_ENV as Mode;
const nodeEnv = (modes.includes(dirtyNodeEnv) ? dirtyNodeEnv : undefined) ?? `production`;
const isDev = nodeEnv === `development`;

const { loadBrandingOptions } = require(`kidsloop-branding`);
const brandingOptions = loadBrandingOptions(process.env.BRAND);

const webpackConfig: Configuration = {
    mode: nodeEnv,
    devtool: isDev ? `eval-cheap-module-source-map`: undefined,
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
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    `file-loader`,
                    {
                        loader: `image-webpack-loader`,
                        options: {
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
                options: {
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
        new CleanWebpackPlugin(),
        new Dotenv(),
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
        new HtmlWebpackPlugin({
            filename: `pdfviewer.html`,
            chunks: [ `pdfviewer` ],
            template: `src/pdfviewer.html`,
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
    },
};

export default webpackConfig;
