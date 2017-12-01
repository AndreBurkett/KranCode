"use strict";
Object.defineProperty(StructureController.prototype, 'memory', {
    configurable: true,
    get: function () {
        if (_.isUndefined(Memory.myControllersMemory)) {
            Memory.myControllersMemory = {};
        }
        if (!_.isObject(Memory.myControllersMemory)) {
            return undefined;
        }
        return Memory.myControllersMemory[this.id] =
            Memory.myControllersMemory[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.myControllersMemory)) {
            Memory.myControllersMemory = {};
        }
        if (!_.isObject(Memory.myControllersMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.myControllersMemory[this.id] = value;
    }
});
Object.defineProperty(StructureController.prototype, 'containerSpot', {
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
//# sourceMappingURL=prototype.controller.js.map