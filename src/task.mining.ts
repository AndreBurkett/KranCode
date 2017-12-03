var taskMine = {
    run: function(creep: Creep) {
        var target;
        target = Game.getObjectById(creep.memory.target);
        if (!creep.memory.taskQ) {
            if (creep.pos.findInRange(STRUCTURE_CONTAINER, 3).length > 0)
                creep.memory.taskQ = 'deposit';
            else
                creep.memory.taskQ = 'build';
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskMine;
