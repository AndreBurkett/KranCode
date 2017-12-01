"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ConcatSource = require("webpack-sources").ConcatSource;
var ScreepsSourceMapToJson = (function () {
    function ScreepsSourceMapToJson() {
    }
    ScreepsSourceMapToJson.prototype.apply = function (compiler) {
        compiler.plugin("emit", function (compilation, cb) {
            for (var filename in compilation.assets) {
                if (path.basename(filename, ".js").match(/\.map/)) {
                    compilation.assets[filename] = new ConcatSource("module.exports = ", compilation.assets[filename]);
                }
            }
            cb();
        });
    };
    return ScreepsSourceMapToJson;
}());
exports.ScreepsSourceMapToJson = ScreepsSourceMapToJson;
//# sourceMappingURL=screeps-webpack-sources.js.map