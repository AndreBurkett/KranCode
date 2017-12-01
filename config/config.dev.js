"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonConfig = require("./config.common");
var ScreepsWebpackPlugin = require("screeps-webpack-plugin");
function webpackConfig(options) {
    if (options === void 0) { options = {}; }
    var config = CommonConfig.init(options);
    var credentials = require("./credentials.json");
    credentials.branch = "dev";
    config.plugin("screeps")
        .use(ScreepsWebpackPlugin, [credentials]);
    config.plugin("define").tap(function (args) {
        args[0].PRODUCTION = JSON.stringify(false);
        return args;
    });
    return config;
}
module.exports = webpackConfig;
//# sourceMappingURL=config.dev.js.map