var taskMine = {
    run: function(creep: Creep) {
        var target;
        target = Game.getObjectById(creep.memory.target);
        if(!target)
            target = creep.pos.findClosestByRange(FIND_SOURCES);
        if (!creep.memory.taskQ && creep.carry[RESOURCE_ENERGY] > 0) {
            if (creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s: Structure) => s.structureType == STRUCTURE_CONTAINER}).length > 0)
                creep.memory.taskQ = 'deposit';
            else if(creep.room.find(FIND_MY_CREEPS, {filter: (c:Creep) => c.memory.role === 'mobileWorker'}).length > 0)
                creep.memory.taskQ = 'build';
            else
                creep.memory.taskQ = 'harvest';
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskMine;
