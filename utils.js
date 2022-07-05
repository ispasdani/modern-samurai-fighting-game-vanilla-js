//function to detect colission
function charactersCollision({ character1, character2 }) {
  return (
    character1.attackBox.position.x + character1.attackBox.width >=
      character2.position.x &&
    character1.attackBox.position.x <=
      character2.position.x + character2.width &&
    character1.attackBox.position.y + character1.attackBox.height >=
      character2.position.y &&
    character1.attackBox.position.y <= character2.position.y + character2.height
  );
}

//function to determine the winner
function determineWinner({ player, enemy, counterId }) {
  //stopping the counter loop
  clearTimeout(counterId);
  modalMessage.style.display = "block";
  if (player.health === enemy.health) {
    modalMessage.innerHTML = "TIE";
  } else if (player.health > enemy.health) {
    modalMessage.innerHTML = "Player WON";
  } else if (player.health < enemy.health) {
    modalMessage.innerHTML = "Enemy WON";
  }
}

//initiate the counter to start from 10
let counter = 20;
//keep track of counter loop
let counterId;
//counter function
function decreseTime() {
  if (counter > 0) {
    counterId = setTimeout(decreseTime, 1000);
    counter--;
    document.getElementById("counter").innerHTML = counter;
  }

  if (counter === 0) {
    determineWinner({ player, enemy, counterId });
  }
}
