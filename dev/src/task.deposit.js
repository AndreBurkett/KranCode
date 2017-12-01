"use strict";
var taskDeposit = {
    run: function (creep) {
        var target;
        if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target);
            if (!target)
                delete creep.memory.target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity; }
            });
            if (target)
                creep.memory.target = target.id;
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (!creep.memory.path)
                    creep.memory.path = PathFinder.search(creep.pos, target.pos, { maxCost: 10 });
                if (creep.memory.path && !creep.memory.path.incomplete)
                    creep.moveByPath(creep.memory.path);
            }
        }
    }
};
module.exports = taskDeposit;
//# sourceMappingURL=task.deposit.js.map