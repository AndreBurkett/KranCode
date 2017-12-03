export class towerManager {
    public t: StructureTower;

    public constructor(t:StructureTower){
        console.log('tm constructed');
    }

    public function run(t: StructureTower){
        console.log('towerManager');
    }
}
