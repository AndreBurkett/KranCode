/*export class towerManager {
    public t: StructureTower;

    public constructor(t:StructureTower){
        console.log('tm constructed');
    }

    public run(t: StructureTower){
        console.log('towerManager');
    }
}
*/
var towerManager = {
    run: function (t: StructureTower) {
        //console.log('tm run');
        let hostile = t.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS)
        if (hostile)
            t.attack(hostile);
    }

}

module.exports = towerManager;
