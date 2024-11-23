export default class Player extends Phaser.GameObjects.Rectangle {
  jumping: boolean; // ジャンプ中かどうか
  invincible: boolean; // 無敵状態
  health: number; // 体力

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 32, 32, 0x00ff00); // 32x32の緑色の四角形
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
  }
}
