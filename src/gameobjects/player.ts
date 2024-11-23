export default class Player extends Phaser.GameObjects.Sprite {
  jumping: boolean; // ジャンプ中かどうか
  invincible: boolean; // 無敵状態
  health: number; // 体力

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "hacktyu-sprite"); // 'hacktyu' 画像を使用
    this.setOrigin(0.5); // 中心を原点に
    this.scene.add.existing(this); // シーンに追加
    this.scene.physics.add.existing(this); // 物理エンジンに追加

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.collideWorldBounds = true; // 画面外に出ないようにする
    body.mass = 10; // 質量
    body.setDragY(10); // Y軸方向のドラッグ
    this.setScale(1); // スケール
    this.jumping = false;
    this.invincible = false;
    this.health = 10;

    this.scene.anims.create({
      key: "hacktyu-sprite",
      frames: this.scene.anims.generateFrameNumbers("hacktyu-sprite", {
        start: 0,
        end: 1
      }),
      frameRate: 8
    });
    this.play({ key: "hacktyu-sprite", repeat: -1 });
  }
}
