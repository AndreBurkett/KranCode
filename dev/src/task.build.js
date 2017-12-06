"use strict";
var taskBuild = {
    run: function (c) {
        let target;
        let containerPrint = c.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        if (containerPrint && containerPrint.length > 0) {
            target = c.pos.findClosestByRange(containerPrint);
            this.buildTarget(c, target);
        }
        else {
            let extensionPrint = c.room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
            if (extensionPrint && extensionPrint.length > 0) {
                target = c.pos.findClosestByRange(extensionPrint);
                if (!this.buildTarget(c, target)) {
                    this.getClosestPrints(c);
                }
            }
            else {
                this.getClosestPrints(c);
            }
        }
        console.log(target);
        if (!target)
            c.memory.task = 'idle';
    },
    buildTarget: function (c, target) {
        switch (c.build(target)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                return true;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                return false;
            case OK:
                return true;
        }
    },
    getClosestPrints: function (c) {
        let target = c.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        this.buildTarget(c, target);
    }
};
module.exports = taskBuild;
//# sourceMappingURL=task.build.js.map