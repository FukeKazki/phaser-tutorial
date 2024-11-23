import * as Phaser from "phaser";
import Game from "./scenes/game";
import GameOver from "./scenes/gameover";
import GameStart from "./scenes/gamestart";

const config: Phaser.Types.Core.GameConfig = {
  width: 600,
  height: 300,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  parent: "game-app",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 350, x: 0 }
      // debug: true,
    }
  },
  scene: [GameStart, Game, GameOver]
};
new Phaser.Game(config);
