"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class architect {
    constructor(room) {
        this.sources = [];
        this.spawns = room.find(FIND_MY_SPAWNS);
        this.r = room;
        for (let i in room.sources) {
            this.sources.push(room.sources[i]);
        }
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
        if (this.r.memory.paths.tick > 500)
            this.r.memory.paths.tick = 0;
    }
    createRoads() {
        var container = this.r.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        var clength = container.length;
        var ticks = this.r.memory.paths.tick++;
        if (!this.r.memory.paths.containers)
            this.r.memory.paths.containers = clength;
        if (!this.r.memory.paths.spawns)
            this.r.memory.paths.spawns = this.spawns.length;
        if (this.r.memory.paths.spawns != this.spawns.length || ticks == 480) {
            for (let i in this.spawns) {
                if (this.r.controller) {
                    let path = PathFinder.search(this.spawns[i].pos, this.r.controller.pos, { swampCost: 1, range: 2, ignoreRoads: true, roomCallback: this.roomCostMatrix() });
                    this.r.memory.paths.controllerPath[i] = path;
                }
            }
            for (let i in this.r.memory.paths.controllerPath) {
                for (let j in this.r.memory.paths.controllerPath[i].path) {
                    this.r.createConstructionSite(this.r.memory.paths.controllerPath[i].path[j].x, this.r.memory.paths.controllerPath[i].path[j].y, STRUCTURE_ROAD);
                }
            }
            this.r.memory.paths.spawns = this.spawns.length;
        }
        if (this.r.memory.paths.containers != clength || this.r.memory.paths.spawns != this.spawns.length || ticks == 490) {
            for (let i in this.spawns) {
                var pathNum = 0;
                for (let j in container) {
                    let path = PathFinder.search(this.spawns[i].pos, container[j].pos, { swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix() });
                    this.r.memory.paths.spawnToContainer[pathNum] = path;
                    pathNum++;
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
        if (this.r.memory.paths.containers != clength || ticks == 500) {
            var pathNum = 0;
            for (let i = 0; i < clength - 1; i++) {
                for (let j = i + 1; j < clength; j++) {
                    let path = PathFinder.search(container[i].pos, container[j].pos, { swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix() });
                    this.r.memory.paths.containerToContainer[pathNum] = path;
                    pathNum++;
                }
            }
            for (let i in this.r.memory.paths.containerToContainer) {
                for (let j in this.r.memory.paths.containerToContainer[i].path) {
                    this.r.createConstructionSite(this.r.memory.paths.containerToContainer[i].path[j].x, this.r.memory.paths.containerToContainer[i].path[j].y, STRUCTURE_ROAD);
                }
            }
            this.r.memory.paths.containers = clength;
        }
    }
    createHighway(sourceId) {
        if (this.r.memory.paths.tick >= 0) {
            var source = Game.getObjectById(sourceId);
            if (source) {
                var path = PathFinder.search(this.spawns[0].pos, source.pos, { swampCost: 2, roomCallback: this.roomCostMatrix() });
                for (let i in path.path) {
                    Game.rooms[path.path[i].roomName].createConstructionSite(path.path[i], STRUCTURE_ROAD);
                }
            }
        }
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
                if (this.spawns[0]) {
                    var site = this.spawns[0].pos.findClosestByRange(target);
                    this.r.createConstructionSite(site, STRUCTURE_CONTAINER);
                }
                else {
                    this.r.createConstructionSite(target[0], STRUCTURE_CONTAINER);
                }
            }
            else {
                this.sources[i].containerSpot;
                this.r.createConstructionSite(this.sources[i].containerSpot[0], this.sources[i].containerSpot[1], STRUCTURE_CONTAINER);
            }
        }
    }
    createControllerContainer() {
        if (this.r.controller && this.r.memory.paths.controllerPath && this.r.memory.paths.controllerPath[0] && this.r.memory.paths.controllerPath[0].path) {
            let sites = Object.keys(this.r.memory.paths.controllerPath[0].path).length;
            this.r.createConstructionSite(this.r.memory.paths.controllerPath[0].path[sites - 3].x, this.r.memory.paths.controllerPath[0].path[sites - 3].y, STRUCTURE_CONTAINER);
        }
    }
    createBunker() {
        if (!this.r.memory.bunker)
            this.r.memory.bunker = Game.time;
        if (Game.time - this.r.memory.bunker > 500) {
            let rSpawn = this.spawns[0];
            this.r.createConstructionSite(rSpawn.pos.x, rSpawn.pos.y - 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x, rSpawn.pos.y - 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x, rSpawn.pos.y - 4, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 1, rSpawn.pos.y - 3, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 2, rSpawn.pos.y - 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 3, rSpawn.pos.y - 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 4, rSpawn.pos.y, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 5, rSpawn.pos.y + 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 4, rSpawn.pos.y + 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 3, rSpawn.pos.y + 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 2, rSpawn.pos.y + 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 1, rSpawn.pos.y, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x + 1, rSpawn.pos.y - 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 1, rSpawn.pos.y - 2, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 2, rSpawn.pos.y - 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 2, rSpawn.pos.y, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 3, rSpawn.pos.y, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 3, rSpawn.pos.y + 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 4, rSpawn.pos.y + 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 1, rSpawn.pos.y - 3, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 2, rSpawn.pos.y - 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 3, rSpawn.pos.y - 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 4, rSpawn.pos.y, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 5, rSpawn.pos.y + 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 4, rSpawn.pos.y + 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 3, rSpawn.pos.y + 2, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 2, rSpawn.pos.y + 1, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 1, rSpawn.pos.y, STRUCTURE_ROAD);
            this.r.createConstructionSite(rSpawn.pos.x - 1, rSpawn.pos.y - 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 1, rSpawn.pos.y - 2, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 2, rSpawn.pos.y - 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 2, rSpawn.pos.y, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 3, rSpawn.pos.y, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 3, rSpawn.pos.y + 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x - 4, rSpawn.pos.y + 1, STRUCTURE_EXTENSION);
            this.r.createConstructionSite(rSpawn.pos.x + 1, rSpawn.pos.y + 1, STRUCTURE_TOWER);
            this.r.createConstructionSite(rSpawn.pos.x - 1, rSpawn.pos.y + 1, STRUCTURE_TOWER);
            this.r.createConstructionSite(rSpawn.pos.x, rSpawn.pos.y + 2, STRUCTURE_STORAGE);
            this.r.createConstructionSite(rSpawn.pos.x, rSpawn.pos.y + 4, STRUCTURE_LINK);
            this.r.memory.bunker = 0;
        }
    }
    roomCostMatrix() {
        if (this.costs) {
            return function () { return this.costs; };
        }
        else {
            var costs = new PathFinder.CostMatrix;
            this.r.find(FIND_STRUCTURES).forEach(function (s) {
                if (!_.contains([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_RAMPART], s.structureType)) {
                    costs.set(s.pos.x, s.pos.y, 0xff);
                }
            });
            return function () { return costs; };
        }
    }
}
exports.architect = architect;
//# sourceMappingURL=constructionManager.js.map