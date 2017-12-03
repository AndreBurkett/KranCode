"use strict";
var towerFill = {
    run: function (c) {
        let target;
        if (!c.memory.target) {
            target = c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity });
            if (!target)
                c.memory.task = 'transport';
            else
                c.memory.target = target.id;
        }
        else {
            target = Game.getObjectById(c.memory.target);
        }
        switch (c.transfer(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_FULL:
                delete c.memory.target;
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
};
module.exports = towerFill;
//# sourceMappingURL=task.towerFill.js.map