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

        /*if(target.pos.x > 9 || target.pos.x < 41){
            if(target.pos.y > 9 || target.pos.y < 41){
                switch (c.attack(target)){
                    case ERR_NOT_IN_RANGE:
                        c.moveTo(target, {reusePath: 3});
                        break;
                    case ERR_INVALID_TARGET:
                        delete c.memory.target;
                        break;
                }
            }
        }*/
    }
}

module.exports = combatMelee;
