"use strict";
var towerFill = {
    run: function (c) {
        let target;
        if (!c.memory.target) {
            target = c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity });
            c.memory.target = target.id;
        }
        else {
            target = Game.getObjectById(c.memory.target);
        }
        if (!target)
            c.memory.task = 'transport';
        switch (creep.withdraw(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_FULL:
                delete creep.memory.target;
                break;
        }
    }
};
module.exports = towerFill;
//# sourceMappingURL=task.towerFill.js.map