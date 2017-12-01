"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-chain");
const screeps_webpack_sources_1 = require("../libs/screeps-webpack-sources");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const git = require("git-rev-sync");
function init(options) {
    const ENV = options.ENV || "dev";
    const ROOT = options.ROOT || __dirname;
    const config = new Config();
    const gitRepoExists = fs.existsSync("../.git");
    config
        .entry("main")
        .add("./src/main.ts");
    config
        .output
        .path(path.join(ROOT, "dist", ENV))
        .filename("main.js")
        .pathinfo(false)
        .libraryTarget("commonjs2")
        .sourceMapFilename("[file].map")
        .devtoolModuleFilenameTemplate("[resource-path]");
    config.devtool("source-map");
    config.target("node");
    config.node.merge({
        Buffer: false,
        __dirname: false,
        __filename: false,
        console: true,
        global: true,
        process: false,
    });
    config.watchOptions({ ignored: /node_modules/ });
    config.resolve
        .extensions
        .merge([".webpack.js", ".web.js", ".ts", ".tsx", ".js"]);
    config.externals({
        "main.js.map": "main.js.map",
    });
    config.plugin("tsChecker")
        .use(ForkTsCheckerWebpackPlugin);
    config.plugin("clean")
        .use(CleanWebpackPlugin, [
        [`dist/${options.ENV}/*`],
        { root: options.ROOT },
    ]);
    config.plugin("define")
        .use(webpack.DefinePlugin, [{
            PRODUCTION: JSON.stringify(true),
            __BUILD_TIME__: JSON.stringify(Date.now()),
            __REVISION__: gitRepoExists ? JSON.stringify(git.short()) : JSON.stringify(""),
        }]);
    config.plugin("screeps-source-map")
        .use(screeps_webpack_sources_1.ScreepsSourceMapToJson);
    config.plugin("no-emit-on-errors")
        .use(webpack.NoEmitOnErrorsPlugin);
    config.module.rule("js-source-maps")
        .test(/\.js$/)
        .enforce("pre")
        .use("source-map")
        .loader("source-map-loader");
    config.module.rule("tsx-source-maps")
        .test(/\.tsx?$/)
        .enforce("pre")
        .use("source-map")
        .loader("source-map-loader");
    config.module.rule("compile")
        .test(/\.tsx?$/)
        .exclude
        .add(path.join(ROOT, "src/snippets"))
        .end()
        .use("typescript")
        .loader("ts-loader")
        .options({
        transpileOnly: true
    });
    return config;
}
exports.init = init;
//# sourceMappingURL=config.common.js.map