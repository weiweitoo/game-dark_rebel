import Phaser from "phaser";
import Menu from "./scenes/menu.js"
import Home from "./scenes/home.js"

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 861,
  // height: 484,
  height: 540,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, 
      debug: false
    }
  },
  // scene: [Menu, Home],
  scene: [Home],
};

const game = new Phaser.Game(config);