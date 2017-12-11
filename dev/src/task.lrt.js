"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./Task");
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_WORKING = 3;
const STATE_DEPOSIT = 4;
const STATE_WITHDRAW = 5;
class Transport extends Task_1.Task {
    constructor(c) {
        super(c);
    }
    run() {
        if (!this.c.memory.state)
            this.c.memory.state = STATE_SPAWNING;
        if (this.c.carry[RESOURCE_ENERGY] == this.c.carryCapacity) {
            switch (this.c.memory.state) {
                case STATE_SPAWNING:
                    if (!this.c.memory.targetRoom)
                        this.c.memory.targetRoom = this.c.room.name;
                    this.c.memory.state = STATE_MOVING;
                    break;
                case STATE_MOVING:
                    this.Move(this.c.memory.homeRoom);
                    break;
                case STATE_TARGETING:
                    this.target('deposit');
                    break;
                case STATE_DEPOSIT:
                    this.deposit();
                    break;
                case STATE_WITHDRAW:
                    this.c.memory.state = STATE_MOVING;
                    this.Move(this.c.memory.homeRoom);
                    break;
            }
        }
        else {
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
                    this.target('withdraw');
                    break;
                case STATE_WITHDRAW:
                    this.withdraw();
                    break;
                case STATE_DEPOSIT:
                    this.deposit();
                    break;
            }
        }
    }
    deposit() {
        var target = Game.getObjectById(this.c.memory.target);
        switch (this.c.transfer(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_MOVING;
                this.target();
                break;
            case OK:
                this.c.memory.state = STATE_MOVING;
                Memory.rooms[this.c.memory.targetRoom].creeps.satTransporter--;
                delete this.c.memory.targetRoom;
                delete this.c.memory.task;
                break;
        }
    }
    target(targetType) {
        switch (targetType) {
            case 'withdraw':
                var target = this.c.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > this.c.carryCapacity
                });
                if (target)
                    this.c.memory.target = target.id;
                this.c.memory.state = STATE_WITHDRAW;
                break;
            case 'deposit':
                var target = this.c.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > this.c.carryCapacity
                });
                if (target)
                    this.c.memory.target = target.id;
                this.c.memory.state = STATE_DEPOSIT;
                break;
        }
    }
    withdraw() {
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
            case OK:
                this.c.memory.state = STATE_MOVING;
        }
    }
}
exports.Transport = Transport;
//# sourceMappingURL=task.lrt.js.map