"use strict";
Creep.prototype.getTask = function () {
    return this.memory.task;
};
Creep.prototype.setTask = function (cTask) {
    let creep = this;
    let memory = creep.memory;
    memory.task = cTask;
};
//# sourceMappingURL=prototype.creep.js.map