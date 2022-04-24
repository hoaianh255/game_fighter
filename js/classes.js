class Sprite {
  constructor({ position, imageSrc, scale = 1, frames = 1, offset = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.frameCurrent = 0;
    this.frameEllapse = 0;
    this.frameHolder = 5;
    this.offset = offset;

  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    )
  }
  animateFrames() {
    this.frameEllapse++;
    if (this.frameEllapse % this.frameHolder === 0) {
      if (this.frameCurrent < this.frames - 1) {
        this.frameCurrent++
      } else {
        this.frameCurrent = 0
      }
    }
  }
  update() {
    this.draw()
    // c.fillStyle = 'yellow'
    // c.fillRect(shop.position.x, shop.position.y, 500, 500)
    this.animateFrames()
  }

}

class Fighter extends Sprite {
  constructor({ position, velocity, offset = { x: 0, y: 0 }, imageSrc, scale = 1, frames = 1, sprites, attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined } }) {
    super({
      position,
      imageSrc,
      scale,
      frames,
      offset
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset
    }
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameEllapse = 0;
    this.frameHolder = 5;
    this.sprites = sprites;
    this.death = false;
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw()
    if (!this.death) this.animateFrames()


    // attack box position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // character position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 84) {
      this.velocity.y = 0;
      this.position.y = 342;
    } else this.velocity.y += gravity;
  }
  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.switchImage('death')
    } else {
      this.switchImage('takeHit');
    }
  }
  attack() {
    this.isAttacking = true;
    this.switchImage('attack1');
  }
  switchImage(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frames - 1)
        this.death = true
      return
    }
    // prevent switch case on animation
    if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.frames - 1) return;

    if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.frames - 1) return;

    // switch based on action
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frames = this.sprites.attack1.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.frames = this.sprites.takeHit.frames;
          this.frameCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frames = this.sprites.death.frames;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}