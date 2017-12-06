"use strict";
var taskBuild = {
    run: function (creep) {
        let target;
        let containerPrint = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        if (containerPrint && containerPrint.length > 0) {
            target = creep.pos.findClosestByRange(containerPrint);
            this.buildTarget(creep, target);
        }
        else {
            let extensionPrint = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
            if (extensionPrint && extensionPrint.length > 0) {
                target = creep.pos.findClosestByRange(extensionPrint);
                this.buildTarget(creep, target);
            }
            else {
                target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                this.buildTarget(creep, target);
            }
        }
        console.log(target);
        if (!target)
            creep.memory.task = 'idle';
    },
    buildTarget: function (creep, target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskBuild;
//# sourceMappingURL=task.build.js.map