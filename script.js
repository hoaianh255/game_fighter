
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
// constant

const gravity = 0.2;//trong luc
// controller character
// player
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  // enemy
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}
let timer = 15;
let timeoutID;
function determineWiner({player,enemy,timeoutID}){
  clearTimeout(timeoutID)
  if(player.health == enemy.health){
    document.querySelector('#displayText').innerHTML = 'tie'
  }else if(player.health > enemy.health){
    document.querySelector('#displayText').innerHTML = 'player 1 wins'
  }else if(player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'player 2 wins'
  }
  
}
function decreaseTimer() {
  timeoutID = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if(timer == 0) {
    determineWiner({player,enemy,timeoutID})
  }
}

decreaseTimer();
// class
class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
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
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    if (this.isAttacking) {
      c.fillStyle = 'blue';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }
  }
  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

// character
const player = new Sprite({
  position: {
    x: 100,
    y: 50
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'yellow',
  offset: {
    x: 0,
    y: 0
  }
})

const enemy = new Sprite({
  position: {
    x: canvas.width - 150,
    y: 50
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'red',
  offset: {
    x: -50,
    y: 0
  }
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
    case ' ':
      player.attack();
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      enemy.lastKey = 'ArrowUp';
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
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
    case 'ArrowDown':
      enemy.attack();
  }
})
// attack off character
function charAttack(char1, char2) {
  return (
    char1.position.x + char1.attackBox.width >= char2.position.x
    && char1.attackBox.position.x <= char2.position.x + char2.width
    && char1.attackBox.position.y + char1.attackBox.height >= char2.position.y
    && char1.attackBox.position.y <= char2.position.y + char2.height
    && char1.isAttacking
  )
}

// animate

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();
  player.velocity.x = 0
  enemy.velocity.x = 0
  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -3
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 3
  } else if (keys.w.pressed && player.lastKey === 'w') {
    player.velocity.y = -5
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -3
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 3
  } else if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp') {
    enemy.velocity.y = -5
  }
  // player attack

  if (
    charAttack(player, enemy)
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyhealth').style.width = enemy.health + '%';
  }
  // enemy attack
  if (
    charAttack(enemy, player)
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerhealth').style.width = player.health + '%';
  }
  // end game based on health
  if(player.health <= 0 || enemy.health <=0 ){
    determineWiner({player,enemy,timeoutID});
  }
}
animate()

