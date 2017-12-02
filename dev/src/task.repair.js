"use strict";
var taskRepair = {
    run: function (creep) {
        var target;
        if (creep.memory.repairTarget) {
            target = Game.getObjectById(creep.memory.repairTarget);
        }
        else {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === (STRUCTURE_CONTAINER || STRUCTURE_ROAD) && s.hits < .75 * s.hitsMax });
            if (target)
                creep.memory.repairTarget = target.id;
        }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskRepair;
//# sourceMappingURL=task.repair.js.map