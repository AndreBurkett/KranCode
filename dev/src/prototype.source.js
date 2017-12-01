"use strict";
Object.defineProperty(Source.prototype, 'memory', {
    configurable: true,
    get: function () {
        if (_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if (!_.isObject(Memory.mySourcesMemory)) {
            return undefined;
        }
        return Memory.mySourcesMemory[this.id] =
            Memory.mySourcesMemory[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if (!_.isObject(Memory.mySourcesMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.mySourcesMemory[this.id] = value;
    }
});
Object.defineProperty(Source.prototype, 'workers', {
    configurable: true,
    get: function () {
        var _this = this;
        return this.memory.workers = _.filter(Game.creeps, function (c) { return c.memory.sourceTarget === _this.id; }).length;
    },
    set: function (value) {
        if (value < 0) {
            value = 0;
        }
        this.memory.workers = value;
    }
});
Object.defineProperty(Source.prototype, 'freeSpaceCount', {
    get: function () {
        var _this = this;
        if (this._freeSpaceCount == undefined) {
            if (this.memory.freeSpaceCount == undefined) {
                var freeSpaceCount_1 = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(function (x) {
                    [_this.pos.y - 1, _this.pos.y, _this.pos.y + 1].forEach(function (y) {
                        if (Game.map.getTerrainAt(x, y, _this.pos.roomName) != 'wall')
                            freeSpaceCount_1++;
                    }, _this);
                }, this);
                this.memory.freeSpaceCount = freeSpaceCount_1;
            }
            this._freeSpaceCount = this.memory.freeSpaceCount;
        }
        return this._freeSpaceCount;
    },
    enumerable: false,
    configurable: true
});
Object.defineProperty(Source.prototype, 'containerSpot', {
    get: function () {
        var _this = this;
        if (this._containerSpot == undefined) {
            if (this.memory.containerSpot == undefined) {
                [this.pos.x - 1, this.pos.x + 1].forEach(function (x) {
                    [_this.pos.y - 1, _this.pos.y + 1].forEach(function (y) {
                        if (Game.map.getTerrainAt(x, y, _this.pos.roomName) != 'wall')
                            _this.memory.containerSpot = [x, y];
                    }, _this);
                }, this);
            }
            this._containerSpot = this.memory.containerSpot;
        }
        return this._containerSpot;
    },
    enumerable: false,
    configurable: true
});
//# sourceMappingURL=prototype.source.js.map