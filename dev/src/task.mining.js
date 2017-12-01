"use strict";
var taskMining = {
    run: function (creep) {
        var target;
        target = Game.getObjectById(creep.memory.sourceTarget);
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskMining;
//# sourceMappingURL=task.mining.js.map