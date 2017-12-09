"use strict";
var combatMelee = {
    run: function (c) {
        var target;
        if (c.memory.target)
            target = Game.getObjectById(c.memory.target);
        else {
            target = c.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (!target) {
                c.moveTo(25, 25);
            }
        }
        switch (c.attack(target)) {
            case ERR_NOT_IN_RANGE:
                if (target.pos.x > 6 && target.pos.x < 44 && target.pos.y > 6 && target.pos.y < 44) {
                    c.moveTo(target, { reusePath: 1 });
                }
                else
                    delete c.memory.target;
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
};
module.exports = combatMelee;
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
        if (this._freeSpaceCount == undefined) {
            if (this.memory.freeSpaceCount == undefined) {
                let freeSpaceCount = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                            freeSpaceCount++;
                    }, this);
                }, this);
                this.memory.freeSpaceCount = freeSpaceCount;
            }
            this._freeSpaceCount = this.memory.freeSpaceCount;
        }
        return this._freeSpaceCount;
    },
    enumerable: false,
    configurable: true
});
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
        if (this._containerSpot == undefined) {
            if (this.memory.containerSpot == undefined) {
                [this.pos.x - 1, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                            this.memory.containerSpot = [x, y];
                    }, this);
                }, this);
            }
            this._containerSpot = this.memory.containerSpot;
        }
        return this._containerSpot;
    },
    enumerable: false,
    configurable: true
});
Creep.prototype.getTask = function () {
    return this.memory.task;
};
Creep.prototype.setTask = function (cTask) {
    let creep = this;
    let memory = creep.memory;
    memory.task = cTask;
};
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
    var mineContainers = [];
    var source = [];
    let cont = this.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
    for (let i in this.memory.sourceIds) {
        source[i] = Game.getObjectById(this.memory.sourceIds[i]);
        for (let j in cont) {
            if (source[i].pos.inRangeTo(cont[j], 2)) {
                energy = energy + cont[j].store[RESOURCE_ENERGY];
            }
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
        return this.memory.workers = _.filter(Game.creeps, (c) => c.memory.target === this.id).length;
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
        if (this._freeSpaceCount == undefined) {
            if (this.memory.freeSpaceCount == undefined) {
                let freeSpaceCount = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                            freeSpaceCount++;
                    }, this);
                }, this);
                this.memory.freeSpaceCount = freeSpaceCount;
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
        if (this._containerSpot == undefined) {
            if (this.memory.containerSpot == undefined) {
                [this.pos.x - 1, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                            this.memory.containerSpot = [x, y];
                    }, this);
                }, this);
            }
            this._containerSpot = this.memory.containerSpot;
        }
        return this._containerSpot;
    },
    enumerable: false,
    configurable: true
});
var creepName = require('./util.nameBuilder');
StructureSpawn.prototype.sCreep = function (role, specialty) {
    var body = [];
    if (this.room.find(FIND_MY_CREEPS).length > 0 && this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }).length > 0 && this.room.find(FIND_MY_CREEPS).length >= 4)
        var energyCap = this.room.energyCapacityAvailable;
    else
        var energyCap = 300;
    var numParts;
    switch (role) {
        case 'deliveryWorker':
            numParts = Math.floor(energyCap / 100);
            for (let i = 0; i < numParts; i++)
                body.push(CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('d'), { memory: { role: role, task: 'idle' } });
            break;
        case 'genWorker':
            body.push(WORK, CARRY, MOVE);
            return this.spawnCreep(body, creepName.getName('g'), { memory: { task: 'idle' } });
            break;
        case 'mobileWorker':
            numParts = Math.floor(energyCap / 250);
            for (let i = 0; i < numParts; i++) {
                body.push(MOVE, CARRY, MOVE, WORK);
            }
            switch (specialty) {
                case 'harvester':
                    return this.spawnCreep(body, creepName.getName('h'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
                case 'builder':
                    return this.spawnCreep(body, creepName.getName('b'), { memory: { role: role, specialty: specialty, task: 'idle' } });
                    break;
                case undefined:
                    return this.spawnCreep(body, creepName.getName('g'), { memory: { role: role, task: 'idle' } });
                    break;
            }
            break;
        case 'scout':
            body.push(MOVE);
            return this.spawnCreep(body, creepName.getName('s'), { memory: { role: role, home: this.room.name, task: 'idle' } });
            break;
        case 'statWorker':
            body.push(MOVE, MOVE, CARRY);
            energyCap = energyCap - 150;
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
var taskBuild = {
    run: function (c) {
        let target;
        let containerPrint = c.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        if (containerPrint && containerPrint.length > 0) {
            target = c.pos.findClosestByRange(containerPrint);
            this.buildTarget(c, target);
        }
        else {
            let extensionPrint = c.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
            if (extensionPrint && extensionPrint.length > 0) {
                target = c.pos.findClosestByRange(extensionPrint);
                if (!this.buildTarget(c, target)) {
                    this.getClosestPrints(c);
                }
            }
            else {
                this.getClosestPrints(c);
            }
        }
    },
    buildTarget: function (c, target) {
        switch (c.build(target)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                return true;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                return false;
            case OK:
                return true;
        }
    },
    getClosestPrints: function (c) {
        let target = c.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (!target)
            c.memory.task = 'idle';
        else
            this.buildTarget(c, target);
    }
};
module.exports = taskBuild;
var taskDeposit = {
    run: function (creep) {
        var target;
        if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target);
            if (!target)
                delete creep.memory.target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_LINK) &&
                    (s.store[RESOURCE_ENERGY] + creep.carryCapacity) < s.storeCapacity
            });
            if (target)
                creep.memory.target = target.id;
            else
                creep.memory.task = 'idle';
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else
                delete creep.memory.target;
        }
    }
};
module.exports = taskDeposit;
var taskHarvest = {
    run: function (creep) {
        var target;
        if (creep.carry.energy == 0) {
            delete creep.memory.sourceTarget;
            creep.memory.task = 'idle';
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; }
            });
            if (!target)
                creep.memory.task = 'idle';
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};
module.exports = taskHarvest;
var taskMine = {
    run: function (creep) {
        var target;
        target = Game.getObjectById(creep.memory.target);
        if (!target)
            target = creep.pos.findClosestByRange(FIND_SOURCES);
        if (!creep.memory.taskQ && creep.carry[RESOURCE_ENERGY] > 0) {
            if (creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }).length > 0)
                creep.memory.taskQ = 'deposit';
            else if (creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'mobileWorker' }).length > 0)
                creep.memory.taskQ = 'build';
            else
                creep.memory.taskQ = 'harvest';
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskMine;
var taskRepair = {
    run: function (creep) {
        var target;
        if (creep.memory.repairTarget) {
            target = Game.getObjectById(creep.memory.repairTarget);
            if (target.hits == target.hitsMax)
                delete creep.memory.repairTarget;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === (STRUCTURE_CONTAINER || STRUCTURE_ROAD) && s.hits < .75 * s.hitsMax });
            if (target)
                creep.memory.repairTarget = target.id;
        }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskRepair;
