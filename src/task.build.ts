var taskBuild = {
    run: function(creep: Creep) {
        let target
        //target = Game.getObjectById(creep.memory.buildTarget);
        let containerPrint = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER});
        if (containerPrint && containerPrint.length > 0)
        target = creep.pos.findClosestByRange(containerPrint);
        else
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(!target)
            creep.memory.task = 'idle';

        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskBuild;
