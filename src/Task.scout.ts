import {Task} from './Task';

export class Scout extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        this.c;
        this.setDestination();
        if(this.c.memory.targetRoom) this.c.moveTo(new RoomPosition(25,25, this.c.memory.targetRoom));
    }

    private setDestination(){
        //console.log(Game.map.describeExits(this.c.room.name));
    }
}
