import {Task} from './Task';

const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_WORKING = 3;
const STATE_DEPOSIT = 4;

export class Mine extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        if(!this.c.memory.state) this.c.memory.state = STATE_SPAWNING
        switch(this.c.memory.state){
            case STATE_SPAWNING:
                if(!this.c.memory.targetRoom) this.c.memory.targetRoom = this.c.room.name;
                this.c.memory.state = STATE_MOVING;
                break;
            case STATE_MOVING:
                this.Move(this.c.memory.targetRoom)
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
        //if(this.c.memory.targetRoom) this.c.moveTo(new RoomPosition(25,25, this.c.memory.targetRoom));
    }
    deposit(){
        var target = this.c.pos.findClosestByRange<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE});
        switch (this.c.withdraw(target, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_MOVING;
                this.target();
                break;
        }

    }
    target(){
        var target = this.c.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > this.c.carryCapacity});
        if(target) this.c.memory.target = target.id;
        this.c.memory.state = STATE_WORKING;
    }
    work(){
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if(!target){
            this.c.memory.state = STATE_TARGETING;
            this.target();
        }

        switch (this.c.withdraw(target, RESOURCE_ENERGY)){
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
