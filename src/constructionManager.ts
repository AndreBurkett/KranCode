interface constructionManager{
    r: Room;
    createRoads(): void;
}

export class architect implements constructionManager{
    r: Room;

    public constructor(room: Room){
        this.r = room;
        console.log('test');
    }
    public createRoads(){

    }
}
