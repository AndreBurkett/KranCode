"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logLevels_1 = require("../lib/logger/logLevels");
exports.ENABLE_DEBUG_MODE = true;
exports.USE_PROFILER = true;
exports.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL = 700;
exports.LOG_LEVEL = logLevels_1.LogLevels.DEBUG;
exports.LOG_PRINT_TICK = true;
exports.LOG_PRINT_LINES = true;
exports.LOG_LOAD_SOURCE_MAP = true;
exports.LOG_MAX_PAD = 100;
exports.LOG_VSC = { repo: "@@_repo_@@", revision: __REVISION__, valid: false };
exports.LOG_VSC_URL_TEMPLATE = function (path, line) {
    return exports.LOG_VSC.repo + "/blob/" + exports.LOG_VSC.revision + "/" + path + "#" + line;
};
//# sourceMappingURL=config.js.map