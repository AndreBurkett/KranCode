var creepName = require('./util.nameBuilder');

interface StructureSpawn{
    sCreep(role:String, specialty?:String): void;
}
StructureSpawn.prototype.sCreep = function(role, specialty?){
    var body = [];
    if(this.room.find(FIND_MY_CREEPS).length > 0 && this.room.find(FIND_STRUCTURES, {filter: (s:StructureContainer) => s.structureType === STRUCTURE_CONTAINER}).length > 0 && this.room.find(FIND_MY_CREEPS).length >= 4)
        var energyCap:number = this.room.energyCapacityAvailable
    else
        var energyCap:number = 300;
    var numParts: number;
    switch (role){
        case 'deliveryWorker':
            numParts = Math.floor(energyCap/100)
            for(let i=0;i<numParts;i++)
                body.push(CARRY,MOVE);
            return this.spawnCreep(body, creepName.getName('d'), {memory: {role: role, task: 'idle'}});
            break;
        case 'genWorker':
            body.push(WORK,CARRY,MOVE);
            return this.spawnCreep(body, creepName.getName('g'), {memory: {task: 'idle'}});
            break;
        case 'mobileWorker':
            numParts = Math.floor(energyCap/250)
            for(let i=0;i<numParts;i++){
                body.push(MOVE,CARRY,MOVE,WORK);
            }
            switch(specialty){
                case 'harvester':
                    return this.spawnCreep(body, creepName.getName('h'), {memory: {role: role, specialty: specialty, task: 'idle'}});
                    break;
                case 'builder':
                    return this.spawnCreep(body, creepName.getName('b'), {memory: {role: role, specialty: specialty, task:'idle'}})
                    break;
                case undefined:
                    return this.spawnCreep(body, creepName.getName('g'), {memory: {role: role, task:'idle'}})
                    break;
            }
            break;
        case 'scout':
            body.push(MOVE)
                return this.spawnCreep(body, creepName.getName('s'), {memory: {role: role, home: this.room.name, task: 'idle'}})
                break;
        case 'statWorker':
            body.push(MOVE, MOVE,CARRY);
            energyCap = energyCap - 150;
            numParts = Math.floor(energyCap/100);
            for(let i=0; i<numParts; i++){
                body.push(WORK);
            }
            switch(specialty){
                case 'miner':
                    return this.spawnCreep(body, creepName.getName('m'), {memory: {role: role, specialty: specialty, task: 'idle'}});
                    break;
                case 'upgrader':
                    return this.spawnCreep(body, creepName.getName('u'), {memory: {role: role, specialty: specialty, task: 'idle'}});
                    break;
            }
            break;
        case 'pikeman':
            body.push(MOVE,ATTACK,MOVE,ATTACK)
            return this.spawnCreep(body, creepName.getName('Ap'), {memory: {role: 'pikeman', task: 'combatMelee'}});
            break;
    }
}


Object.defineProperty(StructureSpawn.prototype, 'spawnEnabled', {
    configurable: true,
    get: function() {
        if(_.isUndefined(this.memory.spawnEnabled)) {
            this.memory.spawnEnabled = true;
        }
        return this.memory.spawnEnabled;
    },
    set: function(value) {
        this.memory.spawnEnabled = value;
    }
});
