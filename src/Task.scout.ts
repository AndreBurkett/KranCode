import {Task} from './Task';

export class Scout extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        this.c;
        this.setDestination();
        this.c.moveTo(new RoomPosition(25,25, 'E17N39'));
    }

    private setDestination(){
        //console.log(Game.map.describeExits(this.c.room.name));
    }
}
