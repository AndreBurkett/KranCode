"use strict";
var towerManager = {
    run: function (t) {
        console.log('tm run');
        let hostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile)
            t.attack(hostile);
    }
};
module.exports = towerManager;
//# sourceMappingURL=towerManager.js.map