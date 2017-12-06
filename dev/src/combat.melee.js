"use strict";
var combatMelee = {
    run: function (c) {
        var target;
        if (c.memory.target)
            target = Game.getObjectById(c.memory.target);
        else {
            target = c.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (!target) {
            }
        }
    }
};
module.exports = combatMelee;
//# sourceMappingURL=combat.melee.js.map