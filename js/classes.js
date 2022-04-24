class Sprite {
  constructor({ position, imageSrc, scale = 1, frames = 1, offsetImg = { x: 0, y: 0 } }) {
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
    this.offsetImg = offsetImg;

  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offsetImg.x,
      this.position.y - this.offsetImg.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    )
  }
  update() {
    this.draw()
    this.frameEllapse++;
    if (this.frameEllapse % this.frameHolder === 0) {
      if (this.frameCurrent < this.frames - 1) {
        this.frameCurrent++
      } else {
        this.frameCurrent = 0
      }
    }
  }

}

class Fighter extends Sprite {
  constructor({ position, velocity, offset, imageSrc, scale = 1, frames = 1, offsetImg, sprites }) {
    super({
      position,
      imageSrc,
      scale,
      frames,
      offsetImg
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
      width: 100,
      height: 50,
      offset
    }
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameEllapse = 0;
    this.frameHolder = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.frameEllapse++;
    if (this.frameEllapse % this.frameHolder === 0) {
      if (this.frameCurrent < this.frames - 1) {
        this.frameCurrent++
      } else {
        this.frameCurrent = 0
      }
    }
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 84) {
      this.velocity.y = 0;
      this.position.y = 342;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    this.image = this.sprites.attack.image;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  switchImage(sprite) {
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
    }
  }
}