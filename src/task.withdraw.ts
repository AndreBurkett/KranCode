var taskWithdraw = {
    run: function(creep) {
        //target = Game.getObjectById(creep.memory.buildTarget);
        let target: string;
        if(creep.memory.target){
            target = Game.getObjectById(creep.memory.target)
        }
        else if(creep.memory.taskQ && creep.memory.taskQ == 'upgrade'){
            target = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
            creep.memory.target = target.id || null;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > creep.carryCapacity});
            if(target)
            creep.memory.target = target.id;
        }
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskWithdraw;
