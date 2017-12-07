"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class architect {
    constructor(room) {
        this.sources = [];
        this.spawns = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN });
        this.r = room;
        for (let i in room.sources) {
            this.sources.push(room.sources[i]);
        }
    }
    createRoads() {
        if (!this.r.memory.paths) {
            this.r.memory.paths = {};
            if (!this.r.memory.paths.controllerPath)
                this.r.memory.paths.controllerPath = {};
        }
        for (let i in this.spawns) {
            if (this.r.controller) {
                let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2, ignoreRoads: true });
                this.r.memory.paths.controllerPath[i] = path;
            }
        }
        for (let i in this.r.memory.paths.controllerPath) {
            for (let j in this.r.memory.paths.controllerPath[i].path) {
                this.r.createConstructionSite(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y, STRUCTURE_ROAD);
            }
        }
    }
    createSourceContainers() {
        for (let i in this.sources) {
            var targetX = [];
            var targetY = [];
            if (Game.map.getTerrainAt(this.sources[i].pos.x - 2, this.sources[i].pos.y, this.r.name) != 'wall') {
                targetX.push(new RoomPosition(this.sources[i].pos.x - 2, this.sources[i].pos.y, this.r.name));
            }
            if (targetX.length > 0) {
                var site = this.spawns[0].pos.findClosestByRange(targetX);
                this.r.visual.circle(site);
            }
        }
    }
}
exports.architect = architect;
//# sourceMappingURL=constructionManager.js.map