var taskUpgrade = {
    run: function(creep) {
        //target = Game.getObjectById(creep.memory.buildTarget);
        target = creep.room.controller
        if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskUpgrade;