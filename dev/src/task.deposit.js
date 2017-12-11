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
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                    (s.store[RESOURCE_ENERGY] + creep.carryCapacity) < s.storeCapacity
            });
            if (target)
                creep.memory.target = target.id;
            else
                creep.memory.task = 'idle';
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else
                delete creep.memory.target;
        }
    }
};
module.exports = taskDeposit;
//# sourceMappingURL=task.deposit.js.map