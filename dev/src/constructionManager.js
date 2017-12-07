"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class architect {
    constructor(room) {
        this.spawns = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN });
        this.r = room;
        console.log('test');
    }
    createRoads() {
        var sources = [];
        for (let i in this.r.sources) {
            sources.push(Game.getObjectById(this.r.sources[i]));
        }
        for (let i in this.spawns) {
            if (this.r.controller)
                this.r.memory.paths.controllerPath.push(PathFinder.search(this.spawns[i], this.r.controller.pos, { swampCost: 1, range: 2 }));
        }
        for (let i in this.r.memory.paths.controllerPath) {
            for (let j in this.r.memory.paths.controllerPath.path) {
            }
        }
    }
}
exports.architect = architect;
//# sourceMappingURL=constructionManager.js.map