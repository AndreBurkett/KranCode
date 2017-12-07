interface constructionManager {
    r: Room;
    createRoads(): void;
}

export class architect implements constructionManager {
    r: Room;
    spawns: StructureSpawn[];
    sources = [];

    public constructor(room: Room) {
        this.spawns = room.find<StructureSpawn>(FIND_STRUCTURES, { filter: (s: Structure) => s.structureType === STRUCTURE_SPAWN })
        this.r = room;
        for (let i in room.sources) {
            this.sources.push(room.sources[i])
        }
    }
    public createRoads() {
        if (!this.r.memory.paths) {
            this.r.memory.paths = {};
            if (!this.r.memory.paths.controllerPath)
                this.r.memory.paths.controllerPath = {};
        }

        for (let i in this.spawns) {
            if (this.r.controller){
                let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2, ignoreRoads: true})
                this.r.memory.paths.controllerPath[i] = path;
            }
        }
        for (let i in this.r.memory.paths.controllerPath) {
            for (let j in this.r.memory.paths.controllerPath[i].path) {
                //this.r.visual.circle(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y);
                this.r.createConstructionSite(this.r.memory.paths.controllerPath[i].path[j].x,this.r.memory.paths.controllerPath[i].path[j].y,STRUCTURE_ROAD)
            }
        }
    }
    public createSourceContainers(){
        for(let i in this.sources){
            var targetX = [];
            var targetY = [];
            if(Game.map.getTerrainAt(this.sources[i].pos.x -2, this.sources[i].pos.y, this.r.name) != 'wall'){
                targetX.push(this.sources[i].pos.x - 2);
                targetY.push(this.sources[i].pos.y);
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x +2, this.sources[i].pos.y, this.r.name) != 'wall'){
                targetX.push(this.sources[i].pos.x  + 2);
                targetY.push(this.sources[i].pos.y);
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y - 2, this.r.name) != 'wall'){
                targetX.push(this.sources[i].pos.x);
                targetY.push(this.sources[i].pos.y - 2);
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y + 2, this.r.name) != 'wall'){
                targetX.push(this.sources[i].pos.x);
                targetY.push(this.sources[i].pos.y + 2);
            }
            if(targetX.length > 0){
                var site = this.spawns[0].pos.findClosestByRange(targetX,targetY);
                this.r.visual.circle(site);
                //this.r.createConstructionSite(site,STRUCTURE_CONTAINER)
            }
        }
    }
}
