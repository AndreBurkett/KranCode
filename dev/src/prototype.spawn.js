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
            energyCap = Math.min(energyCap, 1200);
            numParts = Math.floor(energyCap / 150);
            for (let i = 0; i < numParts; i++)
                body.push(CARRY, CARRY, MOVE);
            switch (specialty) {
                case 'satTransporter':
                    return this.spawnCreep(body, creepName.getName('Lt'), { memory: { role: role, task: 'idle', homeRoom: this.room.name, specialty: specialty } });
            }
            return this.spawnCreep(body, creepName.getName('d'), { memory: { role: role, task: 'idle', homeRoom: this.room.name } });
        case 'genWorker':
            body.push(WORK, CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('g'), { memory: { task: 'idle' } });
        case 'mobileWorker':
            energyCap = Math.min(energyCap, 1200);
            numParts = Math.floor(energyCap / 300);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE, MOVE, CARRY, WORK);
            }
            switch (specialty) {
                case 'harvester':
                    return this.spawnCreep(body, creepName.getName('h'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                case 'builder':
                    return this.spawnCreep(body, creepName.getName('b'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                case 'satBuilder':
                    return this.spawnCreep(body, creepName.getName('Lb'), { memory: { role: role, specialty: specialty, task: 'idle', homeRoom: this.room.name } });
                case undefined:
                    return this.spawnCreep(body, creepName.getName('g'), { memory: { role: role, task: 'idle' } });
            }
            break;
        case 'reserver':
            energyCap = Math.min(energyCap, 1300);
            numParts = Math.floor(energyCap / 650);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE, CLAIM);
            }
            return this.spawnCreep(body, creepName.getName('R'), { memory: { role: role, specialty: specialty, task: 'idle' } });
        case 'satMiner':
            energyCap = Math.min(energyCap, 950) - 50;
            numParts = Math.floor(energyCap / 150);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE, WORK);
            }
            body.push(CARRY);
            return this.spawnCreep(body, creepName.getName('Lm'), { memory: { role: role, specialty: specialty, task: 'idle' } });
        case 'scout':
            body.push(MOVE);
            return this.spawnCreep(body, creepName.getName('s'), { memory: { role: role, home: this.room.name, task: 'idle' } });
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
                case 'upgrader':
                    return this.spawnCreep(body, creepName.getName('u'), { memory: { role: role, specialty: specialty, task: 'idle' } });
            }
            break;
        case 'pikeman':
            body.push(MOVE, MOVE, ATTACK, MOVE, ATTACK, ATTACK);
            return this.spawnCreep(body, creepName.getName('Ap'), { memory: { role: 'pikeman', task: 'Melee' } });
        case 'calvalry':
            energyCap = energyCap - 60;
            numParts = Math.floor(energyCap / 130);
            body.push(TOUGH, MOVE);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE);
            }
            for (let i = 0; i < numParts; i++) {
                body.push(ATTACK);
            }
            return this.spawnCreep(body, creepName.getName('Cm'), { memory: { role: 'calvalry', specialty: specialty, task: 'idle', homeRoom: this.room.name } });
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