interface Room {
    iCreep(): Creep;
    mCreep(): Creep;
    getRoomEnergy(): number;
    memory: RoomMemory;
}
interface RoomMemory{
    //iCreep(): Creep;
    //mCreep(): Creep;
}

Room.prototype.getRoomEnergy = function(){
    let energy = 0;
    let containers: [StructureContainer] = this.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER});
    for(let i in containers){
        energy = energy + containers[i].store[RESOURCE_ENERGY];
    }
}


Room.prototype.iCreep = function(){
    return this.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'idle' || !c.memory.task});
}

Room.prototype.mCreep = function(){
    return this.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.task === 'mine'});
}



Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
            // If we dont have the value stored locally
        if (!this._sources) {
                // If we dont have the value stored in memory
            if (!this.memory.sourceIds) {
                    // Find the sources and store their id's in memory,
                    // NOT the full objects
                this.memory.sourceIds = this.find(FIND_SOURCES)
                                        .map(source => source.id);
            }
            // Get the source objects from the id's in memory and store them locally
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }
        // return the locally stored value
        return this._sources;
    },
    set: function(newValue) {
        // when storing in memory you will want to change the setter
        // to set the memory value as well as the local value
        this.memory.sources = newValue.map(source => source.id);
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});
