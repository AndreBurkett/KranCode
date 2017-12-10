import {Scout} from './Task.scout';
import {Mine} from './Task.lrm';
import {Transport} from './task.lrt';
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

module.exports.loop = function()
{
    //Clear Memory on Respawn
    /*var room = Game.spawns.Spawn1.room;
    if(room.survivalInfo.score == 0) {
        delete Memory.mySourcesMemory;
    }*/
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if(Memory.creeps[name].targetRoom) {
                try{
                    if(Memory.rooms[Memory.creeps[name].targetRoom].creeps[Memory.creeps[name].specialty] > 0)
                        Memory.rooms[Memory.creeps[name].targetRoom].creeps[Memory.creeps[name].specialty]--;
                }
            }
            delete Memory.creeps[name];
        }
    }

    //Create Room Controllers
    for(var roomName in Game.rooms) {
        let myRoom = new roomController(Game.rooms[roomName]);
    }

    //Set Creep Tasks
    for(let name in Game.creeps){
        switch(Game.creeps[name].memory.task){
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
            case 'Mine':
                new Mine(Game.creeps[name]).run();
                break;
            case 'repair':
                taskRepair.run(Game.creeps[name]);
                break;
            case 'scout':
                new Scout(Game.creeps[name]).run();
                break;
            case 'towerFill':
                towerFill.run(Game.creeps[name]);
                break;
            case 'transport':
                taskTransport.run(Game.creeps[name]);
                break;
            case 'Transport':
                new Transport(Game.creeps[name]).run();
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
