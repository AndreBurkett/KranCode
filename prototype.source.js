Object.defineProperty(Source.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if(!_.isObject(Memory.mySourcesMemory)) {
            return undefined;
        }
        return Memory.mySourcesMemory[this.id] = 
                Memory.mySourcesMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if(!_.isObject(Memory.mySourcesMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.mySourcesMemory[this.id] = value;
    }
});

Object.defineProperty(Source.prototype, 'workers', {
    configurable: true,
    get: function() {
        //console.log(this.memory.workers);
        /*if(!this.memory.workers){
            console.log('wkr reset');
            return this.memory.workers = 0;
        }*/
        //console.log(Game.creeps);
        //console.log(_.filter(Game.creeps, (c) => c.memory.sourceTarget === this.id).length);
        return this.memory.workers = _.filter(Game.creeps, (c) => c.memory.sourceTarget === this.id).length;
        //return this.memory.workers;
    },
    set: function(value) {
        if(value < 0 ){
            value = 0;
        }
        this.memory.workers = value;
    }
});

Object.defineProperty(Source.prototype, 'freeSpaceCount', {
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

Object.defineProperty(Source.prototype, 'containerSpot', {
    get: function () {
        if (this._containerSpot == undefined) {
            if (this.memory.containerSpot == undefined) {
                [this.pos.x - 1, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                                this.memory.containerSpot = [x,y];
                                //this.memory.containerSpot.y = y;
                    }, this);
                }, this);
                //this.memory.containerSpot = freeSpaceCount;
            }
            this._containerSpot = this.memory.containerSpot;
        }
        return this._containerSpot;
    },
    enumerable: false,
    configurable: true
});