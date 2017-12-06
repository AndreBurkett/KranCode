"use strict";
require('./prototype.creep');
var towerManager = require('./towerManager');
function roomController(room) {
    let sourceLen = room.sources.length;
    let sources = room.find(FIND_SOURCES);
    let containers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
    let filledContainers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 50 });
    let numContainers = containers.length || 0;
    let maxWorkers = 0;
    if (room.controller)
        var ctrlContainer = room.lookForAt(LOOK_STRUCTURES, room.controller.containerSpot[0], room.controller.containerSpot[1]);
    let spawns = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
    let towers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
    for (let i in towers) {
        towerManager.run(towers[i]);
    }
    for (let s in sources) {
        sources[s].memory.get;
        maxWorkers = maxWorkers + sources[s].memory.workers;
        sources[s].containerSpot;
        room.createConstructionSite(sources[s].containerSpot[0], sources[s].containerSpot[1], STRUCTURE_CONTAINER);
    }
    let rSpawn = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN });
    for (let i in rSpawn) {
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y - 1, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y + 1, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y - 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y + 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y - 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y + 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y + 2, STRUCTURE_TOWER);
    }
    if (ctrlContainer[0]) {
        ctrlContainer[0].transportTarget = true;
    }
    else if (room.controller) {
        room.createConstructionSite(room.controller.containerSpot[0], room.controller.containerSpot[1], STRUCTURE_CONTAINER);
    }
    if (!Memory.paths.sourceC || !Memory.paths.sourceC[numContainers]) {
        let pathNum = 0;
        for (let i in containers) {
            for (let j in spawns) {
                let startPos = containers[i].pos;
                let endPos = spawns[j].pos;
                let path = PathFinder.search(startPos, endPos, { swampCost: 1 });
                pathNum = pathNum + 1;
                Memory.paths.sourceC[pathNum] = path;
            }
        }
    }
    else {
        for (let i in Memory.paths.sourceC) {
            for (let j in Memory.paths.sourceC[i].path) {
                room.createConstructionSite(Memory.paths.sourceC[i].path[j].x, Memory.paths.sourceC[i].path[j].y, STRUCTURE_ROAD);
            }
        }
    }
    if (!Memory.paths.myPath && room.controller) {
        let startPos = room.controller.pos;
        let endPos = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
        for (let i in endPos) {
            let myPath = PathFinder.search(startPos, endPos[i].pos, { swampCost: 1 });
            Memory.paths.myPath = myPath;
        }
    }
    for (let sToC in Memory.paths.myPath.path) {
        room.createConstructionSite(Memory.paths.myPath.path[sToC].x, Memory.paths.myPath.path[sToC].y, STRUCTURE_ROAD);
    }
    var spawnRole = 'genWorker';
    var spawnSpecialty;
    var sites = room.find(FIND_CONSTRUCTION_SITES);
    let maxMiners = 2 * sourceLen;
    let harvesterCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'harvester' }).length;
    let mineCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'miner' }).length;
    let deliveryCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'deliveryWorker' }).length;
    let upgradeCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'upgrader' }).length;
    let buildCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'mobileWorker' }).length;
    let roomCreeps = room.find(FIND_MY_CREEPS).length;
    let pikeCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'pikeman' }).length;
    if (containers.length > 0) {
        if (mineCreeps < maxMiners) {
            spawnRole = 'statWorker';
            spawnSpecialty = 'miner';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (deliveryCreeps < 6) {
            spawnRole = 'deliveryWorker';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (upgradeCreeps < 3) {
            spawnRole = 'statWorker';
            spawnSpecialty = 'upgrader';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole, spawnSpecialty);
            }
        }
        else if (buildCreeps * 10 < sites.length) {
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
        else if (roomCreeps < 20) {
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
    }
    else {
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
        else if (buildCreeps * 10 < sites.length) {
            spawnRole = 'mobileWorker';
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
        else if (roomCreeps < 20) {
            for (let i in spawns) {
                spawns[i].sCreep(spawnRole);
            }
        }
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
    if (hCreeps < 3)
        1 && room.getMineEnergy() > 2500;
    AssignTask('withdraw', 3, 'harvest');
    if (hCreeps <= 1 && room.getMineEnergy() > 750)
        AssignTask('withdraw', 1, 'harvest');
    if (sites && sites.length > 0) {
        let specBuilders = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.specialty === 'builder' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'build' });
        let bCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'build' || c.memory.taskQ === 'build' }).length;
        for (let i in specBuilders) {
            specBuilders[i].memory.task = 'withdraw';
            specBuilders[i].memory.taskQ = 'build';
            if (bCreeps < 3)
                AssignTask('withdraw', 3, 'build');
        }
        let rCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'repair' || c.memory.taskQ === 'repair' }).length;
        if (rCreeps < 1)
            AssignTask('withdraw', 1, 'repair');
        let tCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'transport' || c.memory.taskQ === 'transport' }).length;
        if (ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] < (.85 * ctrlContainer[0].storeCapacity) && tCreeps < 2)
            AssignTask('withdraw', 3, 'transport');
        let emptyTowers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity }).length;
        if (emptyTowers > 0) {
            let tfCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'towerFill' || c.memory.taskQ === 'towerFill' }).length;
            if (tfCreeps < 1)
                AssignTask('withdraw', 1, 'towerFill');
        }
        let iCreep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' }).length;
        AssignTask('withdraw', iCreep, 'upgrade');
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
        var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'idle' || c.memory.task == 'withdraw' || c.memory.task === 'harvest' });
        if (idleCreeps && idleCreeps.length >= 5) {
            for (let spawnName in Game.spawns) {
                Game.spawns[spawnName].spawnEnabled = false;
            }
        }
        else {
            for (let spawnName in Game.spawns) {
                Game.spawns[spawnName].spawnEnabled = true;
            }
        }
    }
    module.exports = roomController;
}
//# sourceMappingURL=roomController.js.map