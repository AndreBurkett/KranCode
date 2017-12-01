Object.defineProperty(StructureSpawn.prototype, 'spawnEnabled', {
    configurable: true,
    get: function() {
        //console.log('get spawnEnabled');
        if(_.isUndefined(this.memory.spawnEnabled)) {
            this.memory.spawnEnabled = true;
        }
        /*if(!_.isObject(this.spawnEnabled)) {
            console.log('wtf');
            return undefined;
        }*/
        return this.memory.spawnEnabled;// = this.memory.spawnEnabled;// || {};
    },
    set: function(value) {
        /*if(_.isUndefined(Memory.mySpawnMemory)) {
            Memory.mySpawnMemory = {};
        }
        if(!_.isObject(Memory.mySpawnMemory)) {
            throw new Error('Could not set source memory');
        }*/
        this.memory.spawnEnabled = value;
    }
});