"use strict";
Object.defineProperty(StructureSpawn.prototype, 'spawnEnabled', {
    configurable: true,
    get: function () {
        if (_.isUndefined(this.memory.spawnEnabled)) {
            this.memory.spawnEnabled = true;
        }
        return this.memory.spawnEnabled;
    },
    set: function (value) {
        this.memory.spawnEnabled = value;
    }
});
//# sourceMappingURL=prototype.spawn.js.map