"use strict";
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
        if (sources[s].workers <= sources[s].freeSpaceCount) {
            let sourceContainer = room.lookForAt(LOOK_STRUCTURES, sources[s].containerSpot[0], sources[s].containerSpot[1], { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
            if (!sourceContainer[0] || sourceContainer[0] && sourceContainer[0].store[RESOURCE_ENERGY] < sourceContainer[0].storeCapacity) {
                var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'idle' });
                let num = Math.min(sources[s].freeSpaceCount - sources[s].workers, idleCreeps.length);
                for (let i = 0; i < num; i++) {
                    var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'idle' });
                    let iCreep = sources[s].pos.findClosestByRange(idleCreeps);
                    iCreep.memory.task = 'mine';
                    iCreep.memory.sourceTarget = room.sources[s].id;
                }
            }
        }
    }
    for (let c in mineCreeps) {
        if (mineCreeps[c].carry.energy == mineCreeps[c].carryCapacity) {
            let i = room.sources.indexOf(Game.getObjectById(mineCreeps[c].memory.sourceTarget));
            delete mineCreeps[c].memory.path;
            mineCreeps[c].memory.task = 'deposit';
        }
    }
    let sites = room.find(FIND_CONSTRUCTION_SITES);
    let numBuilders = buildCreeps.length || 0;
    let iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' });
    if (sites && sites.length > 0 && numBuilders <= 4 && iCreeps && iCreeps.length > 0) {
        if (numContainers == 0) {
            let depoCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'deposit' });
            for (let i in depoCreeps) {
                depoCreeps[i].memory.task = 'build';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
    }
    let buildPrints = room.find(FIND_CONSTRUCTION_SITES);
    if (!buildPrints) {
        let bCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'build' });
        for (let i in bCreeps) {
            bCreeps[i].memory.task = 'withdraw';
        }
    }
    let depoCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'deposit' && c.carry.energy == c.carryCapacity });
    if (depoCreeps && depoCreeps.length > 0 && numContainers == 0) {
        iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' });
        if (iCreeps && iCreeps.length >= 5) {
            for (let i in depoCreeps) {
                depoCreeps[i].memory.task = 'upgrade';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
        else {
            for (let i in depoCreeps) {
                depoCreeps[i].memory.task = 'harvest';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
    }
    else {
        for (let i in depoCreeps) {
            let c = Game.getObjectById(depoCreeps[i].memory.target);
            if ((c && c.store[RESOURCE_ENERGY] == c.storeCapacity) || (depoCreeps[i].path && depoCreeps[i].path.incomplete)) {
                depoCreeps[i].memory.task = 'withdraw';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
    }
    iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' });
    mineCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'mine' || c.memory.task === 'deposit' });
    if (mineCreeps && mineCreeps.length >= maxWorkers && numContainers > 0) {
        if (ctrlContainer[0]) {
            let lCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' || c.memory.task === 'withdraw' || c.memory.task === 'harvest' });
            let uCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'upgrade' || c.memory.taskQ === 'upgrade' });
            let uMax = 3;
            let maxAssign = Math.min(uMax - uCreeps.length, iCreeps.length);
            if (!uCreeps || uCreeps.length <= uMax && iCreeps && iCreeps.length >= 1 && ctrlContainer[0].store[RESOURCE_ENERGY] > 0) {
                console.log('assign uCreep');
                for (let i = 0; i < maxAssign; i++) {
                    iCreeps[i].memory.taskQ = 'upgrade';
                    iCreeps[i].memory.task = 'withdraw';
                }
                iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' });
            }
            if (uCreeps && uCreeps.length <= maxAssign && lCreeps && lCreeps.length >= 3 && ctrlContainer[0].store[RESOURCE_ENERGY] > 0) {
                for (let i = 0; i < maxAssign; i++) {
                    iCreeps[i].memory.taskQ = 'upgrade';
                    iCreeps[i].memory.task = 'withdraw';
                }
            }
            else {
                for (let i in iCreeps) {
                    iCreeps[i].memory.task = 'withdraw';
                }
            }
        }
        else {
            let uCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'upgrade' || c.memory.taskQ === 'upgrade' });
            let maxAssign = Math.min(1, iCreeps.length);
            if (!uCreeps || uCreeps.length < maxAssign) {
                for (let i = 0; i < maxAssign; i++) {
                    iCreeps[i].memory.taskQ = 'upgrade';
                    iCreeps[i].memory.task = 'withdraw';
                }
                iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' });
            }
            for (let i in iCreeps) {
                iCreeps[i].memory.task = 'withdraw';
            }
        }
    }
    let withdrawCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'withdraw' && c.carry.energy == c.carryCapacity });
    if (withdrawCreeps) {
        let uCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'withdraw' && c.memory.taskQ === 'upgrade' && c.carry.energy == c.carryCapacity });
        console.log('uc: ' + uCreeps);
        if (uCreeps && uCreeps.length > 0) {
            for (let i in uCreeps) {
                delete uCreeps[i].memory.target;
                delete uCreeps[i].memory.taskQ;
                uCreeps[i].memory.task = 'upgrade';
            }
        }
        let lCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task === 'idle' || c.memory.task === 'withdraw' || c.memory.task === 'harvest' });
        if (lCreeps && lCreeps.length >= 4) {
            let numBuilders = buildCreeps.length || 0;
            if (sites && sites.length > 0 && numBuilders <= 4) {
                for (let i in withdrawCreeps) {
                    if (withdrawCreeps[i].carry.energy == withdrawCreeps[i].carryCapacity) {
                        delete withdrawCreeps[i].memory.target;
                        withdrawCreeps[i].memory.task = 'build';
                    }
                }
            }
            else {
                withdrawCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'withdraw' });
                for (let i in withdrawCreeps) {
                    if (withdrawCreeps[i].carry.energy == withdrawCreeps[i].carryCapacity) {
                        delete withdrawCreeps[i].memory.target;
                        withdrawCreeps[i].memory.task = 'transport';
                    }
                }
            }
        }
        else {
            for (let i in withdrawCreeps) {
                if (withdrawCreeps[i].carry.energy == withdrawCreeps[i].carryCapacity) {
                    delete withdrawCreeps[i].memory.target;
                    delete withdrawCreeps[i].memory.taskQ;
                    withdrawCreeps[i].memory.task = 'harvest';
                }
            }
        }
    }
    if (ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] == ctrlContainer[0].storeCapacity) {
        let tCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task == 'transport' });
        for (let i in tCreeps) {
            tCreeps[i].memory.task = 'idle';
        }
    }
    iCreeps = room.find(FIND_MY_CREEPS, { filter: (c) => (c.memory.task == 'deposit' || c.memory.task == 'build' || c.memory.task == 'upgrade' || c.memory.task === 'transport' || !c.memory.task) && c.carry.energy == 0 });
    for (let i in iCreeps) {
        iCreeps[i].memory.task = 'idle';
        delete iCreeps[i].memory.sourceTarget;
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