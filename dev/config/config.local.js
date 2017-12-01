"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonConfig = require("./config.common");
function webpackConfig(options) {
    if (options === void 0) { options = {}; }
    var config = CommonConfig.init(options);
    var localPath = "/home/USER_NAME/.config/Screeps/scripts/127_0_0_1___21025/default/";
    config.output.path(localPath);
    config.plugin("define").tap(function (args) {
        args[0].PRODUCTION = JSON.stringify(false);
        return args;
    });
    config.output.sourceMapFilename("[file].map.js");
    return config;
}
module.exports = webpackConfig;
//# sourceMappingURL=config.local.js.map