import {Task} from './Task';

const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2;
const STATE_BUILD = 3;
const STATE_REPAIR = 4;
const STATE_WITHDRAW = 5;
const STATE_MINING = 6;

export class Build extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        if(!this.c.memory.state) this.c.memory.state = STATE_SPAWNING
        //Full Energy
        if (this.c.carry[RESOURCE_ENERGY] == this.c.carryCapacity) {
            switch (this.c.memory.state) {
                case STATE_SPAWNING:
                    if (!this.c.memory.targetRoom) this.c.memory.targetRoom = this.c.room.name;
                    this.c.memory.state = STATE_MOVING;
                    break;
                case STATE_MOVING:
                    this.Move(this.c.memory.targetRoom)
                    break;
                case STATE_TARGETING:
                    this.target('build');
                    break;
                case STATE_BUILD:
                    this.build();
                    break;
                case STATE_REPAIR:
                    this.repair();
                    break;
                case STATE_WITHDRAW:
                    this.c.memory.state = STATE_TARGETING;
                    this.target('build');
                    break;
                case STATE_MINING:
                    this.c.memory.state = STATE_TARGETING;
                    this.target('build');
                    break;
            }
        }
        else{
            switch (this.c.memory.state) {
                case STATE_SPAWNING:
                    if (!this.c.memory.targetRoom) this.c.memory.targetRoom = this.c.room.name;
                    this.c.memory.state = STATE_MOVING;
                    break;
                case STATE_MOVING:
                    this.Move(this.c.memory.targetRoom)
                    break;
                case STATE_TARGETING:
                    this.target('withdraw');
                    break;
                case STATE_BUILD:
                    this.c.memory.state = STATE_TARGETING;
                    this.target('withdraw');
                    break;
                case STATE_REPAIR:
                    this.c.memory.state = STATE_TARGETING;
                    this.target('withdraw');
                    break;
                case STATE_WITHDRAW:
                    this.withdraw();
                    break;
                case STATE_MINING:
                    this.mine();
                    break;
            }
        }
        //if(this.c.memory.targetRoom) this.c.moveTo(new RoomPosition(25,25, this.c.memory.targetRoom));
    }
    build(){
        var target = Game.getObjectById(this.c.memory.target);
        if(!target) this.c.memory.state = STATE_TARGETING
        else {
            switch (this.c.build(target)) {
                case ERR_NOT_IN_RANGE:
                    this.c.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    this.c.memory.state = STATE_TARGETING;
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    this.c.memory.state = STATE_TARGETING;
                    break;
            }
        }
    }
    mine(){
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if(!target){
            this.c.memory.state = STATE_TARGETING
        }
        switch(this.c.harvest(target)){
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case OK:
                this.c.memory.state = STATE_TARGETING;
                this.target('build');
                break;
        }
    }
    repair(){
        var target = Game.getObjectById(this.c.memory.target);
        if(!target) this.c.memory.state = STATE_TARGETING
        else {
            switch (this.c.repair(target)) {
                case ERR_NOT_IN_RANGE:
                    this.c.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    this.c.memory.state = STATE_TARGETING;
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    this.c.memory.state = STATE_TARGETING;
                    break;
            }
        }
    }
    target(targetType: string){
        switch(targetType){
            case 'withdraw':
                var target = this.c.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
                    filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && !s.memory.transportTarget && s.store[RESOURCE_ENERGY] > this.c.carryCapacity});
                if (target) {
                    this.c.memory.target = target.id;
                    this.c.memory.state = STATE_WITHDRAW;
                    this.withdraw();
                }
                else{
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
                    this.mine();
                }
                break;
            case 'build':
                var lStructs = this.c.room.find<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => s.hits < (s.hitsMax * .5)})
                var structs = this.c.room.find<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax})
                var sites = this.c.room.find<ConstructionSite>(FIND_STRUCTURES);
                var bTarget;
                if(lStructs && lStructs.length > 0){
                    this.c.memory.target = this.c.pos.findClosestByRange(lStructs).id;
                    this.c.memory.state = STATE_REPAIR;
                    this.repair();
                }
                else if (sites && sites.length > 0) {
                    bTarget = _.filter(sites, { structureType: STRUCTURE_CONTAINER });
                    if (bTarget && bTarget.length > 0) this.c.memory.target = this.c.pos.findClosestByRange(bTarget).id;
                    else this.c.memory.target = this.c.pos.findClosestByRange(sites).id;
                    this.c.memory.state = STATE_BUILD;
                    this.build();
                }
                else if(structs && structs.length > 0){
                    this.c.memory.target = this.c.pos.findClosestByRange(structs).id;
                    this.c.memory.state = STATE_REPAIR;
                    this.repair();
                }
                break;
        }

    }
    withdraw(){
        var target;
        target = Game.getObjectById(this.c.memory.target);
        if(!target){
            this.c.memory.state = STATE_TARGETING;
        }

        switch (this.c.withdraw(target, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                this.c.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                this.c.memory.state = STATE_TARGETING;
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.c.memory.state = STATE_TARGETING;
                break;
            case OK:
                this.c.memory.state = STATE_TARGETING;
                break;
        }
    }

}
