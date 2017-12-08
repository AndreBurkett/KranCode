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
        //Setup Memory
        if (!this.r.memory.paths)
            this.r.memory.paths = {};
        if(!this.r.memory.paths.controllerPath)
            this.r.memory.paths.controllerPath = {};
        if(!this.r.memory.paths.spawnToContainer)
            this.r.memory.paths.spawnToContainer = {};
        if(!this.r.memory.paths.containerToContainer)
            this.r.memory.paths.containerToContainer = {};

        var container = this.r.find<StructureContainer>(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER})
        var clength = container.length
        if(!this.r.memory.paths.containers)
            this.r.memory.paths.containers = clength;

        //Get Spawn Paths
        for (let i in this.spawns) {
            if (this.r.controller){
                //Get Spawn to Controller Path
                if(!this.r.memory.paths.controllerPath[this.spawns.length-1]){
                    let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2, ignoreRoads: true})
                    this.r.memory.paths.controllerPath[i] = path;
                }

                //Get Spawn to Container Path
                if (!this.r.memory.paths.spawnToContainer[container.length - 1]) {
                    var pathNum = 0;
                    for (let j in container) {
                        let path = PathFinder.search(this.spawns[i].pos, container[j].pos, { swampCost: 1, ignoreRoads: true })
                        this.r.memory.paths.spawnToContainer[pathNum] = path;
                        pathNum++;
                    }
                }
            }
        }

        if (this.r.memory.paths.containers == clength) {
            //Get Container to Container Path
            var maxPaths = 0
            switch (clength) {
                case 1: maxPaths = 0;
                    break;
                case 2: maxPaths = 1;
                    break;
                case 3: maxPaths = 3;
                    break;
                case 4: maxPaths = 6;
                    break;
                case 5: maxPaths = 10;
            }
            if (!this.r.memory.paths.containerToContainer[maxPaths]) {
                var pathNum = 0;
                for (let i = 0; i < clength - 1; i++) {
                    for (let j = i + 1; j < clength; j++) {
                        let path = PathFinder.search(container[i].pos, container[j].pos, { swampCost: 1, ignoreRoads: true });
                        this.r.memory.paths.containerToContainer[pathNum] = path;
                        pathNum++;
                    }
                }
            }

            //Create Container To Container Roads
            for (let i in this.r.memory.paths.containerToContainer) {
                for (let j in this.r.memory.paths.containerToContainer[i].path) {
                    //this.r.visual.circle(this.r.memory.paths.containerToContainer[i].path[j].x, this.r.memory.paths.containerToContainer[i].path[j].y);
                    this.r.createConstructionSite(this.r.memory.paths.containerToContainer[i].path[j].x, this.r.memory.paths.containerToContainer[i].path[j].y, STRUCTURE_ROAD)
                }
            }
            this.r.memory.paths.containers = clength;
        }

        //Create Spawn to Controller Roads
        for (let i in this.r.memory.paths.controllerPath) {
            for (let j in this.r.memory.paths.controllerPath[i].path) {
                //this.r.visual.circle(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y);
                this.r.createConstructionSite(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y, STRUCTURE_ROAD)
            }
        }
        //Create Spawn To Container Roads
        for (let i in this.r.memory.paths.spawnToContainer) {
            for (let j in this.r.memory.paths.spawnToContainer[i].path) {
                //this.r.visual.circle(this.r.memory.paths.spawnToContainer[i].path[j].x, this.r.memory.paths.spawnToContainer[i].path[j].y);
                this.r.createConstructionSite(this.r.memory.paths.spawnToContainer[i].path[j].x, this.r.memory.paths.spawnToContainer[i].path[j].y, STRUCTURE_ROAD)
            }
        }
    }
    public createSourceContainers(){
        for(let i in this.sources){
            var target = [];
            if(Game.map.getTerrainAt(this.sources[i].pos.x -2, this.sources[i].pos.y, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x -1, this.sources[i].pos.y, this.r.name) != 'wall'){
                target.push(new RoomPosition(this.sources[i].pos.x - 2, this.sources[i].pos.y, this.r.name))
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x +2, this.sources[i].pos.y, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x +1, this.sources[i].pos.y, this.r.name) != 'wall'){
                target.push(new RoomPosition(this.sources[i].pos.x + 2, this.sources[i].pos.y, this.r.name))
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y - 2, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y -1, this.r.name) != 'wall'){
                target.push(new RoomPosition(this.sources[i].pos.x, this.sources[i].pos.y-2, this.r.name))
            }
            if(Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y + 2, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y +1, this.r.name) != 'wall'){
                target.push(new RoomPosition(this.sources[i].pos.x, this.sources[i].pos.y +2, this.r.name))
            }
            if(target.length > 0){
                var site = this.spawns[0].pos.findClosestByRange(target);
                this.r.createConstructionSite(site,STRUCTURE_CONTAINER)
            }
            else{
                this.sources[i].containerSpot;
                this.r.createConstructionSite(this.sources[i].containerSpot[0], this.sources[i].containerSpot[1], STRUCTURE_CONTAINER);
            }
        }
    }
}
