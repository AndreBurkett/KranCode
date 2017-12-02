"use strict";
require('./prototype.creep');
function roomController(room) {
    let sourceLen = room.sources.length;
    let sources = room.find(FIND_SOURCES);
    let containers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
    let numContainers = containers.length || 0;
    let maxWorkers = 0;
    if (room.controller)
        var ctrlContainer = room.lookForAt(LOOK_STRUCTURES, room.controller.containerSpot[0], room.controller.containerSpot[1]);
    let spawns = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
    let mineCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'mine' });
    let buildCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'build' });
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
    if (!Memory.paths.sourceC || Memory.paths.sourceC.length < numContainers) {
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
    for (let s = 0; s < sourceLen; s++) {
        let num = sources[s].freeSpaceCount - sources[s].workers;
        console.log(sources[s].freeSpaceCount);
        console.log(sources[s].workers);
        if (containers)
            AssignTask('mine', num, 'deposit', sources[s].id);
    }
    let dCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task !== 'deposit' && c.memory.taskQ === 'deposit' }).length;
    AssignQTask('deposit', dCreeps);
    let uCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'upgrade' || c.memory.taskQ === 'upgrade' }).length;
    if (uCreeps < 1) {
        AssignTask('withdraw', 1, 'upgrade');
    }
    let hCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'harvest' || c.memory.taskQ === 'harvest' || c.memory.task === 'idle' }).length;
    if (hCreeps < 3)
        AssignTask('withdraw', 3, 'harvest');
    let bCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'build' || c.memory.taskQ === 'build' }).length;
    if (bCreeps < 3)
        AssignTask('withdraw', 3, 'build');
    let rCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'repair' || c.memory.taskQ === 'repair' }).length;
    if (rCreeps < 1)
        AssignTask('withdraw', 1, 'repair');
    let tCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'transport' || c.memory.taskQ === 'transport' }).length;
    if (tCreeps < 2)
        AssignTask('withdraw', 2, 'transport');
    let wCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'withdraw' && c.carry[RESOURCE_ENERGY] === c.carryCapacity });
    for (let i in wCreeps) {
        wCreeps[i].memory.task = wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.taskQ;
    }
    let iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.carry[RESOURCE_ENERGY] === 0 && c.memory.task === 'build' || c.memory.task === 'harvest' || c.memory.task === 'repair' || c.memory.task === 'transport' || c.memory.task === 'upgrade' });
    for (let i in iCreeps) {
        iCreeps[i].setTask('idle');
        delete iCreeps[i].memory.target;
    }
    function AssignTask(task, maxAssign, taskQ, target) {
        let creep = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' || !c.memory.task });
        let num = Math.min(maxAssign, creep.length);
        for (let i = 0; i < num; i++) {
            creep[i].setTask(task);
            if (taskQ)
                creep[i].memory.taskQ = taskQ;
            if (target)
                creep[i].memory.target = target;
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
//# sourceMappingURL=roomController.js.map