interface Creep {
    task(str:String): void;
}

Creep.prototype.task = function(cTask: String){
    let creep = this as Creep;
    let memory = creep._memory;
    memory.task = cTask;

};
