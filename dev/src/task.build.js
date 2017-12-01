"use strict";
var taskBuild = {
    run: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskBuild;
//# sourceMappingURL=task.build.js.map