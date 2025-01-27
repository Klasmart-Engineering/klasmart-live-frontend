import pkg from "./package.json";
import { execSync } from "child_process";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { EnvironmentPlugin } from "webpack";

const getGitCommit = () => {
    try {
        return execSync(`git rev-parse HEAD`).toString().trim().slice(0, 7);
    } catch {
        console.log(`Git commit hash unavailable using package.json version: ${pkg.version}`);
        return pkg.version;
    }
};

module.exports = {
    mode: `development`,
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
    devtool: `source-map`,
    plugins: [
        new Dotenv(),
        new EnvironmentPlugin({
            NODE_ENV: `development`,
            USE_TEST_TOKEN: null,
            WEBRTC_DEVICE_HANDLER_NAME: ``,
            CUSTOM_UA: `cordova`,
            IS_CORDOVA_BUILD: true,
            PDF_VERSION: `JPEG`,
            VERSION: pkg.version,
            GIT_COMMIT: getGitCommit(),
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
    devServer: {
        host: `0.0.0.0`,
        historyApiFallback: true,
        proxy: {
            "/graphql": {
                target: `http://localhost:8000`,
                changeOrigin: true,
                ws: true,
            },
            "/sfu": {
                target: `http://localhost:8002`,
                changeOrigin: true,
                ws: true,
            },
            "/h5p": {
                target: `https://zoo.kidsloop.net`,
                changeOrigin: true,
            },
            "/auth": {
                target: `https://prod.auth.badanamu.net/`,
                changeOrigin: true,
                pathRewrite: {
                    "^/auth": ``,
                },
            },
            "/account": {
                target: `https://prod.account.badanamu.net/`,
                changeOrigin: true,
                pathRewrite: {
                    "^/account": ``,
                },
            },
            "/v1": {
                target: `https://kl2-test.kidsloop.net/`,
                secure: true,
                changeOrigin: true,
            },
        },
        disableHostCheck: true,
    },
};
