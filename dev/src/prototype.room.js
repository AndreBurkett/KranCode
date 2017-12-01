"use strict";
Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        if (!this._sources) {
            if (!this.memory.sourceIds) {
                this.memory.sourceIds = this.find(FIND_SOURCES)
                    .map(function (source) { return source.id; });
            }
            this._sources = this.memory.sourceIds.map(function (id) { return Game.getObjectById(id); });
        }
        return this._sources;
    },
    set: function (newValue) {
        this.memory.sources = newValue.map(function (source) { return source.id; });
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});
//# sourceMappingURL=prototype.room.js.map