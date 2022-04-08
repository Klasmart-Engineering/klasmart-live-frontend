import 'webpack-dev-server';
import pkg from "./package.json";
import { execSync } from "child_process";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { config } from "dotenv";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {
    Configuration,
    EnvironmentPlugin,
} from "webpack";

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
const gitCommit = execSync(`git rev-parse HEAD`).toString().trim().slice(0, 7);

const { loadBrandingOptions } = require(`@kl-engineering/kidsloop-branding`);
const brandingOptions = loadBrandingOptions(process.env.BRAND);

const newRelicConfig = {
    newRelicAccountID: `3286825`,
    newRelicAgentID: `322534677`,
    newRelicTrustKey: `3286825`,
    newRelicLicenseKey: `NRJS-eff8c9c844416a5083f`,
    newRelicApplicationID: `322534677`,
};

const webpackConfig: Configuration = {
    mode: nodeEnv,
    devtool: isDev ? `eval-cheap-module-source-map`: undefined,
    entry: {
        ui: `./src/entry.tsx`,
        record: `./src/entry-record.ts`,
        player: `./src/entry-player.ts`,
        pdfviewer: `./src/entry-pdfviewer.js`,
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
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: `asset/resource`,
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
            "@": path.resolve(__dirname, `src`),
            react: path.resolve(`./node_modules/react`),
            'react-dom': path.resolve(`./node_modules/react-dom`),
            'react-redux': path.resolve(`./node_modules/react-redux`),
            ...brandingOptions.webpack.resolve.alias,
        },
    },
    output: {
        filename: `[name].${gitCommit}.js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new Dotenv(),
        new EnvironmentPlugin({
            VERSION: pkg.version,
            GIT_COMMIT: gitCommit,
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
            ...newRelicConfig,
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
                    from: `node_modules/@kl-engineering/pdfjs-dist/cmaps`,
                    to: `cmaps/`,
                },
                {
                    from: `node_modules/@kl-engineering/pdfjs-dist`,
                    to: `pdfjs-dist/`,
                },
                {
                    from: `public`,
                    to: ``, // not `dist` as it will then be place at `dist/dist`
                },
            ],
        }),
    ],
    devServer: {
        https: false,
        host: `localhost`,
        port: 8082,
        proxy: {
            "/graphql": {
                target: `http://localhost:8000`,
                changeOrigin: true,
                ws: true,
            },
            "/room": {
                target: `http://localhost:8002`,
                changeOrigin: true,
                ws: true,
            },
            "/sfu": {
                target: `http://localhost:8002`,
                changeOrigin: true,
                ws: true,
            },
            "/sfuid": {
                target: `http://localhost:8002`,
                changeOrigin: true,
                ws: true,
            },
            "/h5p": {
                target: `https://live.alpha.kidsloop.net`,
                changeOrigin: true,
            },
            "/pdf": {
                target: `https://live.alpha.kidsloop.net`,
                changeOrigin: true,
            },
            "/assets": {
                target: `https://live.alpha.kidsloop.net`,
                changeOrigin: true,
            },
            "/video": {
                target: `https://live.alpha.kidsloop.net`,
                changeOrigin: true,
            },
            "/v1": {
                target: `https://cms.alpha.kidsloop.net`,
                changeOrigin: true,
            },
        },
    },
};

export default webpackConfig;
