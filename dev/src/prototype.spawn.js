"use strict";
var creepName = require('./util.nameBuilder');
StructureSpawn.prototype.sCreep = function (role, specialty) {
    var body = [];
    var energyCap = this.room.energyCapacityAvailable;
    var numParts;
    switch (role) {
        case 'statWorker':
            body.push(MOVE, CARRY);
            energyCap = energyCap - 150;
            numParts = Math.floor(energyCap / 100);
            for (let i = 0; i < numParts; i++) {
                body.push(WORK);
            }
            if (specialty = 'miner')
                return this.spawnCreep(body, creepName.getName('m'), { role: role, specialty: specialty, task: 'idle' });
            break;
        case 'genWorker':
            body.push(WORK, CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('g'), { task: 'idle' });
            break;
    }
};
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