import Phaser from "phaser";
import Menu from "./scenes/menu.js"
import Home from "./scenes/home.js"
import Level from "./scenes/level.js"
import CutScene1 from "./scenes/cutscene1.js"
import CutScene2 from "./scenes/cutscene2.js"
import CutScene3 from "./scenes/cutscene3.js"

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 861,
  // height: 484,
  height: 540,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, 
      debug: false
    }
  },
  scene: [Menu, Home , Level, CutScene1, CutScene2, CutScene3],
};

const game = new Phaser.Game(config);