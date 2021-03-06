Object.defineProperty(StructureController.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.myControllersMemory)) {
            Memory.myControllersMemory = {};
        }
        if(!_.isObject(Memory.myControllersMemory)) {
            return undefined;
        }
        return Memory.myControllersMemory[this.id] = 
                Memory.myControllersMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.myControllersMemory)) {
            Memory.myControllersMemory = {};
        }
        if(!_.isObject(Memory.myControllersMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.myControllersMemory[this.id] = value;
    }
});

Object.defineProperty(StructureController.prototype, 'containerSpot', {
    get: function () {
        //console.log('get contr container spot');
        if (this._containerSpot == undefined) {
            if (this.memory.containerSpot == undefined) {
                [this.pos.x - 1, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y + 1].forEach(y => {
                        if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                                this.memory.containerSpot = [x,y];
                    }, this);
                }, this);
            }
            this._containerSpot = this.memory.containerSpot;
        }
        return this._containerSpot;
    },
    enumerable: false,
    configurable: true
});