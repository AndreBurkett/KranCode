"use strict";
var taskUpgrade = {
    run: function (creep) {
        var target;
        target = creep.room.controller;
        if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};
module.exports = taskUpgrade;
//# sourceMappingURL=task.upgrade.js.map