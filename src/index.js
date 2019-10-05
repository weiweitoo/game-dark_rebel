import Phaser from "phaser";
import Menu from "./scenes/menu.js"
import Home from "./scenes/home.js"
import Level from "./scenes/level.js"

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
      debug: true
    }
  },
  // scene: [Menu, Home],
  scene: [Menu, Home , Level],
};

const game = new Phaser.Game(config);