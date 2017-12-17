require('./prototype.creep');
import {architect} from './constructionManager';
//import {towerManager} from ('./towerManager');

var towerManager = require('./towerManager');

function roomController(room: Room) {
    let sourceLen = room.sources.length;
    let sources = room.find<Source>(FIND_SOURCES);
    let containers = room.find<StructureContainer>(FIND_STRUCTURES, { filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER });
    let filledContainers = room.find(FIND_STRUCTURES, { filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 50});
    let numContainers = containers.length || 0;
    room.memory.numContainers = numContainers;
    var sourceContainerEnergy = room.getMineEnergy();

    let spawns = room.find<StructureSpawn>(FIND_MY_SPAWNS);
    let towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER})
    let hostiles = room.find<Creep>(FIND_HOSTILE_CREEPS);
    var cmNeeded = 0;
    var smNeeded = 0;
    var stNeeded = 0;
    var sbNeeded = 0;
    var rNeeded = 0;

    //Get Room Owner
    if (room.controller) {
        if(room.controller.level > 0){
            if(room.controller.my) room.memory.owner = 'Me';
            else room.memory.owner = 'Hostile'
        }
        else room.memory.owner = 'Neutral'
        var ctrlContainer = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s:Structure) => s.structureType === STRUCTURE_CONTAINER});
        if(ctrlContainer[0]) ctrlContainer[0].transportTarget = true;
        for (let i in hostiles) {
            if ((hostiles[i].getActiveBodyparts(ATTACK) > 0 || hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0) && towers.length < 1) {
                if (room.controller.safeModeAvailable) {
                    room.controller.activateSafeMode
                }
            }
        }
    }

    //Create Construction Manager
    if (room.memory.owner != 'Hostile') {
        var cm = new architect(room);
        if (spawns.length > 0) {
            cm.createBunker();
            cm.createRoads();
            cm.createControllerContainer();
        }
        cm.createSourceContainers();

        //Get Rooms
        if (room.memory.owner === 'Me') {
            let adjacentRoom = Game.map.describeExits(room.name);
            for (let i = 1; i <= 7; i = i + 2) {
                if (adjacentRoom[i]) {
                    if (Memory.rooms[adjacentRoom[i]]) {
                        //Build Highways
                        if (Memory.rooms[adjacentRoom[i]].owner !== 'Hostile') {
                            for (let j in Memory.rooms[adjacentRoom[i]].sourceIds) {
                                cm.createHighway(Memory.rooms[adjacentRoom[i]].sourceIds[j])
                            }
                            if (Memory.rooms[adjacentRoom[i]].owner === 'Neutral') {
                                if (Memory.rooms[adjacentRoom[i]].creeps) {
                                    if (Memory.rooms[adjacentRoom[i]].creeps['calvalry'] < 1) {
                                        if(getAdjacentRoomCreeps(adjacentRoom[i],'calvalry','Melee')) cmNeeded = 1;
                                    }
                                    if (Memory.rooms[adjacentRoom[i]].creeps['satMiner'] < Object.keys(Memory.rooms[adjacentRoom[i]].sourceIds).length) {
                                        if(getAdjacentRoomCreeps(adjacentRoom[i],'satMiner','Mine')) smNeeded = 1;
                                    }
                                    if (Memory.rooms[adjacentRoom[i]].creeps['satTransporter'] < Object.keys(Memory.rooms[adjacentRoom[i]].sourceIds).length && Memory.rooms[adjacentRoom[i]].numContainers > 0) {
                                        if(getAdjacentRoomCreeps(adjacentRoom[i],'satTransporter','Transport')) stNeeded = 1;
                                    }
                                    if (Memory.rooms[adjacentRoom[i]].creeps['satBuilder'] < 1) {
                                        if(getAdjacentRoomCreeps(adjacentRoom[i],'satBuilder','Build')) sbNeeded = 1;
                                    }
                                    if (Memory.rooms[adjacentRoom[i]].creeps['reserver'] < 1 && Game.rooms[adjacentRoom[i]] && Game.rooms[adjacentRoom[i]].controller) {
                                        if(getAdjacentRoomCreeps(adjacentRoom[i],'reserver','Reserve')) rNeeded = 1;
                                    }
                                }
                                else {
                                    Memory.rooms[adjacentRoom[i]].creeps = {};
                                    Memory.rooms[adjacentRoom[i]].creeps.satMiner = 0;
                                    Memory.rooms[adjacentRoom[i]].creeps.satTransporter = 0;
                                    Memory.rooms[adjacentRoom[i]].creeps.satBuilder = 0;
                                    Memory.rooms[adjacentRoom[i]].creeps.calvalry = 0;
                                    Memory.rooms[adjacentRoom[i]].creeps.reserver = 0;
                                }
                            }
                        }
                    }
                    else {
                        let scoutCreep = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.role === 'pikeman' })[0];
                        if (scoutCreep && scoutCreep.memory && scoutCreep.memory.task) {
                            scoutCreep.memory.task = 'scout';
                            scoutCreep.memory.targetRoom = adjacentRoom[i];
                        }
                    }
                }
            }
        }
    }

    function getAdjacentRoomCreeps(adjacentRoom, creepType, task) {
        let creepUnit = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.specialty === creepType && !c.memory.targetRoom })
        if (creepUnit.length > 0) {
            for (let j in creepUnit) {
                creepUnit[j].memory.task = task;
                creepUnit[j].memory.targetRoom = adjacentRoom;
                delete creepUnit[j].memory.taskQ;
                delete creepUnit[j].memory.state;
                Memory.rooms[adjacentRoom].creeps[creepType]++;
            }
            return 0;
        }
        else {
            return 1;
        }
    }

    for (let i in towers){
        towerManager.run(towers[i]);
    }

    for (let s in sources) {
        sources[s].memory.get;
    }

    setSpawnPriority()
    ////////////////////////////////// Request New Creeps ///////////////////////////////////////
    function setSpawnPriority() {
        var spawnRole = 'genWorker';
        var spawnSpecialty;
        var sites = room.find(FIND_CONSTRUCTION_SITES);
        var maxMiners = 2 * sourceLen;
        let harvesterCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.specialty === 'harvester' }).length;
        let mineCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.specialty === 'miner' && c.ticksToLive > 50 }).length;
        let deliveryCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.role === 'deliveryWorker' }).length;
        let upgradeCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.specialty === 'upgrader' }).length;
        let buildCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.role === 'mobileWorker' && c.memory.specialty != 'satMiner' }).length
        let roomCreeps = room.find<Creep>(FIND_MY_CREEPS).length;
        let pikeCreeps = room.find<Creep>(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.role === 'pikeman' }).length;
        var disableSpawning = false;
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
            else if (cmNeeded == 1) {
                spawnRole = 'calvalry';
                spawnSpecialty = 'calvalry';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole, spawnSpecialty);
                }
            }
            else if (smNeeded == 1) {
                spawnRole = 'satMiner';
                spawnSpecialty = 'satMiner';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole, spawnSpecialty);
                }
            }
            else if (stNeeded == 1) {
                spawnRole = 'deliveryWorker';
                spawnSpecialty = 'satTransporter';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole, spawnSpecialty);
                }
            }
            else if (buildCreeps <= sites.length / 20) {
                spawnRole = 'mobileWorker';
                spawnSpecialty = 'builder';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole, spawnSpecialty);
                }
            }
            else if (sbNeeded == 1) {
                spawnRole = 'mobileWorker';
                spawnSpecialty = 'satBuilder';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole, spawnSpecialty);
                }
            }
            else if (rNeeded == 1) {
                spawnRole = 'reserver';
                spawnSpecialty = 'reserver';
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
            else if (upgradeCreeps < 3 || (ctrlContainer[0].store[RESOURCE_ENERGY] > 1500 && upgradeCreeps < 4)) {
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
            else disableSpawning = true;
        }
        else {
            if (buildCreeps < sites.length / 20) {
                spawnRole = 'mobileWorker';
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole)
                }
            }
            else if (roomCreeps < 10) {
                for (let i in spawns) {
                    spawns[i].sCreep(spawnRole);
                }
            }
            else disableSpawning = true;
        }
    }


    ////////////////////////////////// Task Priority ////////////////////////////////////////////

    //Assign Mine Task
    let specMiners = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'miner' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'mine'})
    for(let i in specMiners){
        specMiners[i].memory.task = 'mine';
        specMiners[i].memory.target = sources[getMinSource()].id;
        if(containers.length > 0)
            delete specMiners[i].memory.taskQ;
        else{
            specMiners[i].memory.taskQ = 'build';
        }
    }

    let mdCreeps: number = room.find(FIND_MY_CREEPS, {
        filter: (c: Creep) => (c.memory.task === 'mine' || c.memory.task === 'deposit' || c.memory.taskQ === 'deposit')
    }).length;
    if (containers.length > 0) {
        AssignTask('mine', (maxMiners - mdCreeps),'deposit', sources[getMinSource()].id)
    }
    else if (room.memory.owner == 'Me'){
        AssignTask('mine', (maxMiners - mdCreeps),'harvest', sources[getMinSource()].id)
    }
    else(AssignTask('Mine', (maxMiners - mdCreeps),'build', sources[getMinSource()].id))

    function getMinSource(){
        let sources = room.find<Source>(FIND_SOURCES);
        let minSource = 0;
        let minWorkers = 99;
        for(let s=0;s<sources.length;s++){
            if(minWorkers > sources[s].workers){
                minWorkers = sources[s].workers;
                minSource = s;
            }
        }
        return minSource;
    }

    //Assign Deposit Task
    let dCreeps: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ === 'deposit' && c.carry[RESOURCE_ENERGY] === c.carryCapacity}).length;
    AssignQTask('deposit',dCreeps);

    //Assign Upgrade Task
    let specUpgraders = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'upgrader' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'upgrade'})
    if(containers.length > 0 && ctrlContainer[0]){
        for(let i in specUpgraders){
            specUpgraders[i].memory.task = 'withdraw';
            specUpgraders[i].memory.taskQ = 'upgrade';
        }
    }
    else{
        for(let i in specUpgraders){
            specUpgraders[i].memory.task = 'mine';
            specUpgraders[i].memory.taskQ = 'build';
        }
    }

    //Assign Harvest Task
    let harvCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ === 'harvest' && c.carry[RESOURCE_ENERGY] === c.carryCapacity}).length;
    AssignQTask('harvest', harvCreeps)
    let hCreeps:number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'harvest' || c.memory.taskQ === 'harvest'}).length;
    let specHarvesters = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'harvester' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'withdraw'});
    if (disableSpawning == false && room.energyAvailable != room.energyCapacityAvailable) {
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
        else AssignTask('withdraw', 1, 'harvest');
    }

    //Assign Build Task
    if(sites && sites.length > 0 && mineCreeps > 1){
        let specBuilders = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'builder' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'build'})
        let bCreeps: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'build' || c.memory.taskQ === 'build'}).length;
        for(let i in specBuilders){
            specBuilders[i].memory.task = 'withdraw';
            specBuilders[i].memory.taskQ = 'build'
        }
        if (bCreeps < 3)
            AssignTask('withdraw', 3, 'build');
    }
    //Assign Repair Task
    let rCreeps:number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'repair' || c.memory.taskQ === 'repair'}).length;
    if(rCreeps < 1)
        AssignTask('withdraw', 1, 'repair');

    //Assign Tower Fill Task
    let emptyTowers = room.find(FIND_STRUCTURES, {filter: (s: StructureTower) => s.structureType  === STRUCTURE_TOWER && s.energy < s.energyCapacity}).length
    if(emptyTowers > 0){
        let tfCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'towerFill' || c.memory.taskQ === 'towerFill'}).length;
        if(tfCreeps < 1)
            AssignTask('withdraw', 1, 'towerFill')
    }

    //Assign Upgrade Task
    let iCreep: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle'}).length;
    AssignTask('withdraw', iCreep, 'upgrade');

    //Assign Transport Task
    let tCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'transport' || c.memory.taskQ === 'transport'}).length;
    if(ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] < (.85 * ctrlContainer[0].storeCapacity) && tCreeps < 2)
        AssignTask('withdraw', 10, 'transport');

    //Assign Withdraw Task
    let wCreeps = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'withdraw' && c.carry[RESOURCE_ENERGY] === c.carryCapacity});
    for(let i in wCreeps){
        wCreeps[i].memory.task = wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.target;
    }

    //Assign Idle Task
    let iCreeps = room.find<Creep>(FIND_MY_CREEPS,
        {filter: (c: Creep) => c.carry[RESOURCE_ENERGY] === 0 && (c.memory.task === 'build' || c.memory.task === 'deposit' || c.memory.task === 'harvest' || c.memory.task === 'repair' || c.memory.task === 'towerFill' || c.memory.task === 'transport' || c.memory.task === 'upgrade' || (c.memory.task === 'withdraw' && !filledContainers))});
    for(let i in iCreeps){
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


    //Assign Task Functions
    function AssignTask(task: String, maxAssign: number, taskQ?: String, target?: string){
        let creep;
        if(_.contains(['build','mine','repair','upgrade'], task) || _.contains(['build','mine','repair','upgrade'], taskQ))
            creep = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.getActiveBodyparts(WORK) > 0 && (c.memory.task === 'idle' || !c.memory.task)});
        else{
            creep = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle' || !c.memory.task});
        }
        let num = Math.min(maxAssign, creep.length);

        for(let i=0; i < num; i++){
            creep[i].setTask(task);
            if(taskQ)
                creep[i].memory.taskQ = taskQ;
            if(target)
                creep[i].memory.target = target; //Todo assign closest creep to target
        }
    }
    AssignQdTask();

    function AssignQdTask(){
        let c = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ && c.carry[RESOURCE_ENERGY] === c.carryCapacity})
        for(let i in c){
            c[i].memory.task = c[i].memory.taskQ
            delete c[i].memory.taskQ;
            delete c[i].memory.target;
        }
    }

    function AssignQTask(task: String, maxAssign: number, taskQ?: String, target?: string){
        let creep = room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ == task && c.carry[RESOURCE_ENERGY] === c.carryCapacity})
        let num = Math.min(maxAssign, creep.length);
        for(let i=0; i< num; i++){
            creep[i].memory.task = task;
            if(taskQ)
                creep[i].memory.taskQ = taskQ;
            else
                delete creep[i].memory.taskQ;
            if(target)
                creep[i].memory.target = target; //Todo assign closest creep to target
            else
                delete creep[i].memory.target;
        }
    }
}

module.exports = roomController;
