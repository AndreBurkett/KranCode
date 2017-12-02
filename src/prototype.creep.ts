interface Creep {
    getTask(): String;
    setTask(str: String): void;
    memory: CreepMemory;
}

interface CreepMemory{
    task: String
}

Creep.prototype.getTask = function(){
    return this.memory.task;
}

Creep.prototype.setTask = function(cTask: String){
    let creep = this as Creep;
    let memory = creep.memory;
    memory.task = cTask;
};
