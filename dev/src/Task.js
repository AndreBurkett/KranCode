"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_WORKING = 3;
class Task {
    constructor(c) {
        this.c = c;
    }
    Move(room) {
        let target = new RoomPosition(25, 25, room);
        if (this.c.pos.roomName == room) {
            this.c.memory.state = STATE_WORKING;
        }
        else {
            this.c.moveTo(target);
        }
    }
}
exports.Task = Task;
//# sourceMappingURL=Task.js.map