const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
// constant

const gravity = 0.2;//trong luc
// controller character
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  }
}
// class
class Sprite {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.width = 50;
    this.height = 150;
    this.lastKey
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else this.velocity.y += gravity;
  }
}

// character
const player = new Sprite({
  position: {
    x: 50,
    y: 50
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'yellow'
})
// events
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a'
      break;
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd'
      break;
    case 'w':
      keys.w.pressed = true;
      player.lastKey = 'w'
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
  }
})

// animate

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  player.velocity.x = 0
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -3
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 3
  } else if (keys.w.pressed && player.lastKey === 'w') {
    player.velocity.y = -5
  }
}
animate()

