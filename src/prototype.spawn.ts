var creepName = require('./util.nameBuilder');

interface StructureSpawn{
    sCreep(role:String, specialty:String): void;
}
StructureSpawn.prototype.sCreep = function(role, specialty?){
    var body = [];
    var energyCap = this.room.energyCapacityAvailable
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
        case 'statWorker':
            body.push(MOVE,CARRY);
            energyCap = energyCap - 150;
            numParts = Math.floor(energyCap/100);
            for(let i=0; i<numParts; i++){
                body.push(WORK);
            }
            if(specialty = 'miner')
                return this.spawnCreep(body, creepName.getName('m'), {memory: {role: role, specialty: specialty, task: 'idle'}})

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
