var taskWithdraw = {
    run: function(creep: Creep) {
        let target;
        if(creep.memory.target){
            target = Game.getObjectById(creep.memory.target)
        }
        else if(creep.memory.taskQ && creep.memory.taskQ == 'upgrade' && creep.room.controller){
            target = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity});
            if(target)
            creep.memory.target = target.id;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > creep.carryCapacity});
            if(target)
            creep.memory.target = target.id;
        }

        switch (creep.withdraw(target, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                delete creep.memory.target;
                break;
        }
    }
}

module.exports = taskWithdraw;
