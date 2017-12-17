"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./Task");
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_BUILDING = 3;
const STATE_MINING = 4;
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
                if (this.c.carry[RESOURCE_ENERGY] == this.c.carryCapacity)
                    this.target('build');
                else
                    this.target('mine');
                break;
            case STATE_MINING:
                this.mine();
                break;
            case STATE_BUILDING:
                this.build();
                break;
        }
    }
    target(targetType) {
        switch (targetType) {
            case 'mine':
                let minSource = 0;
                let minWorkers = 99;
                let source = [];
                for (let i = 0; i < Object.keys(this.c.room.memory.sourceIds).length; i++) {
                    source[i] = Game.getObjectById(this.c.room.memory.sourceIds[i]);
                    if (minWorkers > source[i].workers) {
                        minWorkers = source[i].workers;
                        minSource = i;
                    }
                }
                this.c.memory.target = source[minSource].id;
                this.c.memory.state = STATE_MINING;
                this.mine();
                break;
            case 'build':
                var site = this.c.pos.findInRange(FIND_CONSTRUCTION_SITES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                if (!site)
                    site = this.c.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (site) {
                    this.c.memory.target = site.id;
                    this.c.memory.state = STATE_BUILDING;
                    this.build();
                }
        }
    }
    build() {
        var target = Game.getObjectById(this.c.memory.target);
        if (!target)
            return this.c.memory.state = STATE_TARGETING;
        switch (this.c.build(target)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_TARGETING;
                break;
            case ERR_INVALID_TARGET:
                this.c.memory.state = STATE_TARGETING;
        }
    }
    mine() {
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if (!target) {
            this.c.memory.state = STATE_TARGETING;
            return;
        }
        switch (this.c.harvest(target)) {
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case OK:
                var container = this.c.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                if (this.c.carry[RESOURCE_ENERGY] >= this.c.carryCapacity * .75) {
                    if (container)
                        this.c.transfer(container, RESOURCE_ENERGY);
                    else
                        this.c.memory.state = STATE_TARGETING;
                    break;
                }
        }
    }
}
exports.Mine = Mine;
//# sourceMappingURL=Task.lrm.js.map