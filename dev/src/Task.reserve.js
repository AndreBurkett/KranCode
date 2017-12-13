"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./Task");
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_RESERVING = 3;
class Reserve extends Task_1.Task {
    constructor(c) {
        super(c);
    }
    run() {
        if (!this.c.memory.state)
            this.c.memory.state = STATE_SPAWNING;
        switch (this.c.memory.state) {
            case STATE_SPAWNING:
                if (!this.c.memory.targetRoom)
                    delete this.c.memory.task;
                else
                    this.c.memory.state = STATE_MOVING;
                break;
            case STATE_MOVING:
                this.Move(this.c.memory.targetRoom);
                break;
            case STATE_TARGETING:
                this.target();
                break;
            case STATE_RESERVING:
                this.reserve();
                break;
        }
    }
    target() {
        target = this.c.room.controller;
        if (target) {
            this.c.memory.target = target.id;
            this.c.memory.state = STATE_RESERVING;
            this.reserve();
        }
        else
            this.Move(this.c.memory.targetRoom);
    }
    reserve() {
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if (!target) {
            this.c.memory.state = STATE_TARGETING;
            this.target();
        }
        switch (this.c.reserveController(target)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
        }
    }
}
exports.Reserve = Reserve;
//# sourceMappingURL=Task.reserve.js.map