var taskMining = {
    run: function(creep: Creep) {
        var target;
        /*if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.task = 'deposit';
            //Memory.sources[Game.getObjectById(creep.memory.target).name] --;
        }*/
        target = Game.getObjectById(creep.memory.sourceTarget);
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = taskMining;
