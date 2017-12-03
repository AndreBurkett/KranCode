"use strict";
run: function (t) {
    console.log('tm run');
    let hostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile)
        t.attack(hostile);
}
//# sourceMappingURL=towerManager.js.map