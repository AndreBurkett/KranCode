"use strict";
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
module.exports.loop = function () {
    if (!Memory.paths)
        Memory.paths = {};
    if (!Memory.paths.sourceC)
        Memory.paths.sourceC = {};
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    for (var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        if (spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], { dryRun: true }) && spawn.spawnEnabled)
            ;
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName.getName('c'), { memory: { task: 'idle' } });
    }
    Memory.rooms = Game.rooms;
    for (var roomName in Game.rooms) {
        var myRoom = new roomController(Game.rooms[roomName]);
    }
    for (var name_1 in Game.creeps) {
        switch (Game.creeps[name_1].memory.task) {
            case 'build':
                taskBuild.run(Game.creeps[name_1]);
                break;
            case 'deposit':
                taskDeposit.run(Game.creeps[name_1]);
                break;
            case 'harvest':
                taskHarvest.run(Game.creeps[name_1]);
                break;
            case 'mine':
                taskMine.run(Game.creeps[name_1]);
                break;
            case 'repair':
                taskRepair.run(Game.creeps[name_1]);
                break;
            case 'transport':
                taskTransport.run(Game.creeps[name_1]);
                break;
            case 'upgrade':
                taskUpgrade.run(Game.creeps[name_1]);
                break;
            case 'withdraw':
                taskWithdraw.run(Game.creeps[name_1]);
                break;
        }
    }
};
//# sourceMappingURL=main.js.map