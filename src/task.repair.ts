var taskRepair = {
    run: function(creep: Creep) {
        var target;
        if(creep.memory.repairTarget){
            target = Game.getObjectById(creep.memory.repairTarget);
            if(target.hits == target.hitsMax)
                delete creep.memory.repairTarget;
        }
        else{
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === (STRUCTURE_CONTAINER || STRUCTURE_ROAD) && s.hits < .75*s.hitsMax});
            if(target)
            creep.memory.repairTarget = target.id;
        }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskRepair;
