"use strict";
var taskMine = {
    run: function (creep) {
        var target;
        target = Game.getObjectById(creep.memory.target);
        if (!creep.memory.taskQ) {
            if (creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }).length > 0)
                creep.memory.taskQ = 'deposit';
        }
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskMine;
//# sourceMappingURL=task.mine.js.map