"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./Task");
class Scout extends Task_1.Task {
    constructor(c) {
        super(c);
    }
    run() {
        this.c;
        this.setDestination();
        this.c.moveTo(new RoomPosition(25, 25, 'E17N39'));
    }
    setDestination() {
        console.log(Game.map.describeExits(this.c.room.name));
    }
}
exports.Scout = Scout;
//# sourceMappingURL=Task.scout.js.map