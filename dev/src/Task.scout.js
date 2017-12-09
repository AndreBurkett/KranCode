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
        if (this.c.memory.targetRoom)
            this.c.moveTo(new RoomPosition(25, 25, this.c.memory.targetRoom));
    }
    setDestination() {
    }
}
exports.Scout = Scout;
//# sourceMappingURL=Task.scout.js.map