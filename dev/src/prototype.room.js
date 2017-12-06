"use strict";
Room.prototype.getContainers = function () {
    return this.memory.allContainers = this.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
};
Room.prototype.getRoomEnergy = function () {
    let energy = 0;
    let containers = this.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
    for (let i in containers) {
        energy = energy + containers[i].store[RESOURCE_ENERGY];
    }
};
Room.prototype.getMineEnergy = function () {
    let energy = 0;
    if (!this.memory.sourceContainers || this.memory.sourceContainers.length == 0) {
        var mineContainers = [];
        var source = [];
        let cont = this.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        for (let i in Memory.sources) {
            source[i] = Game.getObjectById(this.memory.sourceIds[i]);
            for (let j in cont) {
                if (source[i].pos.inRangeTo(cont[j], 2)) {
                    mineContainers.push(Cont[j]);
                }
            }
        }
        this.memory.sourceContainers = mineContainers;
    }
    for (let i in this.memory.sourceContainers) {
        try {
            energy = energy + this.memory.sourceContainers[i];
        }
        catch (e) {
            console.log(e + "error");
            delete this.memory.sourceContainers;
        }
    }
    return energy;
};
Room.prototype.iCreep = function () {
    return this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' || !c.memory.task });
};
Room.prototype.mCreep = function () {
    return this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'mine' });
};
Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        if (!this._sources) {
            if (!this.memory.sourceIds) {
                this.memory.sourceIds = this.find(FIND_SOURCES)
                    .map(source => source.id);
            }
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }
        return this._sources;
    },
    set: function (newValue) {
        this.memory.sources = newValue.map(source => source.id);
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});
//# sourceMappingURL=prototype.room.js.map