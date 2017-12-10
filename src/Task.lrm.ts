import {Task} from './Task';

const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_WORKING = 3;

export class Mine extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        if(!this.c.memory.state) this.c.memory.state = STATE_SPAWNING
        switch(this.c.memory.state){
            case STATE_SPAWNING:
                if(!this.c.memory.targetRoom) this.c.memory.targetRoom = this.c.room.name;
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
        }
        //if(this.c.memory.targetRoom) this.c.moveTo(new RoomPosition(25,25, this.c.memory.targetRoom));
    }
    target(){
        let minSource = 0;
        let minWorkers = 99;
        let source: Source[] = [];
        for(let i=0; i<Object.keys(this.c.room.memory.sourceIds).length; i++){
            source[i] = Game.getObjectById<Source>(this.c.room.memory.sourceIds[i])
            if(minWorkers > source[i].workers){
                minWorkers = source[i].workers;
                minSource = i;
            }
        }
        this.c.memory.target = source[minSource].id;
        this.c.memory.state = STATE_WORKING;
    }
    work(){
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if(!target){
            this.c.memory.state = STATE_TARGETING
            this.target();
        }
        if (!this.c.memory.taskQ && this.c.carry[RESOURCE_ENERGY] > 0) {
            if (this.c.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s: Structure) => s.structureType == STRUCTURE_CONTAINER}).length > 0)
                this.c.memory.taskQ = 'deposit';
            else
                this.c.memory.taskQ = 'build';
        }
        switch(this.c.harvest(target)){
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
        }
    }

}
