"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function webpackConfig(options) {
    if (options === void 0) { options = {}; }
    _.defaults(options, {
        ENV: "dev",
        ROOT: __dirname,
        TEST: false,
    });
    var config = require("./config/config." + options.ENV)(options);
    return config.toConfig();
}
module.exports = webpackConfig;
//# sourceMappingURL=webpack.config.js.map