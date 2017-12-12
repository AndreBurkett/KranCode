import {Task} from './Task';

const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_ATTACKING = 3;
const STATE_PATROLLING = 4;

export class Melee extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        if(!this.c.memory.state) this.c.memory.state = STATE_SPAWNING;
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
            case STATE_ATTACKING:
                this.attack();
                break;
        }
    }
    attack(){
        var target;
        if(this.c.memory.target)
            target = Game.getObjectById(this.c.memory.target);
        else{
            target = this.c.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
            if(!target){
                this.c.moveTo(25,25);
            }
        }

        switch (this.c.attack(target)){
            case ERR_NOT_IN_RANGE:
                if(target.pos.x > 5 && target.pos.x < 45 && target.pos.y > 5 && target.pos.y < 45){
                    this.c.moveTo(target, {reusePath: 1});
                }
                else
                    this.c.memory.state = STATE_TARGETING;
                break;
            case ERR_INVALID_TARGET:
                this.c.memory.state = STATE_TARGETING;
                break;
        }
    }
    target(){
        var target = this.c.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
        if(target){
            this.c.memory.state = STATE_ATTACKING;
            this.attack();
        }
        else{
            //this.c.memory.state = STATE_PATROLLING;
            this.patrol();
        }
    }
    patrol(){
        this.c.moveTo(25,25);
        this.c.memory.state = STATE_TARGETING;
    }
}
