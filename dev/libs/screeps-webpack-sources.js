"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ConcatSource = require("webpack-sources").ConcatSource;
class ScreepsSourceMapToJson {
    apply(compiler) {
        compiler.plugin("emit", (compilation, cb) => {
            for (const filename in compilation.assets) {
                if (path.basename(filename, ".js").match(/\.map/)) {
                    compilation.assets[filename] = new ConcatSource("module.exports = ", compilation.assets[filename]);
                }
            }
            cb();
        });
    }
}
exports.ScreepsSourceMapToJson = ScreepsSourceMapToJson;
//# sourceMappingURL=screeps-webpack-sources.js.map