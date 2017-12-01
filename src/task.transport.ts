var taskTransport = {
    run: function(creep) {
        let ctrl = creep.room.controller;
        let target = ctrl.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.memory && s.memory.transportTarget == true});

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskTransport;
