var taskWithdraw = {
    run: function(c: Creep) {
        let target;
        if(c.memory.target){
            target = Game.getObjectById(c.memory.target)
        }
        else if(c.memory.taskQ && c.memory.taskQ == 'upgrade' && c.room.controller){
            target = c.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= c.carryCapacity});
            if(target)
            c.memory.target = target.id;
        }
        else {
            target = c.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > c.carryCapacity});
            if(target)
            c.memory.target = target.id;
        }

        switch (c.withdraw(target, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                delete c.memory.target;
                break;
        }
    }
}

module.exports = taskWithdraw;
