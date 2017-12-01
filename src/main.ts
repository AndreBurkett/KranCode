var creepName = require('./util.nameBuilder');
require('./prototype.room');
require('./prototype.source');
require('./prototype.spawn');
require('./prototype.container');
require('./prototype.controller');

var taskBuild = require('./task.build');
var taskDeposit = require('./task.deposit');
var taskHarvest = require('./task.harvest');
var taskMine = require('./task.mining');
var taskRepair = require('./task.repair');
var taskTransport = require('./task.transport');
var taskUpgrade = require('./task.upgrade');
var taskWithdraw = require('./task.withdraw');
var creepName = require('./util.nameBuilder');
var roomController = require('./roomController');

module.exports.loop = function()
{
    //Initialize Memory
    if(!Memory.paths)
    Memory.paths = {};
    if(!Memory.paths.sourceC)
    Memory.paths.sourceC = {};

    //Clear Memory on Respawn
    /*var room = Game.spawns.Spawn1.room;
    if(room.survivalInfo.score == 0) {
        delete Memory.mySourcesMemory;
    }*/
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    //Spawn Creeps
    for(let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        if(spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], {dryRun: true}) && spawn.spawnEnabled);
        spawn.spawnCreep([WORK,CARRY,MOVE,MOVE],creepName.getName('c'), {memory: {task: 'idle'}});
    }

    //Create Room Controllers
    Memory.rooms = Game.rooms;
    for(var roomName in Game.rooms) {
        let myRoom = new roomController(Game.rooms[roomName]);
    }

    //Set Creep Tasks
    for(let name in Game.creeps){
        switch(Game.creeps[name].memory.task){
            case 'build':
                taskBuild.run(Game.creeps[name]);
                break;
            case 'deposit':
                taskDeposit.run(Game.creeps[name]);
                break;
            case 'harvest':
                taskHarvest.run(Game.creeps[name]);
                break;
            case 'mine':
                taskMine.run(Game.creeps[name]);
                break;
            case 'repair':
                taskRepair.run(Game.creeps[name]);
                break;
            case 'transport':
                taskTransport.run(Game.creeps[name]);
                break;
            case 'upgrade':
                taskUpgrade.run(Game.creeps[name]);
                break;
            case 'withdraw':
                taskWithdraw.run(Game.creeps[name]);
                break;
        }
    }
}
