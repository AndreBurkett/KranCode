var combatMelee = {
    run: function(c: Creep) {
        var target
        if(c.memory.target)
            target =Game.getObjectById(c.memory.target)
        else{
            target = c.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
            if(!target){
                c.moveTo(25,25);
            }
        }

        switch (c.attack(target)){
            case ERR_NOT_IN_RANGE:
                if(target.pos.x > 6 && target.pos.x < 44 && target.pos.y > 6 && target.pos.y < 44){
                    c.moveTo(target, {reusePath: 1});
                }
                else
                    delete c.memory.target;
                break;
            case ERR_INVALID_TARGET:
                delete c.memory.target;
                break;
        }
    }
}

module.exports = combatMelee;
