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
        let start = Game.cpu.getUsed();
        if (!this.r.memory.paths)
            this.r.memory.paths = {};
        if (!this.r.memory.paths.controllerPath)
            this.r.memory.paths.controllerPath = {};
        if (!this.r.memory.paths.spawnToContainer)
            this.r.memory.paths.spawnToContainer = {};
        if (!this.r.memory.paths.containerToContainer)
            this.r.memory.paths.containerToContainer = {};
        if (!this.r.memory.paths.tick)
            this.r.memory.paths.tick = 0;
        var container = this.r.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        var clength = container.length;
        var ticks = this.r.memory.paths.tick++;
        if (!this.r.memory.paths.containers)
            this.r.memory.paths.containers = clength;
        if (!this.r.memory.paths.spawns)
            this.r.memory.paths.spawns = this.spawns.length;
        if (this.r.memory.paths.spawns != this.spawns.length || ticks == 48) {
            for (let i in this.spawns) {
                if (this.r.controller) {
                    if (!this.r.memory.paths.controllerPath[this.spawns.length - 1]) {
                        let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2, ignoreRoads: true });
                        this.r.memory.paths.controllerPath[i] = path;
                    }
                }
            }
            for (let i in this.r.memory.paths.controllerPath) {
                for (let j in this.r.memory.paths.controllerPath[i].path) {
                    this.r.createConstructionSite(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y, STRUCTURE_ROAD);
                }
            }
            this.r.memory.paths.spawns = this.spawns.length;
        }
        if (this.r.memory.paths.containers != clength || this.r.memory.paths.spawns != this.spawns.length || ticks == 49) {
            for (let i in this.spawns) {
                if (!this.r.memory.paths.spawnToContainer[container.length - 1]) {
                    var pathNum = 0;
                    for (let j in container) {
                        let path = PathFinder.search(this.spawns[i].pos, container[j].pos, { swampCost: 1, ignoreRoads: true });
                        this.r.memory.paths.spawnToContainer[pathNum] = path;
                        pathNum++;
                    }
                }
            }
            for (let i in this.r.memory.paths.spawnToContainer) {
                for (let j in this.r.memory.paths.spawnToContainer[i].path) {
                    this.r.createConstructionSite(this.r.memory.paths.spawnToContainer[i].path[j].x, this.r.memory.paths.spawnToContainer[i].path[j].y, STRUCTURE_ROAD);
                }
            }
            this.r.memory.paths.containers = clength;
            this.r.memory.paths.spawns = this.spawns.length;
        }
        if (this.r.memory.paths.containers != clength || ticks == 50) {
            var maxPaths = 0;
            switch (clength) {
                case 1:
                    maxPaths = 0;
                    break;
                case 2:
                    maxPaths = 1;
                    break;
                case 3:
                    maxPaths = 3;
                    break;
                case 4:
                    maxPaths = 6;
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
            for (let i in this.r.memory.paths.containerToContainer) {
                for (let j in this.r.memory.paths.containerToContainer[i].path) {
                    this.r.createConstructionSite(this.r.memory.paths.containerToContainer[i].path[j].x, this.r.memory.paths.containerToContainer[i].path[j].y, STRUCTURE_ROAD);
                }
            }
            this.r.memory.paths.containers = clength;
        }
        if (ticks > 50)
            this.r.memory.paths.tick = 0;
    }
    createSourceContainers() {
        for (let i in this.sources) {
            var target = [];
            if (Game.map.getTerrainAt(this.sources[i].pos.x - 2, this.sources[i].pos.y, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x - 1, this.sources[i].pos.y, this.r.name) != 'wall') {
                target.push(new RoomPosition(this.sources[i].pos.x - 2, this.sources[i].pos.y, this.r.name));
            }
            if (Game.map.getTerrainAt(this.sources[i].pos.x + 2, this.sources[i].pos.y, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x + 1, this.sources[i].pos.y, this.r.name) != 'wall') {
                target.push(new RoomPosition(this.sources[i].pos.x + 2, this.sources[i].pos.y, this.r.name));
            }
            if (Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y - 2, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y - 1, this.r.name) != 'wall') {
                target.push(new RoomPosition(this.sources[i].pos.x, this.sources[i].pos.y - 2, this.r.name));
            }
            if (Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y + 2, this.r.name) != 'wall' && Game.map.getTerrainAt(this.sources[i].pos.x, this.sources[i].pos.y + 1, this.r.name) != 'wall') {
                target.push(new RoomPosition(this.sources[i].pos.x, this.sources[i].pos.y + 2, this.r.name));
            }
            if (target.length > 0) {
                var site = this.spawns[0].pos.findClosestByRange(target);
                this.r.createConstructionSite(site, STRUCTURE_CONTAINER);
            }
            else {
                this.sources[i].containerSpot;
                this.r.createConstructionSite(this.sources[i].containerSpot[0], this.sources[i].containerSpot[1], STRUCTURE_CONTAINER);
            }
        }
    }
}
exports.architect = architect;
//# sourceMappingURL=constructionManager.js.map