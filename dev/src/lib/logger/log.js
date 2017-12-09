"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_1 = require("source-map");
const Config = require("../../config/config");
const logLevels_1 = require("./logLevels");
const stackLineRe = /([^ ]*) \(([^:]*):([0-9]*):([0-9]*)\)/;
function resolve(fileLine) {
    const split = _.trim(fileLine).match(stackLineRe);
    if (!split || !Log.sourceMap) {
        return { compiled: fileLine, final: fileLine };
    }
    const pos = { column: parseInt(split[4], 10), line: parseInt(split[3], 10) };
    const original = Log.sourceMap.originalPositionFor(pos);
    const line = `${split[1]} (${original.source}:${original.line})`;
    const out = {
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
    return link(vscUrl(pos.path, `L${pos.line.toString()}`), pos.original);
}
function color(str, color) {
    return `<font color='${color}'>${str}</font>`;
}
function tooltip(str, tooltip) {
    return `<abbr title='${tooltip}'>${str}</abbr>`;
}
function vscUrl(path, line) {
    return Config.LOG_VSC_URL_TEMPLATE(path, line);
}
function link(href, title) {
    return `<a href='${href}' target="_blank">${title}</a>`;
}
function time() {
    return color(Game.time.toString(), "gray");
}
class Log {
    constructor() {
        this._maxFileString = 0;
        _.defaultsDeep(Memory, { log: {
                level: Config.LOG_LEVEL,
                showSource: Config.LOG_PRINT_LINES,
                showTick: Config.LOG_PRINT_TICK,
            } });
    }
    static loadSourceMap() {
        try {
            const map = require("main.js.map");
            if (map) {
                Log.sourceMap = new source_map_1.SourceMapConsumer(map);
            }
        }
        catch (err) {
            console.log("failed to load source map", err);
        }
    }
    get level() { return Memory.log.level; }
    set level(value) { Memory.log.level = value; }
    get showSource() { return Memory.log.showSource; }
    set showSource(value) { Memory.log.showSource = value; }
    get showTick() { return Memory.log.showTick; }
    set showTick(value) { Memory.log.showTick = value; }
    trace(error) {
        if (this.level >= logLevels_1.LogLevels.ERROR && error.stack) {
            console.log(this.resolveStack(error.stack));
        }
        return this;
    }
    error(...args) {
        if (this.level >= logLevels_1.LogLevels.ERROR) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.ERROR).concat([].slice.call(args)));
        }
    }
    warning(...args) {
        if (this.level >= logLevels_1.LogLevels.WARNING) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.WARNING).concat([].slice.call(args)));
        }
    }
    info(...args) {
        if (this.level >= logLevels_1.LogLevels.INFO) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.INFO).concat([].slice.call(args)));
        }
    }
    debug(...args) {
        if (this.level >= logLevels_1.LogLevels.DEBUG) {
            console.log.apply(this, this.buildArguments(logLevels_1.LogLevels.DEBUG).concat([].slice.call(args)));
        }
    }
    getFileLine(upStack = 4) {
        const stack = new Error("").stack;
        if (stack) {
            const lines = stack.split("\n");
            if (lines.length > upStack) {
                const originalLines = _.drop(lines, upStack).map(resolve);
                const hoverText = _.map(originalLines, "final").join("&#10;");
                return this.adjustFileLine(originalLines[0].final, tooltip(makeVSCLink(originalLines[0]), hoverText));
            }
        }
        return "";
    }
    buildArguments(level) {
        const out = [];
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
    }
    resolveStack(stack) {
        if (!Log.sourceMap) {
            return stack;
        }
        return _.map(stack.split("\n").map(resolve), "final").join("\n");
    }
    adjustFileLine(visibleText, line) {
        const newPad = Math.max(visibleText.length, this._maxFileString);
        this._maxFileString = Math.min(newPad, Config.LOG_MAX_PAD);
        return `|${_.padRight(line, line.length + this._maxFileString - visibleText.length, " ")}|`;
    }
}
exports.Log = Log;
if (Config.LOG_LOAD_SOURCE_MAP) {
    Log.loadSourceMap();
}
exports.log = new Log();
global.log = exports.log;
//# sourceMappingURL=log.js.map