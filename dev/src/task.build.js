"use strict";
var taskBuild = {
    run: function (creep) {
        let target;
        let containerPrint = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        if (containerPrint && containerPrint.length > 0)
            target = creep.pos.findClosestByRange(containerPrint);
        else {
            let extensionPrint = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
            if (extensionPrint && extensionPrint.length > 0) {
                target = creep.pos.findClosestByRange(extensionPrint);
            }
            else {
                target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            }
        }
        if (!target)
            creep.memory.task = 'idle';
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskBuild;
//# sourceMappingURL=task.build.js.map