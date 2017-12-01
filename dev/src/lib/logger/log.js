"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var source_map_1 = require("source-map");
var Config = require("../../config/config");
var logLevels_1 = require("./logLevels");
var stackLineRe = /([^ ]*) \(([^:]*):([0-9]*):([0-9]*)\)/;
function resolve(fileLine) {
    var split = _.trim(fileLine).match(stackLineRe);
    if (!split || !Log.sourceMap) {
        return { compiled: fileLine, final: fileLine };
    }
    var pos = { column: parseInt(split[4], 10), line: parseInt(split[3], 10) };
    var original = Log.sourceMap.originalPositionFor(pos);
    var line = split[1] + " (" + original.source + ":" + original.line + ")";
    var out = {
        caller: split[1],
        compiled: fileLine,
        final: line,
        line: original.line,
        original: line,
        path: original.source,
    };
    return out;
}
exports.resolve = resolve;
function makeVSCLink(pos) {
    if (!Config.LOG_VSC.valid || !pos.caller || !pos.path || !pos.line || !pos.original) {
        return pos.final;
    }
    return link(vscUrl(pos.path, "L" + pos.line.toString()), pos.original);
}
function color(str, color) {
    return "<font color='" + color + "'>" + str + "</font>";
}
function tooltip(str, tooltip) {
    return "<abbr title='" + tooltip + "'>" + str + "</abbr>";
}
function vscUrl(path, line) {
    return Config.LOG_VSC_URL_TEMPLATE(path, line);
}
function link(href, title) {
    return "<a href='" + href + "' target=\"_blank\">" + title + "</a>";
}
function time() {
    return color(Game.time.toString(), "gray");
}
var Log = (function () {
    function Log() {
        this._maxFileString = 0;
        _.defaultsDeep(Memory, { log: {
                level: Config.LOG_LEVEL,
                showSource: Config.LOG_PRINT_LINES,
                showTick: Config.LOG_PRINT_TICK,
            } });
    }
    Log.loadSourceMap = function () {
        try {
            var map = require("main.js.map");
            if (map) {
                Log.sourceMap = new source_map_1.SourceMapConsumer(map);
            }
        }
        catch (err) {
            console.log("failed to load source map", err);
        }
    };
    Object.defineProperty(Log.prototype, "level", {
        get: function () { return Memory.log.level; },
        set: function (value) { Memory.log.level = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "showSource", {
        get: function () { return Memory.log.showSource; },
        set: function (value) { Memory.log.showSource = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "showTick", {
        get: function () { return Memory.log.showTick; },
        set: function (value) { Memory.log.showTick = value; },
        enumerable: true,
        configurable: true
    });
    Log.prototype.trace = function (error) {
        if (this.level >= logLevels_1.LogLevels.ERROR && error.stack) {
            console.log(this.resolveStack(error.stack));
        }
        return this;
    };
    Log.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level >= logLevels_1.LogLevels.ERROR) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.ERROR).concat([].slice.call(args)));
        }
    };
    Log.prototype.warning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level >= logLevels_1.LogLevels.WARNING) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.WARNING).concat([].slice.call(args)));
        }
    };
    Log.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level >= logLevels_1.LogLevels.INFO) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.INFO).concat([].slice.call(args)));
        }
    };
    Log.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level >= logLevels_1.LogLevels.DEBUG) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.DEBUG).concat([].slice.call(args)));
        }
    };
    Log.prototype.getFileLine = function (upStack) {
        if (upStack === void 0) { upStack = 4; }
        var stack = new Error("").stack;
        if (stack) {
            var lines = stack.split("\n");
            if (lines.length > upStack) {
                var originalLines = _.drop(lines, upStack).map(resolve);
                var hoverText = _.map(originalLines, "final").join("&#10;");
                return this.adjustFileLine(originalLines[0].final, tooltip(makeVSCLink(originalLines[0]), hoverText));
            }
        }
        return "";
    };
    Log.prototype.buildArguments = function (level) {
        var out = [];
        switch (level) {
            case logLevels_1.LogLevels.ERROR:
                out.push(color("ERROR  ", "red"));
                break;
            case logLevels_1.LogLevels.WARNING:
                out.push(color("WARNING", "yellow"));
                break;
            case logLevels_1.LogLevels.INFO:
                out.push(color("INFO   ", "green"));
                break;
            case logLevels_1.LogLevels.DEBUG:
                out.push(color("DEBUG  ", "gray"));
                break;
            default:
                break;
        }
        if (this.showTick) {
            out.push(time());
        }
        if (this.showSource) {
            out.push(this.getFileLine());
        }
        return out;
    };
    Log.prototype.resolveStack = function (stack) {
        if (!Log.sourceMap) {
            return stack;
        }
        return _.map(stack.split("\n").map(resolve), "final").join("\n");
    };
    Log.prototype.adjustFileLine = function (visibleText, line) {
        var newPad = Math.max(visibleText.length, this._maxFileString);
        this._maxFileString = Math.min(newPad, Config.LOG_MAX_PAD);
        return "|" + _.padRight(line, line.length + this._maxFileString - visibleText.length, " ") + "|";
    };
    return Log;
}());
exports.Log = Log;
if (Config.LOG_LOAD_SOURCE_MAP) {
    Log.loadSourceMap();
}
exports.log = new Log();
global.log = exports.log;
//# sourceMappingURL=log.js.map