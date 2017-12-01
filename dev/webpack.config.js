"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function webpackConfig(options = {}) {
    _.defaults(options, {
        ENV: "dev",
        ROOT: __dirname,
        TEST: false,
    });
    const config = require(`./config/config.${options.ENV}`)(options);
    return config.toConfig();
}
module.exports = webpackConfig;
//# sourceMappingURL=webpack.config.js.map