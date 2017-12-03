"use strict";
var taskMine = {
    run: function (creep) {
        var target;
        target = Game.getObjectById(creep.memory.target);
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskMine;
//# sourceMappingURL=task.mining.js.map