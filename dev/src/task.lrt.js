"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./Task");
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_WORKING = 3;
const STATE_DEPOSIT = 4;
class Mine extends Task_1.Task {
    constructor(c) {
        super(c);
    }
    run() {
        if (!this.c.memory.state)
            this.c.memory.state = STATE_SPAWNING;
        switch (this.c.memory.state) {
            case STATE_SPAWNING:
                if (!this.c.memory.targetRoom)
                    this.c.memory.targetRoom = this.c.room.name;
                this.c.memory.state = STATE_MOVING;
                break;
            case STATE_MOVING:
                this.Move(this.c.memory.targetRoom);
                break;
            case STATE_TARGETING:
                this.target();
                break;
            case STATE_WORKING:
                this.work();
                break;
            case STATE_DEPOSIT:
                this.deposit();
                break;
        }
    }
    deposit() {
        var target = this.c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE });
        switch (this.c.withdraw(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_MOVING;
                this.target();
                break;
        }
    }
    target() {
        var target = this.c.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > this.c.carryCapacity });
        if (target)
            this.c.memory.target = target.id;
        this.c.memory.state = STATE_WORKING;
    }
    work() {
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if (!target) {
            this.c.memory.state = STATE_TARGETING;
            this.target();
        }
        switch (this.c.withdraw(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                this.c.memory.state = STATE_TARGETING;
                this.target();
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_TARGETING;
                this.target();
                break;
        }
    }
}
exports.Mine = Mine;
//# sourceMappingURL=task.lrt.js.map