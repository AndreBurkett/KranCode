"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./prototype.creep');
const constructionManager_1 = require("./constructionManager");
var towerManager = require('./towerManager');
function roomController(room) {
    let sourceLen = room.sources.length;
    let sources = room.find(FIND_SOURCES);
    let containers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
    let filledContainers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 50 });
    let numContainers = containers.length || 0;
    var sourceContainerEnergy = room.getMineEnergy();
    let spawns = room.find(FIND_MY_SPAWNS);
    let towers = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
    let hostiles = room.find(FIND_HOSTILE_CREEPS);
    var smNeeded = 0;
    if (room.memory.owner === 'Me') {
        let adjacentRoom = Game.map.describeExits(room.name);
        for (let i = 1; i <= 7; i = i + 2) {
            if (adjacentRoom[i]) {
                if (Memory.rooms[adjacentRoom[i]]) {
                    if (Memory.rooms[adjacentRoom[i]].owner === 'Neutral') {
                        if (Memory.rooms[adjacentRoom[i]].creeps) {
                            if (Memory.rooms[adjacentRoom[i]].creeps['satMiners'] < 1) {
                                let satMiners = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'satMiner' && !c.memory.targetRoom });
                                if (satMiners.length > 0) {
                                    for (let j in satMiners) {
                                        satMiners[j].memory.task = 'Mine';
                                        satMiners[j].memory.targetRoom = adjacentRoom[i];
                                        delete satMiners[j].memory.taskQ;
                                        Memory.rooms[adjacentRoom[i]].creeps['satMiners']++;
                                    }
                                }
                                else {
                                    smNeeded = 1;
                                }
                            }
                        }
                        else {
                            Memory.rooms[adjacentRoom[i]].creeps = {};
                            Memory.rooms[adjacentRoom[i]].creeps.satMiners = 0;
                        }
                    }
                }
                else {
                    let scoutCreep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'pikeman' })[0];
                    if (scoutCreep && scoutCreep.memory && scoutCreep.memory.task) {
                        scoutCreep.memory.task = 'scout';
                        scoutCreep.memory.targetRoom = adjacentRoom[i];
                    }
                }
            }
        }
    }
    if (room.controller) {
        if (room.controller.level > 0) {
            if (room.controller.my)
                room.memory.owner = 'Me';
            else
                room.memory.owner = 'Hostile';
        }
        else
            room.memory.owner = 'Neutral';
        var ctrlContainer = room.controller.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        if (ctrlContainer[0])
            ctrlContainer[0].transportTarget = true;
        for (let i in hostiles) {
            if ((hostiles[i].getActiveBodyparts(ATTACK) > 0 || hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0) && towers.length < 1) {
                if (room.controller.safeModeAvailable) {
                    room.controller.activateSafeMode;
                }
            }
        }
    }
    for (let i in towers) {
        towerManager.run(towers[i]);
    }
    for (let s in sources) {
        sources[s].memory.get;
    }
    if (room.memory.owner != 'Hostile') {
        var cm = new constructionManager_1.architect(room);
        if (spawns.length > 0) {
            cm.createBunker();
            cm.createRoads();
            cm.createControllerContainer();
        }
        cm.createSourceContainers();
    }
    var spawnRole = 'genWorker';
    var spawnSpecialty;
    var sites = room.find(FIND_CONSTRUCTION_SITES);
    let maxMiners = 2 * sourceLen;
    let harvesterCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'harvester' }).length;
    let mineCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'miner' && c.ticksToLive > 50 }).length;
    let deliveryCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'deliveryWorker' }).length;
    let upgradeCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'upgrader' }).length;
    let buildCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'mobileWorker' && c.memory.specialty != 'satMiner' }).length;
    let roomCreeps = room.find(FIND_MY_CREEPS).length;
    let pikeCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'pikeman' }).length;
    let disableSpawning = false;
    if (harvesterCreeps < 1) {
        spawnRole = 'mobileWorker';
        spawnSpecialty = 'harvester';
        for (let i in spawns) {
            spawns[i].sCreep(spawnRole, spawnSpecialty);
        }
    }
    else if (mineCreeps < maxMiners) {
        spawnRole = 'statWorker';
        spawnSpecialty = 'miner';
        for (let i in spawns) {
            spawns[i].sCreep(spawnRole, spawnSpecialty);
        }
    }
    else if (containers.length > 0) {
        if (deliveryCreeps < 1) {
            spawnRole = 'deliveryWorker';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (upgradeCreeps < 1) {
            spawnRole = 'statWorker';
            spawnSpecialty = 'upgrader';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (smNeeded == 1) {
            spawnRole = 'mobileWorker';
            spawnSpecialty = 'satMiner';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (buildCreeps < sites.length / 20) {
            spawnRole = 'mobileWorker';
            spawnSpecialty = 'builder';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (pikeCreeps < 1) {
            spawnRole = 'pikeman';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (deliveryCreeps < 4) {
            spawnRole = 'deliveryWorker';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (upgradeCreeps < 3 || (ctrlContainer[0].store[RESOURCE_ENERGY] > 1500 && upgradeCreeps < 5)) {
            spawnRole = 'statWorker';
            spawnSpecialty = 'upgrader';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (roomCreeps < 10) {
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else
            disableSpawning = true;
    }
    else {
        if (buildCreeps < sites.length / 20) {
            spawnRole = 'mobileWorker';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (roomCreeps < 10) {
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else
            disableSpawning = true;
    }
    let specMiners = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'miner' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'mine' });
    for (let i in specMiners) {
        specMiners[i].memory.task = 'mine';
        specMiners[i].memory.target = sources[getMinSource()].id;
        if (containers.length > 0)
            delete specMiners[i].memory.taskQ;
        else {
            specMiners[i].memory.taskQ = 'build';
        }
    }
    let mdCreeps = room.find(FIND_MY_CREEPS, {
        filter: (c) => (c.memory.task === 'mine' || c.memory.task === 'deposit' || c.memory.taskQ === 'deposit')
    }).length;
    if (containers.length > 0) {
        AssignTask('mine', (maxMiners - mdCreeps), 'deposit', sources[getMinSource()].id);
    }
    else {
        AssignTask('mine', (maxMiners - mdCreeps), 'harvest', sources[getMinSource()].id);
    }
    function getMinSource() {
        let sources = room.find(FIND_SOURCES);
        let minSource = 0;
        let minWorkers = 99;
        for (let s in sources) {
            if (minWorkers > sources[s].workers) {
                minWorkers = sources[s].workers;
                minSource = s;
            }
        }
        return minSource;
    }
    let dCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.taskQ === 'deposit' && c.carry[RESOURCE_ENERGY] === c.carryCapacity }).length;
    AssignQTask('deposit', dCreeps);
    let specUpgraders = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'upgrader' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'upgrade' });
    if (containers.length > 0 && ctrlContainer[0]) {
        for (let i in specUpgraders) {
            specUpgraders[i].memory.task = 'withdraw';
            specUpgraders[i].memory.taskQ = 'upgrade';
        }
    }
    else {
        for (let i in specUpgraders) {
            specUpgraders[i].memory.task = 'mine';
            specUpgraders[i].memory.taskQ = 'build';
        }
    }
    let harvCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.taskQ === 'harvest' && c.carry[RESOURCE_ENERGY] === c.carryCapacity }).length;
    AssignQTask('harvest', harvCreeps);
    let hCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'harvest' || c.memory.taskQ === 'harvest' }).length;
    let specHarvesters = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'harvester' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'withdraw' });
    if (disableSpawning == false) {
        if (sourceContainerEnergy > 50) {
            for (let i in specHarvesters) {
                specHarvesters[i].memory.task = 'withdraw';
                specHarvesters[i].memory.taskQ = 'harvest';
            }
        }
        else {
            for (let i in specHarvesters) {
                specHarvesters[i].memory.task = 'mine';
                specHarvesters[i].memory.taskQ = 'harvest';
            }
        }
        if (hCreeps < 3 && sourceContainerEnergy > 2500)
            AssignTask('withdraw', 3, 'harvest');
        else if (hCreeps <= 1 && sourceContainerEnergy > 750)
            AssignTask('withdraw', 1, 'harvest');
    }
    if (sites && sites.length > 0 && mineCreeps > 1) {
        let specBuilders = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'builder' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'build' });
        let bCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'build' || c.memory.taskQ === 'build' }).length;
        for (let i in specBuilders) {
            specBuilders[i].memory.task = 'withdraw';
            specBuilders[i].memory.taskQ = 'build';
        }
        if (bCreeps < 3)
            AssignTask('withdraw', 3, 'build');
    }
    let rCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'repair' || c.memory.taskQ === 'repair' }).length;
    if (rCreeps < 1)
        AssignTask('withdraw', 1, 'repair');
    let emptyTowers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity }).length;
    if (emptyTowers > 0) {
        let tfCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'towerFill' || c.memory.taskQ === 'towerFill' }).length;
        if (tfCreeps < 1)
            AssignTask('withdraw', 1, 'towerFill');
    }
    let iCreep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' }).length;
    AssignTask('withdraw', iCreep, 'upgrade');
    let tCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'transport' || c.memory.taskQ === 'transport' }).length;
    if (ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] < (.85 * ctrlContainer[0].storeCapacity) && tCreeps < 2)
        AssignTask('withdraw', 10, 'transport');
    let wCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'withdraw' && c.carry[RESOURCE_ENERGY] === c.carryCapacity });
    for (let i in wCreeps) {
        wCreeps[i].memory.task = wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.target;
    }
    let iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.carry[RESOURCE_ENERGY] === 0 && (c.memory.task === 'build' || c.memory.task === 'deposit' || c.memory.task === 'harvest' || c.memory.task === 'repair' || c.memory.task === 'towerFill' || c.memory.task === 'transport' || c.memory.task === 'upgrade' || (c.memory.task === 'withdraw' && !filledContainers)) });
    for (let i in iCreeps) {
        if (iCreeps[i].ticksToLive < 25)
            iCreeps[i].suicide();
        else {
            if (iCreeps[i].memory.taskQ)
                iCreeps[i].memory.task = iCreeps[i].memory.taskQ;
            else
                iCreeps[i].setTask('idle');
            delete iCreeps[i].memory.target;
            delete iCreeps[i].memory.taskQ;
        }
    }
    function AssignTask(task, maxAssign, taskQ, target) {
        let creep;
        if (_.contains(['build', 'mine', 'repair', 'upgrade'], task) || _.contains(['build', 'mine', 'repair', 'upgrade'], taskQ))
            creep = room.find(FIND_MY_CREEPS, { filter: (c) => c.getActiveBodyparts(WORK) > 0 && (c.memory.task === 'idle' || !c.memory.task) });
        else {
            creep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' || !c.memory.task });
        }
        let num = Math.min(maxAssign, creep.length);
        for (let i = 0; i < num; i++) {
            creep[i].setTask(task);
            if (taskQ)
                creep[i].memory.taskQ = taskQ;
            if (target)
                creep[i].memory.target = target;
        }
    }
    AssignQdTask();
    function AssignQdTask() {
        let c = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.taskQ && c.carry[RESOURCE_ENERGY] === c.carryCapacity });
        for (let i in c) {
            c[i].memory.task = c[i].memory.taskQ;
            delete c[i].memory.taskQ;
            delete c[i].memory.target;
        }
    }
    function AssignQTask(task, maxAssign, taskQ, target) {
        let creep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.taskQ == task && c.carry[RESOURCE_ENERGY] === c.carryCapacity });
        let num = Math.min(maxAssign, creep.length);
        for (let i = 0; i < num; i++) {
            creep[i].memory.task = task;
            if (taskQ)
                creep[i].memory.taskQ = taskQ;
            else
                delete creep[i].memory.taskQ;
            if (target)
                creep[i].memory.target = target;
            else
                delete creep[i].memory.target;
        }
    }
}
module.exports = roomController;
//# sourceMappingURL=roomController.js.map