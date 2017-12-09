export abstract class Task{
    public c: Creep;


    constructor(c: Creep){
        this.c = c;
    }

    public abstract run();
}
