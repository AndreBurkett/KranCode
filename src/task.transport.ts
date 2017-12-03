var taskTransport = {
    run: function(creep) {
        let target;
        let ctrl = creep.room.controller;
        if(creep.memory.target && creep.memory.target === 'towers'){
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType  === STRUCTURE_TOWER && s.energy < s.energyCapacity});
        }
        else
            target = ctrl.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER && s.memory && s.memory.transportTarget == true});

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskTransport;
