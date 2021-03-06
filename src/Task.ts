const STATE_SPAWNING = 0
const STATE_MOVING = 1;
const STATE_TARGETING = 2
const STATE_WORKING = 3;

export abstract class Task{
    public c: Creep;


    constructor(c: Creep){
        this.c = c;
    }

    public Move(room: string){
        let target = new RoomPosition(25,25,room)
        if(this.c.pos.roomName == room && this.c.pos.x > 3 && this.c.pos.x <47 && this.c.pos.y > 3 && this.c.pos.y < 47){
            this.c.memory.state = STATE_TARGETING;
        }
        else{
            this.c.moveTo(target)
        }
    }
    public abstract run();
}
