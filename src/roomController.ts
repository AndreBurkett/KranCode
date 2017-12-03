require('./prototype.creep');

function roomController(room: Room) {
    let sourceLen = room.sources.length;
    let sources = room.find(FIND_SOURCES);
    let containers = room.find(FIND_STRUCTURES, { filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER });
    let filledContainers = room.find(FIND_STRUCTURES, { filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 50});
    let numContainers = containers.length || 0;
    let maxWorkers = 0
    if (room.controller)
    var ctrlContainer = room.lookForAt(LOOK_STRUCTURES, room.controller.containerSpot[0], room.controller.containerSpot[1]);
    let spawns = room.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType == STRUCTURE_SPAWN});
    let towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType  === STRUCTURE_TOWER})
    //let mCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'mine' });
    let buildCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'build' });

    for (let s in sources) {
        sources[s].memory.get;
        maxWorkers = maxWorkers + sources[s].memory.workers;
        sources[s].containerSpot;
        //Create Blueprints
        room.createConstructionSite(sources[s].containerSpot[0], sources[s].containerSpot[1], STRUCTURE_CONTAINER);
    }


    let rSpawn = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_SPAWN});
    for(let i in rSpawn){
        //Create Road Blueprints around room spawns
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y - 1, STRUCTURE_ROAD);
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y + 1, STRUCTURE_ROAD);
        //Create Extension Blueprints around room spawns
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y - 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x - 1, rSpawn[i].pos.y + 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y - 1, STRUCTURE_EXTENSION);
        room.createConstructionSite(rSpawn[i].pos.x + 1, rSpawn[i].pos.y + 1, STRUCTURE_EXTENSION);
        //Create Tower around Room spawns
        room.createConstructionSite(rSpawn[i].pos.x, rSpawn[i].pos.y + 2, STRUCTURE_TOWER);
    }
    //Create Control Container Blueprints
    if(ctrlContainer[0]) {
        ctrlContainer[0].transportTarget = true;
    }
    else if(room.controller) {
        room.createConstructionSite(room.controller.containerSpot[0], room.controller.containerSpot[1], STRUCTURE_CONTAINER);
    }

    //Get Spawn to Source Containers Paths
    if(!Memory.paths.sourceC || Memory.paths.sourceC.length < numContainers) {
        let pathNum = 0;
        for(let i in containers){
            for(let j in spawns){
                let startPos = containers[i].pos;
                let endPos = spawns[j].pos;
                let path = PathFinder.search(startPos, endPos, {swampCost: 1});
                pathNum = pathNum + 1;
                Memory.paths.sourceC[pathNum] = path;
            }
        }
    }
    else {
        for(let i in Memory.paths.sourceC){
            for(let j in Memory.paths.sourceC[i].path){
                room.createConstructionSite(Memory.paths.sourceC[i].path[j].x, Memory.paths.sourceC[i].path[j].y, STRUCTURE_ROAD);
            }
        }
    }
    //Get Spawn to Controller Path
    if(!Memory.paths.myPath && room.controller){
        let startPos = room.controller.pos;
        let endPos = room.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType == STRUCTURE_SPAWN});
        for(let i in endPos){
            let myPath = PathFinder.search(startPos, endPos[i].pos, {swampCost: 1})
            Memory.paths.myPath = myPath;
        }
    }
    //Place Spawn to Controller Roads
    for(let sToC in Memory.paths.myPath.path) {
        room.createConstructionSite(Memory.paths.myPath.path[sToC].x,Memory.paths.myPath.path[sToC].y, STRUCTURE_ROAD);
    }

    ////////////////////////////////// Request New Creeps ///////////////////////////////////////

    var spawnRole  = 'genWorker';
    var spawnSpecialty;
    let maxMiners = 2 * sourceLen;
    let mineCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'miner'}).length;
    let deliveryCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === 'deliveryWorker'}).length;
    if(mineCreeps < maxMiners){
        spawnRole = 'statWorker';
        spawnSpecialty = 'miner';
    }
    else if(deliveryCreeps < 2){
        spawnRole = 'deliveryWorker';
    }
    for(let i in spawns){
        spawns[i].sCreep(spawnRole, spawnSpecialty);
    }


    ////////////////////////////////// Task Priority ////////////////////////////////////////////

    //Assign Mine Task
    let specMiners = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.specialty === 'miner' && c.carry[RESOURCE_ENERGY] === 0 && c.memory.task !== 'mine'})
    for(let i in specMiners){
        specMiners[i].memory.task = 'mine';
        specMiners[i].memory.target = sources[getMinSource()].id;
        delete specMiners[i].memory.taskQ;
    }

    //let allCreeps = room.find(FIND_MY_CREEPS).length;
    //let mCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'mine'}).length;
    let mdCreeps: number = room.find(FIND_MY_CREEPS, {
        filter: (c: Creep) => (c.memory.task === 'mine' || c.memory.task === 'deposit' || c.memory.taskQ === 'deposit')
    }).length;
    if (containers) {
        AssignTask('mine', (maxMiners - mdCreeps),'deposit', sources[getMinSource()].id)
    else
        AssignTask('mine', (maxMiners - mdCreeps),'harvest', sources[getMinSource()].id)
    }

    function getMinSource(){
        let sources = room.find(FIND_SOURCES);
        let minSource = 0;
        let minWorkers = 99;
        for(let s in sources){
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
    let uCreeps: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'upgrade' || c.memory.taskQ === 'upgrade'}).length;
    if(uCreeps < 1){
        AssignTask('withdraw', 1, 'upgrade');
    }

    //Assign Harvest Task
    let harvCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ === 'harvest' && c.carry[RESOURCE_ENERGY] === c.carryCapacity}).length;
    AssignQTask('harvest', harvCreeps)
    let hCreeps:number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'harvest' || c.memory.taskQ === 'harvest' || c.memory.task === 'idle'}).length;
    if(hCreeps < 3)
        AssignTask('withdraw', 3, 'harvest');

    //Assign Build Task
    let sites = room.find(FIND_CONSTRUCTION_SITES);
    if(sites && sites.length > 0){
        let bCreeps: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'build' || c.memory.taskQ === 'build'}).length;
        if (bCreeps < 3)
            AssignTask('withdraw', 3, 'build');
    }
    //Assign Repair Task
    let rCreeps:number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'repair' || c.memory.taskQ === 'repair'}).length;
    if(rCreeps < 1)
        AssignTask('withdraw', 1, 'repair');

    //Assign Transport Task
    let tCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'transport' || c.memory.taskQ === 'transport'}).length;
    if(ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] < (.85 * ctrlContainer[0].storeCapacity) && tCreeps < 2)
        AssignTask('withdraw', 3, 'transport');

    //Assign Tower Fill Task
    let emptyTowers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType  === STRUCTURE_TOWER && s.energy < s.energyCapacity}).length
    if(emptyTowers > 0){
        let tfCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.target === 'towers'}).length;
        if(tfCreeps < 1)
            AssignTask('withdraw', 1, 'transport', 'towers')
    }


    //Assign Upgrade Task
    let iCreep: number = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle'}).length;
    AssignTask('withdraw', iCreep, 'upgrade');

    //Assign Withdraw Task
    let wCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'withdraw' && c.carry[RESOURCE_ENERGY] === c.carryCapacity});
    for(let i in wCreeps){
        wCreeps[i].memory.task = wCreeps[i].memory.taskQ;
        delete wCreeps[i].memory.taskQ;
    }

    //Assign Idle Task
    let iCreeps = room.find(FIND_MY_CREEPS,
        {filter: (c: Creep) => c.carry[RESOURCE_ENERGY] === 0 && (c.memory.task === 'build' || c.memory.task === 'deposit' || c.memory.task === 'harvest' || c.memory.task === 'repair' || c.memory.task === 'transport' || c.memory.task === 'upgrade' || (c.memory.task === 'withdraw' && !filledContainers))});
    //console.log(room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.carry[RESOURCE_ENERGY] === 0 && c.memory.task === 'withdraw' && !filledContainers}));
    //console.log(iCreeps);
    for(let i in iCreeps){
        if(iCreeps[i].memory.taskQ)
            iCreeps[i].memory.task = iCreeps[i].memory.taskQ;
        else
            iCreeps[i].setTask('idle');
        delete iCreeps[i].memory.target;
        delete iCreeps[i].memory.taskQ;
    }


    //Assign Task Functions
    function AssignTask(task: String, maxAssign: number, taskQ?: String, target?: string){
        let creep;
        if(_.contains(['build','mine','repair','upgrade'], task) || _.contains(['build','mine','repair','upgrade'], taskQ))
            creep = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.getActiveBodyparts(WORK) > 0 && (c.memory.task === 'idle' || !c.memory.task)});
        else
            creep = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle' || !c.memory.task});
        let num = Math.min(maxAssign, creep.length);
        for(let i=0; i < num; i++){
            creep[i].setTask(task);
            if(taskQ)
                creep[i].memory.taskQ = taskQ;
            if(target)
                creep[i].memory.target = target; //Todo assign closest creep to target
        }
    }

    function AssignQTask(task: String, maxAssign: number, taskQ?: String, target?: string){
        let creep = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.taskQ == task && c.carry[RESOURCE_ENERGY] === c.carryCapacity})
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





    /////////////////////////////////////////////////////////////////////////////////////////////
