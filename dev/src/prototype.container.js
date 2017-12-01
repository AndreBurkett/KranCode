"use strict";
Object.defineProperty(StructureContainer.prototype, 'memory', {
    configurable: true,
    get: function () {
        if (_.isUndefined(Memory.myContainersMemory)) {
            Memory.myContainersMemory = {};
        }
        return Memory.myContainersMemory[this.id] =
            Memory.myContainersMemory[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.myContainersMemory)) {
            Memory.myContainersMemory = {};
        }
        if (!_.isObject(Memory.myContainersMemory)) {
            throw new Error('Could not set container memory');
        }
        Memory.myContainersMemory[this.id] = value;
    }
});
Object.defineProperty(StructureContainer.prototype, 'transportTarget', {
    configurable: true,
    get: function () {
        return this.memory.transportTarget = this.memory.transportTarget || false;
    },
    set: function (value) {
        this.memory.transportTarget = value;
    }
});
Object.defineProperty(StructureContainer.prototype, 'freeSpaceCount', {
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
//# sourceMappingURL=prototype.container.js.map