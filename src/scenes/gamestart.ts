export default class GameStart extends Phaser.Scene {
  constructor() {
    super({ key: "gamestart" });
  }
  preload() {
    this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
    this.load.spritesheet("coin", "./assets/images/coin.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image("tabako", "assets/images/tabako.png");
    this.load.image("cloud", "assets/images/cloud.png");

    this.load.spritesheet("hacktyu-sprite", "./assets/images/hacktyu-sprite.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.add.bitmapText(this.center_width, 50, "arcade", "Hack'z Run", 40).setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height,
        "arcade",
        "Press SPACE or Click to start!",
        20
      )
      .setOrigin(0.5);
    this.add.bitmapText(this.center_width, 200, "arcade", "Press SPACE to jump", 15).setOrigin(0.5);


    // タバコはNGを表示
    this.add.image(this.center_width - 30, 230, "tabako").setScale(0.5);
    // コインはOKを表示
    this.add.sprite(this.center_width + 30, 230, "coin").setScale(0.5);
    // ハック
    this.add.sprite(this.center_width, 230, "hacktyu-sprite").setScale(0.5);


    this.input.keyboard.on("keydown-SPACE", this.startGame, this);
    this.input.on("pointerdown", (pointer) => this.startGame(), this);
  }

  startGame() {
    this.scene.start("game");
  }
}