/*
    //Assign Mine Task
    for (let s = 0; s < sourceLen; s++) {
        if (sources[s].workers <= sources[s].freeSpaceCount) {
            let sourceContainer = room.lookForAt(LOOK_STRUCTURES, sources[s].containerSpot[0], sources[s].containerSpot[1], { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
            if (!sourceContainer[0] || sourceContainer[0] && sourceContainer[0].store[RESOURCE_ENERGY] < sourceContainer[0].storeCapacity) {
                var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'idle' });
                let num = Math.min(sources[s].freeSpaceCount - sources[s].workers, idleCreeps.length);
                for (let i = 0; i < num; i++) {
                    var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'idle' });
                    let iCreep = sources[s].pos.findClosestByRange(idleCreeps);
                    iCreep.memory.task = 'mine';
                    iCreep.memory.sourceTarget = room.sources[s].id;
                }
            }
        }
    }
    //Assign Deposit Task
    for (let c in mineCreeps) {
        if (mineCreeps[c].carry.energy == mineCreeps[c].carryCapacity) {
            //let i = room.sources.indexOf(Game.getObjectById(mineCreeps[c].memory.sourceTarget));
            delete mineCreeps[c].memory.path;
            mineCreeps[c].memory.task = 'deposit';
        }
    }


    //Assign Build Task
    let sites = room.find(FIND_CONSTRUCTION_SITES);
    let numBuilders = buildCreeps.length || 0;
    let iCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'idle'});
    if (sites && sites.length > 0 && numBuilders <= 4 && iCreeps && iCreeps.length > 0) {
        if (numContainers == 0) {
            let depoCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'deposit' });
            for (let i in depoCreeps) {
                depoCreeps[i].memory.task = 'build';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
    }

    //Assign Build Creeps
    let buildPrints = room.find(FIND_CONSTRUCTION_SITES);
    if(!buildPrints){
        let bCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'build'});
        for(let i in bCreeps){
            bCreeps[i].memory.task = 'withdraw';
        }
    }

    //Assign Depo Creeps
    let depoCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'deposit' && c.carry.energy == c.carryCapacity});
    if(depoCreeps && depoCreeps.length > 0 && numContainers == 0){
        iCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'idle'});
        if(iCreeps && iCreeps.length >= 5){
            for(let i in depoCreeps){
                depoCreeps[i].memory.task = 'upgrade';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
        else{
            for(let i in depoCreeps){
                depoCreeps[i].memory.task = 'harvest';
                delete depoCreeps[i].memory.sourceTarget;
            }
        }
    }
    else{
        for(let i in depoCreeps){
            let c = Game.getObjectById(depoCreeps[i].memory.target);
            if((c && c.store[RESOURCE_ENERGY] == c.storeCapacity) || (depoCreeps[i].path && depoCreeps[i].path.incomplete)){
                depoCreeps[i].memory.task = 'withdraw';
                delete depoCreeps[i].memory.sourceTarget
            }
        }
    }

    //Assign Withdraw Task
    iCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'idle'});
    mineCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'mine' || c.memory.task === 'deposit'});
    if(mineCreeps && mineCreeps.length >= maxWorkers && numContainers > 0){
        if(ctrlContainer[0]){
            let lCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle' || c.memory.task === 'withdraw' || c.memory.task === 'harvest' });
            let uCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task  === 'upgrade' || c.memory.taskQ === 'upgrade'});
            let uMax = 3;
            let maxAssign = Math.min(uMax-uCreeps.length, iCreeps.length);

            if(uCreeps && uCreeps.length <= maxAssign && lCreeps && lCreeps.length >= 3 && ctrlContainer[0].store[RESOURCE_ENERGY] > 0){
                for(let i = 0; i < maxAssign; i++){
                    iCreeps[i].memory.taskQ = 'upgrade';
                    iCreeps[i].memory.task = 'withdraw';
                }
            }
            else{
                for(let i in iCreeps){
                    iCreeps[i].memory.task = 'withdraw';
                }
            }
        }
        else{
            let uCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task  === 'upgrade' || c.memory.taskQ === 'upgrade'});
            let maxAssign = Math.min(1, iCreeps.length);
            if(!uCreeps || uCreeps.length < maxAssign){
                for(let i = 0; i < maxAssign; i++){
                    iCreeps[i].memory.taskQ = 'upgrade';
                    iCreeps[i].memory.task = 'withdraw';
                }
                iCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'idle'});
            }
            for(let i in iCreeps){
                iCreeps[i].memory.task = 'withdraw';
            }
        }
    }

    //Assign Withdraw Creeps
    let withdrawCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'withdraw' && c.carry.energy == c.carryCapacity});
    if (withdrawCreeps) {
        let uCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'withdraw' && c.memory.taskQ === 'upgrade'});
        if (!uCreeps || uCreeps.length == 0) {
            for (let i in withdrawCreeps) {
                //delete uCreeps[i].memory.target;
                //delete uCreeps[i].memory.taskQ;
                withdrawCreeps[i].memory.task = 'upgrade';
            }
            withdrawCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'withdraw' && c.carry.energy == c.carryCapacity});
        }
        let lCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task === 'idle' || c.memory.task === 'withdraw' || c.memory.task === 'harvest' });
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
                withdrawCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'withdraw' });
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

    //Re-assign Transport Task
    if(ctrlContainer[0] && ctrlContainer[0].store[RESOURCE_ENERGY] == ctrlContainer[0].storeCapacity){
        let tCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'transport' });
        for(let i in tCreeps){
            tCreeps[i].memory.task = 'idle';
        }
    }
    //Assign Idle Task
    iCreeps = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => (c.memory.task == 'deposit' || c.memory.task == 'build' || c.memory.task == 'upgrade' || c.memory.task ==='transport' || !c.memory.task) && c.carry.energy == 0});
    for(let i in iCreeps){
        iCreeps[i].memory.task = 'idle';
        delete iCreeps[i].memory.sourceTarget;
    }

*/

    //Start & Stop Spawning
    var idleCreeps = room.find(FIND_MY_CREEPS, { filter: (c: Creep) => c.memory.task == 'idle' || c.memory.task == 'withdraw' || c.memory.task === 'harvest'});
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
