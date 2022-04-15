import pkg from "./package.json";
import { execSync } from "child_process";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { EnvironmentPlugin } from "webpack";

module.exports = {
    mode: `production`,
    entry: {
        ui: `./src/app/entrypoint/entry-cordova.tsx`,
        record: `./src/entry-record.ts`,
        player: `./src/entry-player.ts`,
        pdfviewer: `./src/entry-pdfviewer.tsx`,
        h5presize: `./src/entry-h5p-resize.js`,
        flashcard: `./src/entry-flashcard.ts`,
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
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: `asset/resource`,
            },
            {
                test: /\.mp3$/i,
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
            `.css`,
            `.ttf`,
        ],
        alias: {
            "@": path.resolve(__dirname, `src`),
            react: path.resolve(`./node_modules/react`),
            'react-dom': path.resolve(`./node_modules/react-dom`),
            'react-redux': path.resolve(`./node_modules/react-redux`),
        },
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, `www`),
        publicPath: ``,
    },
    plugins: [
        new Dotenv(),
        new EnvironmentPlugin({
            NODE_ENV: `production`,
            USE_TEST_TOKEN: null,
            WEBRTC_DEVICE_HANDLER_NAME: ``,
            CUSTOM_UA: `cordova`,
            IS_CORDOVA_BUILD: true,
            PDF_VERSION: `JPEG`,
            VERSION: pkg.version,
            GIT_COMMIT: execSync(`git rev-parse HEAD`).toString().trim().slice(0, 7),
        }),
        new HtmlWebpackPlugin({
            filename: `index.html`,
            chunks: [ `ui` ],
            template: `src/app/index.cordova.html`,
        }),
        new HtmlWebpackPlugin({
            filename: `player.html`,
            chunks: [ `player` ],
            template: `src/app/player.cordova.html`,
        }),
        new HtmlWebpackPlugin({
            filename: `pdfviewer.html`,
            chunks: [ `pdfviewer` ],
            template: `src/pdfviewer.html`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `node_modules/@kl-engineering/pdfjs-dist/cmaps`,
                    to: `cmaps/`,
                },
                {
                    from: `node_modules/@kl-engineering/pdfjs-dist`,
                    to: `pdfjs-dist/`,
                },
            ],
        }),
    ],
};
