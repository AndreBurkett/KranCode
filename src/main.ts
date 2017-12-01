import * as CreepManager from "./components/creeps/creepManager";
import * as Config from "./config/config";

import * as Profiler from "screeps-profiler";
import { log } from "./lib/logger/log";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
// NOTE: this is used as an example, you may have better performance
// by setting USE_PROFILER through webpack, if you want to permanently
// remove it on deploy
// Start the profiler
if (Config.USE_PROFILER) {
  Profiler.enable();
}

log.info(`Scripts bootstrapped`);
if (__REVISION__) {
  log.info(`Revision ID: ${__REVISION__}`);
}

function mloop()
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



/*function mloop() {
  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  for (const i in Game.rooms) {
    const room: Room = Game.rooms[i];

    CreepManager.run(room);

    // Clears any non-existing creep memory.
    for (const name in Memory.creeps) {
      const creep: any = Memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          log.info("Clearing non-existing creep memory:", name);
          delete Memory.creeps[name];
        }
      }
    }
  }
}*/

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export const loop = !Config.USE_PROFILER ? mloop : () => { Profiler.wrap(mloop); };
