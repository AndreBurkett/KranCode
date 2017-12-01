var taskBuild = {
    run: function(creep) {
        //target = Game.getObjectById(creep.memory.buildTarget);
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskBuild;