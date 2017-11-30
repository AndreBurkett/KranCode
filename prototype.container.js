Object.defineProperty(StructureContainer.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.myContainersMemory)) {
            Memory.myContainersMemory = {};
        }
        /*if(!_.isObject(Memory.myContainersMemory)) {
            return undefined;
        }*/
        return Memory.myContainersMemory[this.id] = 
                Memory.myContainersMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.myContainersMemory)) {
            Memory.myContainersMemory = {};
        }
        if(!_.isObject(Memory.myContainersMemory)) {
            throw new Error('Could not set container memory');
        }
        Memory.myContainersMemory[this.id] = value;
    }
});

Object.defineProperty(StructureContainer.prototype, 'transportTarget', {
    configurable: true,
    get: function() {
        //console.log(this.memory.workers);
        /*if(!this.memory.workers){
            console.log('wkr reset');
            return this.memory.workers = 0;
        }*/
        //console.log(Game.creeps);
        //console.log(_.filter(Game.creeps, (c) => c.memory.sourceTarget === this.id).length);
        return this.memory.transportTarget = this.memory.transportTarget || false;
        //return this.memory.workers;
    },
    set: function(value) {
        this.memory.transportTarget = value;
    }
});

Object.defineProperty(StructureContainer.prototype, 'freeSpaceCount', {
    get: function () {
        if (this._freeSpaceCount == undefined) {
            if (this.memory.freeSpaceCount == undefined) {
                let freeSpaceCount = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                                freeSpaceCount++;
                            }, this);
                    }, this);
                this.memory.freeSpaceCount = freeSpaceCount;
            }
            this._freeSpaceCount = this.memory.freeSpaceCount;
        }
        return this._freeSpaceCount;
    },
    enumerable: false,
    configurable: true
});