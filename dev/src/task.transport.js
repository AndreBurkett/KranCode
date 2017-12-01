"use strict";
var taskTransport = {
    run: function (creep) {
        var ctrl = creep.room.controller;
        var target = ctrl.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (s) { return s.structureType === STRUCTURE_CONTAINER && s.memory && s.memory.transportTarget == true; } });
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskTransport;
//# sourceMappingURL=task.transport.js.map