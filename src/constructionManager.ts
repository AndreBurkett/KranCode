interface constructionManager {
    r: Room;
    createRoads(): void;
}

export class architect implements constructionManager {
    r: Room;
    spawns: StructureSpawn[];

    public constructor(room: Room) {
        this.spawns = room.find<StructureSpawn>(FIND_STRUCTURES, { filter: (s: Structure) => s.structureType === STRUCTURE_SPAWN })
        this.r = room;
        console.log('test');
    }
    public createRoads() {
        var sources = [];
        if (!this.r.memory.paths) {
            this.r.memory.paths = {};
            if (!this.r.memory.paths.controllerPath)
                this.r.memory.paths.controllerPath = {};
        }

        for (let i in this.r.sources) {
            sources.push(Game.getObjectById(this.r.sources[i]))
        }


        for (let i in this.spawns) {
            if (this.r.controller){
                let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2 })
                this.r.memory.paths.controllerPath[i] = path;
            }
        }
        for (let i in this.r.memory.paths.controllerPath) {
            for (let j in this.r.memory.paths.controllerPath.path) {
                this.r.visual.circle(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y);
            }
        }
    }
}
