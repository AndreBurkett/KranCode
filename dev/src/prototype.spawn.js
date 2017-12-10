"use strict";
var creepName = require('./util.nameBuilder');
StructureSpawn.prototype.sCreep = function (role, specialty) {
    var body = [];
    if (this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }).length > 0 && this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty == 'miner' }).length >= 2)
        var energyCap = this.room.energyCapacityAvailable;
    else if (this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty == 'miner' }).length > 0)
        var energyCap = Math.max(this.room.energyCapacityAvailable / 2, 300);
    else
        var energyCap = 300;
    var numParts;
    switch (role) {
        case 'deliveryWorker':
            numParts = Math.floor(energyCap / 150);
            for (let i = 0; i < numParts; i++)
                body.push(CARRY, CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('d'), { memory: { role: role, task: 'idle' } });
            break;
        case 'genWorker':
            body.push(WORK, CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('g'), { memory: { task: 'idle' } });
            break;
        case 'mobileWorker':
            numParts = Math.floor(energyCap / 300);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE, CARRY, MOVE, CARRY, WORK);
            }
            switch (specialty) {
                case 'harvester':
                    return this.spawnCreep(body, creepName.getName('h'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
                case 'builder':
                    return this.spawnCreep(body, creepName.getName('b'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
                case 'satMiner':
                    return this.spawnCreep(body, creepName.getName('Lm'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                case undefined:
                    return this.spawnCreep(body, creepName.getName('g'), { memory: { role: role, task: 'idle' } });
            }
            break;
        case 'scout':
            body.push(MOVE);
            return this.spawnCreep(body, creepName.getName('s'), { memory: { role: role, home: this.room.name, task: 'idle' } });
            break;
        case 'statWorker':
            body.push(MOVE, MOVE, CARRY);
            energyCap = Math.min(energyCap, 550) - 150;
            numParts = Math.floor(energyCap / 100);
            for (let i = 0; i < numParts; i++) {
                body.push(WORK);
            }
            switch (specialty) {
                case 'miner':
                    return this.spawnCreep(body, creepName.getName('m'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
                case 'upgrader':
                    return this.spawnCreep(body, creepName.getName('u'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
            }
            break;
        case 'pikeman':
            body.push(MOVE, ATTACK, MOVE, ATTACK);
            return this.spawnCreep(body, creepName.getName('Ap'), { memory: { role: 'pikeman', task: 'combatMelee' } });
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