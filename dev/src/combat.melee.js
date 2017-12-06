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
        if (target.pos.x > 6 || target.pos.x < 44) {
            if (target.pos.y > 6 || target.pos.y < 44) {
                switch (c.attack(target)) {
                    case ERR_NOT_IN_RANGE:
                        c.moveTo(target, { reusePath: 3 });
                        break;
                    case ERR_INVALID_TARGET:
                        delete c.memory.target;
                        break;
                }
            }
        }
    }
};
module.exports = combatMelee;
//# sourceMappingURL=combat.melee.js.map