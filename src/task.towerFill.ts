var towerFill = {
    run: function(c: Creep) {
        var target = c.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity});
        if(!target){
            console.log('wtf');
            c.memory.task = 'transport';
        }

        switch (c.transfer(target, RESOURCE_ENERGY)){
            case ERR_NOT_IN_RANGE:
                c.moveTo(target);
                break;
            case ERR_FULL:
                delete c.memory.target;
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
}

module.exports = towerFill;
