var combatMelee = {
    run: function(c: Creep) {
        if(c.memory.target)
            Game.getObjectById(c.memory.target)
        else{
            var target = c.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
            if(!target){
            //create logic to move to rally point
            }
        }

        if(target.pos.x > 6 || target.pos.x < 44){
            if(target.pos.y > 6 || target.pos.y < 44){
                switch (c.attack(target)){
                    case ERR_NOT_IN_RANGE:
                    c.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    delete c.memory.target;
                    break;
                }
            }
        }
    }
}

module.exports = combatMelee;
