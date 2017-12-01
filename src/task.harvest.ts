var taskHarvest = {
    run: function (creep) {
        //console.log('harvesting');
        if (creep.carry.energy == 0) {
            delete creep.memory.sourceTarget;
            creep.memory.task = 'idle';
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; }
            });
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

module.exports = taskHarvest;