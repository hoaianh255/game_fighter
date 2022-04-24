let timer = 15;
let timeoutID;
function determineWiner({ player, enemy, timeoutID }) {
  clearTimeout(timeoutID)
  if (player.health == enemy.health) {
    document.querySelector('#displayText').innerHTML = 'tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'player 1 wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'player 2 wins'
  }

}
function decreaseTimer() {
  timeoutID = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer == 0) {
    determineWiner({ player, enemy, timeoutID })
  }
}