"use strict";
var taskBuild = {
    run: function (creep) {
        var target;
        var containerPrint = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === STRUCTURE_CONTAINER; } });
        if (containerPrint && containerPrint.length > 0)
            target = creep.pos.findClosestByRange(containerPrint);
        else
            target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskBuild;
//# sourceMappingURL=task.build.js.map