import {Task} from './Task';

export class scout extends Task{

    constructor(c: Creep){
        super(c);
    }

    run(){
        this.c;
        this.setDestination();
    }

    private setDestination(){
        console.log(Game.map.describeExits(this.c.room.name));
    }
}
