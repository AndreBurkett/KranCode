var taskWithdraw = {
    run: function(creep: Creep) {
        //target = Game.getObjectById(creep.memory.buildTarget);
        let target;
        if(creep.memory.target){
            target = Game.getObjectById(creep.memory.target)
        }
        else if(creep.memory.taskQ && creep.memory.taskQ == 'upgrade' && creep.room.controller){
            target = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > creep.carryCapacity});
            creep.memory.target = target.id || null;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > creep.carryCapacity});
            if(target)
            creep.memory.target = target.id;
        }
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskWithdraw;
