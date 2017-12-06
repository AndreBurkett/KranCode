interface Room {
    iCreep(): Creep;
    mCreep(): Creep;
    getRoomEnergy(): number;
    getMineEnergy(): number;
    getContainers(): StructureContainer;
    memory: RoomMemory;
}
interface RoomMemory{
    sourceContainers: StructureContainer;
    allContainers: StructureContainer;
    //iCreep(): Creep;
    //mCreep(): Creep;
}

Room.prototype.getContainers = function(){
    return this.memory.allContainers = this.find(FIND_STRUCTURES, {filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER});
}

Room.prototype.getRoomEnergy = function(){
    let energy = 0;
    let containers: [StructureContainer] = this.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER});
    for(let i in containers){
        energy = energy + containers[i].store[RESOURCE_ENERGY];
    }
}

Room.prototype.getMineEnergy = function(){
    let energy = 0
    if(!this.memory.sourceContainers){
        var mineContainers = [];
        for(let i in this.memory.sources){
            for(let j in getContainers()){
                if(Game.getObjectById(this.memory.sources[i]).pos.inRangeTo(Game.getObjectById(this.memory.allContainers[j]), 2)){
                    mineContainers.push(Game.getObjectById(this.memory.allContainers[j]));
                }
            }
        }
        this.memory.sourceContainers = mineContainers;
    }
    for(let i in this.memory.sourceContainers){
        try {
            energy = energy + this.memory.sourceContainers[i];
        } catch (e) {
            console.log('caught mine energy error');
            delete this.memory.sourceContainers;
            this.getMineEnergy();
        }
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
