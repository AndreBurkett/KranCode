"use strict";
var combatMelee = {
    run: function (c) {
        if (c.memory.target)
            Game.getObjectById(c.memory.target);
        else {
            var target = c.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (!target) {
            }
        }
        switch (c.attack(target)) {
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
};
module.exports = combatMelee;
//# sourceMappingURL=combat.melee.js.map