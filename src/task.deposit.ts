var taskDeposit = {
    run: function (creep: Creep) {
        var target;
        if(creep.memory.target){
            target = Game.getObjectById(creep.memory.target)
            if(!target)
            delete creep.memory.target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => { return (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_LINK) && s.store[RESOURCE_ENERGY] < s.storeCapacity; }
            });
            if(target)
                creep.memory.target = target.id;
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //if(!creep.memory.path)
                //    creep.memory.path = PathFinder.search(creep.pos, target.pos, {maxCost: 10})
                //if(creep.memory.path && !creep.memory.path.incomplete){
                        creep.moveTo(target);
                    //}
                //}
            }
            else
                delete creep.memory.target;
        }
    }
}

module.exports = taskDeposit;
