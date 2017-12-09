"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_scout_1 = require("./Task.scout");
var creepName = require('./util.nameBuilder');
require('./prototype.room');
require('./prototype.source');
require('./prototype.spawn');
require('./prototype.container');
require('./prototype.controller');
require('./prototype.creep');
var combatMelee = require('./combat.melee');
var taskBuild = require('./task.build');
var taskDeposit = require('./task.deposit');
var taskHarvest = require('./task.harvest');
var taskMine = require('./task.mine');
var taskRepair = require('./task.repair');
var towerFill = require('./task.towerFill');
var taskTransport = require('./task.transport');
var taskUpgrade = require('./task.upgrade');
var taskWithdraw = require('./task.withdraw');
var roomController = require('./roomController');
module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    for (var roomName in Game.rooms) {
        let myRoom = new roomController(Game.rooms[roomName]);
    }
    for (let name in Game.creeps) {
        switch (Game.creeps[name].memory.task) {
            case 'build':
                taskBuild.run(Game.creeps[name]);
                break;
            case 'combatMelee':
                combatMelee.run(Game.creeps[name]);
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
            case 'scout':
                new Task_scout_1.Scout(Game.creeps[name]).run;
                break;
            case 'towerFill':
                towerFill.run(Game.creeps[name]);
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
};
//# sourceMappingURL=main.js.map