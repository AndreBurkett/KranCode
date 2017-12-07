var taskBuild = {
    run: function(c: Creep) {
        let target
        //target = Game.getObjectById(creep.memory.buildTarget);
        let containerPrint = c.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER});
        if (containerPrint && containerPrint.length > 0){
            target = c.pos.findClosestByRange<ConstructionSite>(containerPrint);
            this.buildTarget(c, target);
        }
        else{
            let extensionPrint = c.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES, {filter: (s: Structure) => s.structureType === STRUCTURE_EXTENSION});
            if(extensionPrint && extensionPrint.length > 0){
                target = c.pos.findClosestByRange<ConstructionSite>(extensionPrint);
                if(!this.buildTarget(c, target)){
                    this.getClosestPrints(c);
                }
            }
            else{
                this.getClosestPrints(c);
            }
        }
    },
    buildTarget: function(c: Creep, target: ConstructionSite) {
        switch (c.build(target)){
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                return true;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                return false;
            case OK:
                return true;
        }
    },
    getClosestPrints: function(c: Creep){
        let target = c.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES);
        if(!target)
            c.memory.task = 'idle';
        else
            this.buildTarget(c, target);
    }
}

module.exports = taskBuild;