var towerFill = {
    run: function (c) {
        var target = c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity });
        if (!target) {
            console.log('wtf');
            c.memory.task = 'transport';
        }
        switch (c.transfer(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_FULL:
                delete c.memory.target;
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
};
module.exports = towerFill;
var taskTransport = {
    run: function (creep) {
        let target;
        let ctrl = creep.room.controller;
        target = ctrl.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.memory && s.memory.transportTarget == true });
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskTransport;
var taskUpgrade = {
    run: function (creep) {
        let target;
        target = creep.room.controller;
        if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskUpgrade;
var taskWithdraw = {
    run: function (c) {
        let target;
        if (c.memory.target) {
            target = Game.getObjectById(c.memory.target);
        }
        else if (c.memory.taskQ && c.memory.taskQ == 'upgrade' && c.room.controller) {
            target = c.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= c.carryCapacity });
            if (target)
                c.memory.target = target.id;
        }
        else {
            target = c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > c.carryCapacity });
            if (target)
                c.memory.target = target.id;
        }
        switch (c.withdraw(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                delete c.memory.target;
                break;
        }
    }
};
module.exports = taskWithdraw;
var towerManager = {
    run: function (t) {
        let hostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile)
            t.attack(hostile);
    }
};
module.exports = towerManager;
var utilNameBuilder = {
    getName: function (role) {
        if (Memory.nameIndex === undefined)
            Memory.nameIndex = {};
        if ((Memory.nameIndex[role] === undefined) || (Memory.nameIndex[role] > 996))
            Memory.nameIndex[role] = 0;
        Memory.nameIndex[role] += 1;
        return role + (Memory.nameIndex[role] + 1);
    },
    commitName: function (role) {
        var newIndex = Memory.nameIndex[role] + 1;
        Memory.nameIndex[role] = newIndex;
    }
};
module.exports = utilNameBuilder;
//# sourceMappingURL=main.js.map