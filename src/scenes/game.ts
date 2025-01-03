import Player from "../gameobjects/player";
import Generator from "../gameobjects/generator";

export default class Game extends Phaser.Scene {
  score: number = 0;
  player: Player | null = null;
  scoreText: Phaser.GameObjects.BitmapText | null = null;

  constructor() {
    super({ key: "game" });
  }

  // タイルセットの１セルあたりの解像度(px)
  public static CELL_PX = {
    WIDTH: 32,
    HEIGHT: 32
  };

  // タイルセットの画像ファイルのキー
  // タイルセット名(map_demo.jsonの中のtilesets.name属性を指定)
  private static TILESET_KEY_NAME = "Tileset";
  // Phaser3の中のタイルセットを指すキーフレーズ（任意の文言）
  private static TILESET_KEY_PLAIN = "Tileset";

  // マップJSONファイルのキー
  // Phaser3の中のマップJSONファイルを指すキーフレーズ（任意の文言）
  private static MAP_JSON_FILE_KEY = "MAP_JSON_FILE_KEY";

  // シーンが初期化されるときに呼ばれる
  init() {
    this.score = 0;
  }

  // 主にアセット(スプライトや音楽など)を読込む処理を書く
  preload() {
    this.registry.set("score", "0");
    this.load.audio("coin", "assets/sounds/coin.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("dead", "assets/sounds/dead.mp3");
    this.load.audio("theme", "assets/sounds/theme.mp3");

    this.load.spritesheet("tile", "assets/images/jungle tileset.png", {
      frameWidth: 768,
      frameHeight: 368
    });
    this.load.tilemapTiledJSON("map01", "assets/images/tile.json");
    // tileset画像ファイルをロード（キー・ファイルパス）
    this.load.image(Game.TILESET_KEY_PLAIN, "assets/images/Tileset.png");

    // mapファイルのロード
    this.load.tilemapTiledJSON(Game.MAP_JSON_FILE_KEY, "assets/images/tile.json");
  }

  // シーンにタイルマップやスプライトを配置する処理を書く(シーンを作るメインはここ)
  create() {
    // タイルマップの作成
    var tilemap: Phaser.Tilemaps.Tilemap = this.add.tilemap(Game.MAP_JSON_FILE_KEY);
    // タイルセットをリンク付け
    let planeTiles0: Phaser.Tilemaps.Tileset = tilemap.addTilesetImage(
      Game.TILESET_KEY_NAME, // 第１引数は マップのjsonファイル中のtilesets.name属性を指定
      Game.TILESET_KEY_PLAIN
    ); // 第２引数はPhaser3内のキーワード

    // レイヤーを作成
    let mapGroundLayer0: Phaser.Tilemaps.TilemapLayer = tilemap.createLayer(
      "地面", // Tiledで設定したレイヤー名
      planeTiles0, // 定義したタイルセット
      0,
      0 // 第３引数・第４引数は、左上の座標を(0,0)とした時の配置位置(x,y)
    );
    mapGroundLayer0.setDisplaySize(600, 300); // レイヤーの表示サイズを設定
    mapGroundLayer0.setCollisionByExclusion([-1]);
    // ゲーム開始時に呼ばれる
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x87ceeb);
    this.obstacles = this.add.group();
    this.coins = this.add.group();
    this.generator = new Generator(this);
    this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.player = new Player(this, this.center_width - 100, this.height - 200);
    this.scoreText = this.add.bitmapText(this.center_width, 10, "arcade", this.score, 20);

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(this.player, mapGroundLayer0);

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoin,
      () => {
        return true;
      },
      this
    );

    this.loadAudios();
    this.playMusic();

    /*
		We use the `pointerdown` event to listen to the mouse click or touch event.
		*/
    this.input.on("pointerdown", (pointer) => this.jump(), this);

    /*
		We use `updateScoreEvent` to update the score every 100ms so the player can see the score increasing as long as he survives.
		*/
    this.updateScoreEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.updateScore(),
      callbackScope: this,
      loop: true
    });
  }

  /*
	This is the game loop. The function is called every frame.
        
	Here is where we can check if a key was pressed or the situation of the player to act accordingly. We use the `update` method to check if the player pressed the space key.
	*/
  update() {
    // 毎フレーム呼ばれる
    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.jump();
    } else if (this.player.body.blocked.down) {
      this.jumpTween?.stop();
      this.player.rotation = 0;
      // ground
    }
  }

  /*
	This method is called when the player hits an obstacle. We stop the updateScoreEvent so the score doesn't increase anymore.
        
	And obviously, we finish the scene.
	*/
  hitObstacle(player, obstacle) {
     // プレイヤーのアニメーションを停止
     this.player.anims.pause();
 
     // 一時停止中に追加の演出（オプション）
     this.cameras.main.shake(200, 0.51);
 
     // 一定時間後にゲームオーバー処理を実行
     this.time.delayedCall(800, () => {
         // ゲームオーバー処理
         this.updateScoreEvent.destroy();
         this.finishScene();
     }, [], this);
  }

  /*
	This method is called when the player hits a coin. We play a sound, update the score, and destroy the coin.
	*/
  hitCoin(player, coin) {
    this.playAudio("coin");
    this.updateScore(1000);
    coin.destroy();
  }

  /*
	We use this `loadAudios` method to load all the audio files that we need for the game.
        
	Then we'll play them using the `playAudio` method.
	*/
  loadAudios() {
    this.audios = {
      jump: this.sound.add("jump"),
      coin: this.sound.add("coin"),
      dead: this.sound.add("dead")
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
	This method is specific to the music. We use it to play the theme music in a loop.
	*/
  playMusic(theme = "theme") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    });
  }

  /*
	This is the method that we use to make the player jump. A jump is just a velocity in the Y-axis. Gravity will do the rest.
        
	We also play a jumping sound and we add a tween to rotate the player while jumping.
	*/
  jump() {
    if (!this.player.body.blocked.down) return;
    this.player.body.setVelocityY(-300);

    this.playAudio("jump");
    this.jumpTween = this.tweens.add({
      targets: this.player,
      duration: 1000,
      angle: { from: 0, to: 360 },
      repeat: -1
    });
  }

  /*
	What should we do when we finish the game scene?
        
	- Stop the theme music
	- Play the dead sound
	- Set the score in the registry to show it in the `gameover` scene.
	- Start the `gameover` scene.
        
	*/
  finishScene() {
    this.theme.stop();
    this.playAudio("dead");
    this.registry.set("score", "" + this.score);
    this.scene.start("gameover");
  }

  /*
	This method is called every 100ms and it is used to update the score and show it on the screen.
	*/
  updateScore(points = 1) {
    this.score += points;
    this.scoreText.setText(this.score);
  }
}
