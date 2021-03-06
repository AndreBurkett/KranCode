"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_scout_1 = require("./Task.scout");
const Task_lrb_1 = require("./Task.lrb");
const Task_lrm_1 = require("./Task.lrm");
const Task_reserve_1 = require("./Task.reserve");
const task_lrt_1 = require("./task.lrt");
const combat_melee_1 = require("./combat.melee");
var creepName = require('./util.nameBuilder');
require('./prototype.room');
require('./prototype.source');
require('./prototype.spawn');
require('./prototype.container');
require('./prototype.controller');
require('./prototype.creep');
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
            if (Memory.creeps[name].targetRoom) {
                try {
                    if (Memory.rooms[Memory.creeps[name].targetRoom].creeps[Memory.creeps[name].specialty] > 0)
                        Memory.rooms[Memory.creeps[name].targetRoom].creeps[Memory.creeps[name].specialty]--;
                }
                catch (e) {
                }
            }
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
            case 'Build':
                new Task_lrb_1.Build(Game.creeps[name]).run();
                break;
            case 'Melee':
                new combat_melee_1.Melee(Game.creeps[name]).run();
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
            case 'Mine':
                new Task_lrm_1.Mine(Game.creeps[name]).run();
                break;
            case 'repair':
                taskRepair.run(Game.creeps[name]);
                break;
            case 'Reserve':
                new Task_reserve_1.Reserve(Game.creeps[name]).run();
                break;
            case 'scout':
                new Task_scout_1.Scout(Game.creeps[name]).run();
                break;
            case 'towerFill':
                towerFill.run(Game.creeps[name]);
                break;
            case 'transport':
                taskTransport.run(Game.creeps[name]);
                break;
            case 'Transport':
                new task_lrt_1.Transport(Game.creeps[name]).run();
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