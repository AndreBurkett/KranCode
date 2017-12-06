var combatMelee = {
    run: function(c: Creep) {
        var target
        if(c.memory.target)
            target =Game.getObjectById(c.memory.target)
        else{
            target = c.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
            if(!target){
            //create logic to move to rally point
            }
        }

        switch (c.attack(target)){
            case ERR_NOT_IN_RANGE:
                if(target.pos.x > 9 && target.pos.x < 41 && target.pos.y > 9 && target.pos.y < 41){
                    c.moveTo(target, {reusePath: 3});
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
