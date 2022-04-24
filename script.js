
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
// constant

const gravity = 0.3;//trong luc
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


decreaseTimer();

// instance

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
});
const shop = new Sprite({
  position: {
    x: 500,
    y: 236
  },
  imageSrc: './img/shop_anim.png',
  scale: 2,
  frames: 6
})
const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/Martial Hero/Sprites/Idle.png',
  scale: 2,
  frames: 8,
  offsetImg: {
    x: 200,
    y: 95
  },
  sprites: {
    idle: {
      imageSrc: './img/Martial Hero/Sprites/Idle.png',
      frames: 8
    },
    run: {
      imageSrc: './img/Martial Hero/Sprites/Run.png',
      frames: 8
    },
    jump: {
      imageSrc: './img/Martial Hero/Sprites/Jump.png',
      frames: 2
    },
    fall: {
      imageSrc: './img/Martial Hero/Sprites/Fall.png',
      frames: 2
    }
  }
})

const enemy = new Fighter({
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
      player.velocity.y = -10;
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
      enemy.velocity.y = -10;
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
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();
  player.velocity.x = 0
  enemy.velocity.x = 0
  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -3;
    player.switchImage('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 3;
    player.switchImage('run');
  } else {
    player.switchImage('idle')
  }

  if (player.velocity.y < 0) {
    player.switchImage('jump')
  } else if (player.velocity.y > 0) {
    player.switchImage('fall')
  }
  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -3
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 3
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
  if (player.health <= 0 || enemy.health <= 0) {
    determineWiner({ player, enemy, timeoutID });
  }
}
animate()

