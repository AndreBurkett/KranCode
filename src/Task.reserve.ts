import {Task} from './Task';

const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_RESERVING = 3;

export class Reserve extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        if(!this.c.memory.state) this.c.memory.state = STATE_SPAWNING
        switch(this.c.memory.state){
            case STATE_SPAWNING:
                if(!this.c.memory.targetRoom) delete this.c.memory.task;
                else this.c.memory.state = STATE_MOVING;
                break;
            case STATE_MOVING:
                this.Move(this.c.memory.targetRoom)
                break;
            case STATE_TARGETING:
                this.target();
                break;
            case STATE_RESERVING:
                this.reserve();
                break;
        }
        //if(this.c.memory.targetRoom) this.c.moveTo(new RoomPosition(25,25, this.c.memory.targetRoom));
    }
    target(){
        var target = this.c.room.controller;
        if(target){
            this.c.memory.target = target.id;
            this.c.memory.state = STATE_RESERVING;
            this.reserve();
        }
        else this.Move(this.c.memory.targetRoom);
    }
    reserve(){
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if(!target){
            this.c.memory.state = STATE_TARGETING
            this.target();
        }
        switch(this.c.reserveController(target)){
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
        }
    }

}
