"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommonConfig = require("./config.common");
const ScreepsWebpackPlugin = require("screeps-webpack-plugin");
function webpackConfig(options = {}) {
    const config = CommonConfig.init(options);
    const credentials = require("./credentials.json");
    credentials.branch = "dev";
    config.plugin("screeps")
        .use(ScreepsWebpackPlugin, [credentials]);
    config.plugin("define").tap((args) => {
        args[0].PRODUCTION = JSON.stringify(false);
        return args;
    });
    return config;
}
module.exports = webpackConfig;
//# sourceMappingURL=config.dev.js.map